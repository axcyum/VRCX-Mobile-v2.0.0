import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
    preferences: new Map(),
    openBrowser: vi.fn(),
    clearCookies: vi.fn(),
    initConfig: vi.fn(),
    openDatabase: vi.fn(),
    query: vi.fn(),
    run: vi.fn()
}));

vi.mock('@capacitor/core', () => ({
    registerPlugin: () => ({ open: mocks.openBrowser }),
    CapacitorCookies: { clearAllCookies: mocks.clearCookies }
}));
vi.mock('@capacitor/preferences', () => ({
    Preferences: {
        get: async ({ key }) => ({ value: mocks.preferences.get(key) ?? null }),
        set: async ({ key, value }) => { mocks.preferences.set(key, value); },
        remove: async ({ key }) => { mocks.preferences.delete(key); }
    }
}));
vi.mock('@capacitor-community/sqlite', () => ({
    CapacitorSQLite: {},
    SQLiteConnection: class {
        async createConnection() {
            return { open: mocks.openDatabase, query: mocks.query, run: mocks.run };
        }
    }
}));
vi.mock('../../services/config.js', () => ({ default: { init: mocks.initConfig } }));
vi.mock('../../ipc-electron/interopApi.js', () => ({ default: {} }));

import { initInteropApi } from '../interopApi';

describe.each(['android', 'ios'])('mobile upgrade bridge on %s', (platform) => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.preferences.clear();
        vi.spyOn(console, 'log').mockImplementation(() => {});
        window.Capacitor = { getPlatform: () => platform };
    });

    afterEach(() => {
        vi.restoreAllMocks();
        delete window.Capacitor;
        for (const name of ['AppApi', 'WebApi', 'VRCXStorage', 'SQLite', 'LogWatcher', 'Discord', 'AssetBundleManager']) {
            delete window[name];
        }
    });

    test('retains v1 stored login data and cookies across bridge initialization', async () => {
        mocks.preferences.set('VRCXStorage_testLogin', JSON.stringify({ id: 'usr_saved' }));
        mocks.preferences.set('vrcx.auth.cookies', JSON.stringify({ auth: 'test-auth' }));
        await initInteropApi();
        expect(await window.VRCXStorage.GetObject('testLogin')).toEqual({ id: 'usr_saved' });
        expect(await window.WebApi.GetCookies()).toBe('auth=test-auth');
        expect(await window.AppApi.GetVersion()).toBe(`2.0.0 (${platform === 'ios' ? 'iOS' : 'Android'})`);

        await window.WebApi.SetCookies('auth=test-refreshed');
        await initInteropApi();
        expect(await window.WebApi.GetCookies()).toBe('auth=test-refreshed');
        await window.WebApi.ClearCookies();
        expect(mocks.preferences.has('vrcx.auth.cookies')).toBe(false);
        expect(mocks.clearCookies).toHaveBeenCalledOnce();
    });

    test('uses the native browser and rejects unsupported URL schemes', async () => {
        await initInteropApi();
        await window.AppApi.OpenLink('https://example.com');
        expect(mocks.openBrowser).toHaveBeenCalledWith({ url: 'https://example.com' });
        await expect(window.AppApi.OpenLink('javascript:alert(1)')).rejects.toThrow('Only HTTP(S)');
        expect(mocks.openBrowser).toHaveBeenCalledOnce();
    });

    test('keeps the existing native database availability for the platform', async () => {
        await initInteropApi();
        if (platform === 'android') {
            expect(mocks.openDatabase).toHaveBeenCalledOnce();
            mocks.query.mockResolvedValueOnce({ values: [{ id: 'wrld_saved', name: 'Saved world' }] });
            expect(await window.SQLite.Execute('SELECT id, name FROM favorite_world WHERE id = @id', {
                '@id': 'wrld_saved'
            })).toEqual([['wrld_saved', 'Saved world']]);
            expect(mocks.query).toHaveBeenCalledWith('SELECT id, name FROM favorite_world WHERE id = ?', ['wrld_saved']);
        } else {
            expect(mocks.openDatabase).not.toHaveBeenCalled();
            expect(await window.SQLite.Execute('SELECT id FROM favorite_world')).toEqual([]);
        }
    });
});

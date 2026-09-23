import { beforeEach, describe, expect, test, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
    values: new Map(),
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
    execute: vi.fn(),
    executeNonQuery: vi.fn()
}));

vi.mock('@capacitor/core', () => ({
    Capacitor: {
        isNativePlatform: () => true
    }
}));

vi.mock('@capacitor/preferences', () => ({
    Preferences: {
        get: mocks.get,
        set: mocks.set,
        remove: mocks.remove
    }
}));

vi.mock('../sqlite.js', () => ({
    default: {
        execute: mocks.execute,
        executeNonQuery: mocks.executeNonQuery
    }
}));

import { ConfigRepository } from '../config.js';

describe('ConfigRepository on Capacitor', () => {
    let repository;

    beforeEach(() => {
        mocks.values.clear();
        vi.clearAllMocks();
        mocks.get.mockImplementation(async ({ key }) => ({
            value: mocks.values.get(key) ?? null
        }));
        mocks.set.mockImplementation(async ({ key, value }) => {
            mocks.values.set(key, value);
        });
        mocks.remove.mockImplementation(async ({ key }) => {
            mocks.values.delete(key);
        });
        repository = new ConfigRepository();
    });

    test('uses native Preferences instead of the unavailable iOS SQLite connection', async () => {
        await repository.init();
        await repository.setString('savedCredentials', '{"usr_1":{}}');

        expect(await repository.getString('savedCredentials', '{}')).toBe(
            '{"usr_1":{}}'
        );
        expect(mocks.set).toHaveBeenCalledWith({
            key: 'config:savedcredentials',
            value: '{"usr_1":{}}'
        });
        expect(mocks.executeNonQuery).not.toHaveBeenCalled();
    });

    test('removes native values and returns the requested default', async () => {
        await repository.setString('lastUserLoggedIn', 'usr_1');
        await repository.remove('lastUserLoggedIn');

        expect(await repository.getString('lastUserLoggedIn', '')).toBe('');
        expect(mocks.remove).toHaveBeenCalledWith({
            key: 'config:lastuserloggedin'
        });
    });
});

import { describe, expect, it } from 'vitest';

import { splitExternalLinks } from '../urlText';

describe('splitExternalLinks', () => {
    it('turns http URLs into link segments while preserving surrounding text', () => {
        expect(
            splitExternalLinks('See https://example.com/path?q=1 now')
        ).toEqual([
            { type: 'text', text: 'See ' },
            {
                type: 'link',
                text: 'https://example.com/path?q=1',
                href: 'https://example.com/path?q=1'
            },
            { type: 'text', text: ' now' }
        ]);
    });

    it('adds https to www links and excludes sentence punctuation', () => {
        expect(splitExternalLinks('www.example.com.')).toEqual([
            {
                type: 'link',
                text: 'www.example.com',
                href: 'https://www.example.com'
            },
            { type: 'text', text: '.' }
        ]);
    });

    it('keeps balanced closing parentheses inside a URL', () => {
        expect(splitExternalLinks('https://example.com/a_(b)')).toEqual([
            {
                type: 'link',
                text: 'https://example.com/a_(b)',
                href: 'https://example.com/a_(b)'
            }
        ]);
    });

    it('returns plain text unchanged', () => {
        expect(splitExternalLinks('no links')).toEqual([
            { type: 'text', text: 'no links' }
        ]);
    });
});

const EXTERNAL_URL_PATTERN = /(?:https?:\/\/|www\.)[^\s<>"'`]+/giu;
const TRAILING_PUNCTUATION = /[.,;:!?}\]、。！？，．]+$/u;

function trimTrailingPunctuation(value) {
    let url = value.replace(TRAILING_PUNCTUATION, '');

    while (url.endsWith(')')) {
        const opens = (url.match(/\(/g) || []).length;
        const closes = (url.match(/\)/g) || []).length;
        if (closes <= opens) break;
        url = url.slice(0, -1);
    }

    return url;
}

/**
 * Split untrusted plain text into safe text/link segments. Vue renders every
 * segment as text, so URLs become clickable without using v-html.
 * @param {unknown} value
 * @returns {{ type: 'text' | 'link', text: string, href?: string }[]}
 */
export function splitExternalLinks(value) {
    const text = value == null ? '' : String(value);
    const segments = [];
    let cursor = 0;

    for (const match of text.matchAll(EXTERNAL_URL_PATTERN)) {
        const start = match.index ?? 0;
        const raw = match[0];
        const linkText = trimTrailingPunctuation(raw);

        if (start > cursor) {
            segments.push({ type: 'text', text: text.slice(cursor, start) });
        }

        if (linkText) {
            segments.push({
                type: 'link',
                text: linkText,
                href: /^www\./iu.test(linkText)
                    ? `https://${linkText}`
                    : linkText
            });
        }

        const trailing = raw.slice(linkText.length);
        if (trailing) {
            segments.push({ type: 'text', text: trailing });
        }
        cursor = start + raw.length;
    }

    if (cursor < text.length) {
        segments.push({ type: 'text', text: text.slice(cursor) });
    }

    return segments.length ? segments : [{ type: 'text', text }];
}

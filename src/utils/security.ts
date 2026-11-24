/**
 * Safely serialize structured data for inline `<script type="application/ld+json">`.
 * Escapes `<`, `>`, `&`, and JS line separators so untrusted or technical strings
 * containing `</script>` or `<!--` cannot break out of the script element.
 */
export function serializeJsonLd(data: unknown): string {
	return JSON.stringify(data)
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e')
		.replace(/&/g, '\\u0026')
		.replace(/\u2028/g, '\\u2028')
		.replace(/\u2029/g, '\\u2029');
}

const SAFE_LOCAL_VIDEO_RE = /^\/(?!\/)[a-zA-Z0-9._/-]+\.(webm|mp4)$/i;

/**
 * Restricts `heroVideo` values to root-relative local `.webm`/`.mp4` assets
 * without path traversal segments, preventing `javascript:`, `data:`, or
 * unexpected cross-origin URLs from being rendered into `<video>` elements.
 */
export function isSafeLocalVideoPath(value: string): boolean {
	if (!SAFE_LOCAL_VIDEO_RE.test(value)) return false;
	if (value.includes('..')) return false;
	return true;
}

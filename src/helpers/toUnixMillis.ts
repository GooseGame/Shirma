/**
 * API may send Unix time in seconds; JS Date and Date.now() use milliseconds.
 * Interpreting ~1.7e9 as ms yields 1970 — normalize to ms for display and comparisons.
 */
export function toUnixMillis(ts: number): number {
	if (!Number.isFinite(ts) || ts <= 0) return ts;
	if (ts >= 1e12) return ts;
	const yearIfMs = new Date(ts).getUTCFullYear();
	if (yearIfMs <= 1971) return Math.round(ts * 1000);
	return ts;
}

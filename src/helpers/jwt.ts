/**
 * Returns true if the string looks like a JWT and its `exp` is in the past.
 * Non-JWT opaque tokens return false (validity is left to the server / 401 handler).
 */
export function isJwtExpired(token: string): boolean {
	const parts = token.split('.');
	if (parts.length !== 3) {
		return false;
	}
	try {
		const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
		const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
		const payload = JSON.parse(atob(padded)) as { exp?: number };
		if (typeof payload.exp !== 'number') {
			return false;
		}
		return payload.exp * 1000 <= Date.now();
	} catch {
		return false;
	}
}

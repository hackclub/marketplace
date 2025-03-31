export function getCookie(name: string): boolean {
	return document.cookie.split('; ').find((row) => row.startsWith(name + '=')) !== undefined;
}

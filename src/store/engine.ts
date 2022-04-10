export interface StateStorage<T> {
	getItem: (key: string) => T | null | ""
	setItem: (key: string, value: T) => void
	removeItem: (key: string) => void
}

export function get<T>(key: string) {
	const data = localStorage.getItem(key);
	return data && JSON.parse(data) as T;
}

export function set<T>(key: string, data: T) {
	localStorage.setItem(key, JSON.stringify(data));
}

export function remove(key: string) {
	localStorage.removeItem(key);
}

export const storageEngine = <T>(): StateStorage<T> => ({
	getItem: (key: string) => {
		return get<T>(key);
	},
	setItem: (key: string, value: T) => {
		return set<T>(key, value);
	},
	removeItem: async (key: string) => {
		return remove(key);
	}
});

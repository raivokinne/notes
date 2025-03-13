export const storage = {
    get<T>(key: string): T | null {
        const stored = localStorage.getItem(key);
        try {
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    },
    set(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key: string) {
        localStorage.removeItem(key);
    }
}
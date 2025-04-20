import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { User } from "../types";
import toast from "react-hot-toast";
import { api } from "../utils/axios";
import { csrf } from "../utils/functions";
import { storage } from "../utils/storage";

interface AuthContextValue {
	user: User | null;
	authenticated: boolean;
	login: (credentials: unknown) => Promise<void>;
	register: (credentials: unknown) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
	user: null,
	authenticated: false,
	login: async () => { },
	register: async () => { },
	logout: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [authenticated, setAuthenticated] = useState(true);

	async function fetchUser() {
		try {
			const response = await api.get("/auth/user", {
				headers: {
					Authorization: `Bearer ${storage.get("token")}`,
				},
			});
			if (response.status === 200) {
				setUser({ ...response.data });
			} else {
				toast.error("Failed to get user");
			}
		} catch {
			setUser(null);
		}
	}

	useEffect(() => {
		fetchUser();
	}, [])

	const login = useCallback(
		async (credentials: unknown) => {
			try {
				await csrf();
				const res = await api.post("/guest/login", credentials);
				if (res.data.success) {
					toast.success(res.data.message);
					storage.set("token", res.data.token);
					setAuthenticated(true);
					await fetchUser()
				} else {
					toast.error(res.data.message);
					setAuthenticated(false);
				}

			} catch {
				toast.error("Login failed. Please try again.");
				setAuthenticated(false);
			}
		},
		[]
	);

	const register = useCallback(
		async (credentials: unknown) => {
			try {
				await csrf();
				const res = await api.post("/guest/register", credentials);
				if (res.data.success) {
					toast.success(res.data.message);
					storage.set("token", res.data.token);
				} else {
					toast.error(res.data.message);
				}

			} catch {
				toast.error("Registration failed. Please try again.");
				setAuthenticated(false);
			}
		},
		[]
	);

	const logout = useCallback(async () => {
		try {
			await api.post("/auth/logout");
			storage.remove("token");
			setUser(null);
			setAuthenticated(false);
			window.location.href = "/";
		} catch (error) {
			toast.error("Loggin out failed. Please try again.");
		}
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				authenticated,
				login,
				register,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);

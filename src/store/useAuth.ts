/* eslint-disable @typescript-eslint/no-unused-vars */
import create from "zustand";
import { persist } from "zustand/middleware";

import { storageEngine } from "./engine";

export type Auth = { password: string, attempts: number, loggedIn: boolean }

type UseAuthState = {
	authCache: Auth
	updateAuthCache: (s: Auth) => void
	clearAuthCache: () => void
}

export const useAuthStore = create<UseAuthState>(
	persist(
		(set, get) => ({
			authCache: { password: "", attempts: 0, loggedIn: false },
			updateAuthCache: (authCache: Auth) => set({ authCache }),
			clearAuthCache: () => set({ authCache: { password: "", attempts: 0, loggedIn: false } })
		}),
		{
			name: "passwordle-game.auth",
			getStorage: storageEngine,
			version: 1
		}
	)
);

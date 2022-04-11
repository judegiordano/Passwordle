/* eslint-disable @typescript-eslint/no-unused-vars */
import create from "zustand";
import { persist } from "zustand/middleware";

import { storageEngine } from "./engine";
import { Guesses } from "@types";

export type Storage = {
	password: string
	hash: string
	attempts: number
	guesses: Guesses[][]
	loggedIn: boolean
}

type UseStorage = {
	storageCache: Storage
	updateStorageCache: (s: Storage) => void
	clearStorageCache: () => void
}

export const useStorageStore = create<UseStorage>(
	persist(
		(set, get) => ({
			storageCache: {
				password: "",
				hash: "",
				attempts: 0,
				guesses: [[]],
				loggedIn: false
			},
			updateStorageCache: (storageCache: Storage) => set({ storageCache }),
			clearStorageCache: () => set({
				storageCache: {
					password: "",
					hash: "",
					attempts: 0,
					guesses: [[]],
					loggedIn: false
				}
			})
		}),
		{
			name: "passwordle-game.storage-settings",
			getStorage: storageEngine,
			version: 1
		}
	)
);

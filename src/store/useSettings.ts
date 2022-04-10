/* eslint-disable @typescript-eslint/no-unused-vars */
import create from "zustand";
import { persist } from "zustand/middleware";

import { storageEngine } from "./engine";

export type Settings = { password: string, hash: string }

type UseSettingsState = {
	settingsCache: Settings
	updateSettingsCache: (s: Settings) => void
	clearSettingsCache: () => void
}

export const useSettingsStore = create<UseSettingsState>(
	persist(
		(set, get) => ({
			settingsCache: { password: "", hash: "" },
			updateSettingsCache: (settingsCache: Settings) => set({ settingsCache }),
			clearSettingsCache: () => set({ settingsCache: { password: "", hash: "" } })
		}),
		{
			name: "passwordle-game.user-settings",
			getStorage: storageEngine,
			version: 1
		}
	)
);

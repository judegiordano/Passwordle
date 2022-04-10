/* eslint-disable @typescript-eslint/no-unused-vars */
import create from "zustand";
import { persist } from "zustand/middleware";

import { storageEngine } from "./engine";

type Day = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"

export type Timestamp = Day | string | null

type UseTimestamp = {
	dayCache: Timestamp
	updateDayCache: (t: Timestamp) => void
	clearDayCache: () => void
}

export const useDayStore = create<UseTimestamp>(
	persist(
		(set, get) => ({
			dayCache: null,
			updateDayCache: (dayCache: Timestamp) => set({ dayCache }),
			clearDayCache: () => set({ dayCache: null })
		}),
		{
			name: "passwordle.game-timestamp",
			getStorage: storageEngine,
			version: 1
		}
	)
);

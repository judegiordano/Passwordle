/* eslint-disable @typescript-eslint/no-unused-vars */
import create from "zustand";
import { persist } from "zustand/middleware";

import { storageEngine } from "./engine";

type Timestamp = string | Date | null

type UseTimestamp = {
	timestampCache: string | Date | null
	updateTimestampCache: (t: Timestamp) => void
	clearTimestampCache: () => void
}

export const useTimeStampStore = create<UseTimestamp>(
	persist(
		(set, get) => ({
			timestampCache: null,
			updateTimestampCache: (timestampCache: Timestamp) => set({ timestampCache }),
			clearTimestampCache: () => set({ timestampCache: null })
		}),
		{
			name: "passwordle.game-timestamp",
			getStorage: storageEngine,
			version: 1
		}
	)
);

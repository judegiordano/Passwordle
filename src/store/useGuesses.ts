/* eslint-disable @typescript-eslint/no-unused-vars */
import create from "zustand";
import { persist } from "zustand/middleware";

import { CircleType } from "@components/circle";

export type Guesses = { type: CircleType }

type UseGuesses = {
	guessesCache: Guesses[][]
	updateGuessesCache: (g: Guesses[][]) => void
	clearGuessesCache: () => void
}

export const useGuessesStore = create<UseGuesses>(
	persist(
		(set, get) => ({
			guessesCache: [[]],
			updateGuessesCache: (guessesCache: Guesses[][]) => set({ guessesCache }),
			clearGuessesCache: () => set({ guessesCache: [[]] })
		}),
		{
			name: "passwordle-game.guesses",
			getStorage: () => localStorage,
			version: 1
		}
	)
);

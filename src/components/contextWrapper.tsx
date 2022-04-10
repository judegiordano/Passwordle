import React, { useEffect } from "react";
import { SWRConfig } from "swr";

import { Notifications } from "@services/notifications";
import { useDayStore } from "@store/useDay";
import { useAuthStore } from "@store/useAuth";
import { useGuessesStore } from "@store/useGuesses";
import { useSettingsStore } from "@store/useSettings";

const provider = ((cache) => () => cache)(new Map());
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function ContextWrapper({ children }: { children: React.ReactNode }) {
	const { dayCache, updateDayCache } = useDayStore();
	const { clearSettingsCache } = useSettingsStore();
	const { clearAuthCache } = useAuthStore();
	const { clearGuessesCache } = useGuessesStore();
	const resetLocalStorage = () => {
		clearSettingsCache();
		clearAuthCache();
		clearGuessesCache();
	};
	useEffect(() => {
		const todayIndex = new Date().getDay();
		if (!dayCache) {
			resetLocalStorage();
			return updateDayCache(days[todayIndex]);
		}
		if(dayCache === days[todayIndex]) return;
		resetLocalStorage();
		updateDayCache(days[todayIndex]);
		window.location.reload();
	}, [dayCache]);
	return (
		<>
			<SWRConfig value={{ provider }}>
				{children}
			</SWRConfig>
			<Notifications />
		</>
	);
}

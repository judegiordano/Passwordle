import React, { useEffect } from "react";
import { SWRConfig } from "swr";

import { Notifications } from "@services/notifications";
import { useDayStore } from "@store/useDay";
import { useStorageStore } from "@store/useStorage";

const provider = ((cache) => () => cache)(new Map());
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function ContextWrapper({ children }: { children: React.ReactNode }) {
	const { dayCache, updateDayCache } = useDayStore();
	const { clearStorageCache } = useStorageStore();
	useEffect(() => {
		const todayIndex = new Date().getDay();
		if (!dayCache) {
			clearStorageCache();
			return updateDayCache(days[todayIndex]);
		}
		if(dayCache === days[todayIndex]) return;
		clearStorageCache();
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

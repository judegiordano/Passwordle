import React, { useEffect } from "react";
import { SWRConfig } from "swr";

import { Notifications } from "@services/notifications";
import { useTimeStampStore } from "@store/useTimestamp";
import { useStorageStore } from "@store/useStorage";

const provider = ((cache) => () => cache)(new Map());

export function diffInDays(date1: Date, date2: Date) {
	const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
	const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
	const diff = Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
	return diff;
}

export function ContextWrapper({ children }: { children: React.ReactNode }) {
	const { timestampCache, updateTimestampCache } = useTimeStampStore();
	const { clearStorageCache } = useStorageStore();
	const reset = () => {
		clearStorageCache();
		updateTimestampCache(new Date());
		window.location.reload();
	};
	useEffect(() => {
		if (!timestampCache) return reset();
		const now = new Date();
		const cacheDate = new Date(timestampCache);
		if (cacheDate.getDay() !== now.getDay()) return reset();
		const diff = diffInDays(now, cacheDate);
		if (diff !== 0) return reset();
	}, [timestampCache]);
	return (
		<>
			<SWRConfig value={{ provider }}>
				{children}
			</SWRConfig>
			<Notifications />
		</>
	);
}

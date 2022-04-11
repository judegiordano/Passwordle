import React, { useState, useEffect } from "react";
import Image from "next/image";
import padlock from "../../public/padlock.png";
import padlockGray from "../../public/padlock-gray.png";

import { MAX_TRIES } from "@services/config";
import { useStorageStore } from "@store/useStorage";

export function LivesCounter() {
	const { storageCache } = useStorageStore();
	const [lifeCount, setLifeCount] = useState<number>(MAX_TRIES);

	useEffect(() => {
		setLifeCount(MAX_TRIES - storageCache.attempts);
	}, [storageCache]);

	return (
		<div className="max-w-md p-3 m-auto text-center">
			{
				Array.from({ length: MAX_TRIES }).map((_, index) => (
					<Image
						key={index}
						height={25}
						width={25}
						priority
						draggable={false}
						src={(index + 1) <= lifeCount ? padlock : padlockGray}
						alt="padlock"
					/>
				))
			}
		</div>
	);
}

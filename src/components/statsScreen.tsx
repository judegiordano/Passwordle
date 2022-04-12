import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, DialogActions, Divider } from "@mui/material";

import { useStorageStore } from "@store/useStorage";
import { useTimeStampStore } from "@store/useTimestamp";
import { BuildScore } from "@components/buildScore";
import { CircleType, Guesses } from "@types";
import { NEXT_PUBLIC_DOMAIN, BROWSER, DEVICE, WEB_SHARE_API_DEVICE_TYPES } from "@services/config";

interface IStatsProps {
	open: boolean
	title: string
	children?: React.ReactNode
}

const emojiLookup = {
	[CircleType.correct]: "🟩",
	[CircleType.wrong_position]: "🟨",
	[CircleType.incorrect]: "🟥"
};

const attemptShare = (shareData: object) => {
	return (
		BROWSER.name?.toUpperCase().indexOf("FIREFOX") === -1 &&
		WEB_SHARE_API_DEVICE_TYPES.indexOf(DEVICE.type ?? "") !== -1 &&
		navigator.canShare &&
		navigator.canShare(shareData) &&
		navigator.share
	);
};

export function StatsScreen({
	open,
	title,
	children,
}: IStatsProps) {
	const { storageCache } = useStorageStore();
	const { timestampCache } = useTimeStampStore();
	const [guesses, setGuesses] = useState<Guesses[][]>([[]]);
	const [time, setTime] = useState<Date>(new Date());

	useEffect(() => {
		setGuesses(storageCache.guesses);
		timestampCache && setTime(timestampCache);
	}, [storageCache, timestampCache]);

	const copyStats = async () => {
		try {
			const score = guesses.map((guess) => {
				const line = guess.map(({ type }) => {
					return emojiLookup[type];
				}).join("");
				return `${line}\n`;
			}).join("");
			const title = `Passwordle for ${new Date(time).toLocaleDateString()}`;
			const data = `${title}\n${NEXT_PUBLIC_DOMAIN}\n${score}`;
			if (attemptShare({ text: data })) {
				navigator.share({ text: data });
				return toast.success("score copied!");
			}
			navigator.clipboard.writeText(data);
			toast.success("score copied!");
		} catch (error) {
			toast.error("share failed");
		}
	};

	return (
		<>
			<Dialog open={open} >
				<DialogTitle>
					{title}
				</DialogTitle>
				<Divider />
				<DialogContent>
					{children}
					<BuildScore guesses={guesses} />
				</DialogContent>
				<Divider />
				<DialogActions>
					<Button onClick={async () => await copyStats()}>
						share
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

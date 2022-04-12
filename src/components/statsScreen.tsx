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
import { NEXT_PUBLIC_DOMAIN } from "@services/config";

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
		const score = guesses.map((guess) => {
			const line = guess.map(({ type }) => {
				return emojiLookup[type];
			}).join("");
			return `${line}\n`;
		}).join("");
		const title = `Passwordle for ${new Date(time).toLocaleDateString()}`;
		const data = `${title}\n${NEXT_PUBLIC_DOMAIN}\n${score}`;
		await navigator.clipboard.writeText(data);
		toast.success("score copied!");
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
					<Button onClick={copyStats}>
						share
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

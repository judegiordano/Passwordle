import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, DialogActions, Divider } from "@mui/material";

import { useStorageStore } from "@store/useStorage";
import { BuildScore } from "@components/buildScore";
import { Guesses } from "@types";

interface IStatsProps {
	open: boolean
	title: string
	children?: React.ReactNode
}

export function StatsScreen({
	open,
	title,
	children,
}: IStatsProps) {
	const { storageCache } = useStorageStore();
	const [guesses, setGuesses] = useState<Guesses[][]>([[]]);

	useEffect(() => {
		setGuesses(storageCache.guesses);
	}, []);

	return (
		<>
			<Dialog
				open={open}
				aria-labelledby="responsive-dialog-title"
			>
				<DialogTitle id="responsive-dialog-title">
					{title}
				</DialogTitle>
				<Divider />
				<DialogContent>
					{children}
					<BuildScore guesses={guesses} />
				</DialogContent>
				<Divider />
				<DialogActions>
					<Button>
						share
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

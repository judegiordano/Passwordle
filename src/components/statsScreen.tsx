import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Divider } from "@mui/material";

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
				</DialogContent>
			</Dialog>
		</>
	);
}

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

interface IAlertProps {
	open: boolean
	title: string
	children: React.ReactNode
	handleClose: () => void
}

export function Alert({
	open,
	title,
	children,
	handleClose
}: IAlertProps) {
	return (
		<>
			<Dialog
				open={open}
				aria-labelledby="responsive-dialog-title"
			>
				<DialogTitle id="responsive-dialog-title">
					{title}
				</DialogTitle>
				<DialogContent>
					{children}
				</DialogContent>
				<Divider />
				<DialogActions>
					<Button onClick={handleClose} autoFocus>
						done
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

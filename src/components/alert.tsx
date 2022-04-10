import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { Divider, Button } from "@elements";

export function Alert({
	open,
	hash,
	handleClose
}: {
	open: boolean
	hash: string
	handleClose: () => void
}) {
	return (
		<>
			<Dialog
				open={open}
				aria-labelledby="responsive-dialog-title"
			>
				<DialogTitle id="responsive-dialog-title">
					{"Congratulations! Todays Password Was:"}
				</DialogTitle>
				<DialogContent>
					<DialogContentText className="break-words">
						<b>{hash}</b>
					</DialogContentText>
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

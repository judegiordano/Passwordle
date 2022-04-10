import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

interface ISpinnerProps {
	visible?: boolean
	size?: number
}

export function Spinner({
	visible = true,
	size = 50
}: ISpinnerProps) {
	if (!visible) return null;
	return (
		<div className="px-2 py-3">
			<CircularProgress size={size} />
		</div>
	);
}

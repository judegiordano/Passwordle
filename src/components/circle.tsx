import React from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { CircleType } from "@types";

interface ICircleProps {
	type: CircleType
}

export function Circle({ type }: ICircleProps) {
	return (
		<>
			{
				type === CircleType.incorrect ? (
					<AddCircleOutlineIcon className="text-red-400" style={{ transform: "rotate(45deg)" }} />
				) : type === CircleType.correct ? (
					<CheckCircleOutlineIcon className="text-green-400" />
				) : (
					<CheckCircleOutlineIcon className="text-yellow-400" />
				)
			}
		</>
	);
}

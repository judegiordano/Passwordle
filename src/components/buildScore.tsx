import React from "react";

import { Divider } from "@elements";
import { Circle, CircleType } from "./circle";

interface IBuildScoreProps {
	guesses: { type: CircleType }[][]
}

export function BuildScore({
	guesses
}: IBuildScoreProps) {
	return (
		<div className="max-w-md p-3 m-auto text-center">
			{
				guesses.map((guess, i) => (
					<span key={i}>
						<div className="pt-2 pb-2">
							{
								guess.map(({ type }, index) => (
									<Circle key={index} type={type} />
								))
							}
						</div>
						<Divider />
					</span>
				))
			}
		</div>
	);
}

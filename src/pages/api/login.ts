import { NextApiRequest, NextApiResponse } from "next";

import { RECAPTCHA_SITE_SECRET } from "@services/config";
import { hash, getPassword } from "@services/password";
import { CircleType, Guesses, HttpMethod } from "@types";

type RequestBody = { token: string, password: string, attempt: number };

async function validateCaptcha(token: string) {
	const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SITE_SECRET}&response=${token}`, { method: HttpMethod.POST });
	const data = await response.json();
	return data;
}

function buildPositions(guess: string, lookup: string[]) {
	return guess.split("").reduce((acc, letter, index) => {
		if (lookup[index] === letter) acc.push({ type: CircleType.correct });
		else if (lookup.includes(letter)) acc.push({ type: CircleType.wrong_position });
		else acc.push({ type: CircleType.incorrect });
		return acc;
	}, [] as Guesses[]);
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		if (req.method != HttpMethod.POST) throw "method not allowed";
		const { token, password: guess, attempt } = JSON.parse(req.body) as RequestBody;
		if (typeof attempt !== "number" || !guess || !token) throw "invalid request body";
		const response = await validateCaptcha(token);
		if (!response.success) throw "recaptcha failed";
		// validation passed
		const { password, lookup } = getPassword();
		if (password !== guess) return res.status(200).json({
			ok: true,
			data: {
				correct: false,
				hash: (attempt + 1) >= 10 ? hash(password) : "",
				password: "",
				positions: buildPositions(guess, lookup)
			}
		});
		return res.status(200).json({
			ok: true,
			data: {
				correct: true,
				hash: hash(password),
				password: "",
				positions: Array.from({ length: lookup.length }).map(() => {
					return { type: CircleType.correct };
				})
			}
		});
	} catch (error) {
		return res.status(500).json({
			ok: false,
			error
		});
	}
};

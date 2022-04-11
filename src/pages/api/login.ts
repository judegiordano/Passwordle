import { NextApiRequest, NextApiResponse } from "next";

import { RECAPTCHA_SITE_SECRET } from "@services/config";
import { hash, getPassword } from "@services/password";
import { CircleType } from "@types";

async function validateCaptcha(token: string) {
	const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SITE_SECRET}&response=${token}`, { method: "POST" });
	const data = await response.json();
	return data;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		if (req.method != "POST") throw "method not allowed";
		const { token, password: guess, attempt } = JSON.parse(req.body) as { token: string, password: string, attempt: number };
		if (!token) throw "recaptcha token missing";
		if (!guess) throw "no guess found";
		const response = await validateCaptcha(token);
		if (!response.success) throw "recaptcha failed";
		// errors passed
		const { password, lookup } = getPassword();
		if (password === guess) {
			return res.status(200).json({
				ok: true,
				data: {
					correct: true,
					hash: hash(password),
					password,
					positions: Array.from({ length: lookup.length }).map(() => {
						return { type: CircleType.correct };
					})
				}
			});
		}
		const positions = guess.split("").reduce((acc, letter, index) => {
			if (lookup[index] === letter) acc.push({ type: CircleType.correct });
			else if (lookup.includes(letter)) acc.push({ type: CircleType.wrong_position });
			else acc.push({ type: CircleType.incorrect });
			return acc;
		}, [] as { type: CircleType }[]);
		return res.status(200).json({
			ok: true,
			data: {
				correct: false,
				hash: (attempt + 1) >= 10 ? hash(password) : "",
				password: (attempt + 1) >= 10 ? password : "",
				positions
			}
		});
	} catch (error) {
		return res.status(500).json({
			ok: false,
			error
		});
	}
};

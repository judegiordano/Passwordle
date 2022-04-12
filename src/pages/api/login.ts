import { NextApiRequest, NextApiResponse } from "next";

import { PASSWORD_LENGTH, RECAPTCHA_SITE_SECRET } from "@services/config";
import { hash, getPassword } from "@services/password";
import { CircleType, Guesses, HttpMethod, RequestBody, PasswordLookup } from "@types";

async function validateCaptcha(token: string) {
	const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SITE_SECRET}&response=${token}`, { method: HttpMethod.POST });
	const data = await response.json();
	return data;
}

function validateGuess(guess: string, lookup: PasswordLookup) {
	const positions = guess.split("").reduce((acc, letter, index) => {
		const match = lookup[letter];
		if (!match) {
			acc.push({ type: CircleType.incorrect });
			return acc;
		}
		if (match.length === 1) {
			if (match[0] === index) acc.push({ type: CircleType.correct });
			else acc.push({ type: CircleType.wrong_position });
			return acc;
		}
		if (match[0] === index) {
			acc.push({ type: CircleType.correct });
		}
		else acc.push({ type: CircleType.wrong_position });
		lookup[letter].shift();
		return acc;
	}, [] as Guesses[]);
	return positions;
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
				positions: validateGuess(guess, lookup)
			}
		});
		return res.status(200).json({
			ok: true,
			data: {
				correct: true,
				hash: hash(password),
				password: "",
				positions: Array.from({ length: PASSWORD_LENGTH }).map(() => {
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

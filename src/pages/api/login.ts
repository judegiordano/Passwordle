import { NextApiRequest, NextApiResponse } from "next";
import Chance from "chance";

import { RECAPTCHA_SITE_SECRET } from "@services/config";
import { hash } from "@services/password";

enum CircleType {
	correct,
	incorrect,
	wrong_position
}

async function validateCaptcha(token: string) {
	const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SITE_SECRET}&response=${token}`, { method: "POST" });
	const data = await response.json();
	return data;
}

function getPassword() {
	const seed = new Chance(new Date().toLocaleDateString());
	const specials = seed.string({ length: 1, pool: "!@#$%^&*" });
	const numbers = seed.string({ length: 2, pool: "0123456789" });
	const uppercase = seed.string({ length: 3, pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" });
	const lowercase = seed.string({ length: 4, pool: "abcdefghijklmnopqrstuvwxyz" });
	const pool = `${specials}${numbers}${uppercase}${lowercase}`.split("");
	const password = seed.shuffle(pool).join("");
	const hashedPass = hash(password);
	return {
		password,
		lookup: password.split(""),
		hashedPass
	};
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		if (req.method != "POST") throw "method not allowed";
		const { token, password: guess } = JSON.parse(req.body) as { token: string, password: string };
		if (!token) throw "recaptcha token missing";
		if (!guess) throw "no guess found";
		const response = await validateCaptcha(token);
		if (!response.success) throw "recaptcha failed";
		// errors passed
		const { password, lookup, hashedPass } = getPassword();
		if (password === guess) {
			return res.status(200).json({
				ok: true,
				data: {
					correct: true,
					hash: hashedPass,
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
		res.status(200).json({
			ok: true,
			data: {
				correct: false,
				hash: null,
				positions
			}
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			error
		});
	}
};

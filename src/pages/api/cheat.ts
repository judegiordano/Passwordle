import { NextApiRequest, NextApiResponse } from "next";
import Chance from "chance";

import { hash } from "@services/password";

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
	const { password, lookup, hashedPass } = getPassword();
	res.status(200).json({ password, lookup, hashedPass });
};

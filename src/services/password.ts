import bcrypt from "bcryptjs";
import Chance from "chance";

import { PasswordLookup } from "@types";

export function hash(password: string) {
	const salt = bcrypt.genSaltSync(1);
	return bcrypt.hashSync(password, salt);
}

function buildLookup(password: string) {
	return password.split("").reduce((acc, letter, index) => {
		const exists = acc[letter];
		if (exists) {
			acc[letter].push(index);
			return acc;
		}
		acc[letter] = [index];
		return acc;
	}, {} as PasswordLookup);
}

export function getPassword() {
	const seed = new Chance(new Date().toLocaleDateString());
	const specials = seed.string({ length: 1, pool: "!@#$%^&*" });
	const numbers = seed.string({ length: 2, pool: "0123456789" });
	const uppercase = seed.string({ length: 3, pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" });
	const lowercase = seed.string({ length: 4, pool: "abcdefghijklmnopqrstuvwxyz" });
	const pool = `${specials}${numbers}${uppercase}${lowercase}`.split("");
	const password = seed.shuffle(pool).join("");
	return {
		password,
		lookup: buildLookup(password)
	};
}

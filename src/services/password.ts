import bcrypt from "bcryptjs";
import Chance from "chance";

export function hash(password: string) {
	const salt = bcrypt.genSaltSync(1);
	return bcrypt.hashSync(password, salt);
}

export function getPassword() {
	const seed = new Chance(new Date().toLocaleDateString());
	const specials = seed.string({ length: 1, pool: "!@#$%^&*" });
	const numbers = seed.string({ length: 2, pool: "0123456789" });
	const uppercase = seed.string({ length: 3, pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" });
	const lowercase = seed.string({ length: 4, pool: "abcdefghijklmnopqrstuvwxyz" });
	const pool = `${specials}${numbers}${uppercase}${lowercase}`.split("");
	const lookup = seed.shuffle(pool);
	return {
		password: lookup.join(""),
		lookup
	};
}

import bcrypt from "bcryptjs";

export function hash(password: string) {
	const salt = bcrypt.genSaltSync(1);
	return bcrypt.hashSync(password, salt);
}

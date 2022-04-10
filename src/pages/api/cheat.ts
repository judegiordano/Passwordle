import { NextApiRequest, NextApiResponse } from "next";

import { hash, getPassword } from "@services/password";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { password, lookup } = getPassword();
	const hashedPass = hash(password);
	res.status(200).json({ password, lookup, hash: hashedPass });
};

import { NextApiRequest, NextApiResponse } from "next";

import { getPassword } from "@services/password";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { password, lookup } = getPassword();
	res.status(200).json({ password, lookup });
};

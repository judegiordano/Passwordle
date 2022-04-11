import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import { Rest } from "@services/rest";
import { IApiResponse } from "@types";

export function useLogin() {
	const recaptchaRef = useRef<ReCAPTCHA>();
	const [isLoading, setIsLoading] = useState(false);

	async function handleLogin(password: string, attempt: number): Promise<IApiResponse> {
		setIsLoading(true);
		const token = await recaptchaRef.current?.executeAsync();
		recaptchaRef.current?.reset();
		const data = await Rest.Post("login", { token, password, attempt });
		setIsLoading(false);
		return data;
	}

	return {
		isLoading,
		recaptchaRef: recaptchaRef as React.LegacyRef<ReCAPTCHA>,
		setIsLoading,
		handleLogin
	};
}

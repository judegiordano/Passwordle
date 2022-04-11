import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import { NEXT_PUBLIC_DOMAIN } from "@services/config";
import { IApiResponse } from "@types";

export function useLogin() {
	const recaptchaRef = useRef<ReCAPTCHA>();
	const [isLoading, setIsLoading] = useState(false);

	async function handleLogin(password: string, attempt: number): Promise<IApiResponse> {
		setIsLoading(true);
		const token = await recaptchaRef.current?.executeAsync();
		recaptchaRef.current?.reset();
		const body = JSON.stringify({ token, password, attempt });
		const response = await fetch(`${NEXT_PUBLIC_DOMAIN}/api/login`, { method: "POST", body });
		const data = await response.json();
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

import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import { NEXT_PUBLIC_DOMAIN } from "@services/config";
import { CircleType } from "@components/circle";

export function useLogin() {
	const recaptchaRef = useRef<ReCAPTCHA>();
	const [isLoading, setIsLoading] = useState(false);

	async function handleLogin(password: string) {
		setIsLoading(true);
		const token = await recaptchaRef.current?.executeAsync();
		recaptchaRef.current?.reset();
		const body = JSON.stringify({ token, password });
		const response = await fetch(`${NEXT_PUBLIC_DOMAIN}/api/login`, { method: "POST", body });
		const data = await response.json();
		return data as {
			ok: boolean,
			error?: string | null,
			data?: {
				correct: boolean
				hash: string,
				positions: { type: CircleType }[]
			}
		};
	}

	return {
		isLoading,
		recaptchaRef: recaptchaRef as React.LegacyRef<ReCAPTCHA>,
		setIsLoading,
		handleLogin
	};
}

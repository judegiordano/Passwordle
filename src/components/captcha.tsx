import React from "react";
import ReCAPTCHA from "react-google-recaptcha";

import { NEXT_PUBLIC_RECAPTCHA_SITE_KEY } from "@services/config";

interface IReCaptchaProps {
	recaptchaRef: React.LegacyRef<ReCAPTCHA>
}

export function ReCaptcha({
	recaptchaRef
}: IReCaptchaProps) {
	return (
		<ReCAPTCHA
			ref={recaptchaRef}
			size="invisible"
			sitekey={NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
		/>
	);
}

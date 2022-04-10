import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Input, InputLabel, FormControl, Card, CardContent, Button } from "@elements";
import { CircleType } from "@components/circle";
import { ReCaptcha } from "@components/captcha";
import { useSettingsStore, Settings } from "@store/useSettings";
import { useGuessesStore, Guesses } from "@store/useGuesses";
import { useAuthStore, Auth } from "@store/useAuth";
import { useLogin } from "@hooks/useLogin";

import { BuildScore } from "@components/buildScore";
import { Alert } from "@components/alert";
import { MAX_TRIES } from "@services/config";

function Home() {
	const { isLoading, recaptchaRef, setIsLoading, handleLogin } = useLogin();
	const { settingsCache, updateSettingsCache } = useSettingsStore();
	const { guessesCache, updateGuessesCache } = useGuessesStore();
	const { authCache, updateAuthCache } = useAuthStore();
	const [alertOpen, setAlertOpen] = useState(false);
	const [guesses, setGuesses] = useState<Guesses[][]>([[]]);
	const [settings, setSettings] = useState<Settings>({ password: "", hash: "" });
	const [auth, setAuth] = useState<Auth>();

	const sync = (
		values: Settings,
		loading: boolean,
		openAlert = false,
		positions?: { type: CircleType }[]
	) => {
		setSettings(values);
		updateSettingsCache(values);
		setIsLoading(loading);
		setAlertOpen(openAlert);
		if (positions) {
			guessesCache.push(positions);
			updateGuessesCache(guessesCache);
		}
	};
	const handleSubmit = async () => {
		const response = await handleLogin(settings.password);
		if (!response.ok || !response.data) {
			toast.error(response.error ?? "internal server error");
			sync({ ...settings, password: "", hash: "" }, false);
			return;
		}
		const {correct, hash, positions } = response.data;
		if (!correct && positions) {
			toast.error("incorrect password");
			sync({ ...settings, password: "", hash: "" }, false, false, positions);
			updateAuthCache({...authCache, attempts: authCache.attempts += 1 });
			return;
		}
		sync({ ...settings, password: "", hash }, false, true, positions );
		updateAuthCache({...authCache, attempts: authCache.attempts += 1 });
	};
	useEffect(() => {
		setSettings(settingsCache);
		setGuesses(guessesCache);
		setAuth(authCache);
	}, [settingsCache, guessesCache, authCache]);

	return (
		<>
			<div className="max-w-md p-3 m-auto">
				Attempts: {auth?.attempts}
			</div>
			<div className="max-w-md p-3 m-auto">
				<Card>
					<CardContent>
						<div className='pb-4 text-center'>
							<FormControl>
								<InputLabel
									htmlFor="filled-adornment-password">
									{`Password ${settings.password.length ?? 0}/10`}
								</InputLabel>
								<Input
									disabled={isLoading || (auth?.attempts && auth.attempts >= MAX_TRIES) || false}
									value={settings.password}
									fullWidth
									className="max-w-[250px] text-1xl"
									inputProps={{ maxLength: 10 }}
									onChange={(e) => sync({ ...settings, password: e.target.value }, false)}
									id="filled-adornment-password"
									type="password"
									autoComplete="off"
								/>
							</FormControl>
						</div>
						<div className="text-center">
							<Button
								disabled={settings.password.length < 10 || isLoading}
								fullWidth
								className="max-w-[250px]"
								variant="outlined"
								onClick={async () => await handleSubmit()}
							>
								Login
							</Button>
						</div>
					</CardContent>
				</Card>
				<Alert
					open={alertOpen}
					hash={settings.hash}
					handleClose={() => setAlertOpen(false)}
				/>
				<ReCaptcha recaptchaRef={recaptchaRef} />
			</div>
			<BuildScore guesses={guesses} />
		</>
	);
}

export default Home;

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { DialogContentText } from "@mui/material";

import { ReCaptcha } from "@components/captcha";
import { useStorageStore, Storage } from "@store/useStorage";
import { useLogin } from "@hooks/useLogin";
import { BuildScore } from "@components/buildScore";
import { MAX_TRIES, PASSWORD_LENGTH } from "@services/config";
import { Spinner } from "@elements/spinner";
import { StatsScreen } from "@components/statsScreen";

function Home() {
	const { isLoading, recaptchaRef, handleLogin } = useLogin();
	const { storageCache, updateStorageCache } = useStorageStore();
	const [memory, setMemory] = useState<Storage>({
		password: "",
		hash: "",
		attempts: 0,
		guesses: [[]],
		loggedIn: false
	});

	const handleSubmit = async () => {
		const response = await handleLogin(memory.password, memory.attempts);
		if (!response.ok || !response.data) {
			toast.error(response.error ?? "internal server error");
			updateStorageCache({
				...storageCache,
				password: "",
				hash: "",
				loggedIn: false
			});
			return;
		}
		const { correct, hash, positions, password } = response.data;
		if (!correct && positions) {
			toast.error("incorrect password");
			memory.guesses.push(positions);
			updateStorageCache({
				...storageCache,
				password,
				hash,
				loggedIn: false,
				attempts: storageCache.attempts += 1,
				guesses: memory.guesses
			});
			return;
		}
		memory.guesses.push(positions);
		updateStorageCache({
			...storageCache,
			password,
			hash,
			loggedIn: true,
			attempts: storageCache.attempts += 1,
			guesses: memory.guesses
		});
	};
	const enterListener = async (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		if (memory.password.length < PASSWORD_LENGTH || isLoading || memory.attempts >= MAX_TRIES || memory.loggedIn) return;
		if (event.code !== "Enter" && event.code !== "NumpadEnter") return;
		event.preventDefault();
		await handleSubmit();
	};

	useEffect(() => {
		setMemory(storageCache);
	}, [storageCache]);

	return (
		<>
			<div className="max-w-md p-3 m-auto">
				Attempts: {memory.attempts} / {MAX_TRIES}
			</div>
			<div className="max-w-md p-3 m-auto">
				<Card>
					<CardContent>
						<div className='pb-4 text-center'>
							<FormControl>
								<InputLabel
									htmlFor="filled-adornment-password">
									{`Password ${memory.password.length ?? 0}/${PASSWORD_LENGTH}`}
								</InputLabel>
								<Input
									disabled={
										isLoading ||
										memory.attempts >= MAX_TRIES ||
										memory.loggedIn
									}
									value={memory.password}
									fullWidth
									className="max-w-[250px] text-1xl"
									inputProps={{ maxLength: PASSWORD_LENGTH }}
									onChange={e => updateStorageCache({ ...storageCache, password: e.target.value })}
									onKeyDown={async e => await enterListener(e)}
									id="filled-adornment-password"
									type="password"
									autoComplete="off"
									endAdornment={
										<InputAdornment position="end">
											<Spinner visible={isLoading} size={25} />
										</InputAdornment>
									}
								/>
							</FormControl>
						</div>
						<div className="text-center">
							<Button
								disabled={
									memory.password.length < 10 ||
									isLoading ||
									memory.attempts >= MAX_TRIES ||
									memory.loggedIn
								}
								type="submit"
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
			</div>
			<StatsScreen
				title={`${memory.loggedIn ? "Congratulations!" : "Too Bad!"} Today's Password Was:`}
				open={memory.attempts >= MAX_TRIES || memory.loggedIn}
			>
				<DialogContentText className="break-words">
					<b>{memory.hash}</b>
				</DialogContentText>
			</StatsScreen>
			<ReCaptcha recaptchaRef={recaptchaRef} />
			<BuildScore guesses={memory.guesses} />
		</>
	);
}

export default Home;

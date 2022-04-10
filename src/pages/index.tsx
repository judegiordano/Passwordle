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
import { Alert } from "@elements/alert";
import { MAX_TRIES } from "@services/config";
import { Spinner } from "@elements/spinner";

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
	const [alertOpen, setAlertOpen] = useState(false);

	const handleSubmit = async () => {
		const response = await handleLogin(memory.password);
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
		const { correct, hash, positions } = response.data;
		if (!correct && positions) {
			toast.error("incorrect password");
			memory.guesses.push(positions);
			updateStorageCache({
				...storageCache,
				password: "",
				hash: "",
				loggedIn: false,
				attempts: storageCache.attempts += 1,
				guesses: memory.guesses
			});
			return;
		}
		memory.guesses.push(positions);
		updateStorageCache({
			...storageCache,
			password: memory.password,
			hash,
			loggedIn: true,
			attempts: storageCache.attempts += 1,
			guesses: memory.guesses
		});
		setAlertOpen(true);
	};

	useEffect(() => {
		setMemory(storageCache);
	}, [storageCache]);

	return (
		<>
			<div className="max-w-md p-3 m-auto">
				Attempts: {memory.attempts}
			</div>
			<div className="max-w-md p-3 m-auto">
				<Card>
					<CardContent>
						<div className='pb-4 text-center'>
							<FormControl>
								<InputLabel
									htmlFor="filled-adornment-password">
									{`Password ${memory.password.length ?? 0}/10`}
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
									inputProps={{ maxLength: 10 }}
									onChange={(e) => updateStorageCache({ ...storageCache, password: e.target.value })}
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
					title="Congratulations! Todays Password Was:"
					open={alertOpen}
					handleClose={() => setAlertOpen(false)}
				>
					<DialogContentText className="break-words">
						<b>{memory.hash}</b>
					</DialogContentText>
				</Alert>
				<ReCaptcha recaptchaRef={recaptchaRef} />
			</div>
			<BuildScore guesses={memory.guesses} />
		</>
	);
}

export default Home;

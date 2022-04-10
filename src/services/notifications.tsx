import React from "react";
import toast, { Toaster, ToastBar } from "react-hot-toast";

import { IconButton } from "@elements";
import { CloseIcon } from "@icons";

export function Notifications() {
	return (
		<>
			<Toaster
				position="top-right"
				gutter={4}
				toastOptions={{
					duration: 3000
				}}
			>
				{(t) => (
					<ToastBar toast={t}>
						{({ icon, message }) => (
							<>
								{icon}
								{message}
								{t.type !== "loading" && (
									<>
										<IconButton>
											<CloseIcon onClick={() => toast.dismiss(t.id)} />
										</IconButton>
									</>
								)}
							</>
						)}
					</ToastBar>
				)}
			</Toaster>
		</>
	);
}

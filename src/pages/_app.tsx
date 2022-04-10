import React from "react";
import Head from "next/head";
import { SWRConfig } from "swr";
import type { AppProps } from "next/app";

import "../styles/globals.css";
import { Notifications } from "@services/notifications";

const provider = ((cache) => () => cache)(new Map());

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<SWRConfig value={{ provider }}>
				<Head>
					<title>Passwordle</title>
					<meta charSet="UTF-8" />
					<meta name="node application" content="A simple web application" />
					<meta name="keywords" content="HTML,CSS,XML,JavaScript" />
					<meta name="description" content="Passwordle Game" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<meta name="author" content="Jude Giordano" />
					<link rel="icon" href="/padlock.png" />
				</Head>
				<div className="font-content">
					<Component {...pageProps} />
				</div>
			</SWRConfig>
			<Notifications />
		</>
	);
}

export default MyApp;

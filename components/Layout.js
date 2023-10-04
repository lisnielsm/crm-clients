import { useRouter } from "next/router";
import React from "react";

import Head from "next/head";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
	// Routing de next
	const router = useRouter();

	return (
		<>
			<Head>
				<title>CRM - Administración de Clientes</title>
				<link
					rel="stylesheet"
					href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
					integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w=="
					crossOrigin="anonymous"
					referrerPolicy="no-referrer"
				/>
			</Head>

			{router.pathname === "/login" || router.pathname === "/nuevacuenta" ? (
				<div className="bg-gray-800 p-4 min-h-screen flex flex-col justify-center">
					<div>{children}</div>
				</div>
			) : (
				<div className="bg-gray-200 min-h-screen">
					<div className="sm:flex min-h-screen">
						<Sidebar />

						<main className="w-full sm:min-h-screen p-5 pb-16">
							<Header />

							{children}
						</main>
					</div>
				</div>
			)}
		</>
	);
};

export default Layout;

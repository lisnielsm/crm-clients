import React from "react";
import { ApolloProvider } from "@apollo/client";
import "tailwindcss/tailwind.css";
import client from "../config/apollo";
import { store } from "../store";
import { Provider } from "react-redux";

function MyApp({ Component, pageProps }) {
	return (
		<Provider store={store}>
			<ApolloProvider client={client}>
				<Component {...pageProps} />
			</ApolloProvider>
		</Provider>
	);
}

export default MyApp;

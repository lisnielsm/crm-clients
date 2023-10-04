import { ApolloProvider } from "@apollo/client";
import "tailwindcss/tailwind.css";
import client from "../config/apollo";
import LayoutState from "../context/layout/LayoutState";
import PedidoState from "../context/pedidos/PedidoState";

function MyApp({ Component, pageProps }) {
	return (
		<ApolloProvider client={client}>
			<LayoutState>
				<PedidoState>
					<Component {...pageProps} />
				</PedidoState>
			</LayoutState>
		</ApolloProvider>
	);
}

export default MyApp;

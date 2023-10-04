import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import fetch from "node-fetch";
import { setContext } from "apollo-link-context";

const httpLink = createHttpLink({
    uri: "https://site--server--n8gvcqwzpvkz.code.run/",
    fetch,
});

const authLink = setContext((_, { headers }) => {
    // Leer el storage almacenado
    const token = localStorage.getItem("token");

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

const apolloClient = new ApolloClient({
    // connectToDevTools: true,
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
});

export default apolloClient;
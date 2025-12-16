import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// apollo client configuration
export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URI || "http://localhost:8000/graphql/",
    headers: {
      "X-ORG-SLUG": import.meta.env.VITE_ORG_SLUG || "acme",
    },
  }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          projects: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});

/**
 * This file setup the connection (http or ws) to a graphql server
 */
import { HttpLink, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import config from "../../config";
import { store } from "../../store";

const getToken = () => {
  const token = store.getState().auth?.token;
  const authorization = token || "";
  return authorization;
};

export const httpLink: HttpLink = new HttpLink({
  uri: config.graphQlSchemaURL,
});

export const wsLink: GraphQLWsLink = new GraphQLWsLink(
  createClient({
    url: config.graphQlWsSchemaURL,

    connectionParams: () => ({
      Authorization: getToken(),
    }),
  }),
);

/**
 * split fn provided by apollo client, it creates server link for us by recognising what type of query operation we are performing (ws or http)
 */
const serverLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink,
);

export default serverLink;

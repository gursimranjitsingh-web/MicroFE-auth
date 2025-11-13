import { ApolloClient } from "@apollo/client";
import link from "./Middlewares";
import initCache from "./Cache";
import config, { ENVIRONMENT } from "../config";

export const getApolloClient = () => {
  const cache = initCache();

  const apolloClient = new ApolloClient({
    link,
    cache,
    connectToDevTools: config.nodeEnv === ENVIRONMENT.DEV,
  });

  return apolloClient;
};

const client = getApolloClient();

export default client;

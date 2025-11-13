import { ApolloLink } from "@apollo/client";
import serverLink from "./server";
import errorLink from "./errors";
import authLink from "./auth";

const link = ApolloLink.from([authLink, errorLink, serverLink]);

export default link;

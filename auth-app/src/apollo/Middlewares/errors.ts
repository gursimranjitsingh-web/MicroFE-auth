import { ApolloLink, ServerError } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { store } from "../../store";
import { logout } from "../../store/authSlice";

enum ERROR_RESPONSE_CODES {
  BadUserInput = "BAD_USER_INPUT",
  Forbidden = "FORBIDDEN",
  UnAuthorized = "UNAUTHORIZED",
  NotFound = "NOT_FOUND",
  InternalServerError = "INTERNAL_ERROR",
  BadRequest = "BAD_REQUEST",
  Downstream = "DOWNSTREAM_SERVICE_ERROR",
}

const isServerError = (error: ServerError | Error): error is ServerError =>
  "statusCode" in error;
/**
 *  Middleware for handling 500 and 4** API status code
 **/

const errorLink: ApolloLink = onError(({ networkError, graphQLErrors }) => {
  const showErrorMessage = (msg: string) => {
    console.log(msg,'Error Message to be shown to user');
  };
  if (
    networkError &&
    isServerError(networkError) &&
    networkError.statusCode === 400
  ) {
    if (typeof networkError.result !== "string") {
      networkError.result.errors.forEach((err: Error) => {
        showErrorMessage(err.message);
      });
    } else {
      // Capture general network errors
    }
  } else if (graphQLErrors) {
    // As discussed with BE, errors will only be coming at first index
    const graphQlErrorState = graphQLErrors[0];
    const errorCode = graphQlErrorState?.extensions?.code;
    
    if (
      [
        ERROR_RESPONSE_CODES.BadRequest,
        ERROR_RESPONSE_CODES.Forbidden,
        ERROR_RESPONSE_CODES.InternalServerError,
        ERROR_RESPONSE_CODES.NotFound,
        ERROR_RESPONSE_CODES.Downstream,
      ].includes(errorCode as ERROR_RESPONSE_CODES)
    ) {
      showErrorMessage(graphQlErrorState.message);
    } else if (ERROR_RESPONSE_CODES.UnAuthorized === errorCode) {
      store.dispatch(logout());
      showErrorMessage(graphQlErrorState.message);
    }
  }
});

export default errorLink;

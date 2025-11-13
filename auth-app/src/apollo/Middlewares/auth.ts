import { ApolloLink, Observable } from "@apollo/client";
import { store } from "../../store";

const GHOST_USER_EMAIL_HEADER = "x-auth-email";

const authLink = new ApolloLink((operation, forward) => {

  return new Observable((observer) => {
    // 1) dispatch your thunk (auto-refresh if needed)
    Promise.resolve().then(() => {
        const token = store.getState().auth?.token;

        if (!token) {
          // forced‐signout path
          throw new Error("SessionExpired");
        }

        // 3) apply headers
        const email = localStorage.getItem(GHOST_USER_EMAIL_HEADER);
        operation.setContext(({ headers = {} }) => ({
          headers: {
            ...headers,
            authorization: token, // or `Bearer ${token}` if your backend requires it
            ...(email ? { [GHOST_USER_EMAIL_HEADER]: email } : {}),
           "Referer-Path": location.pathname + location.search,
          },
        }));

        // 4) fire the request
        forward(operation).subscribe({
          next: (res) => observer.next(res),
          error: (err) => observer.error(err),
          complete: () => observer.complete(),
        });
      })
      .catch((error) => {
        if (
          error.message === "RefreshTokenExpired" ||
          error.message === "SessionExpired"
        ) {
          // store.dispatch(
          //   pushMessageAlert({
          //     type: TAlertEnum.ERROR,
          //     message: "Session expired. Please sign in again.",
          //   }),
          // );
          // store.dispatch(signout());
        }
        // something went wrong in fetchSession()
        observer.error(error);
      });
  });
});

export default authLink;

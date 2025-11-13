
import { CC_ME } from "./queries";
import { CcUser } from "../../__generated__/graphql";
import { logout, setUserData } from "../../store/authSlice";
import { useDispatch } from "react-redux";
import { ApolloClient, DocumentNode, OperationVariables, TypedDocumentNode } from "@apollo/client";
import { useCallback, useRef, useState } from "react";
import client from "../../apollo";

type LazyResult<TData> = {
  called: boolean;
  loading: boolean;
  data?: TData;
  error?: unknown;
};

type Execute<TData, TVars extends OperationVariables> = (
  vars?: TVars
) => Promise<{ data: TData }>;

export function useLazyQueryWithClient<
  TData,
  TVars extends OperationVariables = OperationVariables,
>(
  client: ApolloClient<unknown>,
  query: DocumentNode | TypedDocumentNode<TData, TVars>,
  defaultVars?: TVars,
): [Execute<TData, TVars>, LazyResult<TData>] {
  const [state, setState] = useState<LazyResult<TData>>({ called: false, loading: false });
  const varsRef = useRef<TVars | undefined>(defaultVars);

  const execute = useCallback<Execute<TData, TVars>>(async (vars) => {
    setState(s => ({ ...s, called: true, loading: true, error: undefined }));
    try {
      const res = await client.query<TData, TVars>({
        query,
        variables: vars ?? varsRef.current,
        fetchPolicy: 'no-cache',
      });
      setState({ called: true, loading: false, data: res.data });
      return { data: res.data };
    } catch (err) {
      setState({ called: true, loading: false, error: err as unknown });
      throw err;
    }
  }, [client, query]);

  return [execute, state];
}


export const useCcMe = () => {
  const dispatch = useDispatch();
  const [fetch, { loading }] = useLazyQueryWithClient(client,CC_ME);

  const fetcher = async () => {
    try {
      const result = await fetch();
      dispatch(setUserData(result.data?.ccMe as CcUser));
    } catch (error) {
      dispatch(logout());
    }
  };

  return { fetcher, loading };
};

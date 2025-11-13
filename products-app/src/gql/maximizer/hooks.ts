
import { useLazyQuery, type DocumentNode, type LazyQueryHookOptions, type OperationVariables, type TypedDocumentNode } from "@apollo/client";

import { setMaxConfig } from "../../store/cartSlice";
import { useDispatch } from "react-redux";
import { MAX_CONFIG } from "./queries";
import type { MaxConfigQueryVariables } from "../../__generated__/graphql";


export function useCustomLazyQuery<
  OperationResult,
  Variables extends OperationVariables = {},
>(
  query: DocumentNode | TypedDocumentNode<OperationResult, Variables>,
  options:
    | LazyQueryHookOptions<NoInfer<OperationResult>, Variables>
    | undefined = {},
) {
  const customOptions: typeof options = { fetchPolicy: "no-cache", ...options };
  const queryResult = useLazyQuery(query, {
    ...customOptions,
  });
  return queryResult;
}


export const useMaxConfig = () => {
  const dispatch = useDispatch();
  const [fetch, { loading }] = useCustomLazyQuery(MAX_CONFIG);

  const fetcher = ({
    variables,
    onCompleted,
  }: {
    variables: MaxConfigQueryVariables;
    // TODO: Replace 'any' with actual type
    onCompleted?: (data: any) => void;
  }) => {
    fetch({
      variables,
      onCompleted: (e) => {
        dispatch(
          setMaxConfig({
            ...e?.maxConfigV2,
          }),
        );
        if (onCompleted) onCompleted(e.maxConfigV2 || {});
      },
    });
  };

  return {
    fetchMaxConfig: fetcher,
    maxConfigLoading: loading,
  };
};



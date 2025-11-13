/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query CcMe {\n  ccMe {\n    id\n    fullName\n    email\n    phoneNumber\n    status\n    profilePic\n    alias\n    internal_external\n    isDeleted\n    role {\n      id\n      name\n      description\n      isDeleted\n      displayName\n      permissions {\n        id\n        name\n        description\n        displayName\n      } \n      custom\n      userCount\n    }\n    front {\n      id\n      name\n      isDefault\n      business {\n        id\n        name\n        type\n        activeTabs {\n          isVisible\n          path\n        }\n      }\n    }\n    team {\n      id\n      name\n      teamAlias\n      isDefault\n    }\n    agency {\n      id\n      name\n      email\n      status\n      alias\n      description\n      userCount\n      frontCount\n      teamCount\n      platformCount\n      assetsCount\n    }\n    department {\n      id\n      name\n    }\n    userSettings {\n      id\n      settingOptions {\n        timeZone\n        offset\n        currency\n        name\n        language\n      }\n      isDeleted\n    }\n  }\n}": typeof types.CcMeDocument,
};
const documents: Documents = {
    "query CcMe {\n  ccMe {\n    id\n    fullName\n    email\n    phoneNumber\n    status\n    profilePic\n    alias\n    internal_external\n    isDeleted\n    role {\n      id\n      name\n      description\n      isDeleted\n      displayName\n      permissions {\n        id\n        name\n        description\n        displayName\n      } \n      custom\n      userCount\n    }\n    front {\n      id\n      name\n      isDefault\n      business {\n        id\n        name\n        type\n        activeTabs {\n          isVisible\n          path\n        }\n      }\n    }\n    team {\n      id\n      name\n      teamAlias\n      isDefault\n    }\n    agency {\n      id\n      name\n      email\n      status\n      alias\n      description\n      userCount\n      frontCount\n      teamCount\n      platformCount\n      assetsCount\n    }\n    department {\n      id\n      name\n    }\n    userSettings {\n      id\n      settingOptions {\n        timeZone\n        offset\n        currency\n        name\n        language\n      }\n      isDeleted\n    }\n  }\n}": types.CcMeDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query CcMe {\n  ccMe {\n    id\n    fullName\n    email\n    phoneNumber\n    status\n    profilePic\n    alias\n    internal_external\n    isDeleted\n    role {\n      id\n      name\n      description\n      isDeleted\n      displayName\n      permissions {\n        id\n        name\n        description\n        displayName\n      } \n      custom\n      userCount\n    }\n    front {\n      id\n      name\n      isDefault\n      business {\n        id\n        name\n        type\n        activeTabs {\n          isVisible\n          path\n        }\n      }\n    }\n    team {\n      id\n      name\n      teamAlias\n      isDefault\n    }\n    agency {\n      id\n      name\n      email\n      status\n      alias\n      description\n      userCount\n      frontCount\n      teamCount\n      platformCount\n      assetsCount\n    }\n    department {\n      id\n      name\n    }\n    userSettings {\n      id\n      settingOptions {\n        timeZone\n        offset\n        currency\n        name\n        language\n      }\n      isDeleted\n    }\n  }\n}"): (typeof documents)["query CcMe {\n  ccMe {\n    id\n    fullName\n    email\n    phoneNumber\n    status\n    profilePic\n    alias\n    internal_external\n    isDeleted\n    role {\n      id\n      name\n      description\n      isDeleted\n      displayName\n      permissions {\n        id\n        name\n        description\n        displayName\n      } \n      custom\n      userCount\n    }\n    front {\n      id\n      name\n      isDefault\n      business {\n        id\n        name\n        type\n        activeTabs {\n          isVisible\n          path\n        }\n      }\n    }\n    team {\n      id\n      name\n      teamAlias\n      isDefault\n    }\n    agency {\n      id\n      name\n      email\n      status\n      alias\n      description\n      userCount\n      frontCount\n      teamCount\n      platformCount\n      assetsCount\n    }\n    department {\n      id\n      name\n    }\n    userSettings {\n      id\n      settingOptions {\n        timeZone\n        offset\n        currency\n        name\n        language\n      }\n      isDeleted\n    }\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
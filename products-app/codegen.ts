import { CodegenConfig } from "@graphql-codegen/cli";
import token from "./codegenToken";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config(); // This will load variables from a `.env` file located in the root of your project

const schemaUrl =
  (process.env.VITE_ENVIRONMENT == "production"
    ? process.env.VITE_PROD_GRAPHQL_SCHEMA_URL
    : process.env.VITE_GRAPHQL_SCHEMA_URL) ||
  "https://graph.dev.lookfinity.com/graphql";

const wsSchemaUrl =
  (process.env.VITE_ENVIRONMENT == "production"
    ? process.env.VITE_PROD_GRAPHQL_WS_SCHEMA_URL
    : process.env.VITE_GRAPHQL_WS_SCHEMA_URL) ||
  "wss://subscription.dev.lookfinity.com/graphql";

const codegenConfig: CodegenConfig = {
  // TODO: When we get authenticated graphql schema then we have to use below config object
  schema: {
    [schemaUrl]: {
      headers: {
        Authorization: token,
      },
    },
    [wsSchemaUrl]: {
      headers: {
        Authorization: token,
      },
    },
  },
  // this assumes that all your source files are in a top-level `src/` directory - you might need to adjust this to your file structure
  documents: ["src/**/*.{ts,tsx}"],
  generates: {
    "./src/__generated__/": {
      preset: "client",
      presetConfig: { gqlTagName: "gql", fragmentMasking: false },
    },
  },
  ignoreNoDocuments: true,
};

export default codegenConfig;

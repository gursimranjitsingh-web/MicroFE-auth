export enum ENVIRONMENT {
  DEV = "development",
  PROD = "production",
  BETA = "beta",
  STAGE = "stage",
}
const config = {
  appName: import.meta.env.VITE_APP_NAME,
  nodeEnv: import.meta.env.VITE_USER_NODE_ENV,
  environment: import.meta.env.VITE_ENVIRONMENT,
  graphQlSchemaURL: import.meta.env.VITE_GRAPHQL_SCHEMA_URL,
  prodGraphQlSchemaURL: import.meta.env.VITE_PROD_GRAPHQL_SCHEMA_URL,
  graphQlWsSchemaURL: import.meta.env.VITE_GRAPHQL_WS_SCHEMA_URL,
  prodGraphQlWsSchemaURL: import.meta.env.VITE_PROD_GRAPHQL_WS_SCHEMA_URL,
  appURL: import.meta.env.VITE_APP_URL,
  cognitoUserPoolID: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  cognitoUserPoolRegion: import.meta.env.VITE_COGNITO_USER_POOL_REGION,
  cognitoUserPoolClientID: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
  loggerDSN: import.meta.env.VITE_LOGGER_DSN,
  lFVersion: import.meta.env.VITE_NPM_PACKAGE_VERSION,
  termsAndConditionsURL: import.meta.env.VITE_TERMS_AND_CONDITIONS_URL,
  privacyPolicyURL: import.meta.env.VITE_PRIVACY_POLICY_URL,
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL,
  domain: import.meta.env.VITE_DOMAIN,
  agGridLicenseKey: import.meta.env.VITE_AG_GRID_LICENSE_KEY,
  r2LPEndpoint: import.meta.env.VITE_R2_LP_ENDPOINT,
};
export default config;

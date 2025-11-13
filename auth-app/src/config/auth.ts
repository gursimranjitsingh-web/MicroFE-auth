import config from "./index";

const AuthConfig = {
  Auth: {
    Cognito: {
      userPoolId: config.cognitoUserPoolID,
      region: config.cognitoUserPoolRegion,
      userPoolClientId: config.cognitoUserPoolClientID,
    },
  },
};

export default AuthConfig;

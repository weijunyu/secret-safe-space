export const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
export const firebaseConfig = JSON.parse(
  process.env.REACT_APP_FIREBASE_CONFIG || "{}"
);
export const deploymentEnv = process.env.REACT_APP_DEPLOYMENT_ENV;

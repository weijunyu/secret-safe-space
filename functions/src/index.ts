import * as functions from "firebase-functions";

import apiApp from "./api";

export const api = functions.region("asia-southeast2").https.onRequest(apiApp);

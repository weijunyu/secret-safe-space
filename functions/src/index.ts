import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions
  .region("asia-southeast2")
  .https.onCall((request, response) => {
    functions.logger.info(request.body);
    functions.logger.info("Hello logs!", { structuredData: true });
    return {
      message: "hello there!",
    };
  });

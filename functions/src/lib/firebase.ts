import * as admin from "firebase-admin";

admin.initializeApp();

export const firebaseAdmin = admin;
export const firestore = admin.firestore();

import * as admin from "firebase-admin";

export interface SecretDocument extends admin.firestore.DocumentData {
  secretWriteTime?: FirebaseFirestore.Timestamp;
  secret?: string;
}

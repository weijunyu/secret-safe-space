import * as admin from "firebase-admin";

export interface SecretDocument extends admin.firestore.DocumentData {
  value: string;
  writeTime: admin.firestore.Timestamp;
  expiryTime: admin.firestore.Timestamp;
  encryptionDisabled: boolean;
  deleteOnLoad: boolean;
}

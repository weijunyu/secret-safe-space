import * as admin from "firebase-admin";

export interface SecretDocument extends admin.firestore.DocumentData {
  value: string;
  type: SecretType;
  writeTime: admin.firestore.Timestamp;
  expiryTime: admin.firestore.Timestamp;
  encryptionDisabled: boolean;
  deleteOnLoad: boolean;
}

export enum SecretType {
  Text = "text",
  File = "file",
}

export interface SecretDocumentJsonResponse {
  encryptionDisabled: boolean;
  expiryTime: { _seconds: number; _nanoseconds: number };
  value: string;
  writeTime: { _seconds: number; _nanoseconds: number };
}
export enum SecretType {
  Text = "text",
  File = "file",
}

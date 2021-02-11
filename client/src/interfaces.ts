export interface SecretDocumentJsonResponse {
  deleteOnLoad: boolean;
  encryptionDisabled: boolean;
  expiryTime: { _seconds: number; _nanoseconds: number };
  type: SecretType;
  value: string;
  writeTime: { _seconds: number; _nanoseconds: number };
}
export enum SecretType {
  Text = "text",
  File = "file",
}

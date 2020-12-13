export interface SecretDocumentJsonResponse {
  encryptionDisabled: boolean;
  expiryTime: { _seconds: number; _nanoseconds: number };
  value: string;
  writeTime: { _seconds: number; _nanoseconds: number };
}

export interface SecretDocument {
  secretWriteTime?: FirebaseFirestore.Timestamp;
  secret?: string;
}

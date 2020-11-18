export interface SecretDocument {
  reserveTime?: FirebaseFirestore.Timestamp;
  secretWriteTime?: FirebaseFirestore.Timestamp;
  secret?: string;
}

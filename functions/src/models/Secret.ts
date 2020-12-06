import { firebaseAdmin, firestore } from "../lib/firebase";
import {
  SECRET_PATH_COLLECTION,
  DEFAULT_SECRET_EXPIRY_DURATION,
} from "../lib/constants";
import { SecretDocument } from "../interfaces";

class Secret {
  private path: string;
  private value: string;
  private expiryDuration: number;
  private document: SecretDocument | null = null;

  static async getAvailability(path: string): Promise<boolean> {
    const docSnapshot = await firestore
      .collection(SECRET_PATH_COLLECTION)
      .doc(path)
      .get();
    if (!docSnapshot.exists) {
      return true;
    }
    const secretDoc = docSnapshot.data() as SecretDocument;
    const currentTime = firebaseAdmin.firestore.Timestamp.fromDate(new Date());
    return currentTime > secretDoc.expiryTime;
  }

  static async fetch(path: string): Promise<SecretDocument | null> {
    const secretDoc = await firestore
      .collection(SECRET_PATH_COLLECTION)
      .doc(path)
      .get();
    const secretDocData = secretDoc.data() as SecretDocument;
    const validSecret =
      secretDoc.exists &&
      secretDocData.expiryTime >
        firebaseAdmin.firestore.Timestamp.fromDate(new Date());
    if (validSecret) {
      return secretDocData;
    } else {
      return null;
    }
  }

  constructor({
    path,
    value,
    expiryDuration,
  }: {
    path: string;
    value: string;
    expiryDuration: number;
  }) {
    this.path = path;
    this.value = value;
    this.expiryDuration = expiryDuration || DEFAULT_SECRET_EXPIRY_DURATION;
  }

  public async saveIfValid(): Promise<SecretDocument> {
    const docRef = await firestore
      .collection(SECRET_PATH_COLLECTION)
      .doc(this.path);

    const transactionResults = await firestore.runTransaction(
      async (transaction) => {
        const doc = await transaction.get(docRef);
        const secretDoc = doc.data() as SecretDocument;
        const canWrite =
          !doc.exists ||
          secretDoc.expiryTime <
            firebaseAdmin.firestore.Timestamp.fromDate(new Date());
        if (canWrite) {
          const writeTime = new Date().valueOf();
          const expiryTime = writeTime + this.expiryDuration;
          const secretDocument: SecretDocument = {
            value: this.value,
            writeTime: firebaseAdmin.firestore.Timestamp.fromMillis(writeTime),
            expiryTime: firebaseAdmin.firestore.Timestamp.fromMillis(
              expiryTime
            ),
          };
          transaction.set(docRef, secretDocument);
          return secretDocument;
        } else {
          throw new Error("Can't save secret - path already exists");
        }
      }
    );

    this.document = transactionResults;
    return this.document;
  }
}

export default Secret;

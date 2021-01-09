import { firebaseAdmin, firestore } from "../lib/firebase";
import {
  SECRET_PATH_COLLECTION,
  DEFAULT_SECRET_EXPIRY_DURATION,
  DEFAULT_ENCRYPTION_DISABLED,
  DEFAULT_DELETE_ON_LOAD,
} from "../lib/constants";
import { SecretDocument } from "../interfaces";

class Secret {
  private path: string;
  private value: string;
  private expiryDuration: number;
  private encryptionDisabled: boolean;
  private deleteOnLoad: boolean;

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
    return (
      // current time already past expiry
      firebaseAdmin.firestore.Timestamp.fromDate(new Date()) >
      secretDoc.expiryTime
    );
  }

  static async fetch(path: string): Promise<SecretDocument | null> {
    const secretDoc = await firestore
      .collection(SECRET_PATH_COLLECTION)
      .doc(path)
      .get();
    const secretDocData = secretDoc.data() as SecretDocument;
    const validSecret =
      secretDoc.exists &&
      // current time not yet past expiry
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
    encryptionDisabled,
    deleteOnLoad,
  }: {
    path: string;
    value: string;
    expiryDuration: number;
    encryptionDisabled: boolean;
    deleteOnLoad: boolean;
  }) {
    this.path = path;
    this.value = value;
    this.expiryDuration = expiryDuration || DEFAULT_SECRET_EXPIRY_DURATION;
    this.encryptionDisabled = encryptionDisabled || DEFAULT_ENCRYPTION_DISABLED;
    this.deleteOnLoad = deleteOnLoad || DEFAULT_DELETE_ON_LOAD;
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
          // current time already past expiry
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
            encryptionDisabled: this.encryptionDisabled,
            deleteOnLoad: this.deleteOnLoad,
          };
          transaction.set(docRef, secretDocument);
          return secretDocument;
        } else {
          throw new Error("Can't save secret - path already used");
        }
      }
    );

    this.document = transactionResults;
    return this.document;
  }
}

export default Secret;

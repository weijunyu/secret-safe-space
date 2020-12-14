import { firebaseAdmin, firestore } from "../lib/firebase";
import { SECRET_PATH_COLLECTION } from "../lib/constants";

export async function removeExpiredSecrets(): Promise<void> {
  const expiredDocs = await firestore
    .collection(SECRET_PATH_COLLECTION)
    .where(
      "expiryTime",
      "<",
      firebaseAdmin.firestore.Timestamp.fromDate(new Date())
    )
    .get();
  expiredDocs.forEach((doc) => {
    console.log(doc.id);
    console.log(doc.data());
  });
}

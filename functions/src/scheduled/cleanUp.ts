import { firebaseAdmin, firestore } from "../lib/firebase";
import { SECRET_PATH_COLLECTION } from "../lib/constants";
export async function removeExpiredSecrets() {
  const expiredDocs = firestore
    .collection(SECRET_PATH_COLLECTION)
    .where(
      "expiryTime",
      "<",
      firebaseAdmin.firestore.Timestamp.fromDate(new Date())
    )
    .get();
  console.log(expiredDocs);
}

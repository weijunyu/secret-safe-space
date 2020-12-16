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

  if (!expiredDocs.empty) {
    const batch = firestore.batch();
    expiredDocs.forEach((doc) => {
      console.log(`Deleting expired doc: ${doc.id}`);
      batch.delete(firestore.collection(SECRET_PATH_COLLECTION).doc(doc.id));
    });
    await batch.commit();
  } else {
    console.log("No expired entries were deleted.");
  }
}

import { firestore, firebaseAdmin } from "../lib/firebase";

import * as constants from "../lib/constants";

export async function getTotal(): Promise<number> {
  const usageDocRef = await getUsageDocRef();
  const usageDoc = await usageDocRef.get();
  const { total } = usageDoc.data() || {};
  if (total !== null && total !== undefined) {
    return total;
  } else {
    throw new Error("Usage stats not found.");
  }
}

export async function increment(): Promise<FirebaseFirestore.WriteResult> {
  const usageDocRef = await getUsageDocRef();

  const inc = firebaseAdmin.firestore.FieldValue.increment(1);
  return usageDocRef.update({
    total: inc,
    current: inc,
  });
}

async function getUsageDocRef(): Promise<FirebaseFirestore.DocumentReference> {
  const usageDocRef = firestore
    .collection(constants.USAGE_COLLECTION)
    .doc(constants.USAGE_DOC);
  const usageDoc = await usageDocRef.get();
  if (!usageDoc.exists) {
    await usageDocRef.set({
      total: 0,
      current: 0,
    });
  }
  return usageDocRef;
}

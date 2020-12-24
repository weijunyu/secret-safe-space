import { firestore, firebaseAdmin } from "../lib/firebase";

import * as constants from "../lib/constants";

export async function getTotal(): Promise<number> {
  const usageDoc = await firestore
    .collection(constants.USAGE_COLLECTION)
    .doc(constants.USAGE_DOC)
    .get();
  const { total } = usageDoc.data() || {};
  if (total !== null && total !== undefined) {
    return total;
  } else {
    return 0;
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
  await firestore.runTransaction(async (trx) => {
    const usageDoc = await trx.get(usageDocRef);
    if (!usageDoc.exists) {
      trx.set(usageDocRef, {
        total: 0,
        current: 0,
      });
    }
  });
  return usageDocRef;
}

import { firebaseFunctions } from "../firebase";

export async function checkPathAvailability(path: string): Promise<boolean> {
  const checkSecretPath = firebaseFunctions.httpsCallable("checkSecretPath");
  const availability = await checkSecretPath(path);
  return availability.data;
}

export async function reserveSecretPath(path: string): Promise<any> {
  const reservePath = firebaseFunctions.httpsCallable("reserveSecretPath");
  const reserveResults = await reservePath(path);
  return reserveResults;
}

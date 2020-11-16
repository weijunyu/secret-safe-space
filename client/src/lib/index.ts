import axios from "axios";
import { firebaseFunctions } from "../firebase";

const httpClient = axios.create({
  baseURL: "https://asia-southeast2-shh-xyz.cloudfunctions.net/api",
});

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

export async function getSecretPath(path: string): Promise<any> {
  return httpClient("/secret-path", { params: { path } }).then(
    (res) => res.data
  );
}

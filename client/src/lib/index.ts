import axios from "axios";

import { apiBaseUrl } from "../config";

const httpClient = axios.create({
  baseURL: apiBaseUrl,
});

export async function checkPathAvailability(path: string): Promise<boolean> {
  return httpClient("/secret/availability", { params: { path } }).then(
    (res) => res.data
  );
}

export async function reserveSecretPath(path: string): Promise<any> {
  return httpClient("/secret-path", {
    method: "POST",
    data: {
      path,
    },
  }).then((res) => res.data);
}

export async function getSecretEncrypted(
  path: string
): Promise<{ value: string }> {
  return httpClient("/secret", { params: { path } }).then((res) => res.data);
}

export async function setSecretAtPath({
  secret,
  path,
  expiryDuration,
}: {
  secret: string;
  path: string;
  expiryDuration: number;
}): Promise<any> {
  return httpClient("/secret", {
    method: "post",
    data: { secret, path, expiryDuration },
  }).then((res) => res.data);
}

import axios from "axios";

import { apiBaseUrl } from "../config";

const httpClient = axios.create({
  baseURL: apiBaseUrl,
});

export async function checkPathAvailability(path: string): Promise<boolean> {
  return httpClient("/secret-path/availability", { params: { path } }).then(
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

export async function getSecretEncrypted(path: string): Promise<string> {
  return httpClient("/secret", { params: { path } }).then((res) => res.data);
}

export async function setSecretAtPath({
  secret,
  path,
}: {
  secret: string;
  path: string;
}): Promise<any> {
  return httpClient("/secret", {
    method: "post",
    data: { secret, path },
  }).then((res) => res.data);
}

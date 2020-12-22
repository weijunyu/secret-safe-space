import axios from "axios";

import { apiBaseUrl } from "../config";
import { SecretDocumentJsonResponse } from "../interfaces";

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

export async function getSecretAtPath(
  path: string
): Promise<SecretDocumentJsonResponse> {
  return httpClient("/secret", { params: { path } }).then((res) => res.data);
}

export async function setSecretAtPath({
  secret,
  path,
  expiryDuration,
  encryptionDisabled = false,
}: {
  secret: string;
  path: string;
  expiryDuration: number;
  encryptionDisabled: boolean;
}): Promise<SecretDocumentJsonResponse> {
  return httpClient("/secret", {
    method: "post",
    data: { secret, path, expiryDuration, encryptionDisabled },
  }).then((res) => res.data);
}

export async function getUsage(): Promise<{ total: number }> {
  return httpClient("/usage").then((res) => res.data);
}

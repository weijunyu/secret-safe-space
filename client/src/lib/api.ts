import axios from "axios";

import { apiBaseUrl } from "../config";
import { SecretDocumentJsonResponse, SecretType } from "../interfaces";

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
): Promise<SecretDocumentJsonResponse | ""> {
  return httpClient("/secret", { params: { path } }).then((res) => res.data);
}

export async function setSecretAtPath({
  secret,
  secretType,
  path,
  expiryDuration,
  encryptionDisabled = false,
  deleteOnLoad,
}: {
  secret: string;
  secretType: SecretType;
  path: string;
  expiryDuration: number;
  encryptionDisabled: boolean;
  deleteOnLoad: boolean;
}): Promise<SecretDocumentJsonResponse> {
  return httpClient("/secret", {
    method: "post",
    data: {
      secret,
      secretType,
      path,
      expiryDuration,
      encryptionDisabled,
      deleteOnLoad,
    },
  }).then((res) => res.data);
}

export async function getUsage(): Promise<{ total: number }> {
  return httpClient("/usage").then((res) => res.data);
}

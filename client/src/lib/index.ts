import axios from "axios";

const httpClient = axios.create({
  baseURL: "https://asia-southeast2-shh-xyz.cloudfunctions.net/api",
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

export async function getSecretPath(path: string): Promise<any> {
  return httpClient("/secret-path", { params: { path } }).then(
    (res) => res.data
  );
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

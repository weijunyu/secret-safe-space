import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import { AES, enc } from "crypto-js";

import FormField from "./common/FormField";
import { AccentButton } from "./common/Button";

import { getSecretEncrypted } from "../lib";

type SecretPathViewerParams = {
  secretPath: string;
};

export default function SecretPathViewer() {
  const { secretPath } = useParams<SecretPathViewerParams>();

  const [loadingEncryptedSecrets, setLoadingEncryptedSecrets] = useState(false);
  const [encryptedSecrets, setEncryptedSecrets] = useState<string | null>("");

  useEffect(() => {
    setLoadingEncryptedSecrets(true);
    getSecretEncrypted(secretPath)
      .then((ciphertext) => {
        if (!ciphertext) {
          setEncryptedSecrets(null);
        } else {
          setEncryptedSecrets(ciphertext);
        }
      })
      .finally(() => setLoadingEncryptedSecrets(false));
  }, [secretPath]);

  return (
    <div>
      <p>Your secret path: {secretPath}</p>
      {loadingEncryptedSecrets ? (
        <span>Loading...</span>
      ) : (
        <>
          {encryptedSecrets === null && (
            <p>This path doesn't contain any data!</p>
          )}
          {encryptedSecrets && <p>Your encrypted secret: {encryptedSecrets}</p>}
          {encryptedSecrets && (
            <SecretPathDecryptForm secretPath={secretPath} />
          )}
        </>
      )}
    </div>
  );
}

function SecretPathDecryptForm({ secretPath }: { secretPath: string }) {
  const [secretPassword, setSecretPassword] = useState("");
  const [decryptedSecrets, setDecryptedSecrets] = useState("");
  function onSecretPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newPassword = e.target.value;
    setSecretPassword(newPassword);
  }
  async function getSecretsAtPath(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (secretPath) {
      const decryptedSecrets = await getDecryptedSecrets(
        secretPath,
        secretPassword
      );
      setDecryptedSecrets(decryptedSecrets);
    }
  }
  async function getDecryptedSecrets(secretPath: string, passphrase: string) {
    try {
      const encryptedSecret = await getSecretEncrypted(secretPath);
      const decryptedBytes = AES.decrypt(encryptedSecret, passphrase);
      if (decryptedBytes.sigBytes < 0) {
        throw new Error("Decryption failed.");
      }
      const decryptedSecret = decryptedBytes.toString(enc.Utf8);
      return decryptedSecret;
    } catch (err) {
      toast.error(err.message);
      return "";
    }
  }
  return (
    <div>
      <ToastContainer />
      <form onSubmit={getSecretsAtPath}>
        <FormField>
          <label htmlFor="secret-password">
            Enter the passphrase you received when you created this secret
          </label>
          <input
            id="secret-password"
            type="password"
            value={secretPassword}
            onChange={onSecretPasswordChange}
          ></input>
        </FormField>
        <AccentButton type="submit">Go</AccentButton>
      </form>
      <section>Your decrypted secrets: {decryptedSecrets}</section>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { AES, enc } from "crypto-js";

import FormField from "./common/FormField";
import { AccentButton } from "./common/Button";

import { getSecretEncrypted } from "../lib";

type SecretPathViewerParams = {
  secretPath: string;
};

export default function SecretPathViewer() {
  const { secretPath } = useParams<SecretPathViewerParams>();

  const [secretPassword, setSecretPassword] = useState("");
  const [encryptedSecrets, setEncryptedSecrets] = useState<string | null>(null);
  const [decryptedSecrets, setDecryptedSecrets] = useState("");

  useEffect(() => {
    getSecretEncrypted(secretPath).then((ciphertext) =>
      setEncryptedSecrets(ciphertext)
    );
  }, [secretPath]);

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
      const decryptedSecret = decryptedBytes.toString(enc.Utf8);
      return decryptedSecret;
    } catch (err) {
      console.error(err);
      return "";
    }
  }

  return (
    <div>
      <p>Your secret path: {secretPath}</p>
      {encryptedSecrets && <p>Your encrypted secret: {encryptedSecrets}</p>}
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

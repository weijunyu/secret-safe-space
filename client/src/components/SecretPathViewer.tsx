import React, { useState } from "react";

import { AES, enc } from "crypto-js";

import FormField from "./common/FormField";
import { AccentButton } from "./common/Button";

import { getSecretEncrypted } from "../lib";

export default function SecretPathViewer() {
  const [secretPath, setSecretPath] = useState<string>("");
  const [secretPassword, setSecretPassword] = useState("");
  const [decryptedSecrets, setDecryptedSecrets] = useState("");

  function onSecretPathChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newPath = e.target.value;
    setSecretPath(newPath);
  }
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
      <form onSubmit={getSecretsAtPath}>
        <FormField>
          <label htmlFor="secret-path">Enter URL path for your secret</label>
          <input
            id="secret-path"
            type="text"
            value={secretPath}
            onChange={onSecretPathChange}
          ></input>
        </FormField>
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

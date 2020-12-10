import React, { useState } from "react";
import { AES, enc } from "crypto-js";
import { ToastContainer, toast } from "react-toastify";

import { TextFormField } from "./common/FormField";
import { AccentButton } from "./common/Button";

import { getSecretEncrypted } from "../lib";

export default function SecretPathDecryptForm({
  secretPath,
  onDecrypt,
}: {
  secretPath: string;
  onDecrypt: (plaintext: string) => any;
}) {
  const [secretPassword, setSecretPassword] = useState("");
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
      onDecrypt(decryptedSecrets);
    }
  }
  async function getDecryptedSecrets(secretPath: string, passphrase: string) {
    try {
      const secretData = await getSecretEncrypted(secretPath);
      const decryptedBytes = AES.decrypt(secretData.value, passphrase);
      if (decryptedBytes.sigBytes < 0) {
        throw new Error(
          "Decryption failed. Please check your passphrase and try again."
        );
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
        <TextFormField>
          <label htmlFor="secret-password">
            Enter the passphrase you used to create this secret
          </label>
          <input
            id="secret-password"
            type="password"
            value={secretPassword}
            onChange={onSecretPasswordChange}
          ></input>
        </TextFormField>
        <AccentButton type="submit">Go</AccentButton>
      </form>
    </div>
  );
}

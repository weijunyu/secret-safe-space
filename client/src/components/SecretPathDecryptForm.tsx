import React, { useState } from "react";
import { AES, enc } from "crypto-js";
import { ToastContainer, toast } from "react-toastify";

import DecryptedSecretDisplay from "./DecryptedSecretDisplay";

import FormField from "./common/FormField";
import { AccentButton } from "./common/Button";

import { getSecretEncrypted } from "../lib";

export default function SecretPathDecryptForm({
  secretPath,
}: {
  secretPath: string;
}) {
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
      <DecryptedSecretDisplay decryptedSecrets={decryptedSecrets} />
    </div>
  );
}

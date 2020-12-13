import React, { useState } from "react";
import { AES, enc } from "crypto-js";
import { ToastContainer, toast } from "react-toastify";

import { TextField } from "./common/FormField";
import { AccentButton } from "./common/Button";

export default function SecretPathDecryptForm({
  encryptedSecrets,
  onDecrypt,
}: {
  encryptedSecrets: string;
  onDecrypt: (plaintext: string) => any;
}) {
  const [secretPassword, setSecretPassword] = useState("");

  function onSecretPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSecretPassword(e.target.value);
  }

  async function decryptSecrets(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const decryptedBytes = AES.decrypt(encryptedSecrets, secretPassword);
      if (decryptedBytes.sigBytes < 0) {
        throw new Error("Passphrase incorrect.");
      }
      onDecrypt(decryptedBytes.toString(enc.Utf8));
    } catch (err) {
      toast.error(
        "Decryption failed. Please check your passphrase and try again."
      );
      onDecrypt("");
      return "";
    }
  }

  return (
    <div>
      <ToastContainer />
      <form onSubmit={decryptSecrets}>
        <TextField>
          <label htmlFor="secret-password">
            Enter the passphrase you used to create this secret
          </label>
          <input
            id="secret-password"
            type="password"
            value={secretPassword}
            onChange={onSecretPasswordChange}
          ></input>
        </TextField>
        <AccentButton type="submit">Go</AccentButton>
      </form>
    </div>
  );
}

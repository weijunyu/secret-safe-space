import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { TextField } from "./common/FormField";
import { AccentButton } from "./common/Button";

import { decrypt } from "../lib/cryptography";

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
      const decrypted = decrypt(encryptedSecrets, secretPassword);
      onDecrypt(decrypted);
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

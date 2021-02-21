import React, { useState } from "react";

import Snackbar from "@material-ui/core/Snackbar";

import { TextField } from "./common/FormField";
import { PrimaryButton, BareButton } from "./common/Button";

import { decrypt } from "../lib/cryptography";

export default function SecretPathDecryptForm({
  encryptedSecrets,
  onDecrypt,
}: {
  encryptedSecrets: string;
  onDecrypt: (plaintext: string) => any;
}) {
  const [secretPassword, setSecretPassword] = useState("");

  const [showFailureSnackbar, setShowFailureSnackbar] = useState(false);

  function onSecretPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSecretPassword(e.target.value);
  }

  async function decryptSecrets(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const decrypted = decrypt(encryptedSecrets, secretPassword);
      onDecrypt(decrypted);
    } catch (err) {
      setShowFailureSnackbar(true);
      onDecrypt("");
      return "";
    }
  }

  function closeFailureSnackbar(event: React.SyntheticEvent, reason: string) {
    // if (reason === "clickaway") {
    //   return;
    // }
    setShowFailureSnackbar(false);
  }

  return (
    <div>
      <Snackbar
        open={showFailureSnackbar}
        autoHideDuration={2000}
        onClose={closeFailureSnackbar}
        message={
          <>
            <i className="fas fa-exclamation-triangle" /> Decryption failed.
            Please check your passphrase and try again.
          </>
        }
        action={
          <BareButton
            style={{ color: "white" }}
            onClick={() => setShowFailureSnackbar(false)}
          >
            <i className="fas fa-times" />
          </BareButton>
        }
      />
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
        <PrimaryButton type="submit">Go</PrimaryButton>
      </form>
    </div>
  );
}

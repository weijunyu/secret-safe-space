import React, { useState } from "react";
import { AES } from "crypto-js";

import SecretsEditor from "./SecretsEditor";

import { reserveSecretPath, setSecretAtPath } from "../lib";

import SecretPathReserveForm from "./SecretPathReserveForm";

export default function SecretPathSelect() {
  const [secretPathReserved, setSecretPathReserved] = useState(false);
  const [secretPathFinal, setSecretPathFinal] = useState("");
  const [hasSetSecret, setHasSetSecret] = useState(false);

  function onSelectSecretPath(secretPath: string) {
    reserveSecretPath(secretPath).then((data) => {
      if (data.secretPath) {
        setSecretPathFinal(data.secretPath);
        setSecretPathReserved(true);
        return;
      }
    });
  }

  async function onSubmitSecret(secret: string, passphrase: string) {
    // 1. encrypt secret with passphrase
    const ciphertext = AES.encrypt(secret, passphrase).toString();
    // 2. set secret ciphertext at path
    await setSecretAtPath({ path: secretPathFinal, secret: ciphertext });
    setHasSetSecret(true);
  }

  return (
    <div>
      <SecretPathReserveForm
        onSubmit={onSelectSecretPath}
        active={!secretPathReserved}
      />

      <SecretsEditor
        secretPath={secretPathFinal}
        onSubmitSecret={onSubmitSecret}
        active={secretPathReserved && !hasSetSecret}
      />

      <div>
        <p>You have set your secret! Here's your passphrase: </p>
        <code>something</code>
      </div>
    </div>
  );
}

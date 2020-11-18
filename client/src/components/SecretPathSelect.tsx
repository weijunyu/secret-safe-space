import React, { useState } from "react";

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

  async function onSubmitSecret(secret: string) {
    await setSecretAtPath({ path: secretPathFinal, secret });
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

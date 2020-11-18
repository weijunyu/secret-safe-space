import React, { useState } from "react";

import SecretsEditor from "./SecretsEditor";

import { reserveSecretPath } from "../lib";

import SecretPathReserveForm from "./SecretPathReserveForm";

export default function SecretPathSelect() {
  const [secretPathReserved, setSecretPathReserved] = useState(false);
  const [secretPathFinal, setSecretPathFinal] = useState("");

  function onSelectSecretPath(secretPath: string) {
    reserveSecretPath(secretPath).then((res) => {
      if (res.data?.secretPath) {
        setSecretPathFinal(res.data.secretPath);
        setSecretPathReserved(true);
        return;
      }
    });
  }

  return (
    <div>
      {!secretPathReserved && (
        <SecretPathReserveForm onSubmit={onSelectSecretPath} />
      )}
      {secretPathReserved && <SecretsEditor secretPath={secretPathFinal} />}
    </div>
  );
}

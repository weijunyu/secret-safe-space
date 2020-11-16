import React, { useState } from "react";

import { checkPathAvailability, reserveSecretPath } from "../lib";

export default function SecretPathSelector() {
  const [secretPath, setSecretPath] = useState<string>("");
  const [checkingSecretPath, setCheckingSecretPath] = useState<boolean>(false);
  const [secretPathAvailable, setSecretPathAvailable] = useState<boolean>(
    false
  );
  const [secretPathReserved, setSecretPathReserved] = useState(false);

  function onSecretPathChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newPath = e.target.value;

    setSecretPath(newPath);

    setCheckingSecretPath(true);
    if (newPath) {
      checkPathAvailability(newPath)
        .then((availability) => {
          setSecretPathAvailable(availability);
        })
        .finally(() => {
          setCheckingSecretPath(false);
        });
    }
  }

  function onSelectPath(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    reserveSecretPath(secretPath).then((res) => {
      if (res.data?.success) {
        setSecretPathReserved(true);
      }
    });
  }

  return (
    <div>
      <form onSubmit={onSelectPath}>
        <label htmlFor="secret-path-selector">
          Enter URL path for your secret
        </label>
        <input
          id="secret-path-selector"
          type="text"
          value={secretPath}
          onChange={onSecretPathChange}
        ></input>
        <p>
          <small>
            {checkingSecretPath
              ? "please wait..."
              : `Path available: ${secretPathAvailable}`}
          </small>
        </p>
        <button type="submit">Use this path</button>
        {secretPathReserved && <SecretsEditor />}
      </form>
    </div>
  );
}

function SecretsEditor() {
  return <div>Secrets editor!</div>;
}

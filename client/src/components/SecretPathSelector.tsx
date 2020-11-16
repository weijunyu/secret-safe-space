import React, { useState } from "react";

import FormField from "./common/FormField";
import { AccentButton } from "./common/Button";

import SecretsEditor from "./SecretsEditor";

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

  function onSelectSecretPath(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    reserveSecretPath(secretPath).then((res) => {
      if (res.data?.success) {
        setSecretPathReserved(true);
      }
    });
  }

  return (
    <div>
      <form onSubmit={onSelectSecretPath}>
        <FormField>
          <label htmlFor="secret-path">Enter URL path for your secret</label>
          <input
            id="secret-path"
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
        </FormField>
        <AccentButton type="submit">Use this path</AccentButton>
        {secretPathReserved && <SecretsEditor />}
      </form>
    </div>
  );
}

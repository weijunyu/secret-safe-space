import React, { useState } from "react";

import FormField from "./common/FormField";
import { AccentButton } from "./common/Button";

import { checkPathAvailability } from "../lib";

export default function SecretPathReserveForm({
  onSubmit,
  active,
}: {
  onSubmit: (secretPath: string) => void;
  active: boolean;
}) {
  const [secretPath, setSecretPath] = useState<string>("");
  const [checkingSecretPath, setCheckingSecretPath] = useState<boolean>(false);
  const [secretPathAvailable, setSecretPathAvailable] = useState<boolean>(
    false
  );
  function onSecretPathChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newPath = e.target.value;
    setSecretPath(newPath);

    if (newPath) {
      setCheckingSecretPath(true);
      checkPathAvailability(newPath)
        .then((availability) => {
          setSecretPathAvailable(availability);
        })
        .finally(() => {
          setCheckingSecretPath(false);
        });
    }
  }
  function onSubmitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(secretPath);
  }
  return (
    <form onSubmit={onSubmitForm}>
      <FormField>
        <label htmlFor="secret-path">Enter URL path for your secret</label>
        <p>
          <small>
            {secretPath &&
              (checkingSecretPath
                ? "please wait..."
                : `Path available: ${secretPathAvailable}`)}
          </small>
        </p>
        <input
          id="secret-path"
          type="text"
          value={secretPath}
          onChange={onSecretPathChange}
          disabled={!active}
        ></input>
      </FormField>
      <AccentButton type="submit">Use this path</AccentButton>
    </form>
  );
}

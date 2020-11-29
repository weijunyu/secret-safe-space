import React, { useState, useCallback } from "react";
import debounce from "lodash/debounce";

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedPathCheck = useCallback(
    debounce((newPath: string) => {
      return checkPathAvailability(newPath)
        .then((availability) => {
          setSecretPathAvailable(availability);
        })
        .finally(() => {
          setCheckingSecretPath(false);
        });
    }, 500),
    [setCheckingSecretPath, checkPathAvailability, setSecretPathAvailable]
  );
  function onSecretPathChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newPath = e.target.value;
    setSecretPath(newPath);

    if (newPath) {
      setCheckingSecretPath(true);
      debouncedPathCheck(newPath);
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
                ? "checking path availability..."
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
      <AccentButton type="submit" disabled={!secretPathAvailable}>
        Use this path
      </AccentButton>
    </form>
  );
}

import React, { useState, useCallback } from "react";
import debounce from "lodash/debounce";

import { TextField } from "./common/FormField";
import { AccentButton } from "./common/Button";

import { checkPathAvailability } from "../lib";

export default function SecretPathSelectForm({
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
        .catch(() => {
          setSecretPathAvailable(false); // rejected from BE. no need to notify for now
        })
        .finally(() => {
          setCheckingSecretPath(false);
        });
    }, 500),
    []
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
      <TextField>
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
          autoCapitalize="off"
        ></input>
      </TextField>
      <AccentButton
        type="submit"
        disabled={!secretPathAvailable || !secretPath}
      >
        Use this path
      </AccentButton>
    </form>
  );
}

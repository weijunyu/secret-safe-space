import React, { useState, useCallback } from "react";
import debounce from "lodash/debounce";
import { Link } from "react-router-dom";

import { TextField } from "./common/FormField";
import { AccentButton } from "./common/Button";
import { Success } from "../lib/colors";

import { checkPathAvailability } from "../lib/api";

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
        <label htmlFor="secret-path">Enter the URL path for your secret.</label>
        <p>
          {secretPath &&
            (checkingSecretPath ? (
              <small>checking path availability...</small>
            ) : (
              <small>
                Path available:{" "}
                {secretPathAvailable ? (
                  <>
                    yes{" "}
                    <i
                      className="fas fa-check-circle"
                      style={{ color: Success }}
                    ></i>
                  </>
                ) : (
                  <>
                    no <i className="fas fa-times-circle"></i>
                  </>
                )}
              </small>
            ))}
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

      {secretPath && secretPathAvailable && (
        <p>
          <small>
            Your secret text would be available at{" "}
            <Link to={`/view/${secretPath}`}>{"/view/" + secretPath}</Link>.
          </small>
        </p>
      )}

      <AccentButton
        type="submit"
        disabled={!secretPathAvailable || !secretPath}
      >
        Use this path
      </AccentButton>
    </form>
  );
}

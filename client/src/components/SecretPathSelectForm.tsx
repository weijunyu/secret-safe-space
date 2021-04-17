import React, { useState, useCallback, useEffect } from "react";
import debounce from "lodash/debounce";

import SecretPathUrlDisplay from "./SecretPathUrlDisplay";
import SecretPathSuggestor from "./SecretPathSuggestor";

import { TextField } from "./common/FormField";
import { PrimaryButton } from "./common/Button";
import { Form, FormHint } from "./common/Form";

import { Success } from "../lib/colors";

import { checkPathAvailability } from "../lib/api";

export default function SecretPathSelectForm({
  onSubmit,
  active,
  preChosenPath,
}: {
  onSubmit: (secretPath: string) => void;
  active: boolean;
  preChosenPath?: string;
}) {
  const [secretPath, setSecretPath] = useState<string>("");
  const [checkingSecretPath, setCheckingSecretPath] = useState<boolean>(false);
  const [secretPathAvailable, setSecretPathAvailable] = useState<boolean>(
    false
  );

  function pathCheck(path: string): Promise<void> {
    return checkPathAvailability(path)
      .then((availability) => {
        setSecretPathAvailable(availability);
      })
      .catch(() => {
        setSecretPathAvailable(false); // rejected from BE. no need to notify for now
      })
      .finally(() => {
        setCheckingSecretPath(false);
      });
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedPathCheck = useCallback(debounce(pathCheck, 500), []);

  // changes from typing; debounce this.
  function onSecretPathChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newPath = e.target.value;
    confirmSecretPathChange(newPath, { debounce: true });
  }

  const confirmSecretPathChange = useCallback(
    function (path: string, options?: { debounce: boolean }) {
      setSecretPath(path);

      if (path) {
        setCheckingSecretPath(true);
        if (options?.debounce) {
          debouncedPathCheck(path);
        } else {
          pathCheck(path);
        }
      }
    },
    [debouncedPathCheck]
  );

  function onSubmitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(secretPath);
  }

  useEffect(() => {
    if (preChosenPath) {
      confirmSecretPathChange(preChosenPath);
    }
  }, [preChosenPath, confirmSecretPathChange]);

  return (
    <Form onSubmit={onSubmitForm}>
      <TextField>
        <label htmlFor="secret-path">Enter the URL path for your secret.</label>

        {secretPath &&
          (checkingSecretPath ? (
            <FormHint>
              <small>checking path availability...</small>
            </FormHint>
          ) : (
            <FormHint>
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
            </FormHint>
          ))}

        {!secretPath && (
          <FormHint>
            <SecretPathSuggestor onConfirm={confirmSecretPathChange} />
          </FormHint>
        )}
        <input
          id="secret-path"
          type="text"
          value={secretPath}
          onChange={onSecretPathChange}
          disabled={!active}
          autoCapitalize="off"
        ></input>

        {secretPath && secretPathAvailable && (
          <FormHint>
            <small style={{ width: "100%" }}>
              {/* <small> width 100% so inner url display would overflow-wrap: break-word properly */}
              Your secret text would be available at{" "}
              <SecretPathUrlDisplay path={secretPath} link={false} />.
            </small>
          </FormHint>
        )}
      </TextField>

      <PrimaryButton
        type="submit"
        disabled={!secretPathAvailable || !secretPath}
      >
        Use this path
      </PrimaryButton>
    </Form>
  );
}

import React, { useState } from "react";

import { checkPathAvailability, reserveSecretPath } from "../lib";

export default function SecretPathSelector() {
  const [secretPath, setSecretPath] = useState<string>("");
  const [checkingSecretPath, setCheckingSecretPath] = useState<boolean>(false);
  const [secretPathAvailable, setSecretPathAvailable] = useState<boolean>(
    false
  );

  function onSecretPathChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSecretPath(e.target.value);

    setCheckingSecretPath(true);
    checkPathAvailability(e.target.value)
      .then((availability) => {
        setSecretPathAvailable(availability);
      })
      .finally(() => {
        setCheckingSecretPath(false);
      });
  }

  function onSelectPath(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Submitting path: " + secretPath);
    reserveSecretPath(secretPath).then((res) => {
      console.log(res);
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
      </form>
    </div>
  );
}

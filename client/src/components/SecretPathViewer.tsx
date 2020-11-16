import React, { useState } from "react";

import FormField from "./common/FormField";
import { AccentButton } from "./common/Button";

import { getSecretPath } from "../lib";

export default function SecretPathViewer() {
  const [secretPath, setSecretPath] = useState<string>("");
  const [secretPassword, setSecretPassword] = useState("");
  function onSecretPathChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newPath = e.target.value;
    setSecretPath(newPath);
  }
  function onSecretPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newPassword = e.target.value;
    setSecretPassword(newPassword);
  }
  function onRequestSecretPath(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (secretPath) {
      getSecretPath(secretPath).then((res) => {
        console.log(res);
      });
    }
  }
  return (
    <div>
      <form onSubmit={onRequestSecretPath}>
        <FormField>
          <label htmlFor="secret-path">Enter URL path for your secret</label>
          <input
            id="secret-path"
            type="text"
            value={secretPath}
            onChange={onSecretPathChange}
          ></input>
        </FormField>
        <FormField>
          <label htmlFor="secret-password">
            Enter the passphrase you received when you created this secret
          </label>
          <input
            id="secret-password"
            type="password"
            value={secretPassword}
            onChange={onSecretPasswordChange}
          ></input>
        </FormField>
        <AccentButton type="submit">Go</AccentButton>
      </form>
    </div>
  );
}

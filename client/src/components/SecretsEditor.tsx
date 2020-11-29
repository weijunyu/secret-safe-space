import React, { useState } from "react";
import styled from "styled-components";

import { AccentButton } from "./common/Button";
import FormField from "./common/FormField";

const SecretInputTextarea = styled.textarea`
  font-family: monospace;
`;

const SecretPassphraseInput = styled.input`
  font-family: monospace;
`;

export default function SecretsEditor({
  secretPath,
  onSubmitSecret,
  active,
}: {
  secretPath: string;
  onSubmitSecret: (secret: string, passphrase: string) => Promise<any>;
  active: boolean;
}) {
  const [secretText, setSecretText] = useState("");
  const [secretPassphrase, setSecretPassphrase] = useState("");

  function onSecretInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    event.preventDefault();
    setSecretText(event.target.value);
  }

  function onSecretPassphraseChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    event.preventDefault();
    setSecretPassphrase(event.target.value);
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmitSecret(secretText, secretPassphrase);
  }

  return (
    <div>
      <p>
        Enter your secret text here. You will be able to access it at:{" "}
        <code>/view/{secretPath}</code>
      </p>

      <form onSubmit={onSubmit}>
        <FormField>
          <label htmlFor="secret-text-input">Secret text</label>
          <SecretInputTextarea
            id="secret-text-input"
            onChange={onSecretInputChange}
            disabled={!active}
            rows={20}
          ></SecretInputTextarea>
        </FormField>
        <FormField>
          <label htmlFor="secret-passphrase-input">
            Enter the password you would use to retrieve this secret:
          </label>
          <SecretPassphraseInput
            id="secret-passphrase-input"
            type="password"
            onChange={onSecretPassphraseChange}
          />
        </FormField>
        <AccentButton type="submit">Save</AccentButton>
      </form>
    </div>
  );
}

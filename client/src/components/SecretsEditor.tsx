import React, { useState } from "react";
import styled from "styled-components";

import { AccentButton } from "./common/Button";
import FormField from "./common/FormField";

const SecretInputTextarea = styled.textarea`
  font-family: monospace;
`;

export default function SecretsEditor({
  secretPath,
  onSubmitSecret,
  active,
}: {
  secretPath: string;
  onSubmitSecret: (secret: string) => Promise<any>;
  active: boolean;
}) {
  const [secretText, setSecretText] = useState("");

  function onSecretInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    event.preventDefault();
    setSecretText(event.target.value);
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmitSecret(secretText);
  }

  return (
    <div>
      <p>Enter your secret text here. You will be able to access it at:</p>
      <code>{secretPath}</code>
      <form onSubmit={onSubmit}>
        <FormField>
          <label htmlFor="secret-text-input">Enter your secret string:</label>
          <SecretInputTextarea
            id="secret-text-input"
            onChange={onSecretInputChange}
            disabled={!active}
          ></SecretInputTextarea>
        </FormField>
        <AccentButton type="submit">Save</AccentButton>
      </form>
    </div>
  );
}

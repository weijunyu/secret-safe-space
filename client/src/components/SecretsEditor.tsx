import React, { useState } from "react";
import styled from "styled-components";

import DurationPicker from "./DurationPicker";
import { AccentButton, Button } from "./common/Button";
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
  onCancel,
}: {
  secretPath: string;
  onSubmitSecret: (secret: string, passphrase: string) => Promise<any>;
  active: boolean;
  onCancel: () => void;
}) {
  const [secretText, setSecretText] = useState("");
  const [secretPassphrase, setSecretPassphrase] = useState("");
  const [secretExpiryDuration, setSecretExpiryDuration] = useState(-1);

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
    <form onSubmit={onSubmit}>
      <FormField>
        <label htmlFor="secret-text-input">
          Enter your secret text here. You will be able to access it at:{" "}
          <code>/view/{secretPath}</code>
        </label>
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
      <FormField>
        <span>Secret expiry time</span>
        {/* 1 - 60 min, 1 - 24 hrs */}
        <DurationPicker
          onConfirm={(duration: number) => setSecretExpiryDuration(duration)}
        />
      </FormField>
      <AccentButton type="submit">Save</AccentButton>
      <Button type="button" onClick={onCancel}>
        Back
      </Button>
    </form>
  );
}

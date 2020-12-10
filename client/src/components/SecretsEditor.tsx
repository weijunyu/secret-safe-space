import React, { useState } from "react";
import styled from "styled-components";
import { Duration } from "luxon";

import DurationPicker from "./DurationPicker";
import { AccentButton, Button } from "./common/Button";
import { CheckField, FieldSet, Legend, TextField } from "./common/FormField";

import { Warn } from "../lib/colors";

const SecretInputTextarea = styled.textarea`
  font-family: monospace;
`;

const SecretPassphraseInput = styled.input`
  font-family: monospace;
  :disabled {
    cursor: not-allowed;
  }
`;

const FormHintWarning = styled.small`
  display: block;
  color: ${Warn};
  padding: 6px 0;
`;

const DefaultExpiryDuration = {
  hours: 0,
  minutes: 5,
};

const MinimumExpiryDuration = 60000; // 60000 ms = 1 min

export default function SecretsEditor({
  secretPath,
  onSubmitSecret,
  active,
  onCancel,
}: {
  secretPath: string;
  onSubmitSecret: (
    secret: string,
    passphrase: string,
    secretExpiryDuration: number
  ) => Promise<any>;
  active: boolean;
  onCancel: () => void;
}) {
  const [secretText, setSecretText] = useState("");
  const [secretPassphrase, setSecretPassphrase] = useState("");
  const [secretExpiryDuration, setSecretExpiryDuration] = useState(
    Duration.fromObject(DefaultExpiryDuration).as("milliseconds")
  );
  const [encryptionDisabled, setEncryptionDisabled] = useState(false);

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

  function onToggleEncryption() {
    setEncryptionDisabled(!encryptionDisabled);
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmitSecret(secretText, secretPassphrase, secretExpiryDuration);
  }

  return (
    <form onSubmit={onSubmit}>
      <TextField>
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
      </TextField>
      <TextField>
        <label htmlFor="secret-passphrase-input">
          Enter the password you would use to retrieve this secret:
        </label>
        <SecretPassphraseInput
          id="secret-passphrase-input"
          type="password"
          onChange={onSecretPassphraseChange}
          disabled={encryptionDisabled}
        />
      </TextField>

      <FieldSet>
        <Legend>Additional Options</Legend>
        <CheckField>
          <input
            type="checkbox"
            checked={encryptionDisabled}
            onChange={onToggleEncryption}
            id="encryption-toggle"
          ></input>
          <label htmlFor="encryption-toggle">Do not encrypt</label>
        </CheckField>

        <div style={{ marginBottom: "0.5rem" }}>
          <strong>Secret expiry time</strong>
        </div>
        {/* 1 - 60 min, 1 - 24 hrs */}
        <DurationPicker
          initialDuration={DefaultExpiryDuration}
          onChange={(durationInMs: number) =>
            setSecretExpiryDuration(durationInMs)
          }
        />
        {secretExpiryDuration < MinimumExpiryDuration && (
          <FormHintWarning>
            A minimum expiry duration of 1 minute is required.
          </FormHintWarning>
        )}
      </FieldSet>

      <AccentButton
        type="submit"
        disabled={
          secretText === "" ||
          secretPassphrase === "" ||
          secretExpiryDuration < MinimumExpiryDuration
        }
      >
        Save
      </AccentButton>
      <Button type="button" onClick={onCancel}>
        Back
      </Button>
    </form>
  );
}

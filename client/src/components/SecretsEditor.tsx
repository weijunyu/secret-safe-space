import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { Duration } from "luxon";

import DurationPicker from "./DurationPicker";
import { PrimaryButton } from "./common/Button";
import { Form, FormHint } from "./common/Form";
import { CheckField, FieldSet, Legend, TextField } from "./common/FormField";
import Divider from "./common/Divider";
import SecretTextInput from "./SecretTextInput";
import SecretFileInput from "./SecretFileInput";
import SecretTypeToggle from "./SecretTypeToggle";
import SecretPathUrlDisplay from "./SecretPathUrlDisplay";

import { DefaultExpiryDuration, MinimumExpiryDuration } from "../lib/constants";
import { Warn } from "../lib/colors";

import { SecretType } from "../interfaces";

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

export default function SecretsEditor({
  secretPath,
  onSubmitSecret,
  active,
}: {
  secretPath: string;
  onSubmitSecret: (
    secret: string,
    secretType: SecretType,
    passphrase: string,
    secretExpiryDuration: number,
    encryptionDisabled: boolean,
    deleteOnLoad: boolean
  ) => Promise<any>;
  active: boolean;
}) {
  const [secretText, setSecretText] = useState("");
  const [secretType, setSecretType] = useState<SecretType>(SecretType.Text);
  const [secretPassphrase, setSecretPassphrase] = useState("");
  const [secretExpiryDuration, setSecretExpiryDuration] = useState(
    Duration.fromObject(DefaultExpiryDuration).as("milliseconds")
  );
  const [encryptionDisabled, setEncryptionDisabled] = useState(false);
  const [deleteOnLoad, setDeleteOnLoad] = useState(true);

  function onSecretInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    event.preventDefault();
    setSecretText(event.target.value);
  }

  // useCallback on this function so SecretFileInput doesn't rerender unnecessarily
  // important since uppy instance in SecretFileInput is instantiated during useEffect
  const onSecretFileLoaded = useCallback((encodedFile: string) => {
    setSecretText(encodedFile);
  }, []);

  const onSecretTypeToggle = (newType: SecretType) => {
    setSecretText("");
    setSecretType(newType);
  };

  function onSecretPassphraseChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    event.preventDefault();
    setSecretPassphrase(event.target.value);
  }

  function onToggleEncryption(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      // clear passphrase if toggling from not disabled --> disabled
      setSecretPassphrase("");
    }
    setEncryptionDisabled(e.target.checked);
  }

  function toggleDeleteOnLoad(e: React.ChangeEvent<HTMLInputElement>) {
    setDeleteOnLoad(e.target.checked);
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmitSecret(
      secretText,
      secretType,
      secretPassphrase,
      secretExpiryDuration,
      encryptionDisabled,
      deleteOnLoad
    );
  }

  return (
    <>
      <p>
        <strong>Secret type</strong>
      </p>

      <SecretTypeToggle secretType={secretType} onToggle={onSecretTypeToggle} />

      <Divider />

      <Form onSubmit={onSubmit}>
        <p>
          You will be able to access your secret at{" "}
          <SecretPathUrlDisplay path={secretPath} link={false} />.
        </p>
        {secretType === SecretType.Text && (
          <SecretTextInput
            value={secretText}
            onChange={onSecretInputChange}
            disabled={!active}
          />
        )}
        {secretType === SecretType.File && (
          <SecretFileInput onFileLoaded={onSecretFileLoaded} />
        )}

        <TextField>
          <label htmlFor="secret-passphrase-input">
            Enter the passphrase you would use to retrieve this secret:
          </label>
          <SecretPassphraseInput
            id="secret-passphrase-input"
            type="password"
            value={secretPassphrase}
            onChange={onSecretPassphraseChange}
            disabled={encryptionDisabled}
          />
          {0 < secretPassphrase.length && secretPassphrase.length < 10 && (
            <FormHint type="success">
              <small>
                Recommended minimum passphrase length is 10 (current length is{" "}
                {secretPassphrase.length})
              </small>
            </FormHint>
          )}
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

          <CheckField>
            <input
              type="checkbox"
              checked={deleteOnLoad}
              onChange={toggleDeleteOnLoad}
              id="delete-on-load-toggle"
            ></input>
            <label htmlFor="delete-on-load-toggle">One-time secret link </label>
          </CheckField>

          <div style={{ margin: "0.5rem 0" }}>
            <strong>Secret expiry</strong>
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

        <PrimaryButton
          type="submit"
          disabled={
            secretText === "" ||
            (secretPassphrase === "" && !encryptionDisabled) ||
            secretExpiryDuration < MinimumExpiryDuration
          }
        >
          Encrypt and save
        </PrimaryButton>
      </Form>
    </>
  );
}

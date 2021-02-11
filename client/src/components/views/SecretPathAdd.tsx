import React, { useState } from "react";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import LinearProgress from "@material-ui/core/LinearProgress";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";

import { Button } from "../common/Button";

import SecretPathSelectForm from "../SecretPathSelectForm";
import SecretsEditor from "../SecretsEditor";
import SecretPathAdded from "../SecretPathAdded";

import { setSecretAtPath } from "../../lib/api";
import { encrypt } from "../../lib/cryptography";

import { SecretType } from "../../interfaces";

export default function SecretPathAdd() {
  const [secretPathChosen, setSecretPathChosen] = useState(false);
  const [secretPathFinal, setSecretPathFinal] = useState("");

  const [submittingSecret, setSubmittingSecret] = useState(false);
  const [hasSetSecret, setHasSetSecret] = useState(false);
  const [secretPassphrase, setSecretPassphrase] = useState("");

  const [encryptionDisabledFinal, setEncryptionDisabledFinal] = useState(false);

  const [secretExpiryTime, setSecretExpiryTime] = useState(-1);

  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Choose path", "Add secret"];

  function reset(): void {
    window.location.reload(); // works ¯\_(ツ)_/¯
  }

  function onSelectSecretPath(secretPath: string) {
    setSecretPathFinal(secretPath);
    setSecretPathChosen(true);

    setActiveStep((prev) => prev + 1);
  }

  const onCancelSecretEdit = () => {
    setSecretPathFinal("");
    setSecretPathChosen(false);

    setActiveStep((prev) => prev - 1);
  };

  async function onSubmitSecret(
    secret: string,
    secretType: SecretType,
    passphrase: string,
    secretExpiryDuration: number,
    encryptionDisabled = false,
    deleteOnLoad = true
  ) {
    setEncryptionDisabledFinal(encryptionDisabled);
    // 1. encrypt secret with passphrase
    const ciphertext = encryptionDisabled
      ? secret
      : encrypt(secret, passphrase);
    setSubmittingSecret(true);

    // 2. set secret ciphertext at path
    try {
      const secretDocument = await setSecretAtPath({
        path: secretPathFinal,
        secret: ciphertext,
        secretType,
        expiryDuration: secretExpiryDuration,
        encryptionDisabled,
        deleteOnLoad,
      });
      setSecretPassphrase(passphrase);
      setSecretExpiryTime(secretDocument.expiryTime._seconds);
      setHasSetSecret(true);
      setActiveStep((prev) => prev + 1);
    } catch (err) {
      // Couldn't set ciphertext, go back to path selection
      console.error(err);

      reset();
    }

    setSubmittingSecret(false);
  }

  return (
    <div>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {activeStep === 0 && (
        <Card>
          <CardContent>
            <SecretPathSelectForm
              onSubmit={onSelectSecretPath}
              active={!secretPathChosen}
            />
          </CardContent>
        </Card>
      )}

      {activeStep === 1 && (
        <Card>
          <CardContent>
            <Button type="button" onClick={onCancelSecretEdit}>
              <i className="fas fa-caret-left" /> Back
            </Button>
            <SecretsEditor
              secretPath={secretPathFinal}
              onSubmitSecret={onSubmitSecret}
              active={secretPathChosen && !hasSetSecret}
            />
          </CardContent>
        </Card>
      )}

      {submittingSecret && <LinearProgress />}

      {hasSetSecret && (
        <Card>
          <CardContent>
            <SecretPathAdded
              secretPath={secretPathFinal}
              onAddNewSecret={reset}
              encryptionDisabled={encryptionDisabledFinal}
              secretExpiryTime={secretExpiryTime}
              secretPassphrase={secretPassphrase}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

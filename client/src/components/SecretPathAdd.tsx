import React, { useState } from "react";
import { AES } from "crypto-js";
import { ToastContainer, toast } from "react-toastify";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import LinearProgress from "@material-ui/core/LinearProgress";

import SecretsEditor from "./SecretsEditor";
import SecretPathAdded from "./SecretPathAdded";

import { setSecretAtPath } from "../lib";

import SecretPathSelectForm from "./SecretPathSelectForm";

enum SecretPathAddAccordions {
  None,
  ReservePath,
  SetSecret,
}

export default function SecretPathAdd() {
  const [secretPathChosen, setSecretPathChosen] = useState(false);
  const [secretPathFinal, setSecretPathFinal] = useState("");

  const [submittingSecret, setSubmittingSecret] = useState(false);
  const [hasSetSecret, setHasSetSecret] = useState(false);
  const [secretPassphraseFinal, setSecretPassphraseFinal] = useState("");

  const [expandedAccordion, setExpandedAccordion] = useState(
    SecretPathAddAccordions.ReservePath
  );

  function reset(): void {
    window.location.reload(); // works ¯\_(ツ)_/¯
  }

  function onSelectSecretPath(secretPath: string) {
    setSecretPathFinal(secretPath);
    setSecretPathChosen(true);

    setExpandedAccordion(SecretPathAddAccordions.SetSecret);
  }

  const onCancelSecretEdit = () => {
    setSecretPathFinal("");
    setSecretPathChosen(false);

    setExpandedAccordion(SecretPathAddAccordions.ReservePath);
  };

  async function onSubmitSecret(
    secret: string,
    passphrase: string,
    secretExpiryDuration: number,
    encryptionDisabled = false
  ) {
    // 1. encrypt secret with passphrase
    const ciphertext = encryptionDisabled
      ? secret
      : AES.encrypt(secret, passphrase).toString();

    setSubmittingSecret(true);
    setExpandedAccordion(SecretPathAddAccordions.None);

    // 2. set secret ciphertext at path
    try {
      await setSecretAtPath({
        path: secretPathFinal,
        secret: ciphertext,
        expiryDuration: secretExpiryDuration,
        encryptionDisabled,
      });
      setSecretPassphraseFinal(passphrase);
      setHasSetSecret(true);
    } catch (err) {
      // Couldn't set ciphertext, go back to path selection
      console.error(err);
      toast.error(err.message);

      reset();
    }

    setSubmittingSecret(false);
  }

  const onAccordionExpand = (accordionName: SecretPathAddAccordions) => (
    event: React.ChangeEvent<{}>,
    expanded: boolean
  ) => {
    if (expanded) {
      setExpandedAccordion(accordionName);
    } else {
      setExpandedAccordion(SecretPathAddAccordions.None);
    }
  };

  return (
    <div>
      <ToastContainer />
      <Accordion
        disabled={secretPathChosen}
        expanded={expandedAccordion === SecretPathAddAccordions.ReservePath}
        onChange={onAccordionExpand(SecretPathAddAccordions.ReservePath)}
      >
        <AccordionSummary expandIcon={<i className="fas fa-chevron-down" />}>
          1. Choose a path
        </AccordionSummary>
        <AccordionDetails>
          <SecretPathSelectForm
            onSubmit={onSelectSecretPath}
            active={!secretPathChosen}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion
        disabled={!secretPathChosen || hasSetSecret}
        expanded={expandedAccordion === SecretPathAddAccordions.SetSecret}
        onChange={onAccordionExpand(SecretPathAddAccordions.SetSecret)}
      >
        <AccordionSummary expandIcon={<i className="fas fa-chevron-down" />}>
          2. Enter your secret(s)
        </AccordionSummary>
        <AccordionDetails>
          <SecretsEditor
            secretPath={secretPathFinal}
            onSubmitSecret={onSubmitSecret}
            active={secretPathChosen && !hasSetSecret}
            onCancel={onCancelSecretEdit}
          />
        </AccordionDetails>
      </Accordion>
      {submittingSecret && <LinearProgress />}
      {hasSetSecret && (
        <Card>
          <CardContent>
            <SecretPathAdded
              secretPath={secretPathFinal}
              secretPassphrase={secretPassphraseFinal}
              onAddNewSecret={reset}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

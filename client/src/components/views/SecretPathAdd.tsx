import React, { useState } from "react";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import LinearProgress from "@material-ui/core/LinearProgress";

import { Button } from "../common/Button";

import SecretPathSelectForm from "../SecretPathSelectForm";
import SecretsEditor from "../SecretsEditor";
import SecretPathAdded from "../SecretPathAdded";

import { setSecretAtPath } from "../../lib/api";
import { encrypt } from "../../lib/cryptography";

import { SecretType } from "../../interfaces";

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
  const [secretPassphrase, setSecretPassphrase] = useState("");

  const [encryptionDisabledFinal, setEncryptionDisabledFinal] = useState(false);

  const [secretExpiryTime, setSecretExpiryTime] = useState(-1);

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
    setExpandedAccordion(SecretPathAddAccordions.None);

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
    } catch (err) {
      // Couldn't set ciphertext, go back to path selection
      console.error(err);

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
        <AccordionDetails style={{ flexDirection: "column" }}>
          <Button type="button" onClick={onCancelSecretEdit}>
            <i className="fas fa-caret-up" style={{ marginRight: "10px" }} />
            Go back
          </Button>

          <SecretsEditor
            secretPath={secretPathFinal}
            onSubmitSecret={onSubmitSecret}
            active={secretPathChosen && !hasSetSecret}
          />
        </AccordionDetails>
      </Accordion>
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

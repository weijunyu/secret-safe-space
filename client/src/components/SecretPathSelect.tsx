import React, { useState } from "react";
import { AES } from "crypto-js";
import { Link } from "react-router-dom";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import SecretsEditor from "./SecretsEditor";

import { setSecretAtPath } from "../lib";

import SecretPathSelectForm from "./SecretPathSelectForm";

enum SecretPathSelectionAccordions {
  None,
  ReservePath,
  SetSecret,
}

export default function SecretPathSelect() {
  const [secretPathReserved, setSecretPathReserved] = useState(false);
  const [secretPathFinal, setSecretPathFinal] = useState("");
  const [hasSetSecret, setHasSetSecret] = useState(false);
  const [secretPassphraseFinal, setSecretPassphraseFinal] = useState("");
  const [expandedAccordion, setExpandedAccordion] = useState(
    SecretPathSelectionAccordions.None
  );

  function onSelectSecretPath(secretPath: string) {
    setSecretPathFinal(secretPath);
    setSecretPathReserved(true);

    setExpandedAccordion(SecretPathSelectionAccordions.SetSecret);
  }

  async function onSubmitSecret(secret: string, passphrase: string) {
    // 1. encrypt secret with passphrase
    const ciphertext = AES.encrypt(secret, passphrase).toString();
    // 2. set secret ciphertext at path
    try {
      await setSecretAtPath({ path: secretPathFinal, secret: ciphertext });
      setSecretPassphraseFinal(passphrase);
      setHasSetSecret(true);

      setExpandedAccordion(SecretPathSelectionAccordions.None);
    } catch (err) {
      // Couldn't set ciphertext, go back to path selection
      console.error(err);

      setSecretPathFinal("");
      setSecretPathReserved(false);

      setExpandedAccordion(SecretPathSelectionAccordions.ReservePath);
    }
  }

  const onAccordionExpand = (accordionName: SecretPathSelectionAccordions) => (
    event: React.ChangeEvent<{}>,
    expanded: boolean
  ) => {
    if (expanded) {
      setExpandedAccordion(accordionName);
    } else {
      setExpandedAccordion(SecretPathSelectionAccordions.None);
    }
  };

  return (
    <div>
      <Accordion
        disabled={secretPathReserved}
        expanded={
          expandedAccordion === SecretPathSelectionAccordions.ReservePath
        }
        onChange={onAccordionExpand(SecretPathSelectionAccordions.ReservePath)}
      >
        <AccordionSummary expandIcon={<i className="fas fa-chevron-down" />}>
          1. Choose a path
        </AccordionSummary>
        <AccordionDetails>
          <SecretPathSelectForm
            onSubmit={onSelectSecretPath}
            active={!secretPathReserved}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion
        disabled={!secretPathReserved || hasSetSecret}
        expanded={expandedAccordion === SecretPathSelectionAccordions.SetSecret}
        onChange={onAccordionExpand(SecretPathSelectionAccordions.SetSecret)}
      >
        <AccordionSummary expandIcon={<i className="fas fa-chevron-down" />}>
          2. Enter your secret(s)
        </AccordionSummary>
        <AccordionDetails>
          <SecretsEditor
            secretPath={secretPathFinal}
            onSubmitSecret={onSubmitSecret}
            active={secretPathReserved && !hasSetSecret}
          />
        </AccordionDetails>
      </Accordion>
      {hasSetSecret && (
        <Card>
          <CardContent>
            <p>
              <strong>Secret set!</strong>
            </p>
            <p>
              You can access it at{" "}
              <Link to={`/view/${secretPathFinal}`}>
                /view/{secretPathFinal}
              </Link>
              , with your passphrase: <code>{secretPassphraseFinal}</code>.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

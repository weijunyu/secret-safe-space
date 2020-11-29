import React, { useState } from "react";
import { AES } from "crypto-js";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import SecretsEditor from "./SecretsEditor";

import { reserveSecretPath, setSecretAtPath } from "../lib";

import SecretPathReserveForm from "./SecretPathReserveForm";

export default function SecretPathSelect() {
  const [secretPathReserved, setSecretPathReserved] = useState(false);
  const [secretPathFinal, setSecretPathFinal] = useState("");
  const [hasSetSecret, setHasSetSecret] = useState(false);
  const [secretPassphraseFinal, setSecretPassphraseFinal] = useState("");

  function onSelectSecretPath(secretPath: string) {
    reserveSecretPath(secretPath).then((data) => {
      if (data.secretPath) {
        setSecretPathFinal(data.secretPath);
        setSecretPathReserved(true);
        return;
      }
    });
  }

  async function onSubmitSecret(secret: string, passphrase: string) {
    // 1. encrypt secret with passphrase
    const ciphertext = AES.encrypt(secret, passphrase).toString();
    // 2. set secret ciphertext at path
    await setSecretAtPath({ path: secretPathFinal, secret: ciphertext });
    setSecretPassphraseFinal(passphrase);
    setHasSetSecret(true);
  }

  return (
    <div>
      <Accordion>
        <AccordionSummary expandIcon={<i className="fas fa-chevron-down" />}>
          Reserve a path
        </AccordionSummary>
        <AccordionDetails>
          <SecretPathReserveForm
            onSubmit={onSelectSecretPath}
            active={!secretPathReserved}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<i className="fas fa-chevron-down" />}>
          Enter your secret(s)
        </AccordionSummary>
        <AccordionDetails>
          <SecretsEditor
            secretPath={secretPathFinal}
            onSubmitSecret={onSubmitSecret}
            active={secretPathReserved && !hasSetSecret}
          />
        </AccordionDetails>
      </Accordion>
      <Card>
        <CardContent>
          <p>
            Secret set. You can access it at{" "}
            <code>/view/{secretPathFinal}</code>, with your passphrase:{" "}
            <code>{secretPassphraseFinal}</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { DateTime } from "luxon";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Divider from "../common/Divider";

import SecretPathDecryptForm from "../SecretPathDecryptForm";
import DecryptedSecretDisplay from "../DecryptedSecretDisplay";

import { getSecretAtPath } from "../../lib/api";
import { getCiphertextFromCipher } from "../../lib/cryptography";

type SecretPathViewerParams = {
  secretPath: string;
};

const CipherViewer = styled.span`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: block;
`;

function startSecretTimer(expiryTime: DateTime): number {
  const interval = window.setInterval(() => {
    const remainingTime = expiryTime.diffNow();
    if (Math.sign(remainingTime.valueOf()) === -1) {
      window.clearInterval(interval);
      window.location.reload();
    }
  }, 1000);
  return interval;
}

export default function SecretPathViewer() {
  const { secretPath } = useParams<SecretPathViewerParams>();

  const [loadingSecrets, setLoadingSecrets] = useState(false);
  const [encryptedSecrets, setEncryptedSecrets] = useState<string | null>("");
  const [decryptedSecrets, setDecryptedSecrets] = useState("");
  const [encryptionDisabled, setEncryptionDisabled] = useState(false);
  const [secretDeleted, setSecretDeleted] = useState<boolean>(false);

  useEffect(() => {
    let timer: number | null = null;
    setLoadingSecrets(true);
    getSecretAtPath(secretPath)
      .then((secretData) => {
        if (!secretData || !secretData.value) {
          setEncryptedSecrets(null);
        } else {
          setEncryptionDisabled(secretData.encryptionDisabled);
          setSecretDeleted(secretData.deleteOnLoad);
          timer = startSecretTimer(
            DateTime.fromSeconds(secretData.expiryTime._seconds)
          );

          if (secretData.encryptionDisabled) {
            setDecryptedSecrets(secretData.value);
          } else {
            setEncryptedSecrets(secretData.value);
          }
        }
      })
      .finally(() => setLoadingSecrets(false));
    return () => {
      if (typeof timer === "number") {
        window.clearInterval(timer);
      }
    };
  }, [secretPath]);

  function onDecrypt(plaintext: string) {
    setDecryptedSecrets(plaintext);
  }

  function renderSecrets() {
    return (
      <>
        {secretDeleted && (
          <p>
            <em>
              This is a one-time secret. It has been deleted from our servers
              and will no longer be available at this URL.
            </em>
          </p>
        )}
        {encryptionDisabled && decryptedSecrets && (
          <DecryptedSecretDisplay decryptedSecrets={decryptedSecrets} />
        )}
        {!encryptionDisabled && encryptedSecrets && (
          <>
            <CipherViewer>
              Your encrypted secret: {getCiphertextFromCipher(encryptedSecrets)}
            </CipherViewer>

            <Divider />

            <SecretPathDecryptForm
              encryptedSecrets={encryptedSecrets}
              onDecrypt={onDecrypt}
            />
            {decryptedSecrets && (
              <DecryptedSecretDisplay decryptedSecrets={decryptedSecrets} />
            )}
          </>
        )}
      </>
    );
  }

  return (
    <section>
      <Card>
        <CardContent>
          {loadingSecrets ? (
            <span>Loading...</span>
          ) : (
            <>
              {encryptedSecrets === null && (
                <p>This path doesn't contain any data!</p>
              )}
              {(encryptedSecrets || decryptedSecrets) && renderSecrets()}
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

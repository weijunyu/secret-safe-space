import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

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

export default function SecretPathViewer() {
  const { secretPath } = useParams<SecretPathViewerParams>();

  const [loadingSecrets, setLoadingSecrets] = useState(false);
  const [encryptedSecrets, setEncryptedSecrets] = useState<string | null>("");
  const [decryptedSecrets, setDecryptedSecrets] = useState("");
  const [encryptionDisabled, setEncryptionDisabled] = useState(false);

  useEffect(() => {
    setLoadingSecrets(true);
    getSecretAtPath(secretPath)
      .then((secretData) => {
        if (!secretData.value) {
          setEncryptedSecrets(null);
        } else if (secretData.encryptionDisabled) {
          setDecryptedSecrets(secretData.value);
        } else {
          setEncryptedSecrets(secretData.value);
        }
        setEncryptionDisabled(secretData.encryptionDisabled);
      })
      .finally(() => setLoadingSecrets(false));
  }, [secretPath]);

  function onDecrypt(plaintext: string) {
    setDecryptedSecrets(plaintext);
    // todo: one-time view option: call server to delete document?
  }

  function renderSecrets() {
    if (encryptionDisabled && decryptedSecrets) {
      return <DecryptedSecretDisplay decryptedSecrets={decryptedSecrets} />;
    } else if (!encryptionDisabled && encryptedSecrets) {
      return (
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
      );
    }
  }

  return (
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
  );
}

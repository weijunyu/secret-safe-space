import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Divider from "./common/Divider";

import SecretPathDecryptForm from "./SecretPathDecryptForm";
import DecryptedSecretDisplay from "./DecryptedSecretDisplay";

import { getSecretEncrypted } from "../lib";

type SecretPathViewerParams = {
  secretPath: string;
};

const CipherViewer = styled.span`
  overflow-wrap: break-word;
`;

export default function SecretPathViewer() {
  const { secretPath } = useParams<SecretPathViewerParams>();

  const [loadingEncryptedSecrets, setLoadingEncryptedSecrets] = useState(false);
  const [encryptedSecrets, setEncryptedSecrets] = useState<string | null>("");
  const [decryptedSecrets, setDecryptedSecrets] = useState("");

  useEffect(() => {
    setLoadingEncryptedSecrets(true);
    getSecretEncrypted(secretPath)
      .then((secretData) => {
        if (!secretData.value) {
          setEncryptedSecrets(null);
        } else {
          setEncryptedSecrets(secretData.value);
        }
      })
      .finally(() => setLoadingEncryptedSecrets(false));
  }, [secretPath]);

  function onDecrypt(plaintext: string) {
    setDecryptedSecrets(plaintext);
  }

  return (
    <>
      <Card>
        <CardContent>
          <p>Your secret path: {secretPath}</p>
          {loadingEncryptedSecrets ? (
            <span>Loading...</span>
          ) : (
            <>
              {encryptedSecrets === null && (
                <p>This path doesn't contain any data!</p>
              )}
              {encryptedSecrets && (
                <>
                  <CipherViewer>
                    Your encrypted secret: {encryptedSecrets}
                  </CipherViewer>
                  <Divider />
                  <SecretPathDecryptForm
                    secretPath={secretPath}
                    onDecrypt={onDecrypt}
                  />
                  {decryptedSecrets && (
                    <DecryptedSecretDisplay
                      decryptedSecrets={decryptedSecrets}
                    />
                  )}
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}

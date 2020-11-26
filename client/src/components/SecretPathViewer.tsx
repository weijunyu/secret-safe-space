import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SecretPathDecryptForm from "./SecretPathDecryptForm";

import { getSecretEncrypted } from "../lib";

type SecretPathViewerParams = {
  secretPath: string;
};

export default function SecretPathViewer() {
  const { secretPath } = useParams<SecretPathViewerParams>();

  const [loadingEncryptedSecrets, setLoadingEncryptedSecrets] = useState(false);
  const [encryptedSecrets, setEncryptedSecrets] = useState<string | null>("");

  useEffect(() => {
    setLoadingEncryptedSecrets(true);
    getSecretEncrypted(secretPath)
      .then((ciphertext) => {
        if (!ciphertext) {
          setEncryptedSecrets(null);
        } else {
          setEncryptedSecrets(ciphertext);
        }
      })
      .finally(() => setLoadingEncryptedSecrets(false));
  }, [secretPath]);

  return (
    <div>
      <p>Your secret path: {secretPath}</p>
      {loadingEncryptedSecrets ? (
        <span>Loading...</span>
      ) : (
        <>
          {encryptedSecrets === null && (
            <p>This path doesn't contain any data!</p>
          )}
          {encryptedSecrets && <p>Your encrypted secret: {encryptedSecrets}</p>}
          {encryptedSecrets && (
            <SecretPathDecryptForm secretPath={secretPath} />
          )}
        </>
      )}
    </div>
  );
}

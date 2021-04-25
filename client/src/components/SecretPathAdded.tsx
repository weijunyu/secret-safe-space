import React, { useEffect } from "react";
import { DateTime } from "luxon";
import styled from "styled-components";

import { PrimaryButton } from "./common/Button";
import SecretPathUrlDisplay from "./SecretPathUrlDisplay";

const StyledPassphraseDisplay = styled.strong`
  overflow-wrap: break-word;
`;

export default function SecretPathAdded({
  secretPath,
  onAddNewSecret,
  encryptionDisabled,
  secretExpiryTime,
  secretPassphrase,
}: {
  secretPath: string;
  onAddNewSecret: () => void;
  encryptionDisabled: boolean;
  secretExpiryTime: number;
  secretPassphrase: string;
}) {
  useEffect(() => {
    const resetWatcher = window.setInterval(() => {
      const expiryDateTime = DateTime.fromSeconds(secretExpiryTime);

      if (expiryDateTime.diffNow().valueOf() < 0) {
        window.clearInterval(resetWatcher);
        window.location.reload();
      }
    }, 1000);
    return () => {
      window.clearInterval(resetWatcher);
    };
  }, [secretExpiryTime]);
  return (
    <div>
      <p>
        <strong>Secret {encryptionDisabled ? "set!" : "encrypted!"}</strong>
      </p>
      <p>
        Your secret expires at{" "}
        {DateTime.fromSeconds(secretExpiryTime).toLocaleString(
          DateTime.DATETIME_FULL_WITH_SECONDS
        )}
      </p>
      {encryptionDisabled ? (
        <MessageForUnencryptedText secretPath={secretPath} />
      ) : (
        <MessageForEncryptedText
          secretPath={secretPath}
          secretPassphrase={secretPassphrase}
        />
      )}
      <PrimaryButton onClick={onAddNewSecret}>Add another secret</PrimaryButton>
    </div>
  );
}

function MessageForEncryptedText({
  secretPath,
  secretPassphrase,
}: {
  secretPath: string;
  secretPassphrase: string;
}) {
  return (
    <p>
      You can fetch and decrypt your secret text at{" "}
      <SecretPathUrlDisplay path={secretPath} /> using your passphrase:{" "}
      <StyledPassphraseDisplay>{secretPassphrase}</StyledPassphraseDisplay>
    </p>
  );
}

function MessageForUnencryptedText({ secretPath }: { secretPath: string }) {
  return (
    <p>
      You can fetch your unencrypted text at{" "}
      <SecretPathUrlDisplay path={secretPath} />.
    </p>
  );
}

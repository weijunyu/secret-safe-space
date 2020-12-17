import React from "react";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";

import { AccentButton } from "./common/Button";

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
      <AccentButton onClick={onAddNewSecret}>Add another secret</AccentButton>
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
      <Link to={`/view/${secretPath}`}>/view/{secretPath}</Link> using your
      passphrase: <strong>{secretPassphrase}</strong>
    </p>
  );
}

function MessageForUnencryptedText({ secretPath }: { secretPath: string }) {
  return (
    <p>
      You can fetch your unencrypted text at{" "}
      <Link to={`/view/${secretPath}`}>/view/{secretPath}</Link>.
    </p>
  );
}

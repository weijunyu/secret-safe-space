import React from "react";
import { Link } from "react-router-dom";

import { AccentButton } from "./common/Button";

export default function SecretPathAdded({
  secretPath,
  onAddNewSecret,
  encryptionDisabled,
}: {
  secretPath: string;
  onAddNewSecret: () => void;
  encryptionDisabled: boolean;
}) {
  return (
    <div>
      <p>
        <strong>Secret set!</strong>
      </p>
      {encryptionDisabled ? (
        <MessageForUnencryptedText secretPath={secretPath} />
      ) : (
        <MessageForEncryptedText secretPath={secretPath} />
      )}
      <AccentButton onClick={onAddNewSecret}>Add another secret</AccentButton>
    </div>
  );
}

function MessageForEncryptedText({ secretPath }: { secretPath: string }) {
  return (
    <p>
      You can view and decrypt your secret text at{" "}
      <Link to={`/view/${secretPath}`}>/view/{secretPath}</Link> using your
      passphrase.
    </p>
  );
}

function MessageForUnencryptedText({ secretPath }: { secretPath: string }) {
  return (
    <p>
      You can view your unencrypted text at{" "}
      <Link to={`/view/${secretPath}`}>/view/{secretPath}</Link>.
    </p>
  );
}

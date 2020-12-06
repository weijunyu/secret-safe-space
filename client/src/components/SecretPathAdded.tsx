import React from "react";
import { Link } from "react-router-dom";

import { AccentButton } from "./common/Button";

export default function SecretPathAdded({
  secretPath,
  secretPassphrase,
  onAddNewSecret,
}: {
  secretPath: string;
  secretPassphrase: string;
  onAddNewSecret: () => void;
}) {
  return (
    <div>
      <p>
        <strong>Secret set!</strong>
      </p>
      <p>
        You can access it at{" "}
        <Link to={`/view/${secretPath}`}>/view/{secretPath}</Link>, with your
        passphrase: <code>{secretPassphrase}</code>.
      </p>
      <AccentButton onClick={onAddNewSecret}>Add another secret</AccentButton>
    </div>
  );
}

import React, { useState } from "react";

export default function SecretPathSelector() {
  const [secretPath, setSecretPath] = useState("");
  function onSecretPathChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSecretPath(e.target.value);
  }
  return (
    <div>
      <label htmlFor="secret-path-selector">
        Enter URL path for your secret
      </label>
      <input
        id="secret-path-selector"
        type="text"
        value={secretPath}
        onChange={onSecretPathChange}
      ></input>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { firebaseFunctions } from "../firebase";
export default function SecretPathSelector() {
  const [secretPath, setSecretPath] = useState("");
  useEffect(() => {
    const testFunction = firebaseFunctions.httpsCallable("helloWorld");
    testFunction({ message: "hello!" }).then((response) =>
      console.log(response)
    );
  }, []);
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

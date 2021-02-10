import React from "react";
import styled from "styled-components";
import { TextField } from "./common/FormField";
import SecretPathUrlDisplay from "./SecretPathUrlDisplay";

const SecretInputTextarea = styled.textarea`
  font-family: monospace;
`;

export default function SecretTextInput({
  secretPath,
  value,
  onChange,
  disabled,
}: {
  secretPath: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
}) {
  return (
    <TextField>
      <label htmlFor="secret-text-input">
        Enter your secret text here. You will be able to access it at{" "}
        <SecretPathUrlDisplay path={secretPath} link={false} />.
      </label>
      <SecretInputTextarea
        id="secret-text-input"
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={20}
        autoCapitalize="off"
      ></SecretInputTextarea>
    </TextField>
  );
}

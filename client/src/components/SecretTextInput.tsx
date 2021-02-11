import React from "react";
import styled from "styled-components";
import { TextField } from "./common/FormField";

const SecretInputTextarea = styled.textarea`
  font-family: monospace;
`;

export default function SecretTextInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
}) {
  return (
    <TextField>
      <label htmlFor="secret-text-input">Enter your secret text:</label>
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

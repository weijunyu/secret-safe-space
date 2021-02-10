import React from "react";
import styled from "styled-components";

import { SecretType } from "../interfaces";

import { Button, PrimaryButton } from "./common/Button";

const SecretTypeToggleContainer = styled.div`
  display: flex;
`;

const FlexPrimaryButton = styled(PrimaryButton)`
  flex: 1 1 auto;
`;

const FlexButton = styled(Button)`
  flex: 1 1 auto;
`;

export default function SecretTypeToggle({
  secretType,
  onToggle,
}: {
  secretType: SecretType;
  onToggle: (secretType: SecretType) => void;
}) {
  return (
    <SecretTypeToggleContainer>
      {secretType === SecretType.Text ? (
        <FlexPrimaryButton onClick={() => {}}>Text</FlexPrimaryButton>
      ) : (
        <FlexButton onClick={() => onToggle(SecretType.Text)}>Text</FlexButton>
      )}
      {secretType === SecretType.File ? (
        <FlexPrimaryButton onClick={() => {}}>File</FlexPrimaryButton>
      ) : (
        <FlexButton onClick={() => onToggle(SecretType.File)}>File</FlexButton>
      )}
    </SecretTypeToggleContainer>
  );
}

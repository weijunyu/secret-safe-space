import React from "react";
import styled from "styled-components";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import { Primary, SuccessLight } from "../lib/colors";

const StyledSuccessIcon = styled.i`
  color: ${Primary};
`;

const StyledDecryptedSecretDisplayContainer = styled.section`
  margin: 1rem 0;
`;

const StyledDecryptedSecretCard = styled(Card)`
  && {
    background-color: ${SuccessLight};
  }
  overflow-wrap: break-word;
`;

export default function DecryptedSecretDisplay({
  decryptedSecrets,
}: {
  decryptedSecrets: string;
}) {
  return (
    <StyledDecryptedSecretDisplayContainer>
      <p>
        {decryptedSecrets && (
          <StyledSuccessIcon className="fas fa-check-circle"></StyledSuccessIcon>
        )}{" "}
        Your decrypted secrets:
      </p>
      <StyledDecryptedSecretCard>
        <CardContent>{decryptedSecrets}</CardContent>
      </StyledDecryptedSecretCard>
    </StyledDecryptedSecretDisplayContainer>
  );
}

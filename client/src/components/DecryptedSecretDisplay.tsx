import React from "react";
import styled from "styled-components";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import { Primary } from "../lib/colors";

const StyledSuccessIcon = styled.i`
  color: ${Primary};
`;

const StyledDecryptedSecretDisplay = styled.section`
  margin: 1rem 0;
`;

export default function DecryptedSecretDisplay({
  decryptedSecrets,
}: {
  decryptedSecrets: string;
}) {
  return (
    <StyledDecryptedSecretDisplay>
      {decryptedSecrets && (
        <StyledSuccessIcon className="fas fa-check-circle"></StyledSuccessIcon>
      )}{" "}
      Your decrypted secrets:
      <Card>
        <CardContent>{decryptedSecrets}</CardContent>
      </Card>
    </StyledDecryptedSecretDisplay>
  );
}

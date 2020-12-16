import React, { useState } from "react";
import styled from "styled-components";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Snackbar from "@material-ui/core/Snackbar";

import { Primary, SuccessLight } from "../lib/colors";
import { BareButton } from "./common/Button";

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
  const [showSnackbar, setShowSnackbar] = useState(false);
  function onCopySecret() {
    navigator.clipboard.writeText(decryptedSecrets);
    setShowSnackbar(true);
  }
  function closeSnackbar(event: React.SyntheticEvent, reason: string) {
    // reason can be 'clickaway' or 'timeout'
    if (reason === "clickaway") {
      return;
    }
    setShowSnackbar(false);
  }
  return (
    <StyledDecryptedSecretDisplayContainer>
      <p style={{ display: "flex", justifyContent: "space-between" }}>
        {decryptedSecrets && (
          <span>
            <StyledSuccessIcon className="fas fa-check-circle"></StyledSuccessIcon>{" "}
            Your decrypted secrets:
          </span>
        )}
        <BareButton onClick={onCopySecret}>
          <small>
            <i className="fas fa-copy" /> Copy
          </small>
        </BareButton>
      </p>
      <StyledDecryptedSecretCard>
        <CardContent>{decryptedSecrets}</CardContent>
      </StyledDecryptedSecretCard>
      <Snackbar
        open={showSnackbar}
        message="Secret copied."
        autoHideDuration={2000}
        onClose={closeSnackbar}
        action={
          <BareButton
            style={{ color: "white" }}
            onClick={() => setShowSnackbar(false)}
          >
            <i className="fas fa-times" />
          </BareButton>
        }
      ></Snackbar>
    </StyledDecryptedSecretDisplayContainer>
  );
}

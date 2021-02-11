import React, { useState } from "react";
import styled from "styled-components";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Snackbar from "@material-ui/core/Snackbar";

import { saveAs } from "file-saver";

import { Primary, SuccessLight } from "../lib/colors";
import { BareButton, Button } from "./common/Button";

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

const b64toBlob = (base64: string, type = "application/octet-stream") =>
  fetch(`data:${type};base64,${base64}`).then((res) => res.blob());

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
  function onDownloadSecret() {
    b64toBlob(decryptedSecrets).then((b: Blob) => saveAs(b));
  }
  function closeSnackbar(event: React.SyntheticEvent, reason: string) {
    // // reason can be 'clickaway' or 'timeout'
    // if (reason === "clickaway") {
    //   return;
    // }
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
        <span>
          <Button onClick={onCopySecret}>
            <small>
              <i className="fas fa-copy" /> Copy
            </small>
          </Button>{" "}
          <Button onClick={onDownloadSecret}>
            <small>
              <i className="fas fa-download" /> Download as binary
            </small>
          </Button>
        </span>
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

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";

import { LinkButton } from "./common/Button";

import { generateWords } from "../lib/cryptography";

const StyledSuggestorContainer = styled.div`
  width: 100%;
`;

export default function SecretPathSuggestor({
  onConfirm,
}: {
  onConfirm: (path: string) => void;
}) {
  const [suggestedPath, setSuggestedPath] = useState("");
  useEffect(() => {
    setSuggestedPath(generateWords());
  }, []);

  function confirmSuggestion(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.preventDefault();
    if (suggestedPath) {
      onConfirm(suggestedPath);
    }
  }

  function regenerateSuggestion(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.preventDefault();
    setSuggestedPath(generateWords());
  }

  return (
    <StyledSuggestorContainer>
      <Grid container>
        <Grid item xs={12} sm={7} md={6}>
          <small>Suggested path: {suggestedPath}</small>
        </Grid>
        <Grid item xs={12} sm={5} md={6}>
          <small style={{ display: "flex", justifyContent: "flex-end" }}>
            <LinkButton onClick={confirmSuggestion}>Use this</LinkButton>{" "}
            <LinkButton onClick={regenerateSuggestion}>
              Suggest another
            </LinkButton>{" "}
          </small>
        </Grid>
      </Grid>
    </StyledSuggestorContainer>
  );
}

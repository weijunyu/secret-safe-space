import React from "react";
import styled from "styled-components";

import Container from "@material-ui/core/Container";

const StyledFooter = styled.footer`
  padding-top: 3rem;
  padding-bottom: 3rem;
`;

export default function Footer() {
  return (
    <StyledFooter>
      <Container
        maxWidth="md"
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <small>
          <a href="https://gitlab.com/junyuwei/secret-space">
            <i className="fab fa-gitlab" /> Source
          </a>
        </small>
      </Container>
    </StyledFooter>
  );
}

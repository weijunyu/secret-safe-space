import React from "react";

import styled from "styled-components";

import { Light } from "./lib/colors";

import SecretPathSelector from "./components/SecretPathSelector";

const StyledApp = styled.div`
  min-height: 100vh;
  padding: 0 15vw;
  @media screen and (max-width: 768px) {
    padding: 0;
  }
  background-color: ${Light};
`;

const StyledHeader = styled.header`
  padding: 1.5rem 0;
`;

function App() {
  return (
    <StyledApp>
      <StyledHeader>
        <h1>Secrits!</h1>
      </StyledHeader>
      <main>
        <section>
          <SecretPathSelector />
        </section>
      </main>
    </StyledApp>
  );
}

export default App;

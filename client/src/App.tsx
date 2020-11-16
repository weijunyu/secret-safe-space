import React from "react";

import styled from "styled-components";

import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

import { Light, Accent, Dark } from "./lib/colors";

import SecretPathSelector from "./components/SecretPathSelector";

const StyledApp = styled.div`
  min-height: 100vh;
  padding: 0 15vw;
  @media screen and (max-width: 768px) {
    padding: 0;
  }
  background-color: ${Light};
  font-family: nunito sans, sans-serif;
  color: ${Dark};
`;

const StyledHeader = styled.header`
  padding: 1.5rem 0;
`;

const StyledLink = styled(Link)`
  padding: 3px 4px;
  :link,
  :visited {
    color: ${Dark};
  }
  :hover,
  :link:hover,
  :visited:hover {
    color: white;
    background-color: ${Accent};
  }
`;

const StyledNav = styled.nav`
  ul {
    display: flex;
    justify-content: center;
    padding: 0;
    list-style-type: none;
  }
  li:not(:last-child) {
    margin-right: 1rem;
  }
`;

function App() {
  return (
    <BrowserRouter>
      <StyledApp>
        <StyledHeader>
          <h1 style={{ textAlign: "center" }}>Secrits!</h1>
          <StyledNav>
            <ul>
              <li>
                <StyledLink to="/">Home</StyledLink>
              </li>
              <li>
                <StyledLink to="/add">Add secrets</StyledLink>
              </li>
              <li>
                <StyledLink to="/view">View secrets</StyledLink>
              </li>
            </ul>
          </StyledNav>
        </StyledHeader>
        <main>
          <div>
            <section>
              <Switch>
                <Route path="/add">
                  <SecretPathSelector />
                </Route>
                <Route path="/view">view secrets</Route>
                <Route path="/">nothing</Route>
              </Switch>
            </section>
          </div>
        </main>
      </StyledApp>
    </BrowserRouter>
  );
}

export default App;

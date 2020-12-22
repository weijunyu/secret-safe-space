import React from "react";

import styled from "styled-components";

import {
  BrowserRouter,
  Switch,
  Route,
  NavLink,
  Redirect,
} from "react-router-dom";

import { Light, Accent, Dark } from "./lib/colors";

import SecretPathAdd from "./components/SecretPathAdd";
import SecretPathViewer from "./components/SecretPathViewer";
import Help from "./components/Help";

const StyledApp = styled.div`
  min-height: 100vh;
  padding: 0 15vw;
  @media screen and (max-width: 768px) {
    padding: 0 1rem;
  }
  background-color: ${Light};
  font-family: Courier Prime, monospace;
  color: ${Dark};
`;

const StyledHeader = styled.header`
  padding: 1.5rem 0;
`;

const StyledLink = styled(NavLink)`
  padding: 3px 4px;
  text-decoration: none;
  :link,
  :visited {
    color: ${Dark};
  }
  :hover,
  :link:hover,
  :visited:hover,
  &.active {
    color: white;
    background-color: ${Accent};
  }
`;

const StyledHeaderLink = styled(NavLink)`
  text-decoration: none;
  :link,
  :visited {
    color: ${Dark};
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
          <h1 style={{ textAlign: "center" }}>
            <StyledHeaderLink exact to="/">
              <i className="fas fa-key" /> Luan Loot
            </StyledHeaderLink>
          </h1>
          <StyledNav>
            <ul>
              <li>
                <StyledLink exact to="/">
                  Help
                </StyledLink>
              </li>
              <li>
                <StyledLink to="/add">Add secrets</StyledLink>
              </li>
            </ul>
          </StyledNav>
        </StyledHeader>
        <main>
          <Switch>
            <Route path="/add">
              <SecretPathAdd />
            </Route>
            <Route path="/view/:secretPath">
              <SecretPathViewer />
            </Route>
            <Route exact path="/">
              <Help />
            </Route>
            <Route path="/">
              <Redirect to="/" />
            </Route>
          </Switch>
        </main>
      </StyledApp>
    </BrowserRouter>
  );
}

export default App;

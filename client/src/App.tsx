import React from "react";

import styled from "styled-components";

import {
  BrowserRouter,
  Switch,
  Route,
  NavLink,
  Redirect,
} from "react-router-dom";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import Container from "@material-ui/core/Container";

import * as colors from "./lib/colors";

import Footer from "./components/Footer";
import SecretPathAdd from "./components/views/SecretPathAdd";
import SecretPathViewer from "./components/views/SecretPathViewer";
import Help from "./components/Help";

const StyledApp = styled.div`
  position: relative;
  min-height: 100vh;
  padding: 0 15vw;
  @media screen and (max-width: 768px) {
    padding: 0 1rem;
  }
  background-color: ${colors.Light};
  font-family: Courier Prime, monospace;
  color: ${colors.Dark};
  display: flex;
  flex-direction: column;
`;

const StyledHeader = styled.header`
  padding: 1.5rem 0;
`;

const StyledMain = styled.main`
  flex: 1 1 auto;
`;

const StyledLink = styled(NavLink)`
  padding: 3px 4px;
  text-decoration: none;
  :link,
  :visited {
    color: ${colors.Dark};
  }
  :hover,
  :link:hover,
  :visited:hover,
  &.active {
    color: white;
    background-color: ${colors.Primary};
  }
`;

const StyledHeaderLink = styled(NavLink)`
  text-decoration: none;
  :link,
  :visited {
    color: ${colors.Dark};
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

const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.Primary,
    },

    error: {
      main: colors.Error,
    },
    warning: {
      main: colors.Warn,
    },
    success: {
      main: colors.Success,
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <StyledApp>
          <StyledHeader>
            <h1 style={{ textAlign: "center" }}>
              <StyledHeaderLink exact to="/">
                <i className="fas fa-key" /> secretsafe.space
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
          <StyledMain>
            <Container maxWidth="md">
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
            </Container>
          </StyledMain>
          <Footer />
        </StyledApp>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

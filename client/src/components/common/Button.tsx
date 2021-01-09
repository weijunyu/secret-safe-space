import styled from "styled-components";

import {
  Accent,
  AccentLight,
  AccentAlt,
  Primary,
  PrimaryLight,
  LightGrey,
  Light,
} from "../../lib/colors";

export const Button = styled.button`
  padding: 4px 6px;
  border: none;
  :hover {
    cursor: pointer;
    background-color: ${Light};
  }
  :disabled,
  :disabled:hover {
    background-color: ${LightGrey};
    cursor: not-allowed;
  }
`;

export const PrimaryButton = styled(Button)`
  color: white;
  background-color: ${Primary};
  :hover {
    background-color: ${PrimaryLight};
  }
`;

export const AccentButton = styled(Button)`
  color: white;
  background-color: ${Accent};
  :hover {
    background-color: ${AccentLight};
  }
`;

export const AccentAltButton = styled(Button)`
  background-color: ${AccentAlt};
`;

export const BareButton = styled(Button)`
  background: none;
  border: none;
  :hover {
    background-color: transparent;
  }
`;

export const LinkButton = styled(BareButton)`
  background: none;
  border: none;
  text-decoration: underline;
`;

import styled from "styled-components";

import {
  Primary,
  PrimaryLight,
  Light,
  Grey,
  LightGrey,
} from "../../lib/colors";

export const Button = styled.button`
  padding: 4px 6px;
  border: none;
  background-color: ${LightGrey};
  :hover {
    cursor: pointer;
    background-color: ${Light};
  }
  :disabled,
  :disabled:hover {
    background-color: ${Grey};
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

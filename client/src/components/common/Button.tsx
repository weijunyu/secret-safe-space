import styled from "styled-components";

import { Accent, AccentLight, Primary, PrimaryLight } from "../../lib/colors";

export const Button = styled.button`
  padding: 4px 6px;
  border: none;
  :hover {
    cursor: pointer;
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

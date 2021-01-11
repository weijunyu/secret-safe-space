import styled from "styled-components";

import { Warn } from "../../lib/colors";

export const Form = styled.form`
  width: 100%;
`;

interface FormHintProps {
  justify?: string;
  type?: string;
}
export const FormHint = styled.span<FormHintProps>`
  display: flex;
  margin: 0.5rem 0;
  justify-content: ${(props) => props.justify};
  color: ${(props) => {
    const type = props.type;
    switch (type) {
      case "warn": {
        return Warn;
      }
      default: {
        return undefined;
      }
    }
  }};
`;

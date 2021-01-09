import styled from "styled-components";
export const Form = styled.form`
  width: 100%;
`;

interface FormHintProps {
  justify?: string;
}
export const FormHint = styled.span<FormHintProps>`
  display: flex;
  margin: 0.5rem 0;
  justify-content: ${(props) => props.justify};
`;

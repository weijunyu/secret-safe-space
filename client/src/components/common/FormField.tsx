import React from "react";
import styled from "styled-components";

const StyledFormField = styled.div`
  display: block;
  padding-bottom: 2rem;
  & label {
    display: block;
    padding-bottom: 0.5rem;
  }
  input {
    width: 100%;
  }
`;

export default function FormField({ children }: { children: React.ReactNode }) {
  return <StyledFormField>{children}</StyledFormField>;
}

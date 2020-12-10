import React from "react";
import styled from "styled-components";

const StyledFormField = styled.div`
  display: block;
  padding-bottom: 2rem;
  & label {
    display: block;
    padding-bottom: 0.5rem;
  }
  input,
  textarea {
    width: 100%;
  }
`;

export function TextFormField({
  children,
  ...props
}: {
  children?: React.ReactNode;
  props?: any;
}) {
  return <StyledFormField {...props}>{children}</StyledFormField>;
}

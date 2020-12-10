import React from "react";
import styled from "styled-components";

function generateFieldComponent(Component: React.FunctionComponent) {
  return ({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    props?: any;
  }) => <Component {...props}>{children}</Component>;
}

const StyledTextField = styled.div`
  display: block;
  padding-bottom: 1rem;
  & label {
    display: block;
    padding-bottom: 0.5rem;
  }
  input,
  textarea {
    width: 100%;
  }
`;

const StyledCheckField = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  label {
    padding-left: 0.5rem;
  }
`;

const StyledFieldSet = styled.fieldset`
  margin-bottom: 1rem;
`;

const StyledLegend = styled.legend`
  padding: 0 4px;
`;

export const CheckField = generateFieldComponent(StyledCheckField);
export const TextField = generateFieldComponent(StyledTextField);
export const FieldSet = generateFieldComponent(StyledFieldSet);
export const Legend = generateFieldComponent(StyledLegend);

import React from "react";
import styled from "styled-components";

import * as config from "../config";

const StyledLink = styled.a`
  overflow-wrap: break-word;
`;

export default function SecretPathUrlDisplay({ path }: { path: string }) {
  const url = new URL("/view/" + path, config.appUrl);
  return <StyledLink href={url.href}>{url.href}</StyledLink>;
}

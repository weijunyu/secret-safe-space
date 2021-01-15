import React from "react";
import styled from "styled-components";

import * as config from "../config";

const StyledLink = styled.a`
  overflow-wrap: break-word;
`;

const StyledSpan = styled.span`
  overflow-wrap: break-word;
`;

export default function SecretPathUrlDisplay({
  path,
  link,
}: {
  path: string;
  link?: boolean;
}) {
  const url = new URL("/view/" + path, config.appUrl);
  if (link) {
    return <StyledLink href={url.href}>{url.href}</StyledLink>;
  } else {
    return <StyledSpan>{url.href}</StyledSpan>;
  }
}
SecretPathUrlDisplay.defaultProps = {
  link: true,
};

import React from "react";
import styled from "styled-components";

import { Primary } from "../lib/colors";

const StyledSuccessIcon = styled.i`
  color: ${Primary};
`;

export default function DecryptedSecretDisplay({
  decryptedSecrets,
}: {
  decryptedSecrets: string;
}) {
  return (
    <section>
      {decryptedSecrets && (
        <StyledSuccessIcon className="fas fa-check-circle"></StyledSuccessIcon>
      )}
      Your decrypted secrets: {decryptedSecrets}
    </section>
  );
}

import React from "react";
import styled from "styled-components";

const HelpContainer = styled.section`
  padding-bottom: 2rem;
`;

export default function Help() {
  return (
    <HelpContainer>
      <h2>Usage</h2>
      <p>
        This app lets you store text that is accessible from anywhere on the
        internet without needing to log in, for a short time.
      </p>
      <p>
        This text is encrypted by your browser before being stored on our
        servers. We do not store your encryption password so{" "}
        <strong>
          we would not be able to decrypt and read the contents of your text.
        </strong>
      </p>
      <ol>
        <li>
          <strong>Select a path.</strong>
        </li>
        <li>
          <strong>Enter your text.</strong>
        </li>
        <li>
          <strong>Enter a passphrase.</strong> This would be used by{" "}
          <em>your browser</em> to encrypt your text before it is sent via an
          encrypted connection to be stored on our servers.
        </li>
        <li>
          (optional) Disable encryption. This means your text would no longer be
          encrypted and anyone on the internet would be able to read it if they
          knew the path you set for it!
        </li>
        <li>
          (optional) Set how long it takes for your text to expire, after which
          it is no longer readable from our servers. Defaults to 5 minutes.
        </li>
        <li>
          <strong>Save the secret.</strong>
        </li>
        <li>
          You can then use your other device to access and decrypt it at{" "}
          <strong>
            <em>https://secretsafe.space/view/[your chosen path]</em>
          </strong>{" "}
          within the expiry time you set.
        </li>
      </ol>
      <h2>How it works</h2>
      <p>
        We use{" "}
        <a
          href="https://en.wikipedia.org/wiki/Advanced_Encryption_Standard"
          target="_blank"
          rel="noreferrer"
        >
          AES-256 (GCM)
        </a>
        , a U.S. Federal Information Processing Standard (FIPS) to encrypt your
        text before storing it.
      </p>
      <p>
        Your data would be inaccessible once past expiry, and would be deleted
        from our servers at most 1 hour past expiry time.
      </p>
      <h2>What do I use this for?</h2>
      <ul>
        <li>
          A quick way to copy and paste text between devices without having to
          log in to any service.
        </li>
        <li>A secure way to store and retrieve short-lived secrets online.</li>
        <li>
          Transmit text or text-encoded data that cannot be parsed/read by
          intermediaries.
        </li>
      </ul>
    </HelpContainer>
  );
}

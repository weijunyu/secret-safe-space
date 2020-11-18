import React from "react";
export default function SecretsEditor({ secretPath }: { secretPath: string }) {
  return (
    <div>
      Enter your secret text here. You will be able to access it at {secretPath}
    </div>
  );
}

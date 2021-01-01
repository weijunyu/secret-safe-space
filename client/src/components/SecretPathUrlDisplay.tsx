import React from "react";
import * as config from "../config";
export default function SecretPathUrlDisplay({ path }: { path: string }) {
  const url = new URL("/view/" + path, config.appUrl);
  return <a href={url.href}>{url.href}</a>;
}

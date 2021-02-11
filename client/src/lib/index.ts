export const b64toBlob = (base64: string, type = "application/octet-stream") =>
  fetch(`data:${type};base64,${base64}`).then((res) => res.blob());

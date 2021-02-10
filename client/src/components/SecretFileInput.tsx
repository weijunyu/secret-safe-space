import React, { useEffect } from "react";
import Uppy, { UppyFile } from "@uppy/core";
import DragDrop from "@uppy/drag-drop";
import styled from "styled-components";
import { encode } from "base64-arraybuffer";

import "@uppy/core/dist/style.css";
import "@uppy/drag-drop/dist/style.css";

const StyledSecretFileInput = styled.div`
  padding-bottom: 1rem;
`;

const fileDragDropEl = "secret-file-input";

export default function SecretFileInput() {
  useEffect(() => {
    Uppy({
      onBeforeFileAdded: function (currentFile: UppyFile) {
        currentFile.data.arrayBuffer().then((buf) => console.log(encode(buf)));
        return false;
      },
    }).use(DragDrop, { target: "#" + fileDragDropEl });
  }, []);
  return <StyledSecretFileInput id={fileDragDropEl}></StyledSecretFileInput>;
}

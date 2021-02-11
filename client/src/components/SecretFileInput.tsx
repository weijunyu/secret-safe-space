import React, { useEffect, useState } from "react";
import Uppy, { UppyFile } from "@uppy/core";
import DragDrop from "@uppy/drag-drop";
import styled from "styled-components";
import { encode } from "base64-arraybuffer";

import { PrimaryButton } from "./common/Button";

import "@uppy/core/dist/style.css";
import "@uppy/drag-drop/dist/style.css";

const StyledSecretFileInput = styled.div`
  padding-bottom: 1rem;
`;

const StyledFileLoadedDialog = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const fileDragDropEl = "secret-file-input";

export default function SecretFileInput({
  onFileLoaded,
}: {
  onFileLoaded: (encodedFile: string) => void;
}) {
  const [fileLoaded, setFileLoaded] = useState(false);
  const [fileName, setFileName] = useState("");
  function reset() {
    setFileLoaded(false);
    setFileName("");
    onFileLoaded("");
  }
  return (
    <StyledSecretFileInput>
      {fileLoaded ? (
        <StyledFileLoadedDialog>
          <p>
            <strong>File loaded: {fileName}</strong>
          </p>
          <PrimaryButton onClick={reset}>Load another file</PrimaryButton>
        </StyledFileLoadedDialog>
      ) : (
        <FileLoader
          onFileLoaded={(encodedFile: string, fileName: string) => {
            setFileLoaded(true);
            setFileName(fileName);
            onFileLoaded(encodedFile);
          }}
        />
      )}
    </StyledSecretFileInput>
  );
}

function FileLoader({
  onFileLoaded,
}: {
  onFileLoaded: (encodedFile: string, fileName: string) => void;
}) {
  useEffect(() => {
    Uppy({
      restrictions: {
        maxNumberOfFiles: 1,
      },
      onBeforeFileAdded: function (currentFile: UppyFile) {
        currentFile.data.arrayBuffer().then((buf) => {
          onFileLoaded(encode(buf), currentFile.name);
        });
        return false;
      },
    }).use(DragDrop, { target: "#" + fileDragDropEl });
  }, [onFileLoaded]);
  return <div id={fileDragDropEl} />;
}

import React, { useEffect, useState } from "react";
import Uppy, { UppyFile } from "@uppy/core";
import DragDrop from "@uppy/drag-drop";
import styled from "styled-components";
import { encode } from "base64-arraybuffer";
import Snackbar from "@material-ui/core/Snackbar";

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

export default React.memo(SecretFileInput);

function SecretFileInput({
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
  const [showUploadNotification, setShowUploadNotification] = useState(false);
  function closeSnackbar(event: React.SyntheticEvent, reason: string) {
    setShowUploadNotification(false);
  }
  useEffect(() => {
    Uppy({
      onBeforeFileAdded: function (currentFile: UppyFile) {
        if (currentFile.data.size > 1_048_576) {
          // only accept files less than 1 mib, ie 1024 * 1024 bytes
          setShowUploadNotification(true);
          return false;
        }
        currentFile.data.arrayBuffer().then((buf) => {
          onFileLoaded(encode(buf), currentFile.name);
        });
        return false;
      },
    }).use(DragDrop, { target: "#" + fileDragDropEl });
  }, [onFileLoaded]);
  return (
    <>
      <div id={fileDragDropEl} />
      <Snackbar
        open={showUploadNotification}
        message="Your file must be less than 1MB."
        autoHideDuration={2000}
        onClose={closeSnackbar}
      ></Snackbar>
    </>
  );
}

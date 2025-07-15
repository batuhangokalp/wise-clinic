import React from "react";
import { FileTypeId, findFileType } from "../../../helpers/chatConstants";

export default function RenderAudio({ chatFile, url }) {
  return (
    <>
      {chatFile && FileTypeId.Audio?.includes(findFileType(chatFile?.type)) && (
        <div
          className="text-center"
          style={{
            padding: "8px",
            borderRadius: "6px",
            width: "100%",
            maxWidth: "400px",
            margin: "0 auto",
          }}
        >
          <audio controls style={{ width: "100%" }}>
            <source
              src={URL.createObjectURL(chatFile)}
              type={chatFile.type || "audio/ogg"}
            />
          </audio>
        </div>
      )}
      {url && (
        <div
          className="text-center"
          style={{
            padding: "8px",
            borderRadius: "6px",
            width: "100%",
            maxWidth: "400px",
            margin: "0 auto",
          }}
        >
          <audio controls style={{ width: "100%" }}>
            <source src={url} type="audio/mp3" />
          </audio>
        </div>
      )}
    </>
  );
}

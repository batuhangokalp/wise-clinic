import React from "react";
import { FileTypeId, findFileType } from "../../../helpers/chatConstants";

export default function RenderVideo({ chatFile, url }) {
  const videoSrc = url || (chatFile && URL.createObjectURL(chatFile));
  const fileType = chatFile ? findFileType(chatFile?.type) : "video";

  if (!videoSrc || (chatFile && fileType !== FileTypeId.Video)) return null;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <video
        controls
        style={{
          width: "100%",
          height: "auto",
          borderRadius: "8px",
          maxHeight: "60vh",
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
}

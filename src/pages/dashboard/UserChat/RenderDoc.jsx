import { useEffect, useState } from "react";
import { FileTypeId, findFileType } from "../../../helpers/chatConstants";

export default function RenderDocPreview({ url, chatFile }) {
  const [fileUrl, setFileUrl] = useState(null);

  const extension = url
    ? url.split(".").pop().split("?")[0].toLowerCase()
    : chatFile?.name?.split(".").pop().toLowerCase() || "";

  useEffect(() => {
    if (
      chatFile &&
      (findFileType(chatFile?.type) === FileTypeId.Document ||
        findFileType(chatFile?.type) === FileTypeId.TextFile)
    ) {
      const blobUrl = URL.createObjectURL(chatFile);
      setFileUrl(blobUrl);
    } else if (url) {
      setFileUrl(url);
    }
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [chatFile, url]);

  if (extension === "doc" || extension === "docx" || extension === "txt") {
    const iconClass =
      extension === "txt" ? "ri-file-text-fill" : "ri-file-word-2-fill";

    const iconColor = extension === "txt" ? "#333" : "#2B579A";

    return (
      <div
        className="text-center"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <i
          className={iconClass}
          style={{ fontSize: "50px", color: iconColor }}
        />
        {fileUrl && (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" download>
            Download
          </a>
        )}
      </div>
    );
  }

  return null;
}

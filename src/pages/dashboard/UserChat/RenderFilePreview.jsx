import { useEffect, useState } from "react";
import { FileTypeId, findFileType } from "../../../helpers/chatConstants";

export default function RenderFilePreview({ url, chatFile, senderType }) {
  const [excelUrl, setExcelUrl] = useState(null);

  const extension = url
    ? url.split(".").pop().split("?")[0].toLowerCase()
    : chatFile?.name?.split(".").pop().toLowerCase() || "";

  useEffect(() => {
    if (chatFile && findFileType(chatFile?.type) === FileTypeId.Document) {
      const blobUrl = URL.createObjectURL(chatFile);
      setExcelUrl(blobUrl);
    } else if (url) {
      setExcelUrl(url);
    }
  }, [chatFile, url]);

  if (extension === "xlsx" || extension === "xls") {
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
          className="ri-file-excel-2-fill"
          style={{ fontSize: "50px", color: "#1D6F42" }}
        />
        <a
          href={excelUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          style={{ color: senderType === "contact" ? "white" : "black" }}
        >
          Download
        </a>
      </div>
    );
  }

  return null;
}

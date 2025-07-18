// import React, { useEffect, useRef, useState } from "react";
// import { useTranslation } from "react-i18next";
// import * as pdfjsLib from "pdfjs-dist/build/pdf";
// import workerSrc from "pdfjs-dist/build/pdf.worker.entry";

// import { FileTypeId, findFileType } from "../../../helpers/chatConstants";

// pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

// export default function RenderPDFFirstPage({ chatFile, url }) {
//   const { t } = useTranslation();
//   const [imageSrc, setImageSrc] = useState(null);
//   const [totalPages, setTotalPages] = useState(0);
//   const canvasRef = useRef();

//   const [pdfUrl, setPdfUrl] = useState(null);

//   useEffect(() => {
//     if (chatFile && findFileType(chatFile?.type) === FileTypeId.Document) {
//       const blobUrl = URL.createObjectURL(chatFile);
//       setPdfUrl(blobUrl);
//     } else if (url) {
//       setPdfUrl(url);
//     }
//   }, [chatFile, url]);

//   useEffect(() => {
//     const renderFirstPage = async () => {
//       try {
//         const loadingTask = pdfjsLib.getDocument({
//           url: pdfUrl,
//           withCredentials: false,
//         });

//         const pdf = await loadingTask.promise;
//         setTotalPages(pdf.numPages);

//         const page = await pdf.getPage(1);
//         const viewport = page.getViewport({ scale: 1.5 });

//         const canvas = canvasRef.current;
//         const context = canvas.getContext("2d");

//         canvas.width = viewport.width;
//         canvas.height = viewport.height;

//         await page.render({ canvasContext: context, viewport }).promise;
//         const image = canvas.toDataURL("image/png");
//         setImageSrc(image);
//       } catch (err) {
//         console.error("PDF render error:", err);
//       }
//     };

//     if (pdfUrl) renderFirstPage();
//   }, [pdfUrl]);

//   return (
//     <div className="text-center">
//       {imageSrc ? (
//         <>
//           <img
//             src={imageSrc}
//             alt="First page of PDF"
//             style={{
//               maxWidth: "100%",
//               maxHeight: "150px",
//               objectFit: "contain",
//             }}
//           />
//           <p className="text-sm text-gray-500">
//             {t("Total Pages")} {totalPages}
//           </p>
//         </>
//       ) : (
//         <>
//           <canvas ref={canvasRef} style={{ display: "none" }} />
//           {url && <i className="ri-file-text-fill" style={{ fontSize: "40px" }}></i>}

//         </>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FileTypeId, findFileType } from "../../../helpers/chatConstants";

export default function RenderPDFFirstPage({ chatFile, url }) {
  const { t } = useTranslation();
  const [pdfUrl, setPdfUrl] = useState(null);

  const fileExtension = url?.split(".").pop()?.split("?")[0]?.toLowerCase();

  // Dosya tipi PDF değilse hiçbir şey gösterme
  const isPdf =
    (chatFile &&
      FileTypeId.Document.includes(findFileType(chatFile?.type)) &&
      chatFile?.type?.includes("pdf")) ||
    fileExtension === "pdf";

  useEffect(() => {
    if (
      chatFile &&
      FileTypeId.Document.includes(findFileType(chatFile?.type))
    ) {
      const blobUrl = URL.createObjectURL(chatFile);
      setPdfUrl(blobUrl);
    } else if (url) {
      setPdfUrl(url);
    }
  }, [chatFile, url]);

  if (!isPdf) return null;

  return (
    <div className="text-center">
      {pdfUrl ? (
        <div>
          <iframe
            src={pdfUrl}
            title="PDF Preview"
            style={{
              width: "100%",
              maxHeight: "400px",
              borderRadius: "8px",
            }}
          />
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "8px",
              textDecoration: "none",
              color: "#007bff",
              fontWeight: "500",
            }}
          >
            View
          </a>
        </div>
      ) : (
        <i className="ri-file-text-fill" style={{ fontSize: "40px" }} />
      )}
    </div>
  );
}

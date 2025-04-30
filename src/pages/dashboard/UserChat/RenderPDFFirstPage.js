import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { useTranslation } from "react-i18next";
import { FileTypeId, findFileType } from "../../../helpers/chatConstants";

// Worker tanımlaması
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

export default function RenderPDFFirstPage({ chatFile }) {
  const { t } = useTranslation();
  const [imageSrc, setImageSrc] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const canvasRef = useRef();
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (chatFile && findFileType(chatFile?.type) === FileTypeId.Document) {
      setPdfUrl(URL.createObjectURL(chatFile));
    }
  }, [chatFile]);

  useEffect(() => {
    const renderFirstPage = async () => {
      try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;

        setTotalPages(pdf.numPages);

        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        const image = canvas.toDataURL("image/png");
        setImageSrc(image);
      } catch (error) {
        console.error("Error rendering PDF page:", error);
      }
    };

    if (pdfUrl) renderFirstPage();
  }, [pdfUrl]);

  return (
    <div>
      {chatFile && findFileType(chatFile?.type) === FileTypeId.Document && (
        <div className="text-center">
          {imageSrc ? (
            <div>
              <img
                src={imageSrc}
                alt="First page of PDF"
                style={{ maxWidth: "100%" }}
              />
              <p>{t("Total Pages")} {totalPages}</p>
            </div>
          ) : (
            <>
              <canvas ref={canvasRef} style={{ display: "none" }} />
              <i className="ri-file-text-fill" style={{ fontSize: "100px" }}></i>
            </>
          )}
        </div>
      )}
    </div>
  );
}

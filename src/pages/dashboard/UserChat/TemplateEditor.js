import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function TemplateEditor({ template, onParamsChange }) {
  const [inputs, setInputs] = useState({});
  const [parsedContent, setParsedContent] = useState([]);

  useEffect(() => {
    if (
      !template?.content &&
      !template?.header &&
      !template?.footer &&
      !template?.buttons
    )
      return;

    const regex = /{{(\d+)}}/g;

    const parseText = (text, currentInputs, keyStart, section = "") => {
      let match;
      let lastIndex = 0;
      const elements = [];
      let key = keyStart;

      while ((match = regex.exec(text)) !== null) {
        const start = match.index;
        const end = regex.lastIndex;
        const index = match[1];
        const stateKey = section + "_" + index;

        if (start > lastIndex) {
          elements.push(
            <span key={key++}>{text.slice(lastIndex, start)}</span>
          );
        }

        if (!currentInputs[stateKey]) currentInputs[stateKey] = "";

        elements.push(
          <input
            key={key++}
            type="text"
            value={currentInputs[stateKey]}
            placeholder={`Param ${index}`}
            onChange={(e) => {
              const updatedInputs = {
                ...inputs,
                [stateKey]: e.target.value,
              };
              setInputs(updatedInputs);
              onParamsChange?.(updatedInputs);
            }}
            style={{
              margin: "0 4px",
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        );

        lastIndex = end;
      }

      if (lastIndex < text.length) {
        elements.push(<span key={key++}>{text.slice(lastIndex)}</span>);
      }

      return elements;
    };

const currentInputs = { ...inputs };
let keyCounter = 0;

const headerElements = template.header
  ? parseText(template.header, currentInputs, keyCounter, "header")
  : [];
keyCounter += headerElements.length;

const contentElements = template.content
  ? parseText(template.content, currentInputs, keyCounter, "content")
  : [];
keyCounter += contentElements.length;

const footerElements = template.footer
  ? parseText(template.footer, currentInputs, keyCounter, "footer")
  : [];
keyCounter += footerElements.length;


    const buttonElements = [];
    if (template.buttons) {
      try {
        const buttons = JSON.parse(template.buttons);
        buttons.forEach((btn, i) => {
          if (btn.type === "URL" && btn.url) {
            buttonElements.push(
              <a
                key={`btn-${i}`}
                href={btn.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: "10px",
                  marginRight: "10px",
                  padding: "6px 12px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "4px",
                }}
              >
                {btn.text || "Link"}
              </a>
            );
          }
        });
      } catch (err) {
        console.error("Invalid buttons JSON", err);
      }
    }

    setParsedContent([
      ...headerElements,
      <br key="br-1" />,
      ...contentElements,
      <br key="br-2" />,
      ...footerElements,
      <br key="br-3" />,
      ...buttonElements,
    ]);
  }, [template, inputs]);

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        padding: "1rem",
        borderRadius: "8px",
        border: "1px solid #dee2e6",
        fontSize: "1rem",
        lineHeight: "1.6",
      }}
    >
      {parsedContent}
    </div>
  );
}

TemplateEditor.propTypes = {
  template: PropTypes.object,
  onParamsChange: PropTypes.func,
};

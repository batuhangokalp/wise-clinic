import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function TemplateEditor({ template, onParamsChange }) {
  const [inputs, setInputs] = useState({});
  const [parsedContent, setParsedContent] = useState([]);

  useEffect(() => {
    if (!template?.content) return;

    const regex = /{{(\d+)}}/g;
    let match;
    let lastIndex = 0;
    const elements = [];
    let key = 0;

    const currentInputs = { ...inputs };

    while ((match = regex.exec(template.content)) !== null) {
      const start = match.index;
      const end = regex.lastIndex;
      const index = match[1];

      if (start > lastIndex) {
        elements.push(
          <span key={key++}>{template.content.slice(lastIndex, start)}</span>
        );
      }

      if (!currentInputs[index]) currentInputs[index] = "";

      elements.push(
        <input
          key={key++}
          type="text"
          value={currentInputs[index]}
          placeholder={`Param ${index}`}
          onChange={(e) => {
            const updatedInputs = {
              ...inputs,
              [index]: e.target.value,
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

    if (lastIndex < template.content.length) {
      elements.push(
        <span key={key++}>{template.content.slice(lastIndex)}</span>
      );
    }

    setParsedContent(elements);
  }, [template, inputs]); // inputs'u da ekledik ki güncel değerleri gösterebilsin

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

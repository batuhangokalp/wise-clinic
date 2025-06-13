// Utility function to download a file
export const downloadFile = (filePath) => {
  if (!filePath) {
    console.error("File path is undefined or null.");
    return;
  }

  let fileUrl = filePath.includes("download=false")
    ? filePath.replace("download=false", "download=true")
    : filePath.includes("?")
    ? filePath + "&download=true"
    : filePath + "?download=true";

  const link = document.createElement("a");
  link.href = fileUrl;
  link.target = "_blank";
  link.download = fileUrl.split("/").pop();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const convertFileToBinary = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // Event triggered when the file is read
    reader.onload = () => {
      resolve(reader.result); // Binary data (ArrayBuffer)
    };

    // Event triggered if there is an error
    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };

    // Read the file as an ArrayBuffer
    reader.readAsDataURL(file);
  });
};

// Utility function to download a file
export const downloadFile = (filePath) => {
    if (!filePath) {
        console.error("File path is undefined or null.");
        return;
    }
    let fileUrl = filePath?.includes("download=false") ? filePath?.replace("download=false","download=true") : filePath.appendChild("?download=true");
    const link = document.createElement("a"); // Create a temporary <a> tag
    link.target = "_blank"; // Open in new tab
    link.href = fileUrl; // Set the file URL
    link.download = fileUrl.split("/").pop(); // Extract filename from filePath
    document.body.appendChild(link); // Append link to the body
    link.click(); // Trigger download
    document.body.removeChild(link); // Clean up
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
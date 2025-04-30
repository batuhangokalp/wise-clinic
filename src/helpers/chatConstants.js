export const FileTypeId = {
    Image: [9,24],
    Video: 14,
    Audio: [15,23],
    Document: 11,
    TextFile: 22,
    Text: null
};

export const findFileType = (fileType) => {
    if (/^image\//.test(fileType)) {
        return FileTypeId.Image[0];
    } else if (/^video\//.test(fileType)) {
        return FileTypeId.Video;
    } else if (/^audio\//.test(fileType)) {
        return FileTypeId.Audio[0];
    } else if (/^application\//.test(fileType)) {
        return FileTypeId.Document;
    } else if (/^text\//.test(fileType)) {
        return FileTypeId.Text;
    } else {
        return FileTypeId.Text;
    }
};

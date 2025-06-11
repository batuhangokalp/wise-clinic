export const FileTypeId = {
  Image: [9, 19, 24],
  Audio: [15, 23, 25],
  Video: [14, 26], 
  Document: [10,11,18],
  TextFile: 22,
  Text: null,
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


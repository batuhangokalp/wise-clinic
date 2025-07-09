export const FileTypeId = {
  Image: [9, 19, 24],
  Audio: [15, 23, 25],
  Video: [14, 26],
  Document: [10, 11, 16, 18, 22, 27],
  TextFile: 22,
  Text: null,
};
export const findFileType = (fileType) => {
  if (!fileType) return FileTypeId.TextFile; // yani dosya tipi 22 (file) olsun

  if (/^image\//.test(fileType)) {
    return FileTypeId.Image[0];
  } else if (/^video\//.test(fileType)) {
    return FileTypeId.Video[0];
  } else if (/^audio\//.test(fileType)) {
    return FileTypeId.Audio[0];
  } else if (
    /^application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|vnd\.ms-excel|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)(;.*)?$/.test(
      fileType
    )
  ) {
    return FileTypeId.Document[0];
  } else if (/^text\//.test(fileType)) {
    return FileTypeId.TextFile;
  } else {
    return FileTypeId.TextFile; // fallback dosya olarak değerlendir
  }
};

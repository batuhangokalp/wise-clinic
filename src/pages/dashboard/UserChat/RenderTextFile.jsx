export default function RenderTextFile({ url }) {
  return (
    <object
      data={url}
      type="text/plain"
      style={{
        width: "100%",
        height: "300px",
        border: "1px solid #ccc",
        borderRadius: "6px",
      }}
    >
      <p>Tarayıcınız bu metin dosyasını gösteremiyor.</p>
    </object>
  );
}

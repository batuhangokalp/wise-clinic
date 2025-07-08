const MarkAsReadButton = ({ count = 0, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        border: "1px solid #e66e4a",
        color: "#e66e4a",
        backgroundColor: "#fff",
        padding: "6px 12px",
        borderRadius: "30px",
        display: "flex",
        alignItems: "center",
        fontWeight: 500,
        fontSize: "14px",
        gap: "8px",
      }}
    >
      Mark as read
      <span
        style={{
          backgroundColor: "#e66e4a",
          color: "#fff",
          borderRadius: "50%",
          width: "20px",
          height: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >
        {count}
      </span>
    </button>
  );
};

export default MarkAsReadButton;

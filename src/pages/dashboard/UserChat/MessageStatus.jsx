const MessageStatus = ({ status }) => {
  const iconStyle = {
    width: "22px",
    height: "22px",
    marginLeft: "6px",
    display: "inline-block",
    verticalAlign: "middle"
  };

  // Tek Tik (Gönderildi) - Yumuşak kavis, minimal
  const singleTick = (
    <svg
      style={iconStyle}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9AA0A6"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 13l5 5L20 7" />
    </svg>
  );

  // Çift Tik (İletildi) - Sol yukarı, sağ aşağı, organik kavis
  const doubleTickGray = (
    <svg
      style={iconStyle}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9AA0A6"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 16l3.5 3L12 9" />  {/* Sol tik (yukarıda) */}
      <path d="M11 16l3.5 3L21 7" />  {/* Sağ tik (aşağıda) */}
    </svg>
  );

  // Çift Tik (Okundu) - Mavi gradient efekti için iki ton
  const doubleTickBlue = (
    <svg
      style={iconStyle}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
    >
      <defs>
        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4FC3F7" />
          <stop offset="100%" stopColor="#1976D2" />
        </linearGradient>
      </defs>
      <path 
        d="M3 16l3.5 3L12 9" 
        stroke="url(#blueGradient)" 
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path 
        d="M11 16l3.5 3L21 7" 
        stroke="url(#blueGradient)" 
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  switch (status) {
    case "sent":
      return singleTick;
    case "delivered":
      return doubleTickGray;
    case "read":
      return doubleTickBlue;
    default:
      return null;
  }
};

export default MessageStatus;
import { UncontrolledTooltip } from "reactstrap";

const MessageStatus = ({ status, messageError }) => {
  const iconStyle = {
    width: "22px",
    height: "22px",
    marginLeft: "6px",
    display: "inline-block",
    verticalAlign: "middle",
  };

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
      <path d="M3 16l3.5 3L12 9" />
      <path d="M11 16l3.5 3L21 7" />
    </svg>
  );

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

  if (status === "failed") {
    const tooltipId = `failed-icon-${Math.random().toString(36).substr(2, 9)}`;
    return (
      <>
        <span id={tooltipId}>
          <svg
            style={iconStyle}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D32F2F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12" y2="16" />
          </svg>
        </span>
        <UncontrolledTooltip placement="top" target={tooltipId}>
          {messageError || "Sending error"}
        </UncontrolledTooltip>
      </>
    );
  }
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

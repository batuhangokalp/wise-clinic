import "../../assets/scss/reports/stat-card.scss";

const StatCard = ({ label, value, icon, color = "purple" }) => {
  return (
    <div className="container">
      <div className={`stat-card ${color}`}>
        {icon && <i className={icon}></i>}
        <div>
          <div className="stat-value">{value}</div>
          <div className="stat-label">{label}</div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;

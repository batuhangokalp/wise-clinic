import { useEffect, useState } from "react";
import ReportFilters from "../../../components/ReportsComponent/ReportFilters";
import StatCard from "../../../components/ReportsComponent/StatCard";
import MessagesChart from "../../../components/ReportsComponent/MessagesChart";
import EmployeeTable from "../../../components/ReportsComponent/EmployeeTable";

import "../../../assets/scss/reports/reports.scss";
import { PERMISSIONS } from "../../../redux/role/constants";
import PermissionWrapper from "../../../components/PermissionWrapper";

const Reports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [channel, setChannel] = useState();

  const [statData, setStatData] = useState({ report: [] });
  const [loading, setLoading] = useState(false);

  const totalMessages = statData?.report?.reduce(
    (sum, item) => sum + parseInt(item.messages || 0),
    0
  );

  const totalConversations = statData?.report?.reduce(
    (sum, item) => sum + parseInt(item.conversations || 0),
    0
  );

  const avgResponseTimes = statData?.report?.map((item) => {
    const [mins, secs] = item.avg_response_time?.split(":").map(Number) || [
      0, 0,
    ];
    return mins * 60 + secs;
  });

  const totalUsers = statData?.report?.length;

  let averageResponseTime;
  if (avgResponseTimes?.length) {
    const avgInSeconds =
      avgResponseTimes.reduce((a, b) => a + b, 0) / totalUsers;

    const minutes = Math.floor(avgInSeconds / 60);
    const seconds = Math.floor(avgInSeconds % 60);
    averageResponseTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  const statCards = [
    {
      label: "Total Messages",
      value: totalMessages,
      icon: "ri-message-2-line",
      color: "purple",
    },
    {
      label: "Total Conversation",
      value: totalConversations,
      icon: "ri-chat-1-line",
      color: "blue",
    },
    {
      label: "Active Employees",
      value: totalUsers,
      icon: "ri-user-3-line",
      color: "yellow",
    },
    {
      label: "Avg. Response Time",
      value: averageResponseTime,
      icon: "ri-time-line",
      color: "green",
    },
  ];

  const getDefaultStartDate = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0]; // yyyy-mm-dd
  };

  const getDefaultEndDate = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
  };

  useEffect(() => {
    const defaultStart = getDefaultStartDate();
    const defaultEnd = getDefaultEndDate();

    setStartDate(defaultStart);
    setEndDate(defaultEnd);

    // default verilerle fetch et
    handleApply(defaultStart, defaultEnd, channel);
  }, []);

  const handleFilterChange = (field, value) => {
    if (field === "startDate") setStartDate(value);
    if (field === "endDate") setEndDate(value);
    if (field === "channel") setChannel(value);
  };
  const handleApply = async (
    forcedStartDate = startDate,
    forcedEndDate = endDate,
    forcedChannel = channel
  ) => {
    setLoading(true);

    try {
      const params = {};

      if (forcedStartDate) params.start_date = forcedStartDate;
      if (forcedEndDate) params.end_date = forcedEndDate;

      if (forcedChannel && forcedChannel !== "all") {
        params.channel_id = parseInt(forcedChannel);
      }

      const queryString = new URLSearchParams(params).toString();

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/reports/data?${queryString}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStatData(data);
    } catch (error) {
      console.error("err", error);
    }

    setLoading(false);
  };

  return (
    <div className="reports-page">
      <div className="filters-section">
        <h1 className="reports-title">Reports</h1>
        <ReportFilters
          startDate={startDate}
          endDate={endDate}
          channel={channel}
          onChange={handleFilterChange}
          onApply={() => handleApply()}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : statData?.report?.length > 0 ? (
        <>
          <div className="stat-card-container">
            {statCards.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          <div className="chart-section">
            <h2 className="section-title">Top 10 Employees by Messages</h2>
            <MessagesChart data={statData} />
          </div>

          <div className="table-section">
            <h2 className="section-title">Employee Performance Details</h2>
            <EmployeeTable data={statData} />
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "200px",
            color: "#666",
            fontSize: "1.2rem",
            fontWeight: "500",
          }}
        >
          <span style={{ fontSize: "3rem", marginBottom: "10px" }}>📭</span>
          <p>Data not found:(</p>
        </div>
      )}
    </div>
  );
};

export default PermissionWrapper(Reports, PERMISSIONS.VIEW_REPORTS);

import "../../assets/scss/reports/employee-table.scss";

const EmployeeTable = ({ data }) => {
  return (
    <div className="employee-table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th className="text-center">Messages</th>
            <th className="text-center">Conversations</th>
            <th className="text-center">Avg. Response Time</th>
          </tr>
        </thead>
        <tbody>
          {data?.report?.length > 0 ? (
            data.report.map((emp, index) => (
              <tr key={index}>
                <td>{emp.employee_name}</td>
                <td className="text-center">{emp.messages}</td>
                <td className="text-center">{emp.conversations}</td>
                <td className="text-center">{emp.avg_response_time}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-data">
                No employee data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;

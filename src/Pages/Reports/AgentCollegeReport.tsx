import { useQuery } from "react-query";
import { Divider, Table, type TableColumnsType } from "antd";
import { getAgentAccount } from "../../Api/Agent Accounts/agentAccountApi";

function AgentCollegeReport() {
  const { data, isLoading } = useQuery("agent", getAgentAccount);

  const accounts = data?.data || [];
  
  const totalPending = accounts
    .filter((item: any) => item.type?.toLowerCase() === "debit")
    .reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);

  const columns: TableColumnsType<any> = [
    {
      title: "Date",
      dataIndex: "createdAt",
    },
    {
      title: "Agent",
      dataIndex: ["agentId", "name"],
    },
    {
      title: "Student",
      dataIndex: ["registrationId", "name"],
    },
    {
      title: "Course",
      dataIndex: ["registrationId", "course"],
    },
    {
      title: "College",
      dataIndex: ["registrationId", "collegeId", "college"],
    },
    {
      title: "Type",
      dataIndex: "status",
      render: (text) => {
        let color = "";
        let label = "";

        if (text?.toLowerCase() === "none") {
          color = "green";
          label = "Paid";
        } else if (text?.toLowerCase() === "foragentpayments") {
          color = "red";
          label = "Pending";
        }

        return <span style={{ color, fontWeight: 600 }}>{label}</span>;
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
  ];

  return (
    <div>
      <Divider>Agent College Report</Divider>

      <div className="flex justify-end mx-10 my-4 font-semibold space-x-6">
        <div>
          Balance: <span className="text-red-600">{totalPending}</span>
        </div>
      </div>

      <Table
        columns={columns}
        style={{ height: "350px", overflowY: "auto" }}
        pagination={false}
        dataSource={accounts}
        loading={isLoading}
        size="middle"
        rowKey="_id"
      />
    </div>
  );
}

export default AgentCollegeReport;

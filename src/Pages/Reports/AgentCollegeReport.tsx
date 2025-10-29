import { useQuery } from "react-query";
import { Divider, Table, type TableColumnsType } from "antd";
import { getAgentAccount } from "../../Api/Agent Accounts/agentAccountApi";


function AgentCollegeReport() {
  const { data, isLoading } = useQuery('agent', getAgentAccount);

  const columns: TableColumnsType<any> = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
    },
    {
      title: 'Agent',
      dataIndex: ['agentId', 'name'],
    },
    {
      title: 'Student',
      dataIndex: ['registrationId', 'name'],
    },
    {
      title: 'Course',
      dataIndex: ['registrationId', 'course'],
    },
    {
      title: 'College',
      dataIndex: ['registrationId', 'collegeId', 'college'],
    },
    {
      title: 'Type',
      dataIndex: '',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    }
  ];
  return (
    <div>
      <Divider>Agent College Report</Divider>

      <Table
        columns={columns}
        style={{ height: '350px', overflowY: 'auto' }}
        pagination={false}
        dataSource={data?.data}
        loading={isLoading}
        size="middle"
        rowKey="_id"
      />
    </div>
  )
}

export default AgentCollegeReport
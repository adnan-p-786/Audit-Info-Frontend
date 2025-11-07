import { Divider, Table, type TableColumnsType } from "antd";


function EmployeeSales() {

  const columns: TableColumnsType<any> = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
    },
    {
      title: 'Employee Name',
      dataIndex: 'name',
    },
    {
      title: 'Student Name',
      dataIndex: 'course',
    },
    {
      title: 'College Name',
      dataIndex: ['collegeId', 'college'],
    },
    {
      title: 'Points',
      dataIndex: 'course',
    },
  ];

  return (
    <div>
      <Divider>Employee Sales</Divider>

      <Table
        columns={columns}
        style={{ height: '350px', overflowY: 'auto' }}
        pagination={false}
        // dataSource={data?.data}
        // loading={isLoading}
        size="middle"
        rowKey="_id"
      />

    </div>
  )
}

export default EmployeeSales
import { Divider, Table, type TableColumnsType } from "antd";
import { getemployeesales } from "../../Api/Lead/leadApi";
import { useQuery } from "react-query";

function EmployeeSales() {
  const { data, isLoading } = useQuery('employeesales', getemployeesales);

  const columns: TableColumnsType<any> = [
    { title: 'Date', dataIndex: 'createdAt' },
    { title: 'Employee Name', dataIndex: 'employeeName' },
    { title: 'Student Name', dataIndex: 'studentName' },
    { title: 'College Name', dataIndex: 'collegeName' },
    { title: 'Points', dataIndex: 'points' },
  ];

  return (
    <div>
      <Divider>Employee Sales</Divider>

      <Table
        columns={columns}
        dataSource={data?.data?.data || []}
        loading={isLoading}
        pagination={false}
        size="middle"
        rowKey="_id"
        style={{ height: '350px', overflowY: 'auto' }}
      />
    </div>
  );
}

export default EmployeeSales;

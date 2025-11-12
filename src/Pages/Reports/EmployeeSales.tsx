import { Divider, Table, type TableColumnsType } from "antd";
import { getemployeesales } from "../../Api/Lead/leadApi";
import { useQuery } from "react-query";

function EmployeeSales() {
  const { data, isLoading } = useQuery('employeesales', getemployeesales);

  const columns: TableColumnsType<any> = [
    {
      title: "Date",
      dataIndex: "date",
      render: (v: string) => new Date(v).toLocaleDateString(),
    },
    {
      title: "Employee Name",
      dataIndex: "employee_name",
    },
    {
      title: "Student Name",
      dataIndex: "student_name",
    },
    {
      title: "College Name",
      dataIndex: "college",
    },
    {
      title: "Points",
      dataIndex: "points",
      sorter: (a, b) => a.points - b.points,
    },
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
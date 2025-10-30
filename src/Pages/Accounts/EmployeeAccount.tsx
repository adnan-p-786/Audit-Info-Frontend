import { Divider, Table, type TableColumnsType } from "antd";
import { useQuery } from "react-query";
import { getUser } from "../../Api/User/userApi";

function EmployeeAccount() {

  const { data, isLoading } = useQuery("employees", getUser);


  const columns: TableColumnsType<any> = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
    },
    {
      title: 'Employee Name',
      dataIndex: "name",
    },
    {
      title: 'Credit/Debit',
      dataIndex: "",
    },
    {
      title: 'Points',
      dataIndex: "point_amount",
    },
    // {
    //   title: 'Debit',
    //   dataIndex: 'debit',
    //   render: (value: number) => (
    //     <span style={{ color: 'red' }}>{value}</span>
    //   )
    // },
    // {
    //   title: 'Credit',
    //   dataIndex: 'credit',
    //   render: (value: number) => (
    //     <span style={{ color: 'green' }}>{value}</span>
    //   )
    // }
  ];


  return (
   <div>
      <Divider>Employees Accounts</Divider>
      
      <Table
        columns={columns}
        style={{ height: '430px', overflowY: 'auto' }}
        pagination={false}
        dataSource={data?.data}
        loading={isLoading}
        size="middle"
        rowKey="_id"
      />

    </div>
  )
}

export default EmployeeAccount
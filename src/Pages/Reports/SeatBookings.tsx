import { Divider, Table, type TableColumnsType } from "antd"
import { useQuery } from "react-query";
import { getRegister } from "../../Api/Registration Table/registerTableApi";


function SeatBookings() {

  const { data, isLoading } = useQuery("student", getRegister);
  const FilteredData = data?.data.filter((item: any) => item.status === "foracknowledgment");


  const columns: TableColumnsType<any> = [
      {
        title: 'Date',
        dataIndex: 'createdAt',
      },
      {
        title: 'Student Name',
        dataIndex: "name",
      },
      {
        title: 'College Name',
        dataIndex: ['collegeId', 'college'],
      },
      {
        title: 'Course',
        dataIndex: "course",
      },
      {
        title: 'Booking Amount',
        dataIndex: "booking_amount",
      },
    ];

  return (
    <div>
      <Divider>Seat Bookings</Divider>

      <Table
        columns={columns}
        style={{ height: '350px', overflowY: 'auto' }}
        pagination={false}
        dataSource={FilteredData}
        loading={isLoading}
        size="middle"
        rowKey="_id"
      />

    </div>
  )
}

export default SeatBookings
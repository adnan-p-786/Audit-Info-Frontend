import { Button, Divider, Form, Input, message, Modal, Table, type TableColumnsType } from "antd";
import { useQuery } from "react-query";
import { getRegister } from "../../Api/Registration Table/registerTableApi";
import { setStudentHistory } from '../../Redux/leadSlice';
import { Link } from "react-router-dom";
import { GrView } from "react-icons/gr";
import { useDispatch } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import { useCreateRefund } from "../../Api/Registration Table/registerTableHooks";
import { useState } from "react";

function CancelledStudents() {

  const dispatch = useDispatch()

  const { data, isLoading } = useQuery('expense', getRegister)
  const Filtereddata = data?.data.filter((item: any) => item.cancel === true);
  const [refundModal, setrefundModal] = useState<string | any>(null)
  const { mutate: refund } = useCreateRefund()
  const [refundForm] = Form.useForm()

  const onConfirmRefund = (value: any) => {
    refund(
      {
        id: refundModal,
        data: { refundamount: value.refundamount }
      },
      {
        onSuccess() {
          message.success("Added successfully");
          setrefundModal(null);
          refundForm.resetFields();
        },
        onError() {
          message.error("Failed to add");
        }
      });
  };

  const columns: TableColumnsType<any> = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
    },
    {
      title: 'Student Name',
      dataIndex: 'name',
    },
    {
      title: 'Course',
      dataIndex: 'course',
    },
    {
      title: 'College',
      dataIndex: ['collegeId', 'college'],
    },
    {
      title: 'Action',
      render: (_, record: any) => (
        <div className="flex gap-3">
          <Link to='/studenthistory'>
            <Button type="primary" onClick={() => { dispatch(setStudentHistory(record)) }}><GrView /></Button>
          </Link>
          <Button type="primary" onClick={() => setrefundModal(record._id)} ><PlusOutlined /></Button>
        </div>
      )
    }
  ];
  
  return (
    <div>
      <Divider>Cancelled Students Reports</Divider>

      <Table
        columns={columns}
        style={{ height: '350px', overflowY: 'auto' }}
        pagination={false}
        dataSource={Filtereddata}
        loading={isLoading}
        size="middle"
        rowKey="_id"
      />

      <Modal
        open={!!refundModal}
        onCancel={() => {
          setrefundModal(false);
          refundForm.resetFields();

        }}
        width={250}
        title={
          <h1 className='text-center text-xl font-bold my-4'>Refund Amount</h1>

        }
        footer={null}
      >
        <Form layout='vertical' onFinish={onConfirmRefund} form={refundForm}>

          <Form.Item name={'refundamount'} rules={[{ required: true, message: "Please enter Booking Amount" }]}>
            <Input placeholder='Enter Amount' />
          </Form.Item>

          <Form.Item>
            <Button htmlType='submit' type="primary" className='w-full'>Submit</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default CancelledStudents
import { Button, Checkbox, Divider, Form, Input, message, Modal, Select, Table, type TableColumnsType } from 'antd';
import { useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { useQuery } from 'react-query';
import { getRegister } from '../../Api/Registration Table/registerTableApi';
import { getAgent } from '../../Api/Agent/agentApi';
import { getSchoolmanagement } from '../../Api/School Management/schoolManagementApi';
import { getCollegeManagement } from '../../Api/College Management/collegeMgmtApi';
import TextArea from 'antd/es/input/TextArea';
import { useCreateRefund, useCreateRegister, useDeleteRegister, useUpdateRegister } from '../../Api/Registration Table/registerTableHooks';
import { useCreateAddAmount } from '../../Api/Account/AccountHooks';
import { Link } from 'react-router-dom';
import { GrView } from 'react-icons/gr';
import { useDispatch } from 'react-redux';
import { setStudentHistory } from '../../Redux/leadSlice';
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

interface DataType {
  key: React.Key;
  name: string;
  address: string;
  agentId: string;
  schoolId: string;
  total_fee: number;
  recived_amount: number;
  createdAt: string;
  certificates: string;
  comment: string;
  commission: string;
  sRCId: string;
  phone_number: string;
  course: string;
  collegeId: string;
  _id: string;
}

function StudentManagement() {

  const dispatch = useDispatch()


  const columns: TableColumnsType<DataType> = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
    },
    {
      title: 'Student Name',
      dataIndex: 'name',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
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
      title: 'Balance',
      dataIndex: 'balance',
    },
    {
      title: 'Action',
      render: (_, record: any) => (
        <div className="flex gap-2">
          <Link to='/studenthistory'><Button onClick={() => {
            dispatch(setStudentHistory(record))
          }}><GrView /></Button></Link>
          <Button onClick={() => handleEdit(record)}>
            <CiEdit />
          </Button>
          <Button danger onClick={() => setdeleteModal(record._id)}>
            <CloseOutlined />
          </Button>
          <Button type='primary' onClick={() => setCollectAmountModal(record)}>Add Amount</Button>
        </div>
      )
    }
  ];

  const { data, isLoading, refetch } = useQuery('Register', getRegister)
  const { data: agentdata, isLoading: agentloading } = useQuery('agent', getAgent)
  const { data: schooldata, isLoading: schoolloading } = useQuery('school', getSchoolmanagement)
  const { data: collegedata, isLoading: collegeloading } = useQuery('college', getCollegeManagement)
  const [addModal, setAddModal] = useState(false)
  const [collectAmountModal, setCollectAmountModal] = useState<any>(false)
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setdeleteModal] = useState<string | any>(null)
  const [editingRecord, setEditingRecord] = useState<DataType | any>(null)
  const [refundModal, setrefundModal] = useState<DataType | any>(null)


  const { mutate: Create } = useCreateRegister()
  const { mutate: Update } = useUpdateRegister()
  const { mutate: Delete } = useDeleteRegister()
  const { mutate: collectamount } = useCreateAddAmount()
  const { mutate: refund } = useCreateRefund()

  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const [addamountForm] = Form.useForm()
  const [refundForm] = Form.useForm()

  const onFinish = (value: any) => {
    Create(value, {
      onSuccess() {
        message.success("Added successfully")
        refetch()
        setAddModal(false)
        form.resetFields()
      },
      onError() {
        message.error("Failed to add")
      }
    })
  }

  const onAddamount = (value: any) => {
    collectamount(
      {
        id: collectAmountModal._id,
        data: value
      },
      {
        onSuccess() {
          message.success("Added successfully")
          refetch()
          setCollectAmountModal(false)
          form.resetFields()
        },
        onError() {
          message.error("Failed to add")
        }
      })
  }

  const onUpdateFinish = (values: any) => {
    if (!editingRecord) return;

    const updateData = {
      ...values,
      _id: editingRecord._id
    };

    Update(updateData, {
      onSuccess: () => {
        message.success('Updated successfully');
        refetch();
        setEditModal(false);
        setEditingRecord(null);
        editForm.resetFields();
      },
      onError: () => {
        message.error('Failed to update');
      }
    });
  };

  const handleEdit = (record: DataType) => {
    setEditingRecord(record);
    setEditModal(true);

    editForm.setFieldsValue({
      name: record.name,
      phone_number: record.phone_number,
      address: record.address,
      course: record.course,
      total_fee: record.total_fee,
      recived_amount: record.recived_amount,
      certificates: record.certificates,
      comment: record.comment,
      commission: record.commission,
    });
  };

  const handleDelete = (_id: string) => {
    Delete(_id, {
      onSuccess: () => {
        message.success('Deleted successfully');
        refetch();
        setdeleteModal(null);
      },
      onError: () => {
        message.error('Failed to delete');
      }
    });
  };

  const handleCancelEdit = () => {
    setEditModal(false);
    setEditingRecord(null);
    editForm.resetFields();
  };

  const onCancelAmount = () => {
    setCollectAmountModal(false);
    addamountForm.resetFields();
  };

  const onCancelDelete = () => {
    setdeleteModal(null);
  };

  const onConfirmRefund = (value: any) => {
    refund(
      {
        id: refundModal._id,
        data: value
      },
      {
        onSuccess() {
          message.success("Added successfully");
          setrefundModal(false);
          refundForm.resetFields();
        },
        onError() {
          message.error("Failed to add");
        }
      });
  };

  return (
    <div>
      <Divider>Student Management</Divider>
      <div className="w-full flex gap-2 py-2 justify-end">
        <Button type='primary' onClick={() => setAddModal(true)}>Register</Button>
      </div>
      <Table
        columns={columns}
        style={{ height: '350px', overflowY: 'auto' }}
        pagination={false}
        dataSource={data?.data}
        loading={isLoading}
        size="middle"
        rowKey="_id"
      />
      <Modal
        title="Register"
        open={addModal}
        onCancel={() => setAddModal(false)}
        footer={null}
        width={1250}
      >
        <Form layout='vertical' onFinish={onFinish} form={form}>
          <div className="grid grid-flow-row grid-cols-3 gap-x-2">

            <Form.Item name={'name'} label="Name" rules={[{ required: true, message: "Please enter name" }]}>
              <Input placeholder='Name' />
            </Form.Item>

            <Form.Item
              name={'agentId'}
              label="Agent"
              rules={[{ required: true, message: "Please select Agent" }]}
            >
              <Select
                placeholder="Select Agent"
                options={
                  !agentloading && agentdata?.data.map((branch: { _id: string; name: string }) => ({
                    value: branch._id,
                    label: branch.name
                  }))
                }
              />
            </Form.Item>

            <Form.Item
              name={'schoolId'}
              label="School"
              rules={[{ required: true, message: "Please select School" }]}
            >
              <Select
                placeholder="Select School"
                options={
                  !schoolloading && schooldata?.data.map((school: { _id: string; name: string }) => ({
                    value: school._id,
                    label: school.name
                  }))
                }
              />
            </Form.Item>

            <Form.Item name={'address'} label="Address" rules={[{ required: true, message: "Please enter address" }]}>
              <Input placeholder='Address' />
            </Form.Item>

            <Form.Item name={'phone_number'} label="Phone Number" rules={[{ required: true, message: "Please enter Phone Number" }]}>
              <Input placeholder='Phone Number' />
            </Form.Item>

            <Form.Item
              name={'collegeId'}
              label="College"
              rules={[{ required: true, message: "Please select College" }]}
            >
              <Select
                placeholder="Select College"
                options={
                  !collegeloading && collegedata?.data.map((College: { _id: string; college: string }) => ({
                    value: College._id,
                    label: College.college
                  }))
                }
              />
            </Form.Item>

            <Form.Item name={'course'} label="Course" rules={[{ required: true, message: "Please enter Course" }]}>
              <Input placeholder='Enter Course' />
            </Form.Item>

            <Form.Item name={'booking_amount'} label="Booking Amount" rules={[{ required: true, message: "Please enter Booking Amount" }]}>
              <Input placeholder='Enter Amount' />
            </Form.Item>

            <Form.Item name={'total_fee'} label="Total Fee Amount" rules={[{ required: true, message: "Please enter Total Fee" }]}>
              <Input placeholder='Total Fee Amount' />
            </Form.Item>

            <Form.Item name={'recived_amount'} label="Recieved Amount" rules={[{ required: true, message: "Please enter Recieved Amount" }]}>
              <Input placeholder='Recieved Amount' />
            </Form.Item>

            <Form.Item
              name="certificates"
              label="Certificates"
              rules={[{ required: true, message: "Please select at least one certificate" }]}
            >
              <Checkbox.Group>
                <Checkbox value="SSLC">SSLC</Checkbox>
                <Checkbox value="Plus Two">Plus Two</Checkbox>
                <Checkbox value="TC">TC</Checkbox>
                <Checkbox value="CC">CC</Checkbox>
                <Checkbox value="Migration">Migration</Checkbox>
                <Checkbox value="Photo">Photo</Checkbox>
              </Checkbox.Group>
            </Form.Item>


            <Form.Item name={'comment'} label="Comment" rules={[{ required: true, message: "Please enter Comment" }]}>
              <TextArea rows={2} placeholder="comment" />
            </Form.Item>

            <Form.Item name={'commission'} label="Commission" rules={[{ required: true, message: "Please enter Salary" }]}>
              <Input placeholder='Commission' />
            </Form.Item>

          </div>
          <Form.Item>
            <Button htmlType='submit' type="primary" className='w-full'>Create</Button>
          </Form.Item>
        </Form>
      </Modal>


      <Modal
        title="Edit Branch Manager"
        open={editModal}
        onCancel={handleCancelEdit}
        footer={null}
        width={800}
      >
        <Form layout='vertical' onFinish={onUpdateFinish} form={editForm}>
          <div className="grid grid-flow-row grid-cols-3 gap-x-2">

            <Form.Item name={'name'} label="Name" rules={[{ required: true, message: "Please enter name" }]}>
              <Input placeholder='Name' />
            </Form.Item>

            <Form.Item
              name={'agentId'}
              label="Agent"
              rules={[{ required: true, message: "Please select Agent" }]}
            >
              <Select
                placeholder="Select Agent"
                options={
                  !agentloading && agentdata?.data.map((branch: { _id: string; name: string }) => ({
                    value: branch._id,
                    label: branch.name
                  }))
                }
              />
            </Form.Item>

            <Form.Item
              name={'schoolId'}
              label="School"
              rules={[{ required: true, message: "Please select School" }]}
            >
              <Select
                placeholder="Select School"
                options={
                  !schoolloading && schooldata?.data.map((branch: { _id: string; name: string }) => ({
                    value: branch._id,
                    label: branch.name
                  }))
                }
              />
            </Form.Item>

            <Form.Item name={'address'} label="Address" rules={[{ required: true, message: "Please enter address" }]}>
              <Input placeholder='Address' />
            </Form.Item>

            <Form.Item name={'phone_number'} label="Phone Number" rules={[{ required: true, message: "Please enter Phone Number" }]}>
              <Input placeholder='Phone Number' />
            </Form.Item>

            <Form.Item
              name={'collegeId'}
              label="College"
              rules={[{ required: true, message: "Please select College" }]}
            >
              <Select
                placeholder="Select College"
                options={
                  !collegeloading && collegedata?.data.map((branch: { _id: string; college: string }) => ({
                    value: branch._id,
                    label: branch.college
                  }))
                }
              />
            </Form.Item>

            <Form.Item name={'course'} label="Course" rules={[{ required: true, message: "Please enter Course" }]}>
              <Input placeholder='Enter Course' />
            </Form.Item>

            <Form.Item name={'total_fee'} label="Total Fee Amount" rules={[{ required: true, message: "Please enter Total Fee" }]}>
              <Input placeholder='Total Fee Amount' />
            </Form.Item>

            <Form.Item name={'recived_amount'} label="Recieved Amount" rules={[{ required: true, message: "Please enter Recieved Amount" }]}>
              <Input placeholder='Recieved Amount' />
            </Form.Item>

            <Form.Item
              name="certificates"
              label="Certificates"
              rules={[{ required: true, message: "Please select at least one certificate" }]}
            >
              <Checkbox.Group>
                <Checkbox value="SSLC">SSLC</Checkbox>
                <Checkbox value="Plus Two">Plus Two</Checkbox>
                <Checkbox value="TC">TC</Checkbox>
                <Checkbox value="CC">CC</Checkbox>
                <Checkbox value="Migration">Migration</Checkbox>
                <Checkbox value="Photo">Photo</Checkbox>
              </Checkbox.Group>
            </Form.Item>


            <Form.Item name={'comment'} label="Comment" rules={[{ required: true, message: "Please enter Comment" }]}>
              <TextArea rows={2} placeholder="comment" />
            </Form.Item>

            <Form.Item name={'commission'} label="Commission" rules={[{ required: true, message: "Please enter Salary" }]}>
              <Input placeholder='Commission' />
            </Form.Item>

          </div>
          <Form.Item>
            <Button htmlType='submit' type="primary" className='w-full'>Update</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add Amount"
        open={collectAmountModal}
        onCancel={onCancelAmount}
        footer={null}
        width={380}
      >
        <Form layout='vertical' onFinish={onAddamount} form={addamountForm}>
          <div>

            <Form.Item name={'credit'} label="Amount" rules={[{ required: true, message: "Please enter Amount" }]}>
              <Input placeholder='Amount' />
            </Form.Item>

            <Form.Item
              name="amount_type"
              label="Amount Type"
              rules={[{ required: true, message: "Please select Amount type" }]}
            >
              <Select placeholder="Select Amount type">
                <Select.Option value="cash">Cash</Select.Option>
                <Select.Option value="online">Bank</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item>
            <Button htmlType='submit' type="primary" className='w-full'>Submit</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={!!deleteModal}
        onCancel={() => {
          setdeleteModal(null);
          form.resetFields();
        }}
        footer={null}
        width={390}
        title={
          <div className="text-center">
            <ExclamationCircleOutlined style={{ fontSize: '70px', color: '#F68B1F' }} />
            <div className="mt-3 text-3xl font-bold my-5">Are you sure ?</div>
            <h1 className='my-7'>you want to delete ?</h1>
          </div>
        }
      >
        <Form>
          <Form.Item>
            <div className='flex gap-2'>
              <Button onClick={() => { setrefundModal(true); setdeleteModal(false) }} type='primary' className='w-50'>Refund it</Button>
              <Button onClick={() => deleteModal && handleDelete(deleteModal)} className='w-50' type='primary'>Yes, delete it!</Button>
              <Button onClick={onCancelDelete} danger type="primary" className='mx-2'>Cancel</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

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

export default StudentManagement
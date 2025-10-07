import { Button, Checkbox, Divider, Form, Input, message, Modal, Select, Table, type TableColumnsType } from 'antd';
import { useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import { useQuery } from 'react-query';
import { getRegister } from '../../Api/Registration Table/registerTableApi';
import { getAgent } from '../../Api/Agent/agentApi';
import { getSchoolmanagement } from '../../Api/School Management/schoolManagementApi';
import { getCollegeManagement } from '../../Api/College Management/collegeMgmtApi';
import TextArea from 'antd/es/input/TextArea';
import { useCreateRegister, useDeleteRegister, useUpdateRegister } from '../../Api/Registration Table/registerTableHooks';

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
      dataIndex: ['collegeId','college'],
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
    },
    {
      title: 'Action',
      render: (_, record: any) => (
        <div className="flex gap-2">
          <Button onClick={() => handleEdit(record)}>
            <CiEdit />
          </Button>
          <Button danger onClick={() => handleDelete(record._id)}>
            <MdDeleteOutline />
          </Button>
        </div>
      )
    }
  ];

  const { data, isLoading, refetch } = useQuery('Register', getRegister)
  const { data: agentdata, isLoading: agentloading } = useQuery('agent', getAgent)
  const { data: schooldata, isLoading: schoolloading } = useQuery('school', getSchoolmanagement)
  const { data: collegedata, isLoading: collegeloading } = useQuery('college', getCollegeManagement)
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState<DataType | null>(null)

  const { mutate: Create } = useCreateRegister()
  const { mutate: Update } = useUpdateRegister()
  const { mutate: Delete } = useDeleteRegister()

  const [form] = Form.useForm()
  const [editForm] = Form.useForm()

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
      phone_number:record.phone_number,
      address:record.address,
      course:record.course,
      total_fee:record.total_fee,
      recived_amount:record.recived_amount,
      certificates:record.certificates,
      comment:record.comment,
      commission:record.commission,
    });
  };

  const handleDelete = (_id: string) => {
    Delete(_id, {
      onSuccess: () => {
        message.success('Deleted successfully');
        refetch();
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
  return (
    <div>
      <Divider>Student Management</Divider>
      <div className="w-full flex justify-end">
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
                  !agentloading && agentdata?.data.map((branch: { _id: string; name:string }) => ({
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
                  !schoolloading && schooldata?.data.map((school: { _id: string; name:string }) => ({
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
                  !collegeloading && collegedata?.data.map(( College: { _id: string; college:string }) => ({
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
                  !agentloading && agentdata?.data.map((branch: { _id: string; name:string }) => ({
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
                  !schoolloading && schooldata?.data.map((branch: { _id: string; name:string}) => ({
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
                  !collegeloading && collegedata?.data.map((branch: { _id: string; college:string}) => ({
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

    </div>
  )
}

export default StudentManagement
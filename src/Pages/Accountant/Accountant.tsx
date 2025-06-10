import { Button, DatePicker, Divider, Form, Input, message, Modal, Switch, Table, type TableColumnsType } from "antd";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { useQuery } from "react-query";
import { getAccountant } from "../../Api/Accountant/AccountantApi";
import { useState } from "react";
import { useCreateAccountant, useDeleteAccountant, useUpdateAccountant } from "../../Api/Accountant/AccountantHooks";
import dayjs from 'dayjs';

interface DataType {
  key: React.Key;
  name: string;
  email: string;
  employee_code: string;
  phone_number: string;
  date_of_joining: string;
  address: string;
  status: boolean;
  _id: string;
}

function Accountant() {
  const columns: TableColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Employee Code',
      dataIndex: 'employee_code',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
    },
    {
      title: 'Date of Joining',
      dataIndex: 'date_of_joining',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: boolean) => (
        <span style={{ color: status ? 'green' : 'red', fontWeight: 500 }}>
          {status ? 'Registered' : 'Not Registered'}
        </span>
      )
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

  const { data, isLoading, refetch } = useQuery('accountant', getAccountant)
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState<DataType | null>(null)
  
  const { mutate: Create } = useCreateAccountant()
  const { mutate: Update } = useUpdateAccountant()
  const { mutate: Delete } = useDeleteAccountant()
  
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  
  console.log("Data from API:", data?.data);

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
    
    // Pre-fill the form with existing data
    editForm.setFieldsValue({
      name: record.name,
      email: record.email,
      employee_code: record.employee_code,
      phone_number: record.phone_number,
      address: record.address,
      status: record.status,
      date_of_joining: record.date_of_joining ? dayjs(record.date_of_joining) : null,
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
      <Divider>Accountant</Divider>
      <div className="w-full flex justify-end">
        <Button type='primary' onClick={() => setAddModal(true)}>Add</Button>
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

      {/* Add Modal */}
      <Modal
        title="Add Accountant"
        open={addModal}
        onCancel={() => setAddModal(false)}
        footer={null}
      >
        <Form layout='vertical' onFinish={onFinish} form={form}>
          <Form.Item name={'name'} label="Name" rules={[{ required: true, message: "Please enter name" }]}>
            <Input placeholder='Name' />
          </Form.Item>

          <Form.Item name={'email'} label="Email" rules={[{ required: true, message: "Please enter email" }]}>
            <Input placeholder='Email' />
          </Form.Item>

          <Form.Item name={'password'} label="Password" rules={[{ required: true, message: "Please enter password" }]}>
            <Input placeholder='Password' />
          </Form.Item>

          <Form.Item name={'employee_code'} label="Employee Code" rules={[{ required: true, message: "Please enter Employee Code" }]}>
            <Input placeholder='Employee Code' />
          </Form.Item>

          <Form.Item name={'phone_number'} label="Phone Number" rules={[{ required: true, message: "Please enter Phone Number" }]}>
            <Input placeholder='Phone Number' />
          </Form.Item>

          <Form.Item name={'status'} label="Status" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name={'date_of_joining'} label="Date of Joining" rules={[{ required: true, message: "Please enter Date of Joining" }]}>
            <DatePicker format="DD-MM-YYYY" className="w-full" />
          </Form.Item>

          <Form.Item name={'address'} label="Address" rules={[{ required: true, message: "Please enter address" }]}>
            <Input placeholder='Address' />
          </Form.Item>

          <Form.Item>
            <Button htmlType='submit' className='w-full'>Create</Button>
          </Form.Item>
        </Form>
      </Modal>

    
      <Modal
        title="Edit Accountant"
        open={editModal}
        onCancel={handleCancelEdit}
        footer={null}
      >
        <Form layout='vertical' onFinish={onUpdateFinish} form={editForm}>
          <Form.Item name={'name'} label="Name" rules={[{ required: true, message: "Please enter name" }]}>
            <Input placeholder='Name' />
          </Form.Item>

          <Form.Item name={'email'} label="Email" rules={[{ required: true, message: "Please enter email" }]}>
            <Input placeholder='Email' />
          </Form.Item>

          <Form.Item name={'employee_code'} label="Employee Code" rules={[{ required: true, message: "Please enter Employee Code" }]}>
            <Input placeholder='Employee Code' />
          </Form.Item>

          <Form.Item name={'phone_number'} label="Phone Number" rules={[{ required: true, message: "Please enter Phone Number" }]}>
            <Input placeholder='Phone Number' />
          </Form.Item>

          <Form.Item name={'status'} label="Status" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name={'date_of_joining'} label="Date of Joining" rules={[{ required: true, message: "Please enter Date of Joining" }]}>
            <DatePicker format="DD-MM-YYYY" className="w-full" />
          </Form.Item>

          <Form.Item name={'address'} label="Address" rules={[{ required: true, message: "Please enter address" }]}>
            <Input placeholder='Address' />
          </Form.Item>

          <Form.Item>
            <Button htmlType='submit' className='w-full' type="primary">Update</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Accountant
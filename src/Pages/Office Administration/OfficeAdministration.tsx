import { Button, DatePicker, Divider, Form, Input, message, Modal, Select, Switch, Table, type TableColumnsType } from "antd";
import { useMemo, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { useQuery } from "react-query";
import { getOfficeAdministration } from "../../Api/Office Administration/AdministrationApi";
import { getBranch } from "../../Api/Branch/branchApi";
import { useCreateOfficeAdministration, useDeleteOfficeAdministration, useUpdateOfficeAdministration } from "../../Api/Office Administration/AdministrationHooks";
import dayjs from 'dayjs';
import { SearchOutlined } from "@ant-design/icons";

interface DataType {
  key: React.Key;
  name: string;
  email: string;
  employee_code: string;
  phone_number: string;
  date_of_joining: string;
  address: string;
  head_administractor: Boolean;
  branchId: string;
  status: boolean;
  _id: string;
}

function OfficeAdministration() {
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
      dataIndex: 'createdAt',
    },
    {
      title: 'Branch Id',
      dataIndex: ['branchId', 'name'],
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Head Administration',
      dataIndex: 'head_administractor',
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

  const { data, isLoading, refetch } = useQuery('office Administration', getOfficeAdministration)
  const { data: branchdata, isLoading: branchloading } = useQuery('branch', getBranch)
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState<DataType | null>(null)
  const [searchText, setSearchText] = useState("");

  const { mutate: Create } = useCreateOfficeAdministration()
  const { mutate: Update } = useUpdateOfficeAdministration()
  const { mutate: Delete } = useDeleteOfficeAdministration()

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
      email: record.email,
      employee_code: record.employee_code,
      phone_number: record.phone_number,
      address: record.address,
      branchId: record.branchId,
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

   const filteredData = useMemo(() => {
      return data?.data?.filter((agent: any) =>
        agent.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }, [searchText, data]);

  return (
    <div className="p-2 sm:p-4 w-full">
      <Divider>Office Administrator</Divider>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mx-3 my-4">
        <Input
          placeholder="Search Administrator"
          style={{ width: "100%", maxWidth: 300 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          suffix={<SearchOutlined style={{ cursor: "pointer", color: "#888" }} />}
        />

        <Button type='primary' onClick={() => setAddModal(true)}>Add</Button>
      </div>
      <Table
        columns={columns}
        style={{ height: '350px', overflowY: 'auto' }}
        pagination={false}
        dataSource={filteredData}
        loading={isLoading}
        size="middle"
        rowKey="_id"
      />
      <Modal
        title="Add SRC"
        open={addModal}
        onCancel={() => setAddModal(false)}
        footer={null}
        width={800}
      >
        <Form layout='vertical' onFinish={onFinish} form={form}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

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

            <Form.Item name={'head_administractor'} label="Head Administration" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item name={'date_of_joining'} label="Date of Joining" rules={[{ required: true, message: "Please enter Date of Joining" }]}>
              <DatePicker format="DD-MM-YYYY" className="w-full" />
            </Form.Item>

            <Form.Item name={'address'} label="Address" rules={[{ required: true, message: "Please enter address" }]}>
              <Input placeholder='Address' />
            </Form.Item>

            <Form.Item
              name={'branchId'}
              label="Branch"
              rules={[{ required: true, message: "Please select a  branch" }]}
            >
              <Select
                placeholder="Select a branch"
                options={
                  !branchloading && branchdata?.data.map((branch: { _id: string; name:string}) => ({
                    label: branch.name,
                    value: branch._id
                  }))
                }
              />
            </Form.Item>
          </div>
          <Form.Item>
            <Button htmlType='submit' className='w-full' type="primary">Create</Button>
          </Form.Item>
        </Form>
      </Modal>


      <Modal
        title="Edit SRC"
        open={editModal}
        onCancel={handleCancelEdit}
        footer={null}
        width={800}
      >
        <Form layout='vertical' onFinish={onUpdateFinish} form={editForm}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

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

            <Form.Item name={'head_administractor'} label="Head Administractor" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item name={'date_of_joining'} label="Date of Joining" rules={[{ required: true, message: "Please enter Date of Joining" }]}>
              <DatePicker format="DD-MM-YYYY" className="w-full" />
            </Form.Item>

            <Form.Item name={'address'} label="Address" rules={[{ required: true, message: "Please enter address" }]}>
              <Input placeholder='Address' />
            </Form.Item>

            <Form.Item
              name={'branchId'}
              label="Branch"
              rules={[{ required: true, message: "Please select a  branch" }]}
            >
              <Select
                placeholder="Select a branch"
                options={
                  !branchloading && branchdata?.data.map((branch: { _id: string; name:string }) => ({
                    label: branch.name,
                    value: branch._id
                  }))
                }
              />
            </Form.Item>
          </div>
          <Form.Item>
            <Button htmlType='submit' className='w-full' type="primary">Update</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default OfficeAdministration
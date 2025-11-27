import { Button, Divider, Form, Input, message, Modal, Select, Table, type TableColumnsType } from 'antd';
import { useMemo, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import { useQuery } from 'react-query';
import { useCreateBranchManager, useDeleteBranchManager, useUpdateBranchManager } from '../../Api/Branch Manager/branchManagerHooks';
import { getBranchManager } from '../../Api/Branch Manager/branchManagerApi';
import { getBranch } from '../../Api/Branch/branchApi';
import { SearchOutlined } from '@ant-design/icons';

interface DataType {
  key: React.Key;
  name: string;
  email: string;
  branchId: string;
  employee_code: string;
  phone_number: string;
  point_amount: number;
  salary: number;
  address: string;
  status: boolean;
  _id: string;
}

function BranchManager() {

  const { data, isLoading, refetch } = useQuery('branchManager', getBranchManager)
  const { data: branchdata, isLoading: branchloading } = useQuery('branch', getBranch)
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState<DataType | null>(null)
  const [searchText, setSearchText] = useState("");

  const { mutate: Create } = useCreateBranchManager()
  const { mutate: Update } = useUpdateBranchManager()
  const { mutate: Delete } = useDeleteBranchManager()

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
      point_amount: record.point_amount,
      salary: record.salary,
      branchId: record.branchId,
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
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Branch ID',
      dataIndex: ['branchId', 'name'],
    },
    {
      title: 'Point Amount',
      dataIndex: 'point_amount',
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
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


  return (
    <div className="p-2 sm:p-4 w-full">
      <Divider>Branch Manager</Divider>

      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mx-3 my-4">
        <Input
          placeholder="Search Manager"
          style={{ width: "100%", maxWidth: 300 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          suffix={<SearchOutlined style={{ cursor: "pointer", color: "#888" }} />}
        />

        <Button
          type="primary"
          className="w-full sm:w-auto"
          onClick={() => setAddModal(true)}
        >
          Add
        </Button>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          pagination={false}
          dataSource={filteredData}
          loading={isLoading}
          size="middle"
          rowKey="_id"
        />
      </div>

      {/* ADD Modal */}
      <Modal
        title="Add Branch Manager"
        open={addModal}
        onCancel={() => setAddModal(false)}
        footer={null}
        width={800}
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input placeholder="Name" />
            </Form.Item>

            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item name="password" label="Password" rules={[{ required: true }]}>
              <Input placeholder="Password" />
            </Form.Item>

            <Form.Item name="employee_code" label="Employee Code" rules={[{ required: true }]}>
              <Input placeholder="Employee Code" />
            </Form.Item>

            <Form.Item name="phone_number" label="Phone Number" rules={[{ required: true }]}>
              <Input placeholder="Phone Number" />
            </Form.Item>

            <Form.Item name="address" label="Address" rules={[{ required: true }]}>
              <Input placeholder="Address" />
            </Form.Item>

            <Form.Item name="branchId" label="Branch" rules={[{ required: true }]}>
              <Select
                placeholder="Select a branch"
                options={
                  !branchloading &&
                  branchdata?.data.map((branch:{ _id: string, name: string; }) => ({
                    value: branch._id,
                    label: branch.name,
                  }))
                }
              />
            </Form.Item>

            <Form.Item name="point_amount" label="Point Amount" rules={[{ required: true }]}>
              <Input placeholder="Point Amount" />
            </Form.Item>

            <Form.Item name="salary" label="Salary" rules={[{ required: true }]}>
              <Input placeholder="Salary" />
            </Form.Item>

          </div>

          <Form.Item>
            <Button htmlType="submit" type="primary" className="w-full mt-2">
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* EDIT Modal */}
      <Modal
        title="Edit Branch Manager"
        open={editModal}
        onCancel={handleCancelEdit}
        footer={null}
        width={800}
      >
        <Form layout="vertical" onFinish={onUpdateFinish} form={editForm}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input placeholder="Name" />
            </Form.Item>

            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item name="password" label="Password" rules={[{ required: true }]}>
              <Input placeholder="Password" />
            </Form.Item>

            <Form.Item name="employee_code" label="Employee Code" rules={[{ required: true }]}>
              <Input placeholder="Employee Code" />
            </Form.Item>

            <Form.Item name="phone_number" label="Phone Number" rules={[{ required: true }]}>
              <Input placeholder="Phone Number" />
            </Form.Item>

            <Form.Item name="address" label="Address" rules={[{ required: true }]}>
              <Input placeholder="Address" />
            </Form.Item>

            <Form.Item name="branchId" label="Branch" rules={[{ required: true }]}>
             <Select
                placeholder="Select a branch"
                options={
                  !branchloading &&
                  branchdata?.data.map((branch:{ _id: string, name: string; }) => ({
                    value: branch._id,
                    label: branch.name,
                  }))
                }
              />
            </Form.Item>

            <Form.Item name="point_amount" label="Point Amount" rules={[{ required: true }]}>
              <Input placeholder="Point Amount" />
            </Form.Item>

            <Form.Item name="salary" label="Salary" rules={[{ required: true }]}>
              <Input placeholder="Salary" />
            </Form.Item>

          </div>

          <Form.Item>
            <Button htmlType="submit" type="primary" className="w-full mt-2">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>

  )
}

export default BranchManager
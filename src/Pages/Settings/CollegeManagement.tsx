import { Button, Divider, Form, Input, message, Modal, Select, Switch, Table, type TableColumnsType } from 'antd';
import { useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import { useQuery } from 'react-query';
import { getCollegeManagement } from '../../Api/College Management/collegeMgmtApi';
import { useCreateCollegeManagement, useDeleteCollegeManagement, useUpdateCollegeManagement } from '../../Api/College Management/collegeMgmtHooks';
import { getBranch } from '../../Api/Branch/branchApi';

interface DataType {
  key: React.Key;
  college: string;
  city: string;
  state: string;
  category: string;
  branchId: string;
  bm_point: Number;
  src_point: number;
  sro_point: number;
  status: boolean;
  _id: string;
}


function CollegeManagement() {
  const columns: TableColumnsType<DataType> = [
    {
      title: 'College',
      dataIndex: 'college',
    },
    {
      title: 'City',
      dataIndex: 'city',
    },
    {
      title: 'State',
      dataIndex: 'state',
    },
    {
      title: 'Category',
      dataIndex: 'category',
    },
    {
      title: 'BranchId',
      dataIndex: 'branchId',
    },
    {
      title: 'Src Point',
      dataIndex: 'src_point',
    },
    {
      title: 'SroPoint',
      dataIndex: 'sro_point',
    },
    {
      title: 'Bm Point',
      dataIndex: 'bm_point',
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

  const { data, isLoading, refetch } = useQuery('collegeManagement', getCollegeManagement)
  const { data: branchdata, isLoading: branchloading } = useQuery('branch', getBranch)
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState<DataType | null>(null)

  const { mutate: Create } = useCreateCollegeManagement()
  const { mutate: Update } = useUpdateCollegeManagement()
  const { mutate: Delete } = useDeleteCollegeManagement()

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
      college: record.college,
      city: record.city,
      state: record.state,
      category: record.category,
      branchId: record.branchId,
      bm_point: record.bm_point,
      src_point: record.src_point,
      sro_point: record.sro_point,
      status: record.status,
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
      <Divider>College Management</Divider>
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


      <Modal
        title="Add College Management"
        open={addModal}
        onCancel={() => setAddModal(false)}
        footer={null}
        width={800}
      >
        <Form layout='vertical' onFinish={onFinish} form={form}>
          <div className="grid grid-flow-row grid-cols-2 gap-x-2">

            <Form.Item name={'college'} label="College" rules={[{ required: true, message: "Please enter College" }]}>
              <Input placeholder='College' />
            </Form.Item>

            <Form.Item name={'city'} label="city" rules={[{ required: true, message: "Please enter City" }]}>
              <Input placeholder='City' />
            </Form.Item>

            <Form.Item name={'state'} label="state" rules={[{ required: true, message: "Please enter State" }]}>
              <Input placeholder='State' />
            </Form.Item>

            <Form.Item name={'category'} label="category" rules={[{ required: true, message: "Please enter Category" }]}>
              <Input placeholder='Category' />
            </Form.Item>

            <Form.Item
              name={'branchId'}
              label="Branch"
              rules={[{ required: true, message: "Please select a  branch" }]}
            >
              <Select
                placeholder="Select a branch"
                options={
                  !branchloading && branchdata?.data.map((branch: { _id: string; }) => ({
                    value: branch._id
                  }))
                }
              />
            </Form.Item>

            <Form.Item name={'status'} label="Status" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item name={'bm_point'} label="bm point" rules={[{ required: true, message: "Please enter bm point" }]}>
              <Input placeholder='bm point' />
            </Form.Item>

            <Form.Item name={'src_point'} label="src point" rules={[{ required: true, message: "Please enter src point" }]}>
              <Input placeholder='src point' />
            </Form.Item>

            <Form.Item name={'sro_point'} label="sro point" rules={[{ required: true, message: "Please enter sro point" }]}>
              <Input placeholder='sro point' />
            </Form.Item>

          </div>
          <Form.Item>
            <Button htmlType='submit' type="primary" className='w-full'>Create</Button>
          </Form.Item>
        </Form>
      </Modal>


      <Modal
        title="Edit College Management"
        open={editModal}
        onCancel={handleCancelEdit}
        footer={null}
        width={800}
      >
        <Form layout='vertical' onFinish={onUpdateFinish} form={editForm}>
          <div className="grid grid-flow-row grid-cols-2 gap-x-2">

            <Form.Item name={'college'} label="College" rules={[{ required: true, message: "Please enter College" }]}>
              <Input placeholder='College' />
            </Form.Item>

            <Form.Item name={'city'} label="city" rules={[{ required: true, message: "Please enter City" }]}>
              <Input placeholder='City' />
            </Form.Item>

            <Form.Item name={'state'} label="state" rules={[{ required: true, message: "Please enter State" }]}>
              <Input placeholder='State' />
            </Form.Item>

            <Form.Item name={'category'} label="category" rules={[{ required: true, message: "Please enter Category" }]}>
              <Input placeholder='Category' />
            </Form.Item>

            <Form.Item
              name={'branchId'}
              label="Branch"
              rules={[{ required: true, message: "Please select a  branch" }]}
            >
              <Select
                placeholder="Select a branch"
                options={
                  !branchloading && branchdata?.data.map((branch: { _id: string; }) => ({
                    value: branch._id
                  }))
                }
              />
            </Form.Item>

            <Form.Item name={'status'} label="Status" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item name={'bm_point'} label="bm point" rules={[{ required: true, message: "Please enter bm point" }]}>
              <Input placeholder='bm point' />
            </Form.Item>

            <Form.Item name={'src_point'} label="src point" rules={[{ required: true, message: "Please enter src point" }]}>
              <Input placeholder='src point' />
            </Form.Item>

            <Form.Item name={'sro_point'} label="sro point" rules={[{ required: true, message: "Please enter sro point" }]}>
              <Input placeholder='sro point' />
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

export default CollegeManagement
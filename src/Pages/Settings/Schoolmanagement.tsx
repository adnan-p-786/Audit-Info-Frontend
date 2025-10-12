import { Button, Divider, Form, Input, message, Modal, Select, Table, type TableColumnsType } from 'antd';
import { useMemo, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import { useQuery } from 'react-query';
import { getSchoolmanagement } from '../../Api/School Management/schoolManagementApi';
import { getBranch } from '../../Api/Branch/branchApi';
import { useCreateSchoolmanagement, useDeleteSchoolmanagement, useUpdateSchoolmanagement } from '../../Api/School Management/schoolManagementHooks';

interface DataType {
  key: React.Key;
  name: string;
  school_code: string;
  branchId: string;
  _id: string;
}


function Schoolmanagement() {
  const columns: TableColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'School Code',
      dataIndex: 'school_code',
    },
    {
      title: 'Branch Name',
      dataIndex: ['branchId', 'name'],
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

  const { data, isLoading, refetch } = useQuery('schoolManagement', getSchoolmanagement)
  const { data: branchdata, isLoading: branchloading } = useQuery('branch', getBranch)
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState<DataType | null>(null)
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

  const { mutate: Create } = useCreateSchoolmanagement()
  const { mutate: Update } = useUpdateSchoolmanagement()
  const { mutate: Delete } = useDeleteSchoolmanagement()

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
      school_code: record.school_code,
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
    let filtered = data?.data;
    if (selectedSchool) {
      filtered = filtered?.filter((sro: any) => sro?._id === selectedSchool || sro._id === selectedSchool)
    }
    return filtered;
  }, [selectedSchool])

  return (
    <div>
      <Divider>School Management</Divider>
      <div className='justify-between flex mx-3 my-4'>
        <Select
          placeholder="Filter by Name"
          allowClear
          style={{ width: 200 }}
          value={selectedSchool}
          onChange={(value) => setSelectedSchool(value)}
          options={
            data?.data.map((sro: { _id: string; name: string }) => ({
              value: sro._id,
              label: sro.name,
            }))
          }
          loading={isLoading}
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
        title="Add School Management"
        open={addModal}
        onCancel={() => setAddModal(false)}
        footer={null}
        width={800}
      >
        <Form layout='vertical' onFinish={onFinish} form={form}>
          <div className="grid grid-flow-row grid-cols-2 gap-x-2">

            <Form.Item name={'name'} label="Name" rules={[{ required: true, message: "Please enter Name" }]}>
              <Input placeholder='Name' />
            </Form.Item>

            <Form.Item name={'school_code'} label="School Code" rules={[{ required: true, message: "Please enter School Code" }]}>
              <Input placeholder='School Code' />
            </Form.Item>

            <Form.Item
              name={'branchId'}
              label="Branch"
              rules={[{ required: true, message: "Please select a  branch" }]}
            >
              <Select
                placeholder="Select a branch"
                options={
                  !branchloading && branchdata?.data.map((branch: { _id: string; name: string }) => ({
                    value: branch._id,
                    label: branch.name
                  }))
                }
              />
            </Form.Item>

          </div>
          <Form.Item>
            <Button htmlType='submit' type="primary" className='w-full'>Create</Button>
          </Form.Item>
        </Form>
      </Modal>


      <Modal
        title="Edit School Management"
        open={editModal}
        onCancel={handleCancelEdit}
        footer={null}
        width={800}
      >
        <Form layout='vertical' onFinish={onUpdateFinish} form={editForm}>
          <div className="grid grid-flow-row grid-cols-2 gap-x-2">

            <Form.Item name={'name'} label="Name" rules={[{ required: true, message: "Please enter Name" }]}>
              <Input placeholder='Name' />
            </Form.Item>

            <Form.Item name={'school_code'} label="School Code" rules={[{ required: true, message: "Please enter School Code" }]}>
              <Input placeholder='School Code' />
            </Form.Item>

            <Form.Item
              name={'branchId'}
              label="Branch"
              rules={[{ required: true, message: "Please select a  branch" }]}
            >
              <Select
                placeholder="Select a branch"
                options={
                  !branchloading && branchdata?.data.map((branch: { _id: string; name: string }) => ({
                    value: branch._id,
                    label: branch.name
                  }))
                }
              />
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

export default Schoolmanagement
import { Button, Divider, Form, Input, message, Modal, Select, Switch, Table, type TableColumnsType } from 'antd';
import { useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import { useQuery } from 'react-query';
import { useCreateBranch, useDeleteBranch, useUpdateBranch } from '../../Api/Branch/branchHooks';
import { getBranch } from '../../Api/Branch/branchApi';

interface DataType {
  key: React.Key;
  name: string;
  code: string;
  status: boolean;
  _id: string;
}

function BranchManagement() {
   const columns: TableColumnsType<DataType> = [
      {
        title: 'Branch Name',
        dataIndex: 'name',
      },
      {
        title: 'Code',
        dataIndex: 'code',
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
  
    const { data, isLoading, refetch } = useQuery('branch', getBranch)
    const [addModal, setAddModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [editingRecord, setEditingRecord] = useState<DataType | null>(null)
  
    const { mutate: Create } = useCreateBranch()
    const { mutate: Update } = useUpdateBranch()
    const { mutate: Delete } = useDeleteBranch()
  
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
        code: record.code,
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
      <Divider>Branch Management</Divider>
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
        title="Add Branch Management"
        open={addModal}
        onCancel={() => setAddModal(false)}
        footer={null}
        width={800}
      >
        <Form layout='vertical' onFinish={onFinish} form={form}>
          <div className="grid grid-flow-row grid-cols-2 gap-x-2">

            <Form.Item name={'name'} label="Branch Name" rules={[{ required: true, message: "Please enter Branch Name" }]}>
              <Input placeholder='Branch Name' />
            </Form.Item>

            <Form.Item name={'code'} label="code" rules={[{ required: true, message: "Please enter Code" }]}>
              <Input placeholder='Code' />
            </Form.Item>

            <Form.Item name={'status'} label="Status" valuePropName="checked">
              <Switch />
            </Form.Item>

          </div>
          <Form.Item>
            <Button htmlType='submit' type="primary" className='w-full'>Create</Button>
          </Form.Item>
        </Form>
      </Modal>


      <Modal
        title="Edit Branch Management"
        open={editModal}
        onCancel={handleCancelEdit}
        footer={null}
        width={800}
      >
        <Form layout='vertical' onFinish={onUpdateFinish} form={editForm}>
          <div className="grid grid-flow-row grid-cols-2 gap-x-2">

            <Form.Item name={'name'} label="Branch Name" rules={[{ required: true, message: "Please enter Branch Name" }]}>
              <Input placeholder='Branch Name' />
            </Form.Item>

            <Form.Item name={'code'} label="code" rules={[{ required: true, message: "Please enter Code" }]}>
              <Input placeholder='Code' />
            </Form.Item>

            <Form.Item name={'status'} label="Status" valuePropName="checked">
              <Switch />
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

export default BranchManagement
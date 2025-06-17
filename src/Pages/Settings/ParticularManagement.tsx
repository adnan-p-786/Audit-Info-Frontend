import { Button, Divider, Form, Input, message, Modal, Table, type TableColumnsType } from "antd";
import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { useQuery } from "react-query";
import { useCreateParticular, useDeleteParticular, useUpdateParticular } from '../../Api/Particular/particularHooks';
import { getParticular } from '../../Api/Particular/particularApi';


interface DataType {
  key: React.Key;
  name: string;
  _id: string;
}
function ParticularManagement() {
  const columns: TableColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
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

  const { data, isLoading, refetch } = useQuery('particular', getParticular)
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState<DataType | null>(null)

  const { mutate: Create } = useCreateParticular()
  const { mutate: Update } = useUpdateParticular()
  const { mutate: Delete } = useDeleteParticular()

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
      name: record.name
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
      <Divider>Particulars</Divider>
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
        title="Add Particular"
        open={addModal}
        onCancel={() => setAddModal(false)}
        footer={null}
        width={400}
      >
        <Form layout='vertical' onFinish={onFinish} form={form}>
          <div className="">
            <Form.Item name={'name'} label="Name" rules={[{ required: true, message: "Please enter name" }]}>
              <Input placeholder='Name' />
            </Form.Item>
          </div>
          <Form.Item>
            <Button htmlType='submit' className='w-full' type="primary">Create</Button>
          </Form.Item>
        </Form>
      </Modal>


      <Modal
        title="Edit Particular"
        open={editModal}
        onCancel={handleCancelEdit}
        footer={null}
        width={400}
      >
        <Form layout='vertical' onFinish={onUpdateFinish} form={editForm}>
          <div className="">

            <Form.Item name={'name'} label="Name" rules={[{ required: true, message: "Please enter name" }]}>
              <Input placeholder='Name' />
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

export default ParticularManagement
import { Button, Divider, Form, Input, message, Modal, Select, Table, type TableColumnsType } from 'antd';
import { useState } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import { useQuery } from 'react-query';
import { getExpense } from '../../Api/Expense/ExpenseApi';
import { useCreateExpense, useDeleteExpense } from '../../Api/Expense/ExpenseHooks';
import { getParticular } from '../../Api/Particular/particularApi';


function Expense() {
     const columns: TableColumnsType<any> = [
        {
          title: 'Date',
          dataIndex: 'createdAt',
        },
        {
          title: 'Particular',
          dataIndex: ['particularId', '_id'],
        },
        {
          title: 'Comment',
          dataIndex: 'comment',
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
        },
        {
          title: 'Action',
          render: (_, record: any) => (
            <div>
              <Button danger onClick={() => handleDelete(record._id)}>
                <MdDeleteOutline />
              </Button>
            </div>
          )
        }
      ];
    
      const { data, isLoading, refetch } = useQuery('expense', getExpense)
      const { data: particulardata, isLoading: particularloading } = useQuery('particular',getParticular)
      const [addModal, setAddModal] = useState(false)    
      const { mutate: Create } = useCreateExpense()
      const { mutate: Delete } = useDeleteExpense()
    
      const [form] = Form.useForm()
    
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
  return (
    <div>
      <Divider>Expense</Divider>
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
        title="Add Expense"
        open={addModal}
        onCancel={() => setAddModal(false)}
        footer={null}
        width={400}
      >
        <Form layout='vertical' onFinish={onFinish} form={form}>
          <div className="">

            <Form.Item name={'amount'} label="Amount" rules={[{ required: true, message: "Please enter amount   " }]}>
              <Input placeholder='Amount' />
            </Form.Item>

            <Form.Item name={'comment'} label="Comment" rules={[{ required: true, message: "Please enter Comment" }]}>
              <Input placeholder='Comment' />
            </Form.Item>

            <Form.Item
              name={'particularId'}
              label="Particular"
              rules={[{ required: true, message: "Please select a particular" }]}
            >
              <Select
                placeholder="Select a Particular"
                options={
                  !particularloading && particulardata?.data.map((particular: { _id: string; }) => ({
                    value: particular._id,
                    label : particular._id
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
    </div>
  )
}

export default Expense
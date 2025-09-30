import { Button, Divider, Form, Input, message, Modal, Select, Table, type TableColumnsType } from 'antd';
import { useMemo, useState } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import { useQuery } from 'react-query';
import { getExpense } from '../../Api/Expense/ExpenseApi';
import { useCreateExpense, useDeleteExpense } from '../../Api/Expense/ExpenseHooks';
import { getParticular } from '../../Api/Particular/particularApi';
import { getBranch } from '../../Api/Branch/branchApi';


function Expense() {
  const columns: TableColumnsType<any> = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
    },
    {
      title: 'Particular',
      dataIndex: ['particularId', 'name'],
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
  const { data: particulardata, isLoading: particularloading } = useQuery('particular', getParticular)
  const { data: branchdata, isLoading: branchloading } = useQuery('branch', getBranch)
  const [addModal, setAddModal] = useState(false)
  const { mutate: Create } = useCreateExpense()
  const { mutate: Delete } = useDeleteExpense()

  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);


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



const filteredData = useMemo(()=>{
  let filtered = data?.data;
  if(selectedBranch){
    filtered = filtered?.filter((expense: any) => expense.branchId?._id === selectedBranch || expense.branchId === selectedBranch)
  }
  return filtered;
},[selectedBranch])

  return (
    <div>
      <Divider>Expense</Divider>

      <div className="w-full flex justify-end p-4">

        <div className='px-4'>
        <Select
          placeholder="Filter by Branch"
          allowClear
          style={{ width: 200 }}
          value={selectedBranch || undefined}
          onChange={(value) => setSelectedBranch(value)}
          options={
            branchdata?.data.map((branch: { _id: string; name: string }) => ({
              value: branch._id,
              label: branch.name,
            }))
          }
          loading={branchloading}
        />

      </div>
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
                  !particularloading && particulardata?.data.map((particular: { name: string; }) => ({
                    value: particular.name,
                    label: particular.name
                  }))
                }
              />
            </Form.Item>

            <Form.Item
              name={'branchId'}
              label="Branch"
              rules={[{ required: true, message: "Please select a branch" }]}
            >
              <Select
                placeholder="Select a branch"
                options={
                  !branchloading && branchdata?.data.map((branch: { name: string; }) => ({
                    value: branch.name,
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
    </div>
  )
}

export default Expense
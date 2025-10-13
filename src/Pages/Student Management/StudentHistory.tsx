import { Button, Form, Input, message, Modal, Select, Switch, Table, type TableColumnsType } from "antd"
import { useSelector } from "react-redux"
import { getCollegeFees } from "../../Api/CollegeFees/collegeFeesApi"
import { useQuery } from "react-query"
import { useState } from "react"
import { useCreateCollegeFees } from "../../Api/CollegeFees/CollegeFeesHooks"
import { getParticular } from "../../Api/Particular/particularApi"



function StudentHistory() {
  const studentdata = useSelector((state: any) => state?.studentHistory?.studentHistory)
  const { data, isLoading, refetch } = useQuery('student', getCollegeFees)
  const { data: particulardata, isLoading: particularloading } = useQuery('particular', getParticular)

  const [addcollegefees, setAddCollegeFees] = useState(false)
  const [addFeeform] = Form.useForm()
  const { mutate: addfees } = useCreateCollegeFees()

  const onFinish = (value: any) => {
    addfees(value, {
      onSuccess() {
        message.success("Added successfully")
        refetch()
        setAddCollegeFees(false)
        addFeeform.resetFields()
      },
      onError() {
        message.error("Failed to add")
      }
    })
  }

  const columns: TableColumnsType<any> = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Particular',
      dataIndex: ['particularId', 'name'],
    },
    {
      title: 'Paid',
      dataIndex: '',
    },
    {
      title: 'Action',
      render: () => <a></a>,
    }
  ];

  return (
    <div>
      <div className="flex">
        <div className="w-[50%]">
          <h1 className='font-semibold text-md'>Student Name: <span className="font-normal text-sm">{studentdata?.name}</span></h1>
          <h1 className='font-semibold text-md'>Address: <span className="font-normal text-sm">{studentdata?.address}</span></h1>
          <h1 className='font-semibold text-md'>School: <span className="font-normal text-sm">{studentdata?.schoolId?.name}</span></h1>
          <h1 className='font-semibold text-md'>Phone Number: <span className="font-normal text-sm">{studentdata?.phone_number}</span></h1>
          <h1 className="font-semibold text-md">Certificates:{" "}<span className="font-normal text-sm">{studentdata?.certificates?.join(", ")}</span></h1>
        </div>
        <div className="w-[50%]">
          <h1 className="font-semibold text-md">College: <span className="font-normal text-sm">{studentdata?.collegeId?.college}</span></h1>
          <h1 className="font-semibold text-md">Course: <span className="font-normal text-sm">{studentdata?.course}</span></h1>
          <h1 className="font-semibold text-md">SRC: <span className="font-normal text-sm">{studentdata?.srcId?.name}</span></h1>
          <h1 className="font-semibold text-md">SRO: <span className="font-normal text-sm">{studentdata?.sroId?.name}</span></h1>
          <h1 className="font-semibold text-md">Branch: <span className="font-normal text-sm">{studentdata?.branchId?.name}</span></h1>
          <h1 className="font-semibold text-md">Comment: <span className="font-normal text-sm">{studentdata?.comment}</span></h1>
        </div>
      </div>
      <div className="text-center my-4">
        <h1 className="underline font-bold">College Fee</h1>
        <h1 className="font-bold">Total Fee: </h1>
        <h1 className="font-bold">Fee balance:</h1>
      </div>

      <div>
        <Button type="primary" className="mb-4" onClick={() => setAddCollegeFees(true)} >Add Fees</Button>
        <Table
          columns={columns}
          style={{ height: '200px', overflowY: 'auto', width: '60%' }}
          pagination={false}
          dataSource={data?.data}
          loading={isLoading}
          size="small"
          rowKey="_id"
        />
      </div>

      <Modal
        title="Add Fees"
        open={addcollegefees}
        onCancel={() => setAddCollegeFees(false)}
        footer={null}
        width={400}
      >
        <Form layout='vertical' onFinish={onFinish} form={addFeeform}>
          <div>
            <Form.Item
              name={'particularId'}
              label="Particular"
              rules={[{ required: true, message: "Please select Agent" }]}
            >
              <Select
                placeholder="Select Particular"
                options={
                  !particularloading && particulardata?.data.map((particular: { _id: string; name: string }) => ({
                    value: particular._id,
                    label: particular.name
                  }))
                }
              />
            </Form.Item>

            <Form.Item name={'amount'} label="Amount" rules={[{ required: true, message: "Please enter amount" }]}>
              <Input placeholder='Amount' />
            </Form.Item>

            <Form.Item
              name="amount_type"
              label="Amount Type"
              rules={[{ required: true, message: "Please select amount type" }]}
            >
              <Select placeholder="Select payment type">
                <Select.Option value="cash">Cash</Select.Option>
                <Select.Option value="online">Bank</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name={'directPay'} label="Direct Pay" valuePropName="checked">
              <Switch />
            </Form.Item>

          </div>
          <Form.Item>
            <Button htmlType='submit' type="primary" className='w-full'>Submit</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default StudentHistory
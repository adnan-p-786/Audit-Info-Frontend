import { Button, Form, Input, message, Modal, Select, Switch, Table, Tag, type TableColumnsType } from "antd"
import { useSelector } from "react-redux"
import { getCollegeFees } from "../../Api/CollegeFees/collegeFeesApi"
import { useQuery } from "react-query"
import { useState } from "react"
import { useCreateCollegeFees, useDeleteCollegeFees } from "../../Api/CollegeFees/CollegeFeesHooks"
import { getParticular } from "../../Api/Particular/particularApi"
import { useCreateServiceCharge, useDeleteAccount } from "../../Api/Account/AccountHooks"
import { getServiceCharge } from "../../Api/Account/AccountApi"
import { MdDeleteOutline } from "react-icons/md"



function StudentHistory() {
  const studentdata = useSelector((state: any) => state?.studentHistory?.studentHistory)
  console.log({ studentdata });

  const { data, isLoading, refetch } = useQuery('student', () => getCollegeFees(studentdata._id))
  const { data: particulardata, isLoading: particularloading } = useQuery('particular', getParticular)
  const { data: servicechargedata, isLoading: servicechargeloading, isRefetching:reload} = useQuery('servicecharge', () => getServiceCharge(studentdata._id))

  const [addcollegefees, setAddCollegeFees] = useState<any>(false)
  const [addserviceCharge, setAddserviceCharge] = useState<any>(false)
  const [addFeeform] = Form.useForm()
  const [addServiceChargeform] = Form.useForm()
  const { mutate: addfees } = useCreateCollegeFees()
  const { mutate: serviceCharge } = useCreateServiceCharge()
  const { mutate: Delete } = useDeleteCollegeFees()
  const { mutate: DeleteServiceCharge } = useDeleteAccount()

  const onFinish = (value: any) => {
    addfees({
      id: studentdata._id,
      data: {
        ...value,
        collegeId: studentdata.collegeId,
      },
    },
      {
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

  const onFinishServiceCharge = (value: any) => {
    serviceCharge(
      {
        id: studentdata._id,
        data: value
      },
      {
        onSuccess() {
          message.success("Added successfully")
          reload
          setAddserviceCharge(false)
          addServiceChargeform.resetFields()
        },
        onError() {
          message.error("Failed to add")
        }
      }
    )
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

  const handleDeleteServiceCharge = (_id: string) => {
    DeleteServiceCharge(_id, {
      onSuccess: () => {
        message.success('Deleted successfully');
        refetch();
      },
      onError: () => {
        message.error('Failed to delete');
      }
    });
  };


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
      dataIndex: 'directPay',
      render: (directPay) => {
        if (directPay === true) return <Tag color="green">Paid</Tag>;
        if (directPay === false) return <Tag color="red">Unpaid</Tag>;
      },
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

  const servicecolumns: TableColumnsType<any> = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
    },
    {
      title: 'Amount',
      dataIndex: 'credit',
    },
    {
      title: 'Action',
      render: (_, record: any) => (
        <div>
          <Button danger onClick={() => handleDeleteServiceCharge(record._id)}>
            <MdDeleteOutline />
          </Button>
        </div>
      )
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
      <div className="flex my-4 justify-between">
        <div>
          <h1 className="underline font-bold mx-8">College Fee</h1>
          <h1 className="font-bold">Total Fee: </h1>
          <h1 className="font-bold">Fee Balance:</h1>
        </div>
        <div className="mx-15">
          <h1 className="underline font-bold mx-8">Service</h1>
          <h1 className="font-bold">Total Service Charge: </h1>
          <h1 className="font-bold">Service Balance:</h1>
        </div>
      </div>
      <div className="flex justify-between">
        <Button type="primary" className="mb-4" onClick={() => setAddCollegeFees(true)} >Add Fees</Button>
        <Button type="primary" className="mb-4" onClick={() => setAddserviceCharge(true)} >Add Service Amount</Button>
      </div>
      <div className="flex gap-5">
        <Table
          columns={columns}
          style={{ height: '200px', overflowY: 'auto', width: '60%' }}
          pagination={false}
          dataSource={data?.data}
          loading={isLoading}
          size="small"
          rowKey="_id"
        />

        <Table
          columns={servicecolumns}
          style={{ height: '200px', overflowY: 'auto', width: '60%' }}
          pagination={false}
          dataSource={servicechargedata?.data}
          loading={servicechargeloading}
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

            <Form.Item name="directPay" label="Direct Pay" valuePropName="checked" initialValue={false}>
              <Switch />
            </Form.Item>


          </div>
          <Form.Item>
            <Button htmlType='submit' type="primary" className='w-full'>Submit</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add Service Charge"
        open={addserviceCharge}
        onCancel={() => setAddserviceCharge(false)}
        footer={null}
        width={400}
      >
        <Form layout='vertical' onFinish={onFinishServiceCharge} form={addServiceChargeform}>
          <div>

            <Form.Item name={'credit'} label="Amount" rules={[{ required: true, message: "Please enter amount" }]}>
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
import { Button, Divider, Form, Input, message, Modal, Select, Table, type TableColumnsType } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import { getAgentAccount } from "../../Api/Agent Accounts/agentAccountApi";
import { getAgent } from "../../Api/Agent/agentApi";
import { getRegister } from "../../Api/Registration Table/registerTableApi";
import { useCreateAgentAccount } from "../../Api/Agent Accounts/agentAccountHooks";



function AgentAccount() {

  const { data, isLoading, refetch } = useQuery('agentAccount', getAgentAccount)
  const { data: agentData, isLoading: agentloading } = useQuery('agent', getAgent);
  const { data: registerData, isLoading: registerloading } = useQuery('register', getRegister);

  const [addModal, setAddModal] = useState<any>(false);

  const { mutate: Create } = useCreateAgentAccount()

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

  const columns: TableColumnsType<any> = [
    {
      title: 'SI.NO',
      render: (_text, _record, index) => index + 1,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
    },
    {
      title: 'Student Name',
      dataIndex: ['registrationId', 'name'],
    },
    {
      title: 'Agent',
      dataIndex: ['agentId', 'name'],
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render: (type: string) => (
        <span
          style={{
            color: type === 'Credit' ? 'green' : 'red',
            fontWeight: 500,
          }}
        >
          {type}
        </span>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    }
  ];

  return (
    <div>
      <Divider>Agent Account</Divider>
      <div className="flex justify-end my-3 mx-10">
        <Button onClick={() => setAddModal(true)} htmlType='submit' type="primary">Add</Button>
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
        open={!!addModal}
        onCancel={() => {
          setAddModal(false);
          form.resetFields();
        }}
        footer={null}
        width={380}
      >
        <Form layout='vertical' onFinish={onFinish} form={form}>
          <div className="">
            <Form.Item name={'amount'} label="Amount" rules={[{ required: true, message: "Please enter amount" }]}>
              <Input placeholder='amount' />
            </Form.Item>

            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true, message: "Please select amount type" }]}
            >
              <Select placeholder="select amount type">
                <Select.Option value="Debit">Debit</Select.Option>
                <Select.Option value="Credit">Credit</Select.Option>
              </Select>

            </Form.Item>

            <Form.Item
              name="amount_type"
              label="Amount Type"
              rules={[{ required: true, message: "Please select amount type" }]}
            >
              <Select placeholder="select amount type">
                <Select.Option value="Cash">Cash</Select.Option>
                <Select.Option value="Bank">Bank</Select.Option>
              </Select>

            </Form.Item>

            <Form.Item
              name={'agentId'}
              label="Agent"
              rules={[{ required: true, message: "Please select a Agent" }]}
            >
              <Select
                placeholder="Select Agent"
                options={
                  !agentloading && agentData?.data.map((agent: { _id: string; name: string }) => ({
                    value: agent._id,
                    label: agent.name
                  }))
                }
              />
            </Form.Item>

            <Form.Item
              name={'registrationId'}
              label="Student Name"
              rules={[{ required: true, message: "Please select a  Student" }]}
            >
              <Select
                placeholder="Select Student"
                options={
                  !registerloading && registerData?.data.map((register: { _id: string; name: string }) => ({
                    value: register._id,
                    label: register.name
                  }))
                }
              />
            </Form.Item>

            <Form.Item
              name={'particularId'}
              label="Particular"
              rules={[{ required: true, message: "Please select a particular" }]}
              initialValue="68fb1eec65bb26d8daf5a015"
            >
              <h1>Agent Amount</h1>
            </Form.Item>



          </div>

          <Form.Item>
            <Button htmlType='submit' type="primary" className="w-full">Yes, Collected</Button>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  )
}

export default AgentAccount
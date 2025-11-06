import {
  Button,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Select,
  Table,
  type TableColumnsType,
} from "antd";
import { useQuery } from "react-query";
import { useState } from "react";
import { getPayments } from "../../Api/payment/paymentApi";
import { getParticular } from "../../Api/Particular/particularApi";
import { getBranch } from "../../Api/Branch/branchApi";
import { useCreatePayments } from "../../Api/payment/paymentHooks";
import { getUser } from "../../Api/User/userApi";

function Payment() {

  const { data, isLoading, refetch } = useQuery("payments", getPayments);
  const { data: particulardata, isLoading: particularloading } = useQuery("particular", getParticular);
  const { data: branchdata, isLoading: branchloading } = useQuery("branch", getBranch);
  const { data: userdata, isLoading: userloading } = useQuery("user", getUser);

  const [addModal, setAddModal] = useState(false);
  const [form] = Form.useForm();
  const { mutate: Create } = useCreatePayments();

  const [userType, setUserType] = useState<string | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const handleUserTypeChange = async (value: string) => {
  form.setFieldsValue({ userId: undefined });
  setFilteredUsers([]);

  const selectedType = value.toLowerCase();

  const filtered =
    userdata?.data?.filter(
      (user: { position: string }) =>
        user.position?.toLowerCase() === selectedType
    ) || [];

  setFilteredUsers(filtered);
};


  const onFinish = (value: any) => {
    Create(value, {
      onSuccess() {
        message.success("Added successfully");
        refetch();
        setAddModal(false);
        form.resetFields();
        setUserType(null);
        setFilteredUsers([]);
      },
      onError() {
        message.error("Failed to add");
      },
    });
  };

  const columns: TableColumnsType<any> = [
    {
      title: "Date",
      dataIndex: "createdAt",
    },
    {
      title: "Employee",
      dataIndex: ["userId", "name"],
    },
    {
      title: "Branch",
      dataIndex: ["branchId", "name"],
    },
    {
      title: "Particular",
      dataIndex: ["particularId", "name"],
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
  ];


  return (
    <div>
      <Divider>Payments</Divider>

      <div className="flex justify-end mx-5 my-5">
        <Button type="primary" onClick={() => setAddModal(true)}>
          Add
        </Button>
      </div>

      <Table
        columns={columns}
        style={{ height: "350px", overflowY: "auto" }}
        pagination={false}
        dataSource={data?.data}
        loading={isLoading}
        size="middle"
        rowKey="_id"
      />

      <Modal
        title="Add Payment"
        open={addModal}
        onCancel={() => {
          setAddModal(false);
          form.resetFields();
          setUserType(null);
          setFilteredUsers([]);
        }}
        footer={null}
        width={500}
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <div className="flex gap-5 w-full">
            <div className="w-[50%]">
              <Form.Item
                name="branchId"
                label="Branch"
                rules={[{ required: true, message: "Please select a Branch" }]}
              >
                <Select
                  placeholder="Select a Branch"
                  options={
                    !branchloading &&
                    branchdata?.data?.map(
                      (branch: { _id: string; name: string }) => ({
                        value: branch._id,
                        label: branch.name,
                      })
                    )
                  }
                />
              </Form.Item>

              <Form.Item
                name="user_type"
                label="User Type"
                rules={[{ required: true, message: "Please select user type" }]}
              >
                <Select
                  placeholder="Select user type"
                  onChange={handleUserTypeChange}
                >
                  <Select.Option value="SRC">SRC</Select.Option>
                  <Select.Option value="SRO">SRO</Select.Option>
                  <Select.Option value="Manager">Manager</Select.Option>
                  <Select.Option value="Administractor">Administractor</Select.Option>
                  <Select.Option value="Accountant">Accountant</Select.Option>
                </Select>
              </Form.Item>


              <Form.Item
                name="userId"
                label="User"
                rules={[{ required: true, message: "Please select a user" }]}
              >
                <Select
                  placeholder="Select a user"
                  loading={loadingUsers || userloading}
                  options={
                    filteredUsers?.map((user: { _id: string; name: string }) => ({
                      value: user._id,
                      label: user.name,
                    })) || []
                  }
                />
              </Form.Item>
            </div>


            <div className="w-[50%]">

              <Form.Item
                name="particularId"
                label="Particular"
                rules={[
                  { required: true, message: "Please select a particular" },
                ]}
              >
                <Select
                  placeholder="Select a Particular"
                  options={
                    !particularloading &&
                    particulardata?.data?.map(
                      (p: { _id: string; name: string }) => ({
                        value: p._id,
                        label: p.name,
                      })
                    )
                  }
                />
              </Form.Item>


              <Form.Item
                name="amount"
                label="Amount"
                rules={[{ required: true, message: "Please enter amount" }]}
              >
                <Input placeholder="Amount" />
              </Form.Item>


              <Form.Item
                name="amount_type"
                label="Amount Type"
                rules={[
                  { required: true, message: "Please select amount type" },
                ]}
              >
                <Select placeholder="Select amount type">
                  <Select.Option value="Cash">Cash</Select.Option>
                  <Select.Option value="Bank">Bank</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          <Form.Item>
            <Button htmlType="submit" type="primary" className="w-full">
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Payment;

import { Button, Form, Input, Select } from "antd"



function Login() {
  return (
    <div className='w-full h-screen flex justify-center items-center bg-amber-300'>
      <div className="bg-white px-5 py-4 w-[380px] rounded-md">
        <Form
          layout="vertical"
        >
          <Form.Item
            name="position"
            label="Position"
            rules={[{ required: true, message: 'Please select a Position' }]}
          >
            <Select
              placeholder="select position"
            >
              <Select.Option value="SRC">SRC</Select.Option>
              <Select.Option value="SRO">SRO</Select.Option>
              <Select.Option value="Manager">Manager</Select.Option>
              <Select.Option value="Administractor">Administractor</Select.Option>
              <Select.Option value="Accountant">Accountant</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input placeholder="email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input placeholder="password" />
          </Form.Item>

          <Form.Item>
            <Button
            className="w-full"
              type="primary"
              style={{ backgroundColor: '#f59e0b', borderColor: '#f59e0b' }}>
              Login
            </Button>

          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
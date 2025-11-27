import { Button, Form, Input, Select, message } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../Redux/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import image from "../../assets/yuy.jpg";

function Login() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const res = await axios.post("http://localhost:3000/api/user/login", values);

      if (res.data.success) {
        toast.success("Login successful!", { duration: 4000 });
        message.success("Login successful!");

        dispatch(
          loginSuccess({
            user: res.data.data,
            token: res.data.data.token,
          })
        );

        navigate("/dashboard");
      } else {
        message.error(res.data.message);
      }
    } catch (err) {
      message.error("Login failed");
    }
  };

  return (
    <div
      className="w-full h-screen flex justify-center items-center relative px-4"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[5px]"></div>

      {/* Login Card */}
      <div className="
        relative bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl 
        px-6 py-8 sm:px-8 sm:py-10 
        w-[90%] sm:w-[400px] 
        rounded-2xl animate-fadeIn
      ">
        
        <h2 className="text-white text-2xl sm:text-3xl font-semibold text-center mb-6 drop-shadow-md">
          Welcome
        </h2>

        <Form layout="vertical" form={form} onFinish={onFinish}>

          <Form.Item
            name="position"
            label={<span className="text-white">Position</span>}
            rules={[{ required: true, message: "Please select a Position" }]}
          >
            <Select placeholder="Select position" size="large">
              <Select.Option value="Admin">Admin</Select.Option>
              <Select.Option value="SRC">SRC</Select.Option>
              <Select.Option value="SRO">SRO</Select.Option>
              <Select.Option value="Manager">Manager</Select.Option>
              <Select.Option value="Administractor">Administractor</Select.Option>
              <Select.Option value="Accountant">Accountant</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="email"
            label={<span className="text-white">Email</span>}
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input placeholder="email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span className="text-white">Password</span>}
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input.Password placeholder="password" size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              className="
                w-full text-lg py-2 rounded-lg shadow-md 
                hover:scale-[1.03] transition-transform
              "
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#f59e0b", borderColor: "#f59e0b" }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Login;

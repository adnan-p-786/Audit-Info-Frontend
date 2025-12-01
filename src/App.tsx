import { ExclamationCircleOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Form, Input, Layout, Menu, message, Modal, theme } from 'antd';
import { RiDashboardFill, RiUserVoiceFill } from 'react-icons/ri';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import SubMenu from 'antd/es/menu/SubMenu';
import { IoSettingsOutline } from 'react-icons/io5';
import { useState } from 'react';
import { MdAccountCircle } from 'react-icons/md';
import { FaArrowRight, FaBell, FaUsers, FaUsersCog, FaUserSecret, FaUserTie } from 'react-icons/fa';
import { FaBuildingUser } from 'react-icons/fa6';
import { TbReportAnalytics } from 'react-icons/tb';
import { PiStudent } from 'react-icons/pi';
import { SiContactlesspayment } from 'react-icons/si';
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useUpdatePassword } from './Api/User/userHooks';
import axios from 'axios';
import { logout } from './Redux/authSlice';



function App() {

  const [updateModal, setUpdateModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [form] = Form.useForm();
  const { mutate: change } = useUpdatePassword();
  const email = useSelector((state: any) => state.auth.user?.Email);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const onFinish = (value: any) => {
    change(
      {
        email: email,
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
      },
      {
        onSuccess() {
          message.success("Updated successfully");
          setUpdateModal(false);
          form.resetFields();
        },
        onError() {
          message.error("Failed to Update Password");
        }
      }
    );
  };

  const onLogout = async (values: any) => {
    try {
      const res = await axios.post("http://localhost:3000/api/user/logout", values);

      if (res.data.success) {
        toast.success("Logout successful!", { duration: 4000 });
        message.success("Logout successful!");

        dispatch(
          logout()
        );

        navigate("/Login");
      } else {
        message.error(res.data.message);
      }
    } catch (err) {
      message.error("Login failed");
    }
  };


  const position = useSelector((state: any) => state.auth.user?.Position);

  const { Header, Sider, Content } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <>
      <Toaster />
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#f07416',
            colorBgContainer: '#ffffff',
          },
          components: {
            Layout: {
              siderBg: '#001529',
              headerBg: '#f0f2f5',
              bodyBg: '#fafafa',
            },
            Menu: {
              itemColor: '#ffffff',
              itemSelectedColor: '#1890ff',
              itemBg: '#001529',
              itemSelectedBg: '#003a8c',
              itemHoverColor: '#40a9ff',
              itemHoverBg: '#000c17',
            },
          },
        }}
      >
        <Layout className='h-screen overflow-y-hidden'>

          {/* --- SIDEBAR --- */}
          <Sider
            className='overflow-y-scroll sidebarHidden'
            trigger={null}
            collapsible
            collapsed={collapsed}
            collapsedWidth="0"
            breakpoint="lg"
            onBreakpoint={(broken) => setCollapsed(broken)}
            onCollapse={(value) => setCollapsed(value)}
          >
            <div className="demo-logo-vertical" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key={'1'} icon={<RiDashboardFill />}>
                <Link to='/dashboard'>Dashboard</Link>
              </Menu.Item>

              {position !== 'Manager' && position !== 'SRC' && position !== 'SRO' && position !== 'Administractor' && position !== 'Accountant' && (
                <Menu.Item key={'2'} icon={<FaUserTie />}>
                  <Link to='/branchmanager'>Branch Manager</Link>
                </Menu.Item>
              )}

              {position !== 'Manager' && position !== 'SRC' && position !== 'SRO' && (
                <Menu.Item key={'3'} icon={<MdAccountCircle />}>
                  <Link to='/accountant'>Accountant</Link>
                </Menu.Item>
              )}

              {position !== 'SRC' && position !== 'SRO' && position !== 'Administractor' && position !== 'Accountant' && (
                <Menu.Item key={'4'} icon={<RiUserVoiceFill />}>
                  <Link to='/src'>SRC</Link>
                </Menu.Item>
              )}

              {position !== 'SRO' && position !== 'Administractor' && position !== 'Accountant' && (
                <Menu.Item key={'5'} icon={<FaUsersCog />}>
                  <Link to='/sro'>SRO</Link>
                </Menu.Item>
              )}

              {position !== 'Manager' && position !== 'SRC' && position !== 'SRO' && position !== 'Accountant' && (
                <Menu.Item key={'6'} icon={<FaBuildingUser />}>
                  <Link to='officeadministration'>Office Administration</Link>
                </Menu.Item>
              )}

              {position !== 'Manager' && position !== 'SRC' && position !== 'SRO' && position !== 'Administractor' && (
                <Menu.Item key={'7'} icon={<FaUserSecret />}>
                  <Link to='/agent'>Agent</Link>
                </Menu.Item>
              )}

              <Menu.Item key={'8'} icon={<FaUsers />}>
                <Link to='/leadmanagement'>Lead Management</Link>
              </Menu.Item>

              <Menu.Item key={'9'} icon={<PiStudent />}>
                <Link to='/studentmanagement'>Student Management</Link>
              </Menu.Item>

              {position !== 'Manager' && position !== 'SRC' && position !== 'SRO' && position !== 'Administractor' && position !== 'Accountant' && (
                <SubMenu key={'10'} title="Settings" icon={<IoSettingsOutline />}>
                  <Menu.Item icon={<FaArrowRight />}>
                    <Link to='/particularmanagement'>Particular Management</Link>
                  </Menu.Item>
                  <Menu.Item icon={<FaArrowRight />}>
                    <Link to='/schoolmanagement'>School Management</Link>
                  </Menu.Item>
                  <Menu.Item icon={<FaArrowRight />}>
                    <Link to='/collegemanagement'>College Management</Link>
                  </Menu.Item>
                  <Menu.Item icon={<FaArrowRight />}>
                    <Link to='/branchmanagement'>Branch Management</Link>
                  </Menu.Item>
                </SubMenu>
              )}

              {position !== 'Manager' && position !== 'SRC' && position !== 'SRO' && (
                <SubMenu key={'11'} title="Reports" icon={<TbReportAnalytics />}>
                  <Menu.Item icon={<FaArrowRight />}>
                    <Link to='/seatbooking'>Seat Bookings</Link>
                  </Menu.Item>
                  <Menu.Item icon={<FaArrowRight />}>
                    <Link to='/employeesales'>Employee Sales</Link>
                  </Menu.Item>
                  <Menu.Item icon={<FaArrowRight />}>
                    <Link to='/agentcollegereport'>Agent College Report</Link>
                  </Menu.Item>
                  <Menu.Item icon={<FaArrowRight />}>
                    <Link to='/cancelledstudent'>Cancelled Students</Link>
                  </Menu.Item>

                  <SubMenu title='Accounts'>
                    <Menu.Item icon={<FaArrowRight />}>
                      <Link to='/accounts'>Accounts</Link>
                    </Menu.Item>
                    <Menu.Item icon={<FaArrowRight />}>
                      <Link to='/collegeaccounts'>College Account</Link>
                    </Menu.Item>
                    <Menu.Item icon={<FaArrowRight />}>
                      <Link to='/employeeaccounts'>Employee Account</Link>
                    </Menu.Item>
                    <Menu.Item icon={<FaArrowRight />}>
                      <Link to='/agentaccounts'>Agent Account</Link>
                    </Menu.Item>
                  </SubMenu>
                </SubMenu>
              )}

              {position !== 'Manager' && position !== 'SRC' && position !== 'SRO' && (
                <Menu.Item key={'12'} icon={<FaUserSecret />}>
                  <Link to='/expense'>Expense</Link>
                </Menu.Item>
              )}

              {position !== 'Manager' && position !== 'SRC' && position !== 'SRO' && (
                <Menu.Item key={'13'} icon={<SiContactlesspayment />}>
                  <Link to='/payment'>Payment</Link>
                </Menu.Item>
              )}

              {position !== 'Manager' && position !== 'SRC' && position !== 'SRO' && (
                <Menu.Item key={'14'} icon={<FaBell />}>
                  <Link to='/request'>Request</Link>
                </Menu.Item>
              )}
            </Menu>
          </Sider>

          {/* --- MOBILE OVERLAY --- */}
          {!collapsed && (
            <div
              className="mobileOverlay"
              onClick={() => setCollapsed(true)}
            ></div>
          )}

          {/* --- CONTENT AREA --- */}
          <Layout>
            <Header className='justify-between flex items-center' style={{ padding: 0, height: 50, background: colorBgContainer }}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: '14px', width: 60, height: 60 }}
              />
              <div className='flex items-center justify-center gap-4 mx-10'>
                {position !== 'Manager' && position !== 'SRC' && position !== 'SRO' && position !== 'Accountant' && position !== 'Administractor' && (
                  <Button onClick={(() => setUpdateModal(true))} type='primary'>Update Password</Button>
                )}
                <Button onClick={(() => setLogoutModal(true))} className='text-2xl cursor-pointer'><LogoutOutlined /></Button>
              </div>
            </Header>

            <Content
              style={{
                margin: '13px 10px',
                padding: 16,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
              className='h-screen overflow-y-scroll'
            >
              <Outlet />

              <Modal
                title="Update Password"
                open={updateModal}
                onCancel={() => {
                  setUpdateModal(false);
                  form.resetFields();
                }}
                footer={null}
                width={400}
              >
                <Form layout="vertical" form={form} onFinish={onFinish}>
                  <div>
                    <Form.Item name={'email'} label="Email" rules={[{ required: true, message: "Please enter your password" }]}>
                      <Input placeholder='Email' />
                    </Form.Item>

                    <Form.Item name={'currentPassword'} label="Current Password" rules={[{ required: true, message: "Please enter current password" }]}>
                      <Input placeholder='Current Password' />
                    </Form.Item>

                    <Form.Item name={'newPassword'} label="New Password" rules={[{ required: true, message: "Please enter new password" }]}>
                      <Input placeholder='New Password' />
                    </Form.Item>
                  </div>
                  <Form.Item>
                    <Button htmlType="submit" type="primary" className="w-full">
                      Update
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>

              <Modal
                title={
                  <div className="text-center px-2">
                    <ExclamationCircleOutlined style={{ fontSize: '70px', color: '#F68B1F', marginTop: 25 }} />
                    <div className="mt-5 text-xl sm:text-2xl mb-8 font-semibold">
                      Are you sure want to Logout
                    </div>
                  </div>
                }
                open={logoutModal}
                onCancel={() => {
                  setLogoutModal(false);
                }}
                footer={null}
                width={400}
              >
                <Form layout="vertical" onFinish={onLogout} form={form}>
                  <Form.Item>
                    <Button htmlType="submit" type="primary" className="w-full">
                      Logout
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>

            </Content>

          </Layout>
        </Layout>
      </ConfigProvider>
    </>
  )
}

export default App;

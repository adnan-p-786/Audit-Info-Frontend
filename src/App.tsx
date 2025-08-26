import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, ConfigProvider, Layout, Menu, theme } from 'antd';
import { RiDashboardFill, RiUserVoiceFill } from 'react-icons/ri';
import { Link, Outlet } from 'react-router-dom';
import SubMenu from 'antd/es/menu/SubMenu';
import { IoSettingsOutline } from 'react-icons/io5';
import { useState } from 'react';
import { MdAccountCircle } from 'react-icons/md';
import { FaArrowRight, FaBell, FaUsers, FaUsersCog, FaUserSecret, FaUserTie } from 'react-icons/fa';
import { FaBuildingUser } from 'react-icons/fa6';
import { TbReportAnalytics } from 'react-icons/tb';
import { PiStudent } from 'react-icons/pi';
import { SiContactlesspayment } from 'react-icons/si';


function App() {

  const { Header, Sider, Content } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#e89207',
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
      <Layout className='h-screen'>
        <Sider className='overflow-y-scroll sidebarHidden' trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
          >
            <Menu.Item key={'1'} icon={<RiDashboardFill />}>
              <Link to='/dashboard'>Dashboard</Link>
            </Menu.Item>

            <Menu.Item key={'2'} icon={<FaUserTie />}>
              <Link to='/branchmanager'>Branch Manager</Link>
            </Menu.Item>

            <Menu.Item key={'3'} icon={<MdAccountCircle />}>
              <Link to='/accountant'>Accountant</Link>
            </Menu.Item>

            <Menu.Item key={'4'} icon={<RiUserVoiceFill />}>
              <Link to='/src'>SRC</Link>
            </Menu.Item>

            <Menu.Item key={'5'} icon={<FaUsersCog />}>
              <Link to='/sro'>SRO</Link>
            </Menu.Item>

            <Menu.Item key={'6'} icon={<FaBuildingUser />}>
              <Link to='officeadministration'>Office Administration</Link>
            </Menu.Item>

            <Menu.Item key={'7'} icon={<FaUserSecret />}>
              <Link to='/agent'>Agent</Link>
            </Menu.Item>

            <Menu.Item key={'8'} icon={<FaUsers  />}>
              <Link to='/leadmanagement'>Lead Management</Link>
            </Menu.Item>

            <Menu.Item key={'9'} icon={<PiStudent />}>
              <Link to='/studentmanagement'>Student Management</Link>
            </Menu.Item>

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

            <SubMenu key={'11'} title="Reports" icon={<TbReportAnalytics />}>
              <Menu.Item icon={<FaArrowRight />}>
                <Link to='/seatbooking'>Seat Bookings</Link>
              </Menu.Item>
              <Menu.Item icon={<FaArrowRight />}>
                <Link to='/employeesales'>Employee Sales</Link>
              </Menu.Item>
              <Menu.Item icon={<FaArrowRight />}>
                <Link to='/agentcollege'>Agent College</Link>
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

            <Menu.Item key={'12'} icon={<FaUserSecret />}>
              <Link to='/expense'>Expense</Link>
            </Menu.Item>

            <Menu.Item key={'13'} icon={<SiContactlesspayment />}>
              <Link to='/payment'>Payment</Link>
            </Menu.Item>

            <Menu.Item key={'14'} icon={<FaBell />}>
              <Link to='/request'>Request</Link>
            </Menu.Item>


          </Menu>
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
      </ConfigProvider>
    </>
  )
}

export default App

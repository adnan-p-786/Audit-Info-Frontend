import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { RiDashboardFill } from 'react-icons/ri';
import { Link, Outlet } from 'react-router-dom';
import SubMenu from 'antd/es/menu/SubMenu';
import { IoSettingsOutline } from 'react-icons/io5';


function App() {

  const { Header, Sider, Content } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <>
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

            <Menu.Item key={'2'} icon={<RiDashboardFill />}>
              <Link to='/accountant'>Accountant</Link>
            </Menu.Item>

            <Menu.Item key={'3'} icon={<RiDashboardFill />}>
              <Link to='/src'>SRC</Link>
            </Menu.Item>

            <Menu.Item key={'4'} icon={<RiDashboardFill />}>
              <Link to='/sro'>SRO</Link>
            </Menu.Item>

            <Menu.Item key={'5'} icon={<RiDashboardFill />}>
              <Link to='officeadministration'>Office Administration</Link>
            </Menu.Item>

            <Menu.Item key={'6'} icon={<RiDashboardFill />}>
              <Link to='/agent'>Agent</Link>
            </Menu.Item>

            <Menu.Item key={'7'} icon={<RiDashboardFill />}>
              <Link to='/leadmanagement'>Lead Management</Link>
            </Menu.Item>

            <Menu.Item key={'8'} icon={<RiDashboardFill />}>
              <Link to='/studentmanagement'>Student Management</Link>
            </Menu.Item>

            <SubMenu key={'9'} title="Settings" icon={<IoSettingsOutline />}>
              <Menu.Item>
                <Link to='/particularmanagement'>Particular Management</Link>
              </Menu.Item>
              <Menu.Item >
                <Link to='/schoolmanagement'>School Management</Link>
              </Menu.Item>
              <Menu.Item >
                <Link to='/collegemanagement'>College Management</Link>
              </Menu.Item>
              <Menu.Item >
                <Link to='/branchmanagement'>Branch Management</Link>
              </Menu.Item>
            </SubMenu>

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
    </>
  )
}

export default App

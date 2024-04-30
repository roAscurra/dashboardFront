import React from 'react';
import { Avatar, Layout, Menu, theme, Dropdown } from 'antd';
import {
  PieChartOutlined,
  SettingOutlined,
  UserOutlined,
  BarChartOutlined,
  UsergroupAddOutlined,
  HomeOutlined,
  TagsOutlined,
  NotificationOutlined,
  AlignLeftOutlined,
  ApartmentOutlined,
  AppstoreOutlined,
  ProjectOutlined,
  LogoutOutlined,
  ProfileOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Inicio', '1', <PieChartOutlined />),
  getItem('Productos', 'sub1', <AppstoreOutlined />, [
    getItem('Lista de productos', '3', <AlignLeftOutlined />),
    getItem('Categorías', '4', <ApartmentOutlined />),
  ]),
  getItem('Marketing', 'sub2', <BarChartOutlined />, [
    getItem('Cupones', '5', <TagsOutlined />),
    getItem('Promociones', '6', <NotificationOutlined />),
  ]),
  getItem('Configuracion', 'sub3', <SettingOutlined />, [
    getItem('Sucursales', '8', <HomeOutlined />),
    getItem('Usuarios', '9', <UsergroupAddOutlined />)
  ]),
  
];
export const SideBar = () => {
    const {
        token: { colorBgContainer },
      } = theme.useToken();
    
      const menu = (
        <Menu>
          <Menu.Item key="profile">
            <ProfileOutlined />
            Perfil
          </Menu.Item>
          <Menu.Item key="logout">
            <LogoutOutlined />
            Cerrar Sesión
          </Menu.Item>
        </Menu>
      );
  return (
    <Layout>
    <Header className="header" style={{ position: 'fixed', width: '100%', left: 0, padding: 0, top: 0 }}>
      <Menu  mode="horizontal" style={{ lineHeight: 'inherit', height: '100%', backgroundColor: "#e6f7ff", }}>
        <Menu.Item key="1" style={{ marginRight: 'auto' }}>
          <Avatar size="large" icon={<ProjectOutlined />} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
          Dashboard
        </Menu.Item>
      </Menu>
      <Dropdown overlay={menu} placement="bottomRight">
        <Avatar size="large" icon={<UserOutlined />} style={{ position: 'absolute', right: '24px', top: '16px' }} />
      </Dropdown>
    </Header>

    <Sider style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, bottom: 200, top: 70, background: colorBgContainer}}>
      <div className="demo-logo-vertical" />
      <Menu theme="light" mode="inline" defaultSelectedKeys={['1']} items={items} />
    </Sider>
  </Layout>
  )
}

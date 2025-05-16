import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography, Avatar, Space, Button } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  AppstoreOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { useStore } from '../store/userStore';

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Model.confirm({
    //   title: '提示',
    //   content: '确定退出吗？',
    //   onOkText: '确定',
    //   onCancelText: '取消',
    //   onOk: () => {
    //     logout();
    //     navigate('/login');
    //   },
    //   onCancel: () => {
    //     console.log('Cancel');
    //   },
    // })
    if (window.confirm('确定退出吗？')) {
      logout();
      navigate('/login');
    }
  };

  const selectedKeys = React.useMemo(() => {
    switch (location.pathname) {
      case '/':
        return ['home'];
      case '/categories':
        return ['categories'];
      case '/notes':
        return ['notes'];
      default:
        return [];
    }
  }, [location.pathname]);

  return (
    <Header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={selectedKeys}
        className="w-200"
        items={[
          {
            key: 'home',
            label: (
              <Space size="middle">
                <HomeOutlined />
                <Text>首页</Text>
              </Space>
            ),
            onClick: () => navigate('/'),
          },
          {
            key: 'categories',
            label: (
              <Space size="middle">
                <AppstoreOutlined />
                <Text>分类</Text>
              </Space>
            ),
            onClick: () => navigate('/categories'),
          },
          {
            key: 'notes',
            label: (
              <Space size="middle">
                <FileOutlined />
                <Text>笔记</Text>
              </Space>
            ),
            onClick: () => navigate('/notes'),
          },
        ]}
      />
      <div>
        {user ? (
          <Space onClick={handleLogout}>
            {user.avatar_url ? (
              <Avatar src={user.avatar_url} />
            ) : (
              <Avatar 
                src="https://my-bucket-wyj.oss-cn-shanghai.aliyuncs.com/images/%E7%86%8A%E4%BA%8C.png"
                style={{ 
                  backgroundColor: 'transparent'  // 移除背景色
                }}
                size={32}  // 设置合适的大小
              />
            )}
            <Text className="ml-2 text-white">
              {user.nickname || user.username}
            </Text>
          </Space>
        ) : (
          <Button type="primary" onClick={() => navigate('/login')}>
            登录
          </Button>
        )}
      </div>
    </Header>
  );
};

export default Navbar;

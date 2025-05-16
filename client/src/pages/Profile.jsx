import React from 'react';
import { Card, Avatar, Button, Descriptions } from 'antd';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import Navbar1 from '@/components/Navbar1';

const Profile = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('确定退出？')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <>
      <Navbar1 />
      <div className="p-6">
        <Card className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-4">
            <Avatar
              size={100}
              src={
                user?.avatar_url ||
                'https://my-bucket-wyj.oss-cn-shanghai.aliyuncs.com/images/%E6%96%B0%E7%94%A8%E6%88%B7.jpg'
              }
              style={{
                backgroundColor: 'transparent',
              }}
            />
            <Descriptions title="个人信息" column={1}>
              <Descriptions.Item label="用户名">
                {user?.username}
              </Descriptions.Item>
              <Descriptions.Item label="邮箱">{user?.email}</Descriptions.Item>
            </Descriptions>
            <Button
              type="primary"
              danger
              onClick={handleLogout}
              className="mt-4"
            >
              退出登录
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Profile;

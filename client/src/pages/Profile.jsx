import React, { useState, useEffect } from 'react';
import { Card, Avatar, Button, Descriptions, List, Tag, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
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

  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const savedReminders = localStorage.getItem('reminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);

  const handleDeleteReminder = (reminderToDelete) => {
    const updatedReminders = reminders.filter(reminder => 
      reminder.datetime !== reminderToDelete.datetime
    );
    setReminders(updatedReminders);
    localStorage.setItem('reminders', JSON.stringify(updatedReminders));
    message.success('提醒已删除');
  };

  return (
    <>
      <Navbar1 />
      <div className="p-6 flex gap-6">
        <div className="w-1/3">
          <Card title="提醒事项" className="mb-4">
            <List
              dataSource={reminders}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Popconfirm
                      title="删除提醒"
                      description="确定要删除这个提醒吗？"
                      onConfirm={() => handleDeleteReminder(item)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />}
                      >
                        删除
                      </Button>
                    </Popconfirm>
                  ]}
                >
                  <div className="w-full">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{item.title}</span>
                      <Tag color={item.notified ? 'gray' : 'green'}>
                        {item.notified ? '已提醒' : '待提醒'}
                      </Tag>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(item.datetime).toLocaleString()}
                    </div>
                    <div className="text-sm">{item.description}</div>
                  </div>
                </List.Item>
              )}
              locale={{ emptyText: '暂无提醒事项' }}
            />
          </Card>
        </div>
        <div className="w-2/3">
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
      </div>
    </>
  );
};

export default Profile;

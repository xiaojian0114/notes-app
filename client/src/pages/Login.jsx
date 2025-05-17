import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { loginUser } from '@/api/userApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Login = () => {
  const { setUser } = useStore();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      const response = await loginUser(values);
      setUser(response.data);
      message.success('登录成功');
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      message.error('用户名或密码错误');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-96 mx-auto transform hover:scale-105 transition-transform duration-300">
        <Title level={2} className="text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          欢迎回来
        </Title>
        <Form 
          name="login_form" 
          onFinish={onSubmit} 
          className="space-y-6"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="用户名"
              className="rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-colors"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="密码"
              className="rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-colors"
            />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit"
              className="w-full h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 transform hover:scale-105 transition-all duration-300"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center mt-6 text-gray-600">
          还没有账号？
          <a 
            onClick={() => navigate('/register')} 
            className="text-blue-500 hover:text-purple-500 transition-colors ml-2 cursor-pointer"
          >
            立即注册
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;

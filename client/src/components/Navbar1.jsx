// 使用 unocss 编写的自定义导航栏组件
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/userStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar } from 'antd';
import { ColorPicker } from 'antd';
import './Navbar.css'; // 确保正确导入 UnoCSS 文件
import { Switch } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';

const Navbar1 = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('确定退出？')) {
      logout();
      navigate('/login');
    }
  };

  const handleColorChange = (color) => {
    const root = document.documentElement;
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.style.backgroundColor = color.toHexString();
    }
    root.style.setProperty('--primary-color', color.toHexString());
    root.style.setProperty('--primary-hover-color', color.setAlpha(0.8).toHexString());
  };

  const Navbar = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const handleThemeChange = (checked) => {
      setIsDarkMode(checked);
      document.documentElement.classList.toggle('dark', checked);
    };

    return (
      <nav className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Switch
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
              checked={isDarkMode}
              onChange={handleThemeChange}
              className="bg-gray-400"
            />
          </div>
        </div>
      </nav>
    );
  };

  return (
    <nav className="navbar">
      <ul className="nav-menu">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">首页</Link>
        </li>
        <li
          className={
            location.pathname.startsWith('/categories') ? 'active' : ''
          }
        >
          <Link to="/categories">分类</Link>
        </li>
        <li className={location.pathname.startsWith('/notes') ? 'active' : ''}>
          <Link to="/notes">笔记</Link>
        </li>
      </ul>
      <div className="user-info">
        <ColorPicker
          size="small"
          style={{ marginRight: '16px' }}
          onChange={handleColorChange}
          presets={[
            {
              label: '推荐',
              colors: [
                '#1677ff',
                '#00b96b',
                '#f5222d',
                '#fa8c16',
                '#722ed1',
                '#eb2f96',
              ],
            },
          ]}
        />
        {user ? (
          <Link to="/profile">
            {user.avatar_url ? (
              <Avatar src={user.avatar_url} />
            ) : (
              <Avatar
                src="https://my-bucket-wyj.oss-cn-shanghai.aliyuncs.com/images/%E6%96%B0%E7%94%A8%E6%88%B7.jpg"
                style={{
                  backgroundColor: 'transparent',
                }}
                size={32}
              />
            )}
            <span className="nickname">{user.nickname || user.username}</span>
          </Link>
        ) : (
          <Link to="/login" className="login-link">
            登录
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar1;

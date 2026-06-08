import React from 'react';
import { Layout, Menu, Button, Tooltip } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import styled from '@emotion/styled';
import {
  HomeOutlined,
  PictureOutlined,
  UploadOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  UserOutlined,
  BulbOutlined,
  BulbFilled,
} from '@ant-design/icons';

const { Header } = Layout;

const StyledHeader = styled(Header)`
  background: var(--header-bg);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  padding: 0 24px;
  transition: background 0.3s, border-color 0.3s;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-primary);
  font-weight: 700;
  font-size: 18px;
  margin-right: 32px;
  letter-spacing: 0.5px;
  cursor: pointer;
`;

const LogoImg = styled.img`
  height: 28px;
  width: auto;
  border-radius: 4px;
`;

const StyledMenu = styled(Menu)`
  background: transparent !important;
  border-bottom: none;

  .ant-menu-item {
    color: var(--text-primary) !important;
    transition: color 0.2s;
    &:hover {
      color: var(--accent-color) !important;
    }
    .anticon {
      color: var(--text-secondary) !important;
    }
    a {
      color: inherit !important;
      &:hover {
        color: var(--accent-color) !important;
      }
    }
  }
`;

const MainMenu = styled(StyledMenu)`
  flex: 1;
`;

const UserMenu = styled(StyledMenu)`
  min-width: 100px;

  .ant-menu-submenu-title {
    color: var(--text-primary) !important;
    display: flex;
    align-items: center;
    padding: 0 12px !important;
  }
`;

const ThemeToggle = styled(Button)`
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
  color: var(--text-primary);
  transition: all 0.3s;
  backdrop-filter: blur(4px);

  &:hover {
    background: var(--hover-bg);
    border-color: var(--accent-color);
    color: var(--accent-color);
    box-shadow: 0 0 12px var(--accent-color);
    transform: scale(1.08);
  }

  .anticon {
    font-size: 20px;
    filter: drop-shadow(0 0 4px currentColor);
  }
`;

const NavBar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const menuItems = user
    ? [
        { key: '/', icon: <HomeOutlined />, label: '首页' },
        { key: '/images', icon: <PictureOutlined />, label: '上传图片' },
        { key: '/files', icon: <UploadOutlined />, label: '上传文件' },
        { key: '/shared', icon: <ShareAltOutlined />, label: '共享文件' },
        { key: '/top-downloads', icon: <DownloadOutlined />, label: '下载榜' },
      ]
    : [];

  return (
    <StyledHeader>
      <Logo>
        <LogoImg src="/logo.jpg" alt="闪存" />
        <span>闪存</span>
      </Logo>

      <MainMenu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems.map(item => ({
          ...item,
          label: <Link to={item.key}>{item.label}</Link>,
        }))}
      />

      {user ? (
        <UserMenu
          mode="horizontal"
          items={[
            {
              key: 'user',
              icon: <UserOutlined />,
              label: user.username,
              children: [
                {
                  key: 'logout',
                  label: '退出登录',
                  onClick: logout,
                },
              ],
            },
          ]}
        />
      ) : (
        <UserMenu
          mode="horizontal"
          items={[
            {
              key: 'login',
              label: (
                <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <UserOutlined />
                  <span>登录</span>
                </Link>
              ),
            },
          ]}
        />
      )}

      <Tooltip title={theme === 'light' ? '切换暗黑模式' : '切换浅色模式'}>
        <ThemeToggle
          type="text"
          icon={theme === 'light' ? <BulbOutlined /> : <BulbFilled />}
          onClick={toggleTheme}
        />
      </Tooltip>
    </StyledHeader>
  );
};

export default NavBar;
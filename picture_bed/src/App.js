import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, ConfigProvider, theme as antTheme } from 'antd';
import { Global, css } from '@emotion/react';
import styled from '@emotion/styled';
import Login from './pages/Login';
import Home from './pages/Home';
import ImageList from './pages/ImageList';
import FileList from './pages/FileList';
import SharedFiles from './pages/SharedFiles';
import TopDownloads from './pages/TopDownloads';
import NavBar from './components/NavBar';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { lightTheme, darkTheme } from './theme';

const { Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: var(--bg-primary);
  transition: background 0.3s;
`;

const GlassContent = styled(Content)`
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  border-radius: var(--border-radius, 16px);
  border: 1px solid var(--border-color);
  margin: 24px;
  padding: 24px;
  box-shadow: var(--shadow);
  transition: all 0.3s;
`;

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
    <StyledLayout>
      <NavBar />
      <GlassContent>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/images" element={<PrivateRoute><ImageList /></PrivateRoute>} />
          <Route path="/files" element={<PrivateRoute><FileList /></PrivateRoute>} />
          <Route path="/shared" element={<PrivateRoute><SharedFiles /></PrivateRoute>} />
          <Route path="/top-downloads" element={<PrivateRoute><TopDownloads /></PrivateRoute>} />
        </Routes>
      </GlassContent>
    </StyledLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <ThemedApp />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

function ThemedApp() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // 合并 ConfigProvider 的主题
  const antThemeConfig = {
    algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    token: isDark ? darkTheme.token : lightTheme.token,
  };

  // 全局 CSS 变量
  const globalStyles = css`
  body {
    margin: 0;
    font-family: ${antThemeConfig.token.fontFamily};
    transition: background 0.3s, color 0.3s;
  }

  /* ---------- 浅色主题 ---------- */
  body[data-theme='light'] {
    --bg-primary: #F5F5F7;
    --bg-card: rgba(255, 255, 255, 0.75);
    --text-primary: #1D1D1F;
    --text-secondary: #86868B;
    --border-color: rgba(0, 0, 0, 0.08);
    --shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    --header-bg: rgba(245, 245, 247, 0.72);
    --accent-color: #D97706;        /* 琥珀金，灯泡、链接等点缀 */
    --hover-bg: rgba(0, 0, 0, 0.04);
    --border-radius: 16px;
    --file-icon-pdf: #D97706;
    --file-icon-word: #059669;
    --file-icon-excel: #059669;
    --file-icon-zip: #D97706;
    --file-icon-text: #6E6E73;
  }

  /* ---------- 暗黑主题 ---------- */
  body[data-theme='dark'] {
    --bg-primary: #1C1C1E;
    --bg-card: rgba(44, 44, 46, 0.65);
    --text-primary: #F5F5F7;
    --text-secondary: #98989D;
    --border-color: rgba(255, 255, 255, 0.08);
    --shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
    --header-bg: rgba(28, 28, 30, 0.6);
    --accent-color: #F59E0B;        /* 亮金，更醒目 */
    --hover-bg: rgba(255, 255, 255, 0.06);
    --border-radius: 20px;
    --file-icon-pdf: #F59E0B;
    --file-icon-word: #34D399;
    --file-icon-excel: #34D399;
    --file-icon-zip: #F59E0B;
    --file-icon-text: #98989D;
  }
`;

  return (
    <ConfigProvider theme={antThemeConfig}>
      <Global styles={globalStyles} />
      <AppRoutes />
    </ConfigProvider>
  );
}

export default App;
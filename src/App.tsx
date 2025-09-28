// React Router와 페이지 컴포넌트 import
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/auth/Login';       // 로그인 페이지
import Signup from '@/pages/auth/Signup';     // 회원가입 페이지
import AdminPage from '@/pages/admin/AdminPage'; // 관리자 페이지
import '@/styles/App.css'; // 전체 앱 스타일

// 메인 App 컴포넌트 - 라우팅 설정
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 메인 페이지 - 로그인 화면 */}
          <Route path="/" element={<Login />} />
          {/* 회원가입 페이지 */}
          <Route path="/signup" element={<Signup />} />
          {/* 관리자 페이지 (중첩 라우팅) */}
          <Route path="/admin/*" element={<AdminPage />} />
          {/* 존재하지 않는 경로는 메인 페이지로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

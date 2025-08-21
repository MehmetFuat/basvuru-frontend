import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminPanel from './pages/adminPanel';
import AdminLogin from './pages/adminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import ApplicationStatus from './pages/ApplicationStatus';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
            
          }
        />
       <Route path="/application-status" element={<ApplicationStatus />} />

      </Routes>
    </Router>
  );
}

export default App;

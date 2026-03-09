import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/login/Login'
import SignUp from './pages/signup/SignUp'
import Profile from './pages/Profile'
import Landing from './pages/Landing'
import Dashboard from './pages/dashboard/Dashboard'

function App() {
    return (
        <Router>
            {/* Routes */}
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    )
}

export default App

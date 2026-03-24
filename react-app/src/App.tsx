import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import CreateGroup from "./pages/CreateGroup";
import { AuthProvider } from "./providers/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import Layout from "./components/Layout";
import InvitePage from "./pages/Invite";
import GroupDetails from "./pages/GroupDetails";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Layout>
                    {/* Routes */}
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route
                            path="/login"
                            element={
                                <GuestRoute>
                                    <Login />
                                </GuestRoute>
                            }
                        />
                        <Route
                            path="/signup"
                            element={
                                <GuestRoute>
                                    <SignUp />
                                </GuestRoute>
                            }
                        />
                        <Route
                            path="/home"
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/creategroup"
                            element={
                                <ProtectedRoute>
                                    <CreateGroup />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/invite/:code"
                            element={
                                <ProtectedRoute>
                                    <InvitePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/groups/:id"
                            element={
                                <ProtectedRoute>
                                    <GroupDetails />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Layout>
            </Router>
        </AuthProvider>
    );
}

export default App;

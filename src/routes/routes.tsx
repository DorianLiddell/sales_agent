import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../components/Auth/LoginPage";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children}: { children: JSX.Element}) => {
    const { isAutthenticated } = useAuth();
    return isAutthenticated ? children : <Navigate to="/login"/>
};

const router = createBrowserRouter([
    {path: "/login", element: <LoginPage/>},
    {path: "/map", element: <ProtectedRoute><MapPage/></ProtectedRoute>},
    {path: "*", element: <Navigate to="/map"/>},
]):

export default router
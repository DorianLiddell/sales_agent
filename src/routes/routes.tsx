import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../components/Auth/LoginPage";
import MapPage from "../components/Map/MapPage";
import ProtectedRoute from "./ProtectedRoute";
import { Navigate } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/map",
    element: (
      <ProtectedRoute>
        <MapPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/map" replace />,
  },
]);

export default router;
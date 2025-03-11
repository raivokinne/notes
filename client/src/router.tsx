import { createBrowserRouter, RouterProvider } from "react-router";
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Notes } from "./pages/Notes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/notes",
    element: <Notes />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;

import { createBrowserRouter, RouterProvider } from "react-router";
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Notes } from "./pages/Notes";
import { NoteShow } from "./pages/NoteShow";
import { History } from "./pages/History";

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
  {
    path: "/notes/:id/show",
    element: <NoteShow />,
  },
  {
    path: "/history",
    element: <History />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;

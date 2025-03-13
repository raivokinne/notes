import { Link } from "react-router";
import { useAuth } from "../providers/AuthProvider";
import { FormEvent } from "react";

export function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = async (e: FormEvent) => {
    e.preventDefault();
    await logout();
  };
  return (
    <>
      <nav className="flex justify-center items-center w-full h-[80px] bg-slate-300 fixed top-0">
        <div className="container flex justify-between items-center w-full mx-[300px] md:mx-[100px] sm:mx-0">
          <div className="font-bold text-2xl">
            <h3 className="">Notes</h3>
          </div>

          <ul className="flex items-center gap-4">
            <li className="font-bold">
              <a href="/">Home</a>
            </li>
            {user && (
              <li className="font-bold">
                <a href="/notes">Your Notes</a>
              </li>
            )}

            {user ? (
              <>
                <span className="font-bold">{user.username}</span>
                <li className="font-bold">
                  <button
                    onClick={handleLogout}
                    className="bg-slate-800 px-4 py-2 rounded text-white transition duration-300 hover:bg-slate-500"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="font-bold border-l border-slate-400 pl-4">
                  <Link to="/login">Login</Link>
                </li>
                <li className="font-bold">
                  <Link
                    to="/register"
                    className="bg-slate-800 px-4 py-2 rounded text-white transition duration-300 hover:bg-slate-500"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}

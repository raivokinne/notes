export function Navbar() {
  return (
    <>
      <nav className="flex justify-center items-center w-full h-[100px] bg-slate-300 fixed top-0">
        <div className="container flex justify-between items-center w-full mx-[300px] md:mx-[100px] sm:mx-0">
          <div className="font-bold text-2xl">
            <h3 className="">Notes</h3>
          </div>

          <ul className="flex gap-4">
            <li className="font-bold">
              <a href="/">Home</a>
            </li>
            <li className="font-bold border-l border-slate-400 pl-4">
              <a href="/login">Login</a>
            </li>
            <li className="font-bold">
              <a
                href="/register"
                className="bg-slate-800 px-4 py-2 rounded text-white transition duration-300 hover:bg-slate-500"
              >
                Register
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

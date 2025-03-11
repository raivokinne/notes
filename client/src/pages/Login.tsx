import { useNavigate } from "react-router";
import { Layout } from "../layouts/Layout";
import { api } from "../utils/axios";
import { csrf } from "../utils/functions";
import { FormEvent } from "react";
import { storage } from "../utils/storage";
import toast from "react-hot-toast";

export function Login() {
  const navigate = useNavigate();
  const onsubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const form = ev.target as HTMLFormElement;
    const formData = new FormData(form);
    const formDataObj = Object.fromEntries(formData);
    try {
      await csrf();
      const res = await api.post("/guest/login", formDataObj);
      if (res.status === 200) {
        storage.set("token", res.data.token);
        toast.success(res.data.message);
        form.reset();
        navigate("/notes");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Layout>
        <div className="text-center flex flex-col justify-center items-center">
          <form className="w-[400px]" onSubmit={onsubmit}>
            <fieldset className="flex flex-col gap-4">
              <legend className="text-3xl mb-4 font-bold">Login</legend>

              <div className="flex flex-col gap-4">
                <label htmlFor="username" className="text-left">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="user"
                  className="w-full border border-slate-400 px-4 py-2 rounded"
                />
              </div>
              <div className="flex flex-col gap-4">
                <label htmlFor="password" className="text-left">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="********"
                  className="w-full border border-slate-400 px-4 py-2 rounded"
                />
              </div>

              <button className="bg-slate-800 px-4 py-2 rounded text-white transition duration-300 hover:bg-slate-500">
                Login
              </button>

              <div className="flex flex-col gap-4">
                <p className="text-left">
                  Don't have an account?{" "}
                  <a href="/register" className="text-slate-800">
                    Register
                  </a>
                </p>
              </div>
            </fieldset>
          </form>
        </div>
      </Layout>
    </>
  );
}

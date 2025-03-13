import { FormEvent } from "react";
import { Layout } from "../layouts/Layout";
import { api } from "../utils/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { storage } from "../utils/storage";
import { csrf } from "../utils/functions";

export function Register() {
  const navigate = useNavigate();

  const onsumbit = async (ev: FormEvent) => {
    ev.preventDefault();
    const form = ev.target as HTMLFormElement;
    const formData = new FormData(form);
    const formDataObj = Object.fromEntries(formData);
    try {
      await csrf();
      const res = await api.post("/guest/register", formDataObj);
      if (res.status === 200) {
        storage.set("token", res.data.token);
        toast.success(res.data.message);
        form.reset();
        navigate("/notes");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {}
  };
  return (
    <>
      <Layout>
        <div className="text-center flex flex-col justify-center items-center">
          <form className="w-[400px]" onSubmit={onsumbit}>
            <fieldset className="flex flex-col gap-4">
              <legend className="text-3xl mb-4 font-bold">Register</legend>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                  <label htmlFor="firstname" className="text-left">
                    Firstname
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    placeholder="john"
                    className="w-full border border-slate-400 px-4 py-2 rounded"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <label htmlFor="lastname" className="text-left">
                    Lastname
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    id="lastname"
                    placeholder="doe"
                    className="w-full border border-slate-400 px-4 py-2 rounded"
                  />
                </div>
              </div>
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
                Register
              </button>

              <div className="flex flex-col gap-4">
                <p className="text-sm">
                  Already have an account?{" "}
                  <a href="/login" className="text-blue-500">
                    Login
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

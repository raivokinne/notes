import { Navbar } from "../components/Navbar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="flex justify-center items-center w-full h-screen">
        {children}
      </main>
    </>
  );
}

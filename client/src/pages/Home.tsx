import { Layout } from "../layouts/Layout";

export function Home() {
  return (
    <>
      <Layout>
        <div className="text-center flex flex-col justify-center items-center">
          <h1 className="text-7xl font-bold mb-4">Note taking App</h1>
          <p className="text-lg">This is a simple note taking app</p>
        </div>
      </Layout>
    </>
  );
}

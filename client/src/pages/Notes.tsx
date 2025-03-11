export function Notes() {
  return (
    <>
      <main className="grid place-items-center grid-cols-5 w-full h-screen">
        <div className="h-full border border-slate-400 col-span-1 flex flex-col gap-4 w-full">
          <div className="flex justify-between items-center w-full p-4">
            <h1 className="text-3xl font-bold">Notes</h1>
            <button className="bg-slate-900 flex justify-center items-center w-[35px] px-4 py-2 rounded-full text-white">
              +
            </button>
          </div>
        </div>
        <textarea
          className="h-full resize-none border border-slate-400 col-span-4 font-sans p-4 w-full"
          name="notes"
          id="notes"
        ></textarea>
      </main>
    </>
  );
}

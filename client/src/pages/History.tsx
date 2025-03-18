import { useEffect, useState } from "react";
import { useNotes } from "../hooks/useNotes";
import { Note, User } from "../types";
import { Layout } from "../layouts/Layout";
import { formatDate } from "../utils/functions";

interface NoteHistory {
  user: User,
  note: Note,
  expires: string,
  created_at: string,
}

export function History() {
  const [histories, setHistories] = useState<NoteHistory[]>([])
  const { note_delete } = useNotes()
  const { getAllHistory } = useNotes()

  useEffect(() => {
    async function fetchHistory() {
      const data = await getAllHistory();
      setHistories(data);

      data.forEach((history: NoteHistory) => {
        const now = new Date();
        const expiresAt = new Date(history.expires);

        if (expiresAt <= now) {
          note_delete(history.note.id);
        }
      });
    }

    fetchHistory();
  }, []);


  return (
    <>
      <Layout>
        <div className="container overflow-scroll h-[80%] fixed mx-auto py-6 px-8">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-2xl font-semibold text-gray-800">Your History</h1>
            </div>
          </div>

          {histories?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No notes found. Create your first note to get started.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {histories?.map((history) => (
                <div className="block">
                  <div className="bg-white border border-gray-200 rounded-lg px-6 py-4 h-full">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-medium text-gray-800 mb-2 truncate">
                        {history.note.title}
                      </h2>
                    </div>
                    <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                      <span>{formatDate(history.note.created_at)}</span>
                      {history.note.tags && history.note.tags.length > 0 && (
                        <div className="flex gap-2">
                          {history.note.tags.map((tag) => (
                            <span
                              key={tag.id}
                              className="bg-gray-200 px-2 py-1 rounded-full"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}

import { useNotes } from "../hooks/useNotes";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "../layouts/Layout";
import { formatDate } from "../utils/functions";
import { useAuth } from "../providers/AuthProvider";
import { ChangeEvent, useEffect, useState } from "react";
import { useTags } from "../hooks/useTags";
import { Note } from "../types";

export function Notes() {
  const { authenticated } = useAuth();
  const navigate = useNavigate();
  const { data: notes, loading, create, note_delete } = useNotes();
  const { data: tags } = useTags();
  const [filterdNotes, setFilterdNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (!authenticated) {
      navigate("/");
    }
  }, [authenticated]);

  useEffect(() => {
    if (notes) {
      setFilterdNotes(notes);
    }
  }, [notes]);

  const handleFillter = (e: ChangeEvent<HTMLSelectElement>) => {
    const tagId = e.target.value;
    tags.filter((tag) => {
      if (!tagId) return setFilterdNotes(notes);
      if (tag.name === tagId) {
        setFilterdNotes(tag.notes);
      } else if (tagId === "all") {
        setFilterdNotes(notes);
      }
    });
  };

  const handleCreate = async () => {
    await create();
  };

  const handleDelete = async (noteId: number) => {
    await note_delete(noteId);
  };
  return (
    <Layout>
      <div className="container overflow-scroll h-[80%] fixed mx-auto py-6 px-8">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Your Notes</h1>
            {tags.length !== 0 && (
              <>
                <div>
                  <select
                    name="tag"
                    id="tag"
                    className="px-4 py-2 bg-slate-50 rounded"
                    onChange={handleFillter}
                  >
                    <option value="all">All</option>
                    {tags.map((tag) => (
                      <>
                        <option>{tag.name}</option>
                      </>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
          <button
            onClick={handleCreate}
            className="bg-slate-800 flex items-center justify-center px-4 py-1 w-[30px] rounded-full text-white"
          >
            +
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : filterdNotes?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No notes found. Create your first note to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterdNotes?.map((note) => (
              <div className="block">
                <div className="bg-white border border-gray-200 rounded-lg px-6 py-4 h-full">
                  <div className="flex justify-between items-center">
                    <Link
                      key={note.id}
                      to={`/notes/${note.id}/show`}
                      className="text-wrap"
                    >
                      <h2 className="text-lg font-medium text-gray-800 mb-2 truncate">
                        {note.title}
                      </h2>
                    </Link>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="bg-red-500 rounded-full px-3 py-1 text-white"
                    >
                      x
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                    <span>{formatDate(note.created_at)}</span>
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex gap-2">
                        {note.tags.map((tag) => (
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
  );
}

import { useNotes } from "../hooks/useNotes";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "../layouts/Layout";
import { formatDate } from "../utils/functions";
import { useAuth } from "../providers/AuthProvider";
import { useEffect, useState } from "react";
import { useTags } from "../hooks/useTags";
import { Note } from "../types";

export function Notes() {
  const { authenticated } = useAuth();
  const navigate = useNavigate();
  const { data: notes, loading, create } = useNotes();
  const { data: tags } = useTags();

  const [filterdNotes, setFilterdNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (!authenticated) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (notes) {
      setFilterdNotes(notes);
    }
  }, [notes]);

  const handleFillter = (tagId?: number) => {
    tags.filter((tag) => {
      if (!tagId) return setFilterdNotes(notes);
      if (tag.id === tagId) {
        setFilterdNotes(tag.notes);
      }
    });
  };

  const handleCreate = async () => {
    await create();
  };
  return (
    <Layout>
      <div className="container mx-auto py-6 px-8">
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
                  >
                    <option value="all" onClick={() => handleFillter()}>
                      All
                    </option>
                    {tags.map((tag) => (
                      <>
                        <option
                          onClick={() => handleFillter(tag.id)}
                          value={tag.id}
                        >
                          {tag.name}
                        </option>
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
              <Link
                key={note.id}
                to={`/notes/${note.id}/show`}
                className="block"
              >
                <div className="bg-white border border-gray-200 rounded-lg px-6 py-4 h-full">
                  <h2 className="text-lg font-medium text-gray-800 mb-2 truncate">
                    {note.title}
                  </h2>
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

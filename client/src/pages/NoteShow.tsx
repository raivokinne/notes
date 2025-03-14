import { useParams } from "react-router-dom";
import { Layout } from "../layouts/Layout";
import { useNotes } from "../hooks/useNotes";
import { useEffect, useState, useRef } from "react";
import { Note, Tag } from "../types";
import { useTags } from "../hooks/useTags";
import toast from "react-hot-toast";
import useMousePosition from "../hooks/useMousePosition";

export function NoteShow() {
  const { id } = useParams<{ id: string }>();
  const { show, update, uploadAttachment } = useNotes();
  const [note, setNote] = useState<Note>({} as Note);
  const [isSaving, setIsSaving] = useState(false);
  const { data: tags } = useTags();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition();

  useEffect(() => {
    async function fetchNote() {
      if (id) {
        const data: Note = await show(id);
        setNote(data);
        setSelectedTags(data.tags || []);

        if (contentRef.current) {
          contentRef.current.innerHTML = data.content || "";
        }

        data.attachments?.map((img) => {
          insertImage("http://localhost:8000/storage/" + img.path);
        });
      }
    }
    fetchNote();
  }, [id, show]);

  const handleNoteInput = (e: React.FormEvent<HTMLDivElement>) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = e.currentTarget.innerHTML;

    const images = tmp.querySelectorAll("img");
    images.forEach((img) => img.remove());

    const content = tmp.innerHTML;

    setNote({
      ...note,
      content,
    });
  };

  const saveNote = async () => {
    if (!id || isSaving || !note.content) return;

    setIsSaving(true);
    try {
      const data = await update({
        ...note,
        tags: selectedTags,
      });
      setNote(data);
      toast.success("Changes have been saved");
    } catch (error) {
      toast.error("Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (note.content && note.id) {
        saveNote();
      }
    }, 30000);

    return () => clearInterval(timer);
  }, [note.content, note.id]);

  const handleTagChange = (tagId: number) => {
    const selectedTag = tags.find((tag: Tag) => tag.id === tagId);

    if (selectedTag && !selectedTags.find((t) => t.id === tagId)) {
      setSelectedTags((prev) => [...prev, selectedTag]);
    }
  };

  const removeTag = (tagId: number) => {
    setSelectedTags((prev) => prev.filter((tag) => tag.id !== tagId));
  };

  const insertImage = (url: string) => {
    const img = document.createElement("img");
    img.src = url;
    img.style.maxWidth = "30%";
    img.style.display = "block";
    img.style.margin = "10px 0";
    img.setAttribute("data-attachment", "true");
    contentRef.current?.appendChild(img);
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file && note.id) {
          try {
            const attachment = await uploadAttachment(note.id, file);
            insertImage("http://localhost:8000/storage/" + attachment?.path);
            if (id) {
              const note = await show(id);
              setNote(note);
            }
          } catch (error) {
            toast.error("Failed to upload image");
          }
        }
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    for (const file of files) {
      if (file.type.startsWith("image/") && note.id) {
        try {
          const attachment = await uploadAttachment(note.id, file);
          insertImage("http://localhost:8000/storage/" + attachment?.path);
          if (id) {
            const note = await show(id);
            setNote(note);
          }
        } catch (error) {
          toast.error("Failed to upload image");
        }
      }
    }
  };

  return (
    <Layout>
      <div className="flex flex-col w-full h-[calc(100vh-100px)] mt-20 px-6">
        <div className="flex justify-between w-full items-center gap-4 py-4">
          <input
            type="text"
            value={note.title || ""}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            placeholder="Note Title"
            className="text-xl font-medium focus:outline-none border-b border-slate-300 focus:border-blue-500 pb-1 w-full"
          />

          {tags && tags.length > 0 && (
            <div className="flex flex-col">
              <select
                name="tag"
                id="tag"
                className="px-4 py-1 bg-slate-50 rounded"
                value=""
              >
                <option value="" disabled>
                  Select a tag
                </option>
                {tags.map((tag) => (
                  <option
                    key={tag.id}
                    onClick={() => handleTagChange(tag.id)}
                    value={tag.id}
                  >
                    {tag.name}
                  </option>
                ))}
              </select>

              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag.id}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center"
                    >
                      {tag.name}
                      <button
                        onClick={() => removeTag(tag.id)}
                        className="ml-1 text-blue-800 hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center w-[120px]">
            <button
              onClick={saveNote}
              disabled={isSaving}
              className="w-full px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col py-3">
          <div
            ref={contentRef}
            className="flex-1 p-4 resize-none border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent overflow-auto"
            contentEditable="true"
            id="note"
            onInput={handleNoteInput}
            onPaste={handlePaste}
            onDrop={handleDrop}
          />
        </div>
      </div>
    </Layout>
  );
}

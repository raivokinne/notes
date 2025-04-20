import { useParams } from "react-router-dom";
import { Layout } from "../layouts/Layout";
import { useNotes } from "../hooks/useNotes";
import { useEffect, useState, useRef, ChangeEvent, useCallback } from "react";
import { Note, Tag } from "../types";
import { useTags } from "../hooks/useTags";
import toast from "react-hot-toast";
import { useKey } from "../hooks/useKey";

export function NoteShow() {
  const { id } = useParams<{ id: string }>();
  const { show, update, uploadAttachment } = useNotes();
  const [note, setNote] = useState<Note>({} as Note);
  const [isSaving, setIsSaving] = useState(false);
  const { data: tags } = useTags();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const draggingImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    async function fetchNote() {
      if (id) {
        const data: Note = await show(id);
        setNote(data);
        setSelectedTags(data.tags || []);

        if (contentRef.current) {
          contentRef.current.innerHTML = data.content || "";
        }

        data.attachments?.forEach((img) => {
          insertImage("http://localhost:8000/storage/" + img.path);
        });
      }
    }
    fetchNote();
  }, [id, show]);

  const handleNoteInput = (e: React.FormEvent<HTMLDivElement>) => {
    const tmpDiv = document.createElement("div");
    tmpDiv.innerHTML = e.currentTarget.innerHTML;

    const images = tmpDiv.querySelectorAll("img");
    images.forEach((img) => img.remove());

    const content = tmpDiv.innerHTML;
    setNote({
      ...note,
      content,
    });
  };

  const saveNote = useCallback(async () => {
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
  }, [id, isSaving, note, selectedTags, update]);

  useKey("ctrls", saveNote);

  useEffect(() => {
    const timer = setInterval(() => {
      if (note.content && note.id) {
        saveNote();
      }
    }, 30000);

    return () => clearInterval(timer);
  }, [note.content, note.id, saveNote]);

  const handleTagChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const tagName = e.target.value;
    const selectedTag = tags.find((tag: Tag) => tag.name === tagName);
    if (selectedTag) {
      setSelectedTags((prev) => [...prev, selectedTag]);
    }
  };

  const removeTag = (tagId: number) => {
    setSelectedTags((prev) => prev.filter((tag) => tag.id !== tagId));
  };

  function mouseDown(e: MouseEvent) {
    const img = e.target as HTMLImageElement;
    if (!img) return;

    e.preventDefault();
    setIsDragging(true);
    draggingImgRef.current = img;

    const rect = img.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    img.setAttribute("data-offset-x", offsetX.toString());
    img.setAttribute("data-offset-y", offsetY.toString());

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
  }

  function mouseMove(e: MouseEvent) {
    const img = draggingImgRef.current;
    if (isDragging && img) {
      e.preventDefault();

      const offsetX = parseInt(img.getAttribute("data-offset-x") || "0", 10);
      const offsetY = parseInt(img.getAttribute("data-offset-y") || "0", 10);

      const newLeft = e.clientX - offsetX;
      const newTop = e.clientY - offsetY;

      img.style.left = `${newLeft}px`;
      img.style.top = `${newTop}px`;
    }
  }

  function mouseUp() {
    setIsDragging(false);
    draggingImgRef.current = null;

    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);
  }

  const insertImage = (url: string) => {
    const img = document.createElement("img");
    img.src = url;
    img.addEventListener("mousedown", mouseDown);
    img.style.maxWidth = "30%";
    img.style.display = "block";
    img.style.margin = "10px 0";
    img.style.cursor = "move";
    img.style.position = "absolute";
    contentRef.current?.appendChild(img);
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file && note.id) {
          await uploadImageWithPreview(file, note.id);
        }
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    for (const file of files) {
      if (file.type.startsWith("image/") && note.id) {
        await uploadImageWithPreview(file, note.id);
      }
    }
  };

  const uploadImageWithPreview = async (file: File, noteId: number) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        const previewId = `preview-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`;
        const previewImg = document.createElement("img");
        previewImg.src = event.target.result.toString();
        previewImg.id = previewId;
        previewImg.style.maxWidth = "30%";
        previewImg.style.display = "block";
        previewImg.style.margin = "10px 0";
        previewImg.style.opacity = "0.6";
        previewImg.style.position = "absolute";
        previewImg.style.left = "0px";
        previewImg.style.top = "0px";
        previewImg.addEventListener("mousedown", mouseDown);

        contentRef.current?.appendChild(previewImg);

        try {
          await uploadAttachment(noteId, file);

          const timeout = setTimeout(() => {
            const previewToRemove = document.getElementById(previewId);
            if (previewToRemove) {
              previewToRemove.remove();
            }
          }, 5000);

          if (id) {
            const note = await show(id);
            setNote(note);
          }

          clearTimeout(timeout);
        } catch (error) {
          const previewToRemove = document.getElementById(previewId);
          if (previewToRemove) {
            previewToRemove.remove();
          }
          toast.error("Failed to upload image");
        }
      }
    };
    reader.readAsDataURL(file);
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
                onChange={handleTagChange}
              >
                <option value="" disabled>
                  Select a tag
                </option>
                {tags.map((tag) => (
                  <option key={tag.id}>{tag.name}</option>
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

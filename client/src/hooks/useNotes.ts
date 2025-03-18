import { useCallback, useEffect, useState } from "react";
import { Note, NoteAttachment } from "../types";
import { api } from "../utils/axios";

export const useNotes = () => {
    const [data, setData] = useState<Note[]>([]);
    const [errors, setErrors] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await api.get("/auth/notes");
                setData(res.data.notes);
            } catch (error) {
                setErrors(error as Error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotes()
    }, []);

    const create = useCallback(async () => {
        try {
            const res = await api.post('/auth/notes', {
                title: "New Note",
                content: ""
            });
            setData([...data, res.data.note]);
        } catch (error) {
            setErrors(error as Error);
        }
    }, [data]);

    const update = useCallback(async (note: Note) => {
        try {
            const res = await api.post(`/auth/notes/${note.id}`, { ...note, _method: "PUT" });
            return res.data.note
        } catch (error) {
            setErrors(error as Error);
        }
    }, []);

    const note_delete = useCallback(async (noteId: number) => {
        try {
            await api.post(`/auth/notes/${noteId}`, { _method: "DELETE" });
            setData(data.filter((note) => note.id !== noteId))
        } catch (error) {
            setErrors(error as Error);
        }
    }, [data]);

    const show = useCallback(async (noteId: string) => {
        try {
            const res = await api.get(`/auth/notes/${noteId}`)
            return res.data.note
        } catch (error) {
            setErrors(error as Error)
        }
    }, [])

    const uploadAttachment = useCallback(async (noteId: number, file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('note_id', noteId.toString());
            const res = await api.post(`/auth/note-attachments`, formData);
            return res.data.noteAttachment as NoteAttachment
        } catch (error) {
            setErrors(error as Error)
        }
    }, [])

    const getAllHistory = useCallback(async () => {
        try {
            const res = await api.get('/auth/history');
            return res.data.notes;
        } catch (error) {
            setErrors(error as Error)
        }
    }, [])

    return {
        data,
        errors,
        loading,
        create,
        update,
        show,
        note_delete,
        uploadAttachment,
        getAllHistory
    };
};

import { useCallback, useEffect, useState } from "react";
import { Note } from "../types";
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
            return res.data.attachment
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
        uploadAttachment
    };
};

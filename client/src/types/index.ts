export type Tag = {
    id: number,
    name: string,
    notes: Note[]
}

export type Note = {
    id: number,
    title: string,
    content: string,
    in_history: boolean,
    user_id: number,
    tags: Tag[],
    attachments?: NoteAttachment[],
    shared_with: User[],
    created_at: string,
    updated_at: string
}

export type SharedNote = {
    id: number,
    note_id: number,
    shared_with_user_id: number,
}

export type User = {
    id: number,
    firstname: string,
    lastname: string,
    username: string,
}

export type NoteTag = {
    id: number,
    tag_id: number,
    note_id: number,
}

export type NoteAttachment = {
    id: number,
    note_id: number,
    filename: string,
    path: string,
    mime_type: string,
    size: number
}

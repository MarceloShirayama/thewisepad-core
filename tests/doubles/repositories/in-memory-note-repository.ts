import { randomUUID } from "node:crypto";

import { NoteData, NoteRepository } from "@/use-cases/ports";

export class InMemoryNoteRepository implements NoteRepository {
  private readonly _data: NoteData[];

  constructor(data: NoteData[]) {
    this._data = data;
  }

  async addNote(note: NoteData): Promise<NoteData> {
    note.id = randomUUID();
    this._data.push(note);

    return note;
  }

  async findAllNotesFrom(userId: string): Promise<NoteData[]> {
    return this._data.filter((note) => note.ownerId === userId);
  }

  async findNote(noteId: string): Promise<NoteData | null> {
    const note = this._data.find((note) => note.id === noteId);

    return note || null;
  }

  async remove(noteId: string): Promise<NoteData | null> {
    const noteIndex = this._data.findIndex((note) => note.id === noteId);

    if (noteIndex === -1) return null;

    const [removedNote] = this._data.splice(noteIndex, 1);

    return removedNote;
  }

  async updateTitle(noteId: string, newTitle: string): Promise<boolean> {
    const originalNote = await this.findNote(noteId);

    if (!originalNote) return false;

    originalNote.title = newTitle;
    return true;
  }

  async updateContent(noteId: string, newContent: string): Promise<boolean> {
    const originalNote = await this.findNote(noteId);

    if (!originalNote) return false;

    originalNote.content = newContent;
    return true;
  }
}

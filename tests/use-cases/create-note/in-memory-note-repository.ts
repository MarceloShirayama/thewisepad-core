import { randomUUID } from "node:crypto";

import { NoteData } from "@/entities/note-data";
import { NoteRepository } from "@/use-cases/ports/note-repository";

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
}

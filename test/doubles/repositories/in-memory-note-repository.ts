import { NoteData, NoteRepository } from "src/use-cases/ports";

export class InMemoryNoteRepository implements NoteRepository {
  private readonly _data: NoteData[];
  private idCounter = 0;

  constructor(data: NoteData[]) {
    this._data = data;
  }

  async add(note: NoteData): Promise<NoteData> {
    note.id = this.idCounter.toString();
    this.idCounter++;
    this._data.push(note);

    return note;
  }

  async findAllNotesFrom(userId: string): Promise<NoteData[]> {
    return this._data.filter((note) => note.ownerId === userId);
  }

  async findById(noteId: string): Promise<NoteData | null> {
    const note = this._data.find((note) => note.id === noteId);

    return note || null;
  }

  async remove(noteId: string): Promise<void> {
    const noteIndex = this._data.findIndex((note) => note.id === noteId);

    this._data.splice(noteIndex, 1);
  }

  async updateTitle(noteId: string, newTitle: string): Promise<void> {
    const originalNote = await this.findById(noteId);

    if (originalNote) originalNote.title = newTitle;
  }

  async updateContent(noteId: string, newContent: string): Promise<void> {
    const originalNote = await this.findById(noteId);

    if (originalNote) originalNote.content = newContent;
  }
}

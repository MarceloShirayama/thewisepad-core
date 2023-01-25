import { NoteData } from "@/entities/note-data";

export interface NoteRepository {
  addNote(noteData: NoteData): Promise<NoteData>;
  findAllNotesFrom(userId: string): Promise<NoteData[]>;
  findNote(noteId: string): Promise<NoteData | null>;
  remove(noteId: string): Promise<NoteData | null>;
}

import { NoteData } from "@/use-cases/ports";

export interface NoteRepository {
  addNote(noteData: NoteData): Promise<NoteData>;
  findAllNotesFrom(userId: string): Promise<NoteData[]>;
  findNote(noteId: string): Promise<NoteData | null>;
  remove(noteId: string): Promise<NoteData | null>;
  updateTitle(noteId: string, newTitle: string): Promise<boolean>;
  updateContent(noteId: string, newContent: string): Promise<boolean>;
}

import { NoteData } from "../../use-cases/ports";

export interface NoteRepository {
  add(noteData: NoteData): Promise<NoteData>;
  findAllNotesFrom(userId: string): Promise<NoteData[]>;
  findById(noteId: string): Promise<NoteData | null>;
  remove(noteId: string): Promise<void>;
  updateTitle(noteId: string, newTitle: string): Promise<boolean>;
  updateContent(noteId: string, newContent: string): Promise<boolean>;
}

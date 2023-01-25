import { NoteData } from "@/entities/note-data";

export interface NoteRepository {
  addNote(noteData: NoteData): Promise<NoteData>;
  findAllNotesFrom(userId: string): Promise<NoteData[]>;
}

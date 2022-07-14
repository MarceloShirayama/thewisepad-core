import { NoteData } from '../note-data'

export interface NoteRepository {
  addNote(noteData: NoteData): Promise<NoteData>
  findAllNotesFrom(userId: string): Promise<NoteData[]>
  findNoteById(noteId: string): Promise<NoteData>
  removeNote(noteId: string): Promise<NoteData>
}

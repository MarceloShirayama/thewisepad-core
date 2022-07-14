import { NoteData } from './note-data'

export interface NoteRepository {
  addNote(noteData: NoteData): Promise<NoteData>
  findAllNotesFrom(userId: string): Promise<NoteData[]>
  findNoteById(noteId: string): Promise<NoteData>
  removeNote(noteId: string): Promise<NoteData>
  updateTitle(noteId: string, newTitle: string): Promise<Boolean>
  updateContent(noteId: string, newContent: string): Promise<Boolean>
}

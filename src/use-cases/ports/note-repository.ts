import { NoteData } from './note-data'

export interface NoteRepository {
  add(note: NoteData): Promise<NoteData>
  findAllFromUserId(userId: string): Promise<NoteData[]>
  findById(noteId: string): Promise<NoteData>
  remove(noteId: string): Promise<NoteData>
  updateTitle(noteId: string, newTitle: string): Promise<Boolean>
  updateContent(noteId: string, newContent: string): Promise<Boolean>
}

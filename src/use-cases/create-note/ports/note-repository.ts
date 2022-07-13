import { NoteData } from '../note-data'

export interface NoteRepository {
  addNote(noteData: NoteData): Promise<NoteData>
  finAllNotesFrom(userId: string): Promise<NoteData[]>
}

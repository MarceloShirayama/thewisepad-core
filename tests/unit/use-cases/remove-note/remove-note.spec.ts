import { NoteData } from '@/use-cases/ports/note-data'
import { NoteRepository } from '@/use-cases/ports/note-repository'
import { RemoveNote } from '@/use-cases/remove-note/remove-note'
import { InMemoryNoteRepository } from '../in-memory-note-repository'

describe('Remove note use case', () => {
  const note: NoteData = {
    title: 'my note',
    content: 'some content',
    ownerId: '0',
    ownerEmail: 'valid@mail.com',
    id: '0'
  }

  const noteRepositoryWithANote: NoteRepository = new InMemoryNoteRepository([
    note
  ])

  it('Should remove existing note', async () => {
    const useCase = new RemoveNote(noteRepositoryWithANote)
    const noteId = note.id as string

    const removedNote = await useCase.perform(noteId)

    expect(removedNote).toBe(note)
    expect(await noteRepositoryWithANote.findById(noteId)).toBe(null)
  })

  it('Should return null if note does not exist', async () => {
    const useCase = new RemoveNote(noteRepositoryWithANote)

    const removedNote = await useCase.perform('1')

    expect(removedNote).toBeNull()
  })
})

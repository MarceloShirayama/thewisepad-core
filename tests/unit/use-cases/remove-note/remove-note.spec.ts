import { NoteRepository } from '@/use-cases/create-note/ports/note-repository'
import { RemoveNote } from '@/use-cases/remove-note/remove-note'
import { InMemoryNoteRepository } from '../create-note/in-memory-note-repository'

describe('Remove note use case', () => {
  const note = {
    title: 'my note',
    content: 'some content',
    ownerId: '0',
    id: '0'
  }

  const noteRepositoryWithANote: NoteRepository = new InMemoryNoteRepository([
    note
  ])

  it('Should remove existing note', async () => {
    const useCase = new RemoveNote(noteRepositoryWithANote)

    const removedNote = await useCase.perform(note.id)

    expect(removedNote).toBe(note)
    expect(await noteRepositoryWithANote.findNoteById(note.id)).toBe(null)
  })

  it('Should return null if note does not exist', async () => {
    const useCase = new RemoveNote(noteRepositoryWithANote)

    const removedNote = await useCase.perform('1')

    expect(removedNote).toBeNull()
  })
})

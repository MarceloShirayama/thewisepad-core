import { NoteDataBuilder } from '@/tests/builders'
import { InMemoryNoteRepository } from '@/tests/doubles/repositories'
import { NoteData, NoteRepository } from '@/use-cases/ports'
import { RemoveNote } from '@/use-cases/remove-note'

describe('Remove note use case', () => {
  const note: NoteData = NoteDataBuilder.validNote().build()

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

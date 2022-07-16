import { LoadNotesForUser } from '@/use-cases/load-notes-for-user/load-notes-for-user'
import { NoteData } from '@/use-cases/ports/note-data'
import { NoteRepository } from '@/use-cases/ports/note-repository'
import { NoteDataBuilder } from '../builders/note-builder'
import { InMemoryNoteRepository } from '../repositories/in-memory-note-repository'

describe('Load notes for user use case', () => {
  const note1: NoteData = NoteDataBuilder.validNote().build()

  const note2: NoteData = NoteDataBuilder.validNote()
    .withDifferentTileAndId()
    .build()

  const noteRepositoryWithTwoNotes: NoteRepository = new InMemoryNoteRepository(
    [note1, note2]
  )

  it('Should correctly load notes for a registered user', async () => {
    const useCase = new LoadNotesForUser(noteRepositoryWithTwoNotes)
    const notes: NoteData[] = await useCase.perform(note1.ownerId as string)

    expect(notes).toHaveLength(2)
    expect(notes).toEqual([note1, note2])
  })

  it('Should fail to load notes for user without notes', async () => {
    const useCase = new LoadNotesForUser(noteRepositoryWithTwoNotes)
    const notes: NoteData[] = await useCase.perform('10')

    expect(notes).toHaveLength(0)
  })
})

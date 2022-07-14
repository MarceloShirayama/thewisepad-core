import { NoteData } from '@/use-cases/create-note/note-data'
import { NoteRepository } from '@/use-cases/create-note/ports/note-repository'
import { LoadNotesForUser } from '@/use-cases/load-notes-for-user/load-notes-for-user'
import { InMemoryNoteRepository } from '../create-note/in-memory-note-repository'

describe('Load notes for user use case', () => {
  const validTitle1 = 'my note'
  const validTitle2 = 'my second note'
  const validUserId = '0'
  const someContent = 'some content'
  const someOtherContent = 'some other content'
  const note1: NoteData = {
    title: validTitle1,
    content: someContent,
    ownerId: validUserId,
    id: '0'
  }
  const note2: NoteData = {
    title: validTitle2,
    content: someOtherContent,
    ownerId: validUserId,
    id: '1'
  }
  const noteRepositoryWithTwoNotes: NoteRepository = new InMemoryNoteRepository(
    [note1, note2]
  )
  it('Should correctly load notes for a registered user', async () => {
    const useCase = new LoadNotesForUser(noteRepositoryWithTwoNotes)

    const notes: NoteData[] = await useCase.perform(validUserId)

    expect(notes).toHaveLength(2)
    expect(notes).toEqual([note1, note2])
  })
})

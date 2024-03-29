import { Document, ObjectId } from "mongodb";
import { NoteData, NoteRepository } from "../../../use-cases/ports";
import { MongoHelper } from "./helpers";

export class MongodbNoteRepository implements NoteRepository {
  async add(noteData: NoteData): Promise<NoteData> {
    const noteCollection = await MongoHelper.getCollection("notes");

    const noteClone = {
      title: noteData.title,
      content: noteData.content,
      ownerEmail: noteData.ownerEmail,
      ownerId: noteData.ownerId as string,
      _id: null as unknown as ObjectId,
    };

    await noteCollection.insertOne(noteClone);

    return this.withApplicationId(noteClone);
  }

  async findAllNotesFrom(userId: string): Promise<NoteData[]> {
    const noteCollection = await MongoHelper.getCollection("notes");

    const notesFromUser = await noteCollection
      .find({ ownerId: userId })
      .toArray();

    return notesFromUser.map(this.withApplicationId);
  }

  async findById(noteId: string): Promise<NoteData | null> {
    const noteCollection = await MongoHelper.getCollection("notes");

    const _id = new ObjectId(noteId);

    const note = await noteCollection.findOne({ _id });

    return note ? this.withApplicationId(note) : null;
  }

  async remove(noteId: string): Promise<void> {
    const noteCollection = await MongoHelper.getCollection("notes");

    const _id = new ObjectId(noteId);

    await noteCollection.deleteOne({ _id });
  }

  async updateTitle(noteId: string, newTitle: string): Promise<void> {
    const noteCollection = await MongoHelper.getCollection("notes");

    const _id = new ObjectId(noteId);

    await noteCollection.updateOne(
      { _id },
      {
        $set: {
          title: newTitle,
        },
      }
    );
  }

  async updateContent(noteId: string, newContent: string): Promise<void> {
    const noteCollection = await MongoHelper.getCollection("notes");

    const _id = new ObjectId(noteId);

    await noteCollection.updateOne(
      { _id },
      {
        $set: {
          content: newContent,
        },
      }
    );
  }

  private withApplicationId(dbNote: Document): NoteData {
    return {
      title: dbNote.title,
      content: dbNote.content,
      ownerEmail: dbNote.ownerEmail,
      ownerId: dbNote.ownerId,
      id: dbNote._id.toString(),
    };
  }
}

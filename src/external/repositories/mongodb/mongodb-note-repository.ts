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

    const note = await noteCollection.findOne({ _id: new ObjectId(noteId) });

    return note ? this.withApplicationId(note) : null;
  }

  async remove(noteId: string): Promise<NoteData | null> {
    const noteCollection = await MongoHelper.getCollection("notes");

    const _id = new ObjectId(noteId);

    const noteToRemoved = await noteCollection.findOne({ _id });

    const result = await noteCollection.deleteOne({ _id });

    return result.deletedCount === 1
      ? this.withApplicationId(noteToRemoved as Document)
      : null;
  }

  async updateTitle(noteId: string, newTitle: string): Promise<boolean> {
    const noteCollection = await MongoHelper.getCollection("notes");

    const _id = new ObjectId(noteId);

    const result = await noteCollection.updateOne(
      { _id },
      {
        $set: {
          title: newTitle,
        },
      }
    );

    return result.modifiedCount === 1;
  }

  async updateContent(noteId: string, newContent: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  private withApplicationId(dbNote: Document): NoteData {
    return {
      title: dbNote.title,
      content: dbNote.content,
      ownerEmail: dbNote.ownerId,
      id: dbNote._id.toString(),
    };
  }
}

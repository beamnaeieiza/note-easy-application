import { Request, ResponseToolkit } from "@hapi/hapi";
import { off } from "process";
import {
  DataSource,
  getRepository,
  LessThanOrEqual,
  MoreThan,
  Repository,
} from "typeorm";
import { AppDataSource } from "../data-source";
import { CategoryNote } from "../entity/CategoryNote";
import { Customer } from "../entity/Customer";
import { HistoryNote } from "../entity/HistoryNote";
import { Note } from "../entity/Note";

export class NoteController {
  async getAllNotes(request: Request, h: ResponseToolkit) {
    try {
      const { page = 1, limit = 10 } = request.query as {
        page?: number;
        limit?: number;
      };
      const offset = (page - 1) * limit;
      const noteRepository = AppDataSource.getRepository(Note);
      const customers = await noteRepository.find({
        skip: offset,
        take: limit,
        relations: {
          category: true,
        },
      });
      return h.response(customers).code(200);
    } catch (error) {
      return h.response({ error: "Internal Server Error" }).code(500);
    }
  }

  async getNoteById(request: Request, h: ResponseToolkit) {
    try {
      const { id } = request.params;
      const noteRepository = AppDataSource.getRepository(Note);
      const note = await noteRepository.findOne({
        where: {
          note_id: id,
        },
        relations: {
          category: true,
        },
      });

      if (!note) {
        return h.response({ error: "Note not found" }).code(404);
      }

      return h.response(note).code(200);
    } catch (error) {
      return h.response({ error: "Internal Server Error" }).code(500);
    }
  }

  async getNoteByCustomerId(request: Request, h: ResponseToolkit) {
    try {
      const { page = 1, limit = 10 } = request.query as {
        page?: number;
        limit?: number;
      };
      const offset = (page - 1) * limit;
      const { customerId } = request.params;
      const noteRepository = AppDataSource.getRepository(Note);
      const note = await noteRepository.find({
        where: {
          customer_id: customerId,
        },
        skip: offset,
        take: limit,
      });

      if (!note) {
        return h.response({ error: "Note not found" }).code(404);
      }

      return h.response(note).code(200);
    } catch (error) {
      return h.response({ error: "Internal Server Error" }).code(500);
    }
  }

  async createNoteAndCategory(request: Request, h: ResponseToolkit) {
    try {
      const { customer_id, text, remindAt, category_name } =
        request.payload as any;
      const Filter = require("bad-words");
      const filterWords = new Filter();
      const noteRepository = AppDataSource.getRepository(Note);
      const categoryRepository = AppDataSource.getRepository(CategoryNote);
      const newNote = new Note();
      console.log(customer_id, text, remindAt, category_name);
      if (!text) {
        throw new Error("Text is required");
      }
      const cleanText = filterWords.clean(text);
      newNote.customer_id = customer_id;
      newNote.text = cleanText;
      newNote.remindAt = remindAt;
      newNote.status = false;
      const categoryNote = new CategoryNote();
      categoryNote.category_name = category_name;

      await noteRepository.save(newNote);
      categoryNote.note_id = newNote.note_id;
      await categoryRepository.save(categoryNote);

      console.log(newNote);
      console.log(categoryNote);

      return h.response(newNote).code(201);
    } catch (error) {
      console.error("Error creating note and category:", error);
      return h.response({ error: "Internal Server Error" }).code(500);
    }
  }

  async deleteNote(request: Request, h: ResponseToolkit) {
    try {
      const { noteId } = request.params;
      const noteRepository = AppDataSource.getRepository(Note);
      const note = await noteRepository.findOne({
        where: {
          note_id: noteId,
        },
      });

      await noteRepository.remove(note);

      if (!note) {
        return h.response({ error: "Note not found" }).code(404);
      }

      return h.response(note).code(200);
    } catch (error) {
      console.error("Error updating note and category:", error);
      return h.response({ error: "Internal Server Error" }).code(500);
    }
  }

  async updateNote(request: Request, h: ResponseToolkit) {
    try {
      const { text, remindAt, category_name, status } = request.payload as any;
      const { noteId } = request.params;
      const Filter = require("bad-words");
      const filterWords = new Filter();
      const noteRepository = AppDataSource.getRepository(Note);
      const categoryRepository = AppDataSource.getRepository(CategoryNote);
      const historyRepository = AppDataSource.getRepository(HistoryNote);

      const noteInfo = await noteRepository.findOne({
        where: {
          note_id: noteId,
        },
        relations: {
          category: true,
        },
      });

      await historyRepository.save(noteInfo);
      const cleanText = filterWords.clean(text);
      noteInfo.text = cleanText;
      noteInfo.remindAt = remindAt;
      noteInfo.status = status;

      await noteRepository.save(noteInfo);

      const categoryNote = await categoryRepository.findOne({
        where: {
          note_id: noteId,
        },
      });
      categoryNote.category_name = category_name;

      await categoryRepository.save(categoryNote);

      console.log(noteInfo);
      console.log(categoryNote);

      return h.response(noteInfo).code(201);
    } catch (error) {
      console.error("Error updating note and category:", error);
      return h.response({ error: "Internal Server Error" }).code(500);
    }
  }

  async updateStatusNote(request: Request, h: ResponseToolkit) {
    try {
      const { noteId } = request.params;
      const noteRepository = AppDataSource.getRepository(Note);

      const noteInfo = await noteRepository.findOne({
        where: {
          note_id: noteId,
        },
      });

      noteInfo.status = !noteInfo.status;

      await noteRepository.save(noteInfo);

      console.log(noteInfo);

      return h.response(noteInfo).code(201);
    } catch (error) {
      console.error("Error updating note", error);
      return h.response({ error: "Internal Server Error" }).code(500);
    }
  }

  async getNoteBeforeDueDate(request: Request, h: ResponseToolkit) {
    try {
      const { page = 1, limit = 10 } = request.query as {
        page?: number;
        limit?: number;
      };
      const offset = (page - 1) * limit;
      const { customerId } = request.params;
      const noteRepository = AppDataSource.getRepository(Note);
      const notes = await noteRepository.find({
        where: {
          customer_id: customerId,
          remindAt: MoreThan(new Date()),
        },
        skip: offset,
        take: limit,
      });

      if (!notes) {
        return h.response({ error: "Cannot find note" }).code(404);
      }

      return h.response(notes).code(200);
    } catch (error) {
      console.error("Error getting notes:", error);
      return h.response({ error: "Internal Server Error" }).code(500);
    }
  }

  async getNoteThatPastDueDate(request: Request, h: ResponseToolkit) {
    try {
      const { page = 1, limit = 10 } = request.query as {
        page?: number;
        limit?: number;
      };
      const offset = (page - 1) * limit;
      const { customerId } = request.params;
      const noteRepository = AppDataSource.getRepository(Note);
      const notes = await noteRepository.find({
        where: {
          customer_id: customerId,
          remindAt: LessThanOrEqual(new Date()),
        },
        skip: offset,
        take: limit,
      });

      if (!notes) {
        return h.response({ error: "Cannot find note" }).code(404);
      }

      return h.response(notes).code(200);
    } catch (error) {
      console.error("Error getting notes:", error);
      return h.response({ error: "Internal Server Error" }).code(500);
    }
  }

  async getAllHistoryFromCustomer(request: Request, h: ResponseToolkit) {
    try {
      const { page = 1, limit = 10 } = request.query as {
        page?: number;
        limit?: number;
      };
      const offset = (page - 1) * limit;
      const { customerId } = request.params;
      const noteRepository = AppDataSource.getRepository(HistoryNote);
      const note = await noteRepository.find({
        where: {
          note: {
            customer_id: customerId,
          },
        },
        skip: offset,
        take: limit,
      });

      if (!note) {
        return h.response({ error: "History not found" }).code(404);
      }

      return h.response(note).code(200);
    } catch (error) {
      return h.response({ error: "Internal Server Error" }).code(500);
    }
  }

  async getNoteHistory(request: Request, h: ResponseToolkit) {
    try {
      const { page = 1, limit = 10 } = request.query as {
        page?: number;
        limit?: number;
      };
      const offset = (page - 1) * limit;
      const { noteId } = request.params;
      const noteRepository = AppDataSource.getRepository(HistoryNote);
      const note = await noteRepository.find({
        where: {
          note: {
            note_id: noteId,
          },
        },
        skip: offset,
        take: limit,
      });

      if (!note) {
        return h.response({ error: "History not found" }).code(404);
      }

      return h.response(note).code(200);
    } catch (error) {
      return h.response({ error: "Internal Server Error" }).code(500);
    }
  }

  async getNoteFromCategoryName(request: Request, h: ResponseToolkit) {
    try {
      const { page = 1, limit = 10 } = request.query as {
        page?: number;
        limit?: number;
      };
      const offset = (page - 1) * limit;
      const { customerId } = request.params;
      const { categoryName } = request.params;
      const noteRepository = AppDataSource.getRepository(Note);
      const note = await noteRepository.find({
        where: {
          customer_id: customerId,
          category: {
            category_name: categoryName,
          },
        },
        relations: {
          category: true,
        },
        skip: offset,
        take: limit,
      });

      if (!note) {
        return h.response({ error: "Category not found" }).code(404);
      }

      return h.response(note).code(200);
    } catch (error) {
      return h.response({ error: "Internal Server Error" }).code(500);
    }
  }

  async getFinishedNote(request: Request, h: ResponseToolkit) {
    try {
      const { page = 1, limit = 10 } = request.query as {
        page?: number;
        limit?: number;
      };
      const offset = (page - 1) * limit;
      const { customerId } = request.params;
      const noteRepository = AppDataSource.getRepository(Note);
      const note = await noteRepository.find({
        where: {
          customer_id: customerId,
          status: true,
        },
        skip: offset,
        take: limit,
      });

      if (!note) {
        return h.response({ error: "History not found" }).code(404);
      }

      return h.response(note).code(200);
    } catch (error) {
      return h.response({ error: "Internal Server Error" }).code(500);
    }
  }

  async getUnfinishedNote(request: Request, h: ResponseToolkit) {
    try {
      const { page = 1, limit = 10 } = request.query as {
        page?: number;
        limit?: number;
      };
      const offset = (page - 1) * limit;
      const { customerId } = request.params;
      const noteRepository = AppDataSource.getRepository(Note);
      const note = await noteRepository.find({
        where: {
          customer_id: customerId,
          status: true,
        },
        skip: offset,
        take: limit,
      });

      if (!note) {
        return h.response({ error: "History not found" }).code(404);
      }

      return h.response(note).code(200);
    } catch (error) {
      return h.response({ error: "Internal Server Error" }).code(500);
    }
  }
}

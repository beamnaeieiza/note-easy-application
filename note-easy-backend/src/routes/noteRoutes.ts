import { Server } from "@hapi/hapi";
import { NoteController } from "../controllers/noteController";

export const initNoteRoutes = (server: Server) => {
  const noteController = new NoteController();

  server.route({
    method: "GET",
    path: "/notes",
    handler: noteController.getAllNotes.bind(noteController),
  });

  server.route({
    method: "GET",
    path: "/notes/{id}",
    handler: noteController.getNoteById.bind(noteController),
  });

  server.route({
    method: "GET",
    path: "/notes/customer/{customerId}",
    handler: noteController.getNoteByCustomerId.bind(noteController),
  });

  server.route({
    method: "GET",
    path: "/notes/customer/{customerId}/pastduedate",
    handler: noteController.getNoteThatPastDueDate.bind(noteController),
  });

  server.route({
    method: "GET",
    path: "/notes/customer/{customerId}/incomingduedate",
    handler: noteController.getNoteBeforeDueDate.bind(noteController),
  });

  server.route({
    method: "GET",
    path: "/notes/customer/{customerId}/getallhistory",
    handler: noteController.getAllHistoryFromCustomer.bind(noteController),
  });

  server.route({
    method: "GET",
    path: "/notes/{noteId}/history",
    handler: noteController.getNoteHistory.bind(noteController),
  });

  server.route({
    method: "GET",
    path: "/notes/customer/{customerId}/category/{categoryName}",
    handler: noteController.getNoteFromCategoryName.bind(noteController),
  });

  server.route({
    method: "GET",
    path: "/notes/customer/{customerId}/finished",
    handler: noteController.getFinishedNote.bind(noteController),
  });

  server.route({
    method: "POST",
    path: "/notes/create",
    handler: noteController.createNoteAndCategory.bind(noteController),
  });

  server.route({
    method: "PATCH",
    path: "/notes/update/{noteId}",
    handler: noteController.updateNote.bind(noteController),
  });

  server.route({
    method: "PATCH",
    path: "/notes/updatestatus/{noteId}",
    handler: noteController.updateStatusNote.bind(noteController),
  });

  server.route({
    method: "DELETE",
    path: "/notes/delete/{noteId}",
    handler: noteController.deleteNote.bind(noteController),
  });
};

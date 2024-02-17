import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import DatePicker from "react-date-picker";
import axios from "axios";
import "react-date-picker/dist/DatePicker.css";

type Note = {
  note_id: number;
  customer_id: number;
  text: string;
  createdAt: Date;
  remindAt: Date;
  updatedAt: Date;
  status: boolean;
  category: Category;
};

type Category = {
  category_id: number;
  note_id: number;
  category_name: string;
};

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [dateValue, setDateValue] = useState<Value>(new Date());
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [status, setStatus] = useState(true);

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const data = "";

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get("http://localhost:3000/notes");
        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching notes", error);
      }
    };
    fetchNotes();
    const intervalId = setInterval(fetchNotes, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleNoteClick = async (note: Note) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/notes/${note.note_id}`
      );
      setSelectedNote(response.data);
      setTitle(response.data.text);
      setText(response.data.text);
      setCategoryName(response.data.category.category_name);
      setDateValue(response.data.remindAt);
      setStatus(response.data.status);
    } catch (error) {
      console.error("Error fetching note", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      console.log("text", text);
      console.log("categoryName", categoryName);
      console.log("ThisisRemindAt", dateValue);
      const response = await axios.post("http://localhost:3000/notes/create", {
        customer_id: 1,
        text: text,
        remindAt: dateValue,
        category_name: categoryName,
      });
      let newNote = await response.data;
      newNote = {
        ...newNote,
        createdAt: new Date(),
        updatedAt: new Date(),
        remindAt: dateValue,
        category: { category_name: categoryName },
      };
      setNotes([newNote, ...notes]);
      console.log("response", response);
    } catch (error) {
      console.error("Error creating note", error);
    }
  };

  const handleUpdateNote = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedNote) {
      return;
    }

    try {
      const dateUS = dateValue;
      const response = await axios.patch(
        `http://localhost:3000/notes/update/${selectedNote.note_id}`,
        {
          text: text,
          remindAt: dateValue,
          category_name: categoryName,
          status: status,
        }
      );

      const updatedNotes = notes.map((note) =>
        note.note_id === selectedNote.note_id ? response.data : note
      );
      setNotes(updatedNotes);
      setTitle("");
      setText("");
      setSelectedNote(null);
    } catch (error) {
      console.error("Error updating note", error);
    }
  };
  const handleCancel = () => {
    setText("");
    setCategoryName("");
    setSelectedNote(null);
  };

  const deleteNote = async (event: React.MouseEvent, noteId: number) => {
    try {
      await axios.delete(`http://localhost:3000/notes/delete/${noteId}`);

      const updatedNotes = notes.filter((note) => note.note_id !== noteId);
      setNotes(updatedNotes);

      if (selectedNote && selectedNote.note_id === noteId) {
        setTitle("");
        setText("");
        setSelectedNote(null);
      }
    } catch (error) {
      console.error("Error deleting note", error);
    }
  };

  return (
    <div className="app-container">
      <form className="note-form" onSubmit={(e) => handleSubmit(e)}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Text"
          required
        ></input>

        <input
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Category Name"
          required
        ></input>
        <div>
          <DatePicker
            locale="en-US"
            onChange={setDateValue}
            value={dateValue}
          />
        </div>

        {selectedNote ? (
          <div className="edit-buttons">
            <div className="checkbox-container">
              <label>
                Checkmark
                <input
                  type="checkbox"
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                />
              </label>
            </div>
            <button onClick={handleUpdateNote} type="submit">
              Save
            </button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <button type="submit">Add Note</button>
        )}
      </form>

      {selectedNote && (
        <div className="selected-note">
          <h2>{selectedNote.text}</h2>
          <p>Category Name: {selectedNote.category.category_name}</p>
          <p>Created at: {new Date(selectedNote.createdAt).toLocaleString()}</p>
          <p>Updated at: {new Date(selectedNote.updatedAt).toLocaleString()}</p>
          <p>Remind at: {new Date(selectedNote.remindAt).toLocaleString()}</p>
          <p>Status: {selectedNote.status ? "Finished" : "Unfinished"}</p>
        </div>
      )}

      <div className="notes-grid">
        {notes.map((note) => (
          <div className="note-item" onClick={() => handleNoteClick(note)}>
            <div className="notes-header">
              <button onClick={(e) => deleteNote(e, note.note_id)}>x</button>
            </div>
            <h2>{note.text}</h2>
            <p>Customer ID :{note.customer_id}</p>
            <p>Created At : {new Date(note.updatedAt).toLocaleString()}</p>
            <p>Remind At : {new Date(note.remindAt).toLocaleString()}</p>
            <p>Status : {note.status ? "Finished" : "Unfinished"}</p>
            <p>Category Name : {note.category.category_name}</p>
            <p>
              Status :{" "}
              <span
                style={{
                  color: new Date(note.remindAt) < new Date() ? "red" : "green",
                }}
              >
                {new Date(note.remindAt) < new Date()
                  ? "Past due date"
                  : "Not yet past the due date"}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

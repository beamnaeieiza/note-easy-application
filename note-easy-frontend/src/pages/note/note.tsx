import React, { useState } from 'react';
import Note from './note';

interface Note {
  title: string;
  content: string;
}

const NotePage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreateNote = (event: React.FormEvent) => {
    event.preventDefault();
    setNotes(prevNotes => [...prevNotes, { title, content }]);
    setTitle('');
    setContent('');
  };

  return (
    <div>
      <h2>Create Note</h2>
      <form onSubmit={handleCreateNote}>
        <label>
          Title:
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
        </label>
        <label>
          Content:
          <textarea value={content} onChange={e => setContent(e.target.value)} />
        </label>
        <input type="submit" value="Create" />
      </form>

      <h2>Notes</h2>
      {/* {notes.map((note, index) => (
        <Note key={index} title={note.title} content={note.content} />
      ))} */}
    </div>
  );
};

export default NotePage;
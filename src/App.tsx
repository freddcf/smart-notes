import { ChangeEvent, useState } from "react";
import NewNoteCard from "./components/NewNoteCard";
import NoteCard from "./components/NoteCard";

interface Note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem("notes");
    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }
    return [];
  });

  function onNoteCreate(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content: content,
    };

    const notesArray = [newNote, ...notes];

    setNotes(notesArray);

    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function onNoteDelete(id: string) {
    const notesArray = notes.filter((note) => note.id !== id);
    setNotes(notesArray);

    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;
    setSearch(query);
  }

  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      : notes;

  return (
    <div className="mx-auto px-5 md:px-10 max-w-6xl my-12 space-y-6">
      <h1 className="text-emerald-600 text-lg md:text-2xl font-regular lowercase tracking-wider">
        {"<Smart-notes/>"}
      </h1>
      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent text-xl md:text-3xl font-semibold tracking-tighter placeholder:text-slate-500 outline-none"
          onChange={handleSearch}
        />
      </form>
      <div className="h-px bg-slate-700" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onNoteCreate={onNoteCreate} />
        {filteredNotes.map((note) => (
          <NoteCard key={note.id} note={note} onNoteDelete={onNoteDelete} />
        ))}
      </div>
    </div>
  );
}

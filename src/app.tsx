import { ChangeEvent, useState } from 'react'

import logo from '@/assets/logo-nlw-expert.svg'

import { NewNoteCard } from './components/new-note-card'
import { NoteCard } from './components/note-card'

export interface AppNoteProps {
  id: string
  date: string
  content: string
}

function compareDates(a: { date: string }, b: { date: string }) {
  return Date.parse(b.date) - Date.parse(a.date)
}

export function App() {
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState<AppNoteProps[]>(() => {
    const notesOnStorage = localStorage.getItem('notes')

    if (notesOnStorage) {
      const notesParsed = JSON.parse(notesOnStorage)

      const notesShorted = notesParsed.sort(compareDates)

      return notesShorted
    }

    return []
  })

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      content,
    }

    const notesArray = [...notes, newNote]

    const notesShorted = notesArray.sort(compareDates)

    setNotes(notesShorted)

    localStorage.setItem('notes', JSON.stringify(notesShorted))
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter((note) => {
      return note.id !== id
    })

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  const filteredNotes =
    search !== ''
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
        )
      : notes

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value

    setSearch(query)
  }

  return (
    <div className="mx-auto my-12 w-full max-w-6xl space-y-6 px-4">
      <img src={logo} alt="Logo NLW Expert Nodes" />

      <form>
        <input
          type="text"
          placeholder="Busque em suas notas..."
          className="w-full rounded-lg bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500 "
          onChange={handleSearch}
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid auto-rows-[250px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes?.map((note) => {
          return (
            <NoteCard onNoteDeleted={onNoteDeleted} key={note.id} note={note} />
          )
        })}
        <div className="fixed bottom-0 left-0 right-0 flex justify-end p-6">
          <span className="mt-auto text-sm text-slate-400">
            Você tem {notes.length} notas.
          </span>
        </div>
      </div>
    </div>
  )
}

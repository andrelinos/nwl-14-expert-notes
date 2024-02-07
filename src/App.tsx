import logo from '@/assets/logo-nlw-expert.svg'
import { NoteCard } from '@/components/note-card'

import { NewNoteCard } from './components/new-note-card'

export function App() {
  const note = { date: new Date(), content: 'Hello world' }
  return (
    <div className="mx-auto my-12 w-full max-w-6xl space-y-6 px-4">
      <img src={logo} alt="Logo NLW Expert Nodes" />

      <form>
        <input
          type="text"
          placeholder="Busque em suas notas..."
          className="w-full rounded-lg bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500 "
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid auto-rows-[250px] grid-cols-3 gap-4">
        <NewNoteCard />

        <NoteCard note={note} />
      </div>
    </div>
  )
}

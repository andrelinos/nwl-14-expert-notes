import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

interface DialogDeleteProps {
  onNoteDeleted: () => void
  noteId?: string
}

export function DialogDelete({ onNoteDeleted }: DialogDeleteProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="group w-full bg-slate-800 p-4 text-center font-medium text-slate-300 outline-none transition-all">
        Deseja{' '}
        <span className="text-red-400 underline-offset-4 hover:underline-offset-4 group-hover:underline">
          apagar esta nota
        </span>
        ?
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-slate-900 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Close
            aria-label="Close"
            className="absolute right-0 top-0 z-20 bg-slate-800 p-1.5 text-slate-400 transition-all hover:text-slate-100"
          >
            <X className="size-5" />
          </Dialog.Close>

          <Dialog.Title className="text-xl font-medium">
            Quer mesmo apagar esta nota?
          </Dialog.Title>

          <Dialog.Description className="py-5 leading-normal text-slate-400">
            Ao apagar esta nota, ela não poderá ser mais recuperada.
          </Dialog.Description>

          <div className="mt-[25px] flex justify-end gap-4">
            <Dialog.Close asChild>
              <button className="flex flex-1 items-center justify-center rounded-md bg-slate-800 px-6 py-4 text-center font-medium text-slate-300 outline-none transition-all hover:brightness-105">
                Cancelar
              </button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button
                type="button"
                className="flex flex-1 items-center justify-center rounded-md bg-slate-800 px-6 py-4 text-center font-medium text-slate-300 outline-none transition-all hover:bg-red-400 hover:text-slate-900 hover:brightness-105"
                onClick={onNoteDeleted}
              >
                Excluir
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

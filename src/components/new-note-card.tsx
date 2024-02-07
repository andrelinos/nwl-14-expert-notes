import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import classNames from 'classnames'
import { X } from 'lucide-react'
import { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const signInFormSchema = z.object({
  note: z.string().min(15, 'Obrigatório no mínimo 15 caracteres.'),
})

type SignInFormProps = z.infer<typeof signInFormSchema>

export function NewNoteCard() {
  const [shouldShowOnboard, setShouldShowOnboarding] = useState(true)

  function handleStartEditor() {
    setShouldShowOnboarding(false)
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    if (event.target.value === '') {
      setShouldShowOnboarding(true)
    }
  }

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm<SignInFormProps>({
    resolver: zodResolver(signInFormSchema),
  })

  function handleSaveNote(values: SignInFormProps) {
    try {
      toast.success('Nota Salva com sucesso!')
      console.log(values)
    } catch (error) {
      toast.error('Oops! Ocorreu um erro ao salvar nota.')
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="relative flex flex-col gap-3 overflow-hidden rounded-md bg-slate-700 p-5 text-left outline-none hover:ring-2 hover:ring-slate-600 focus:ring-lime-400 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-4 text-slate-400">
          Grave uma nota em áudio que será convertida para texto automaticamente
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="m fixed left-1/2 top-1/2 flex h-[60vh] w-full max-w-[640px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-md bg-slate-700 outline-none">
          <Dialog.Close className="absolute right-0 top-0 z-20 bg-slate-800 p-1.5 text-slate-400 transition-all hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>

          <form
            className="flex flex-1 flex-col"
            onSubmit={handleSubmit(handleSaveNote)}
          >
            <div className="relative flex flex-1 flex-col gap-3 p-5 ">
              <span>Adicionar nota</span>
              {shouldShowOnboard ? (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{' '}
                  <button className="font-medium text-lime-400 underline-offset-4 transition-all hover:underline hover:underline-offset-4">
                    gravando uma nota
                  </button>{' '}
                  em áudio ou se preferir{' '}
                  <button
                    className="font-medium text-lime-400 underline-offset-4 transition-all hover:underline hover:underline-offset-4"
                    onClick={handleStartEditor}
                  >
                    utilize apenas texto
                  </button>
                  .
                </p>
              ) : (
                <textarea
                  id="note"
                  className={classNames(
                    'relative mb-2 flex-1 resize-none rounded-md bg-transparent p-4 text-sm leading-6 text-slate-400 outline-none',
                    {
                      'outline-none ring-1 ring-red-300 ring-opacity-50':
                        errors.note,
                    },
                  )}
                  autoFocus
                  {...register('note', {
                    onChange: handleContentChanged,
                  })}
                />
              )}
              <label
                htmlFor="note"
                className="absolute bottom-2 right-4 text-xs text-red-400 opacity-70"
              >
                {errors.note?.message}
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-lime-400 py-4 text-center font-medium text-lime-950 outline-none transition-all hover:brightness-95"
              disabled={isSubmitting}
            >
              Salvar nota
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

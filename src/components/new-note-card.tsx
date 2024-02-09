import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import classNames from 'classnames'
import { X } from 'lucide-react'
import { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { NodeProps } from './note-card'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

const signInFormSchema = z.object({
  content: z.string().min(1, 'Obrigatório.'),
})

const SpeechRecognitionAPI =
  window.SpeechRecognition || window.webkitSpeechRecognition

const speechRecognition = new SpeechRecognitionAPI()

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [shouldShowOnboard, setShouldShowOnboarding] = useState(true)

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<NodeProps>({
    resolver: zodResolver(signInFormSchema),
  })

  function handleStartEditor() {
    setShouldShowOnboarding(false)
    setIsRecording(false)
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    const textValue = event.target.value
    if (textValue === '') {
      setShouldShowOnboarding(true)
    }
  }

  function handleSaveNote({ content }: { content: string }) {
    try {
      onNoteCreated(content)
      setShouldShowOnboarding(true)

      toast.success('Nota Salva com sucesso!')
    } catch (error) {
      toast.error('Oops! Ocorreu um erro ao salvar nota.')
    }
    reset({ content: '' })
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

    if (isSpeechRecognitionAPIAvailable) {
      return toast.warning(
        'Infelizmente seu navegador não suporta a API de gravação!',
      )
    }

    setShouldShowOnboarding(false)
    setIsRecording(true)

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setValue('content', transcription)
    }

    speechRecognition.onerror = (event) => {
      console.log(event)
    }

    speechRecognition?.start()
  }

  function handleStopRecording() {
    setIsRecording(false)

    speechRecognition?.stop()
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
        <Dialog.Content className="fixed inset-0 flex w-full flex-col overflow-hidden bg-slate-700 outline-none md:inset-auto md:left-1/2 md:top-1/2 md:h-[60vh] md:max-w-[640px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-md">
          <Dialog.Close className="absolute right-0 top-0 z-20 bg-slate-800 p-1.5 text-slate-400 transition-all hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>

          <form className="flex flex-1 flex-col">
            <div className="relative flex flex-1 flex-col gap-3 p-5 ">
              <span>Adicionar nota</span>
              {shouldShowOnboard ? (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{' '}
                  <button
                    type="button"
                    className="font-medium text-lime-400 underline-offset-4 transition-all hover:underline hover:underline-offset-4"
                    onClick={handleStartRecording}
                  >
                    gravando uma nota
                  </button>{' '}
                  em áudio ou se preferir{' '}
                  <button
                    type="button"
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
                        errors.content,
                    },
                  )}
                  autoFocus
                  {...register('content', {
                    onChange: handleContentChanged,
                  })}
                />
              )}
              <label
                htmlFor="note"
                className="absolute bottom-2 right-4 text-xs text-red-400 opacity-70"
              >
                {errors.content?.message}
              </label>
            </div>

            {isRecording ? (
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 bg-slate-900 py-4 text-center font-medium text-slate-300 outline-none transition-all hover:brightness-105"
                disabled={isSubmitting}
                onClick={handleStopRecording}
              >
                <div className="size-3 animate-pulse rounded-full bg-red-500" />
                Gravando! (clique p/interromper)
              </button>
            ) : (
              <button
                type="button"
                className="w-full bg-lime-400 py-4 text-center font-medium text-lime-950 outline-none transition-all hover:brightness-95"
                disabled={isSubmitting}
                onClick={handleSubmit(handleSaveNote)}
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

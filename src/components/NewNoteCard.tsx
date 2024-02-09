import * as Dialog from "@radix-ui/react-dialog";
import { Mic, X } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";

interface NewNoteCardProps {
  onNoteCreate: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null = null;

export default function NewNoteCard({ onNoteCreate }: NewNoteCardProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [content, setContent] = useState("");

  function handleContentChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value.trimStart());
  }

  function handleSaveNote() {
    if (content == "") {
      toast.error("Notas vazias não podem ser armazenadas");
      return;
    }
    onNoteCreate(content);
    setContent("");

    toast.success("Nota Criada com sucesso");
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    if (!isSpeechRecognitionAPIAvailable) {
      alert("Infelizmente seu navegador não suporta a API de gravação...");
    }

    setIsRecording(true);

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeechRecognitionAPI();

    speechRecognition.lang = "pt-BR";
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (event) => {
      let transcription = content + " ";
      transcription += Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, "");
      setContent(transcription);
    };

    speechRecognition.onerror = (event) => {
      setIsRecording(false);
      alert("Erro na captação da API de gravação, tente recarregar a página");
      console.error(`Speech recognition error detected: ${event.error}`);
    };

    speechRecognition.start();
  }

  function handleStopRecording() {
    setIsRecording(false);

    if (speechRecognition !== null) {
      speechRecognition.stop();
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md flex flex-col text-left bg-slate-700 p-5 gap-3 outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-emerald-500">
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100 outline-none focus-visible:bg-slate-500">
            <X className="sizes-5 focus-visible:ring-2" />
          </Dialog.Close>

          <form className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Adicionar nota
              </span>

              <textarea
                autoFocus
                className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                placeholder="Digite uma nota..."
                onChange={handleContentChange}
                value={content}
                disabled={isRecording}
              />
              <span
                hidden={content != ""}
                className="text-sm leading-6 text-slate-400"
              >
                Dica: Comece escrevendo uma nota de texto ou se preferir utilize
                áudio!
              </span>
            </div>

            {isRecording ? (
              <button
                type="button"
                onClick={handleStopRecording}
                className="w-full h-14 flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm font-medium text-slate-300 outline-none focus-visible:bg-slate-500"
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                Gravando! (clique para interromper)
              </button>
            ) : (
              <div className="flex flex-row h-14">
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="w-full bg-emerald-600 py-4 text-center text-sm font-medium text-slate-100 outline-none hover:bg-emerald-700 focus-visible:bg-emerald-800"
                >
                  Salvar nota
                </button>
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="bg-emerald-600 p-2 text-center text-sm font-medium text-slate-100 outline-none hover:bg-emerald-700 focus-visible:bg-emerald-800"
                >
                  <div className="bg-slate-900 p-2 rounded-md">
                    <Mic />
                  </div>
                </button>
              </div>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

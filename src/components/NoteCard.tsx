import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";

interface NoteCardProps {
  note: {
    id: string;
    date: Date;
    content: string;
  };
  onNoteDelete: (id: string) => void;
}

export default function NoteCard({ note, onNoteDelete }: NoteCardProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md text-left flex flex-col bg-slate-800 p-5 gap-3 overflow-hidden relative outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-emerald-500">
        <span className="text-sm font-medium text-slate-300">
          {formatDistanceToNow(note.date, {
            locale: ptBR,
            addSuffix: true,
          })}
        </span>
        <textarea
          className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 w-full outline-none overflow-hidden pointer-events-none"
          disabled
          value={note.content}
        />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100 outline-none focus-visible:bg-slate-500">
            <X className="sizes-5" />
          </Dialog.Close>

          <div className="flex flex-1 flex-col gap-3 p-5">
            <span className="text-sm font-medium text-slate-300">
              {formatDistanceToNow(note.date, {
                locale: ptBR,
                addSuffix: true,
              })}
            </span>
            {/* <p className="text-sm leading-6 text-slate-400">{note.content}</p> */}
            <textarea
              className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
              value={note.content}
              disabled
            />
          </div>

          <button
            type="button"
            onClick={() => onNoteDelete(note.id)}
            className="w-full bg-slate-800 py-4 text-center text-sm font-medium text-slate-300 outline-none group hover:bg-red-900 focus-visible:bg-red-900"
          >
            Deseja{" "}
            <span className="text-red-400 group-hover:text-slate-300">
              apagar essa nota
            </span>
            ?
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

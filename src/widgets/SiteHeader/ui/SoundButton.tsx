import { Music2 } from "lucide-react";

/** Кнопка звука — та же, что в шапке, рамка `ink-muted` */
export function SoundButton() {
  return (
    // TODO: подключить к фоновому аудио, когда появится features/ambient-sound
    <button
      type="button"
      aria-label="Включить звук"
      className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-ink-muted text-cream transition-colors hover:border-cream"
    >
      <Music2 className="size-4" strokeWidth={1.5} />
    </button>
  );
}

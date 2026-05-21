interface BackButtonProps {
  onClick: () => void;
}

export default function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-transparent border-none text-white/35 font-[family-name:var(--font-barlow-condensed)] text-xs font-semibold tracking-[2px] uppercase cursor-pointer py-4 px-6 transition-colors duration-200 hover:text-white"
    >
      <span className="text-base">←</span> Retour
    </button>
  );
}

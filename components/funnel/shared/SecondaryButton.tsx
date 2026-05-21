import { type ButtonHTMLAttributes } from "react";

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function SecondaryButton({
  children,
  ...props
}: SecondaryButtonProps) {
  return (
    <button
      {...props}
      className={`flex items-center justify-center gap-2.5 bg-transparent text-white font-[family-name:var(--font-barlow-condensed)] text-[13px] font-semibold tracking-[2px] uppercase py-3.5 px-7 border border-white/30 cursor-pointer transition-all duration-200 w-full max-w-[400px] mx-auto mt-3 hover:border-white ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

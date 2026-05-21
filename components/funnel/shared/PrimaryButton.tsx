import { type ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function PrimaryButton({
  children,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      {...props}
      className={`btn-shimmer items-center gap-3 bg-white text-black font-(family-name:--font-barlow-condensed) text-[15px] font-bold tracking-[2.5px] uppercase py-4.5 px-9 border-none cursor-pointer transition-all duration-200 w-full justify-center mx-auto flex hover:bg-accent hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${props.className ?? ""}`}
    >
      {children}
      <span className="text-lg transition-transform duration-200 group-hover:translate-x-1">
        →
      </span>
    </button>
  );
}

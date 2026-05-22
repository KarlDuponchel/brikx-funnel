import Image from "next/image";
import Link from "next/link";

interface StepperProps {
  currentScreen: number;
  totalScreens: number;
}

export default function Stepper({ currentScreen, totalScreens }: StepperProps) {
  return (
    <nav className="fixed top-0 left-0 w-full z-100 bg-black/92 backdrop-blur-sm border-b border-border px-4">
      <div className="flex items-center justify-between max-w-225 mx-auto py-2 gap-1.5">
        <Link className="shrink-0" href={"/"}>
          <Image src="/logo-brikx.png" alt="brikx." loading="eager" width={100} height={42} className="block" />
        </Link>
        <div className="flex items-center gap-0 flex-1 justify-end">
          {Array.from({ length: totalScreens }, (_, i) => {
            const step = i + 1;
            const isActive = step === currentScreen;
            const isDone = step < currentScreen;
            return (
              <div key={step} className="flex items-center">
                {i > 0 && (
                  <div className="w-4 h-px bg-grey-mid shrink-0" />
                )}
                <div
                  className={`h-2 rounded-full shrink-0 transition-all duration-300 ${
                    isActive
                      ? "w-6 bg-white rounded-[4px]"
                      : isDone
                        ? "w-2 bg-grey-light"
                        : "w-2 bg-grey-mid"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

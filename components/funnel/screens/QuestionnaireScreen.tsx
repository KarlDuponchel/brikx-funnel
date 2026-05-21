import { useState } from "react";
import type { QuestionnaireData } from "@/lib/types";
import { QUESTIONS } from "@/lib/constants";
import BackButton from "../shared/BackButton";
import PrimaryButton from "../shared/PrimaryButton";

interface QuestionnaireScreenProps {
  questionnaire: QuestionnaireData;
  setQuestionnaire: React.Dispatch<React.SetStateAction<QuestionnaireData>>;
  onSubmit: () => void;
  goTo: (n: number) => void;
}

export default function QuestionnaireScreen({
  questionnaire,
  setQuestionnaire,
  onSubmit,
  goTo,
}: QuestionnaireScreenProps) {
  const [currentQ, setCurrentQ] = useState(1);

  const nextQ = (n: number) => {
    if (n <= 4) setCurrentQ(n);
  };

  const getValue = (field: keyof QuestionnaireData): string => {
    const val = questionnaire[field];
    return typeof val === "string" ? val : "";
  };

  const setValue = (field: string, val: string | number) => {
    setQuestionnaire((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <div>
      <BackButton onClick={() => goTo(5)} />
      <div className="max-w-[560px] mx-auto px-6 pt-6 pb-16">
        {/* Progress bar */}
        <div className="flex gap-1.5 mb-10">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className={`flex-1 h-0.5 transition-colors duration-300 ${
                n <= currentQ ? "bg-white" : "bg-grey-mid"
              }`}
            />
          ))}
        </div>

        {QUESTIONS.map((q) => (
          <div
            key={q.num}
            className={currentQ === q.num ? "block fade-up" : "hidden"}
          >
            <p className="font-[family-name:var(--font-barlow-condensed)] text-[11px] font-bold tracking-[3px] uppercase text-grey-light mb-2.5">
              Question {q.num} / {q.total}
            </p>
            <h3 className="font-[family-name:var(--font-anton)] text-[clamp(20px,5vw,32px)] uppercase mb-7 leading-[1.15] whitespace-pre-line">
              {q.question}
            </h3>

            {q.type === "input" && (
              <input
                type="text"
                value={getValue(q.field)}
                onChange={(e) => setValue(q.field, e.target.value)}
                placeholder={q.placeholder}
                className="w-full bg-grey border border-border text-white font-[family-name:var(--font-barlow)] text-[15px] py-4 px-[18px] outline-none transition-[border-color] duration-200 focus:border-white/50 placeholder:text-white/20"
              />
            )}

            {q.type === "textarea" && (
              <textarea
                value={getValue(q.field)}
                onChange={(e) => setValue(q.field, e.target.value)}
                placeholder={q.placeholder}
                className="w-full bg-grey border border-border text-white font-[family-name:var(--font-barlow)] text-[15px] p-[18px] min-h-[120px] resize-y outline-none transition-[border-color] duration-200 focus:border-white/50 placeholder:text-white/20"
              />
            )}

            {q.type === "rating" && (
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setValue(q.field, n)}
                    className={`w-[42px] h-[42px] border font-[family-name:var(--font-barlow-condensed)] text-sm font-bold cursor-pointer transition-all duration-150 ${
                      questionnaire.motivation === n
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-white border-border hover:bg-white hover:text-black hover:border-white"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6">
              {q.num < 4 ? (
                <PrimaryButton onClick={() => nextQ(q.num + 1)}>
                  Suivant
                </PrimaryButton>
              ) : (
                <PrimaryButton
                  onClick={onSubmit}
                  disabled={questionnaire.motivation === null}
                >
                  Envoyer mes réponses
                </PrimaryButton>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

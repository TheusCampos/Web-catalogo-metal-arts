import React from "react";

type CornerPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";
type CornerVariant = "leaves" | "tools" | "hybrid" | "subtle-branch" | "plane" | "saw";

interface WoodcraftCornerDecorProps {
  position?: CornerPosition;
  variant?: CornerVariant;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

/**
 * Vetor de Ferramenta: Plaina Manual de Madeira
 */
function HandPlaneSvg({
  className = "w-full h-full text-stone-700/40 dark:text-stone-300/30",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 78H88C91 78 94 75 94 72L90 60C89 57 86 55 83 55H70L62 38C60 35 57 34 54 36L48 40V55H32C28 55 24 57 22 61L14 74C13 76 14 78 16 78Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M56 36L44 65" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M60 48L68 55" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M74 55C75 48 78 42 84 40C88 38 90 42 88 47C86 51 83 53 82 55"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26 55C24 50 25 44 28 43C31 42 32 46 31 55"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Vetor de Ferramenta: Disco de Serra Circular
 */
function CircularBladeSvg({
  className = "w-full h-full text-stone-700/40 dark:text-stone-300/30",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="12" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="50" r="4" fill="currentColor" fillOpacity="0.7" />
      <path
        d="M50 14L54 22L62 16L64 25L74 22L73 31L83 31L79 40L88 43L82 50L88 57L79 60L83 69L73 69L74 78L64 75L62 84L54 78L50 86L46 78L38 84L36 75L26 78L27 69L17 69L21 60L12 57L18 50L12 43L21 40L17 31L27 31L26 22L36 25L38 16L46 22L50 14Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Vetor de Ferramentas: Esquadro & Formão
 */
function SquareChiselSvg({
  className = "w-full h-full text-stone-700/40 dark:text-stone-300/30",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M14 14V86H34V34H86V14H14Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M14 24H22M14 34H26M14 44H22M14 54H26M14 64H22M14 74H26"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M44 14V22M54 14V26M64 14V22M74 14V26" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M38 82L68 52L72 56L42 86L38 82Z"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path
        d="M68 52L82 38C84 36 88 36 90 38L92 40C94 42 94 46 92 48L78 62L68 52Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M38 82L34 86" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

const SIZE_CLASSES = {
  sm: "w-28 sm:w-36 md:w-48 max-w-[40vw]",
  md: "w-40 sm:w-56 md:w-72 max-w-[50vw]",
  lg: "w-52 sm:w-72 md:w-96 lg:w-[420px] max-w-[60vw]",
  xl: "w-64 sm:w-96 md:w-[460px] lg:w-[560px] max-w-[70vw]",
};

const POSITION_CLASSES: Record<CornerPosition, string> = {
  "top-left": "top-0 left-0",
  "top-right": "top-0 right-0",
  "bottom-left": "bottom-0 left-0 scale-y-[-1]",
  "bottom-right": "bottom-0 right-0 scale-y-[-1]",
};

/**
 * Componente de Decoração de Cantos com Imagens Reais de Ramos Botânicos e Ferramentas
 */
export function WoodcraftCornerDecor({
  position = "top-left",
  variant = "hybrid",
  size = "md",
  className = "",
}: WoodcraftCornerDecorProps) {
  const isRight = position === "top-right" || position === "bottom-right";
  const branchSrc = isRight ? "/ramos-direita-01.png" : "/ramos-esquerda-01.png";
  const posClass = POSITION_CLASSES[position];
  const sizeClass = SIZE_CLASSES[size];

  // Apenas ferramentas em SVG (sem ramos)
  if (variant === "tools" || variant === "plane" || variant === "saw") {
    return (
      <div
        className={`absolute ${posClass} w-24 h-24 sm:w-32 sm:h-32 pointer-events-none select-none z-0 p-4 transition-opacity duration-300 ${className}`}
        aria-hidden="true"
      >
        {variant === "plane" && <HandPlaneSvg />}
        {variant === "saw" && <CircularBladeSvg />}
        {variant === "tools" && <SquareChiselSvg />}
      </div>
    );
  }

  // Variantes com imagens reais dos ramos (leaves, hybrid, subtle-branch)
  return (
    <div
      className={`absolute ${posClass} ${sizeClass} pointer-events-none select-none z-0 transition-all duration-500 overflow-visible ${className}`}
      aria-hidden="true"
    >
      <div className="relative w-full">
        {/* Imagem Real de Folhagem / Ramo */}
        <img
          src={branchSrc}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-contain filter drop-shadow-sm opacity-90 transition-transform duration-700 hover:scale-[1.02]"
        />

        {/* Ferramenta de marcenaria sutil integrada para a variante hybrid */}
        {variant === "hybrid" && (
          <div
            className={`absolute ${
              isRight
                ? "bottom-2 left-6 sm:bottom-4 sm:left-10"
                : "bottom-2 right-6 sm:bottom-4 sm:right-10"
            } w-12 h-12 sm:w-16 sm:h-16 opacity-30 dark:opacity-20 pointer-events-none`}
          >
            {isRight ? <HandPlaneSvg /> : <SquareChiselSvg />}
          </div>
        )}
      </div>
    </div>
  );
}

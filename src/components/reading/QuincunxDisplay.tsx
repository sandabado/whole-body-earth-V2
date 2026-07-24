import type { BodyScore } from "@/lib/reading-engine";

const POSITIONS: Record<BodyScore["body"], { left: string; top: string }> = {
  Mental: { left: "50%", top: "9%" },
  Physical: { left: "9%", top: "50%" },
  Emotional: { left: "91%", top: "50%" },
  Spiritual: { left: "50%", top: "91%" },
};

export function QuincunxDisplay({ scores, guardian }: { scores: BodyScore[]; guardian: boolean }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 9V91M9 50H91" stroke="#2A2A38" strokeWidth="0.45" />
        <path d="M50 9L50 50 9 50M50 50H91M50 50V91" stroke="#8888A0" strokeWidth="0.2" strokeDasharray="1 1" />
      </svg>
      {scores.map((score) => {
        const size = 72 + score.percentage * 1.4;
        return (
          <div key={score.body} className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={POSITIONS[score.body]}>
            <div className="grid place-items-center rounded-full border-2 font-mono text-sm" style={{ width: size, height: size, borderColor: score.color, color: score.color, backgroundColor: `${score.color}20`, boxShadow: score === scores[0] ? `0 0 26px ${score.color}80` : undefined }}>{score.percentage}%</div>
            <span className="mt-2 font-mono text-[9px] uppercase tracking-[0.13em]" style={{ color: score.color }}>{score.body}</span>
          </div>
        );
      })}
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <div className={`grid place-items-center rounded-full ${guardian ? "h-16 w-16 border-2 border-guardian bg-guardian/20 shadow-[0_0_30px_rgba(143,91,255,.55)]" : "h-7 w-7 border border-guardian/60"}`}><span className="text-guardian">{guardian ? "☉" : ""}</span></div>
        {guardian ? <span className="mt-2 font-mono text-[9px] uppercase tracking-[0.13em] text-guardian">Ethereal</span> : null}
      </div>
    </div>
  );
}

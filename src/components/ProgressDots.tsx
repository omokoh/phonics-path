interface Props {
  total: number;
  completed: number;
}

export function ProgressDots({ total, completed }: Props) {
  return (
    <div className="flex gap-4 justify-center items-center py-4" role="progressbar" aria-valuenow={completed} aria-valuemax={total}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="w-5 h-5 rounded-full transition-all duration-500"
          style={{
            backgroundColor: i < completed ? "#f59e0b" : "rgba(255,255,255,0.25)",
            transform: i < completed ? "scale(1.25)" : "scale(1)",
          }}
        />
      ))}
    </div>
  );
}

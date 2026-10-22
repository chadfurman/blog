// "in 23 min, at 3:00 PM" / "in 5 h 10 min, tomorrow at 8:00 PM", in the visitor's local time.
export function formatReset(resetAtIso: string, now: Date = new Date()): string {
  const resetAt = new Date(resetAtIso);
  const mins = Math.max(1, Math.ceil((resetAt.getTime() - now.getTime()) / 60_000));
  const hours = Math.floor(mins / 60);
  const rest = mins % 60;
  const relative = hours === 0 ? `${mins} min` : rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
  const time = resetAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const sameDay = resetAt.toDateString() === now.toDateString();
  return `in ${relative}, ${sameDay ? "at" : "tomorrow at"} ${time}`;
}

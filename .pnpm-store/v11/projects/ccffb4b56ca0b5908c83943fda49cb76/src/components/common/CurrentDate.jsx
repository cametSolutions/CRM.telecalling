export default function CurrentDate() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return <h2 className="text-base font-semibold text-blue-900">{today}</h2>;
}

function FullScreenLoader({ text = "Loading..." }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30">
      <div className="flex flex-col items-center gap-3 rounded-xl bg-white px-5 py-4 shadow-xl">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
        <p className="text-sm font-medium text-slate-700">{text}</p>
      </div>
    </div>
  )
}
export default FullScreenLoader
export function StatusBar() {
  return (
    <div className="bg-slate-200 border-t border-slate-300 px-4 py-1 flex items-center justify-between text-xs">
      <div className="flex items-center gap-4">
        <span>Default</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span>📶</span>
        </div>
        <span>230 / 15MB</span>
      </div>
    </div>
  )
}

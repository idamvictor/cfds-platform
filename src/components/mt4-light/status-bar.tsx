export function StatusBar() {
  return (
    <div className="bg-slate-200 border-t border-slate-400 px-4 py-1 flex items-center justify-between text-xs">
      <div className="flex items-center gap-4">
        <span className="text-slate-800 font-medium">Default</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span>📶</span>
        </div>
        <span className="text-slate-800 font-medium">230 / 15MB</span>
      </div>
    </div>
  );
}

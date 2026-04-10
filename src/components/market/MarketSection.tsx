interface MarketSectionProps {
  icon: React.ReactNode;
  title: string;
}

export function MarketSection({ icon, title }: MarketSectionProps) {
  return (
    <h2 className="mb-3 flex items-center gap-2 text-[0.78rem] font-extrabold uppercase tracking-[0.06em] text-[#eef2f7]">
      <span className="text-[#00dfa2]">{icon}</span>
      {title}
    </h2>
  );
}

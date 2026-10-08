export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="dh-page-frame relative z-10 mx-auto flex w-full max-w-[1180px] flex-1 flex-col gap-[14px] px-3 pb-7 pt-3 md:px-5 md:pb-9 md:pt-4">
      {children}
    </div>
  );
}

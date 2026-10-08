export function MarbleBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-marble"
    >
      <div className="absolute -top-[22%] -right-[18%] h-[90%] w-[80%] rounded-full bg-[radial-gradient(circle_at_center,rgba(1,51,60,0.55),rgba(1,51,60,0.18)_46%,transparent_72%)] blur-3xl" />
      <div className="absolute top-[42%] right-[-6%] h-[58%] w-[52%] rounded-full bg-[radial-gradient(circle_at_center,rgba(1,51,60,0.32),transparent_68%)] blur-3xl" />
      <div className="absolute -bottom-[20%] -left-[18%] h-[62%] w-[58%] rounded-full bg-[radial-gradient(circle_at_center,rgba(1,51,60,0.2),transparent_70%)] blur-3xl" />
      <div className="dh-marble-layer absolute -top-[42%] -left-[14%] h-[190%] w-[128%] bg-[url('/marble.svg')] bg-repeat opacity-[0.14] mix-blend-multiply" />
      <div className="dh-marble-float absolute -inset-[10%] bg-[url('/marble.svg')] bg-repeat opacity-[0.1] mix-blend-multiply" />
    </div>
  );
}

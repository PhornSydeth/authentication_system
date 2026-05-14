/** Full-page ambient mesh used on auth shell and marketing pages. */
export function MeshBackground() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-1/4 top-0 h-[28rem] w-[28rem] rounded-full bg-sky-600/25 blur-[100px]" />
            <div className="absolute -right-1/4 bottom-0 h-[32rem] w-[32rem] rounded-full bg-indigo-600/20 blur-[110px]" />
            <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-500/10 blur-[80px]" />
            <div
                className="absolute inset-0 opacity-[0.35]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E")`,
                }}
            />
        </div>
    );
}

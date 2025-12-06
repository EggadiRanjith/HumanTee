import Loader from "./components/ui/Loader";
import Intro from "./components/ui/Intro";

export default function Home() {
    return (
        <Loader>
            <Intro>
                <section className="flex min-h-screen items-center justify-center bg-brand-bg-dusk text-brand-text relative overflow-hidden">
                    {/* Aurora Background Layer */}
                    <div className="absolute inset-0 opacity-20">
                        <div 
                            className="h-full w-full"
                            style={{
                                backgroundImage: "var(--gradient-aurora)",
                                backgroundSize: "150% 150%",
                                animation: "gradientMove 20s ease infinite"
                            }}
                        />
                    </div>
                    
                    {/* Content Layer */}
                    <div className="container-responsive text-center relative z-10">
                        <h1 className="font-geist text-step-7 font-hero leading-tight tracking-wider uppercase text-brand-primary">
                            HUMANTEE
                        </h1>
                        <p className="mt-4 font-geist text-step-1 leading-relaxed tracking-wide text-brand-text-muted max-w-lg mx-auto">
                            Crafting cinematic luxury experiences that transcend digital boundaries
                        </p>
                        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-6 justify-center">
                            <button className="tap-target rounded-lg bg-brand-primary px-6 py-3 font-geist text-step-0 font-heading tracking-wide uppercase text-brand-bg-dusk transition-all hover:bg-brand-primary/90 hover:shadow-glow-cyan sm:px-8 sm:py-4 sm:text-step-1">
                                Explore Work
                            </button>
                            <button className="tap-target rounded-lg border border-brand-border-subtle bg-brand-surface px-6 py-3 font-geist text-step-0 font-heading tracking-wide uppercase text-brand-primary transition-all hover:bg-brand-surface-elevated hover:border-brand-border-strong hover:shadow-glow-violet sm:px-8 sm:py-4 sm:text-step-1">
                                Learn More
                            </button>
                        </div>
                    </div>
                </section>
            </Intro>
        </Loader>
    );
}

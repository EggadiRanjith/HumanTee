export default function Home() {
    return (
        <>
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
                <div className="container-responsive text-center relative z-10 px-4 xs:px-6 sm:px-8">
                    <h1 className="font-geist text-step-7 font-hero leading-tight tracking-wider uppercase text-brand-primary px-2">
                        HUMANTEE
                    </h1>
                    <p className="mt-3 xs:mt-4 sm:mt-6 font-geist text-step-0 xs:text-step-1 leading-relaxed tracking-wide text-brand-text-muted max-w-lg mx-auto px-2">
                        Crafting cinematic luxury experiences that transcend digital boundaries
                    </p>
                    <div className="mt-6 xs:mt-8 flex flex-col gap-3 xs:gap-4 sm:flex-row sm:gap-6 justify-center items-stretch sm:items-center px-2">
                        <button className="tap-target rounded-lg bg-brand-primary px-5 py-2.5 xs:px-6 xs:py-3 font-geist text-[13px] xs:text-step-0 sm:text-step-1 font-heading tracking-wide uppercase text-brand-bg-dusk transition-all hover:bg-brand-primary/90 hover:shadow-glow-cyan sm:px-8 sm:py-4 min-h-[44px] xs:min-h-[48px]">
                            Explore Work
                        </button>
                        <button className="tap-target rounded-lg border border-brand-border-subtle bg-brand-surface px-5 py-2.5 xs:px-6 xs:py-3 font-geist text-[13px] xs:text-step-0 sm:text-step-1 font-heading tracking-wide uppercase text-brand-primary transition-all hover:bg-brand-surface-elevated hover:border-brand-border-strong hover:shadow-glow-violet sm:px-8 sm:py-4 min-h-[44px] xs:min-h-[48px]">
                            Learn More
                        </button>
                    </div>
                </div>
            </section>
            
            {/* Additional content to make page scrollable */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold brand-text-primary mb-6">Discover Excellence</h2>
                    <p className="brand-text-muted leading-relaxed mb-8">
                        Experience the pinnacle of digital luxury with our carefully curated collection of premium products and services.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        <div className="p-6 border border-white/10 rounded-lg">
                            <h3 className="text-xl font-semibold brand-text-primary mb-3">Premium Quality</h3>
                            <p className="brand-text-muted">Only the finest materials and craftsmanship</p>
                        </div>
                        <div className="p-6 border border-white/10 rounded-lg">
                            <h3 className="text-xl font-semibold brand-text-primary mb-3">Exclusive Design</h3>
                            <p className="brand-text-muted">Unique pieces that stand apart</p>
                        </div>
                        <div className="p-6 border border-white/10 rounded-lg">
                            <h3 className="text-xl font-semibold brand-text-primary mb-3">Luxury Service</h3>
                            <p className="brand-text-muted">White-glove experience from start to finish</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

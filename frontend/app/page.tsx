import Loader from "./components/ui/Loader";
import Intro from "./components/ui/Intro";

export default function Home() {
    return (
        <Loader>
            <Intro>
                <section className="flex min-h-screen items-center justify-center bg-black text-white">
                    <p className="text-lg tracking-[0.3em]">Homepage content goes here.</p>
                </section>
            </Intro>
        </Loader>
    );
}

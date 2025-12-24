"use client";

export default function InfoCards() {
    return (
        <div className="mt-8 space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-white/80 text-sm leading-relaxed">
                    <span className="font-semibold text-white">New to HumanTee?</span> No worries!
                    We'll create an account for you automatically.
                </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white/60 text-xs leading-relaxed">
                    <span className="font-semibold text-white/80">Passwordless login:</span> We'll send
                    you a one-time code via email. No passwords needed!
                </p>
            </div>
        </div>
    );
}

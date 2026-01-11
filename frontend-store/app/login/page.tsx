"use client";

import { Suspense } from "react";
import LoginPageContent from "./LoginPageContent";

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div style={{
                minHeight: "100vh",
                width: "100%",
                backgroundColor: "#060010",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <div style={{ color: "rgba(255, 255, 255, 0.6)" }}>Loading...</div>
            </div>
        }>
            <LoginPageContent />
        </Suspense>
    );
}

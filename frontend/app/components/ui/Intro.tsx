"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

const MIN_SPLASH_DURATION = 10000; // ms
const SAFETY_DURATION = 20000; // ms

interface IntroProps {
    children?: ReactNode;
    onComplete?: () => void;
}

const Intro = ({ children, onComplete }: IntroProps) => {
    if (children) {
        return <>{children}</>;
    }

    const [isVisible, setIsVisible] = useState(true);
    const [iframeReady, setIframeReady] = useState(false);
    const mountedAt = useRef<number>(Date.now());
    const hideTimerRef = useRef<number | null>(null);
    const hasCompleted = useRef(false);

    const hideSplash = () => {
        setIsVisible(false);

        if (!hasCompleted.current) {
            hasCompleted.current = true;
            onComplete?.();
        }
    };

    const scheduleHide = () => {
        if (hideTimerRef.current !== null) {
            window.clearTimeout(hideTimerRef.current);
        }
        const elapsed = Date.now() - mountedAt.current;
        const remaining = Math.max(0, MIN_SPLASH_DURATION - elapsed);
        hideTimerRef.current = window.setTimeout(hideSplash, remaining);
    };

    useEffect(() => {
        mountedAt.current = Date.now();
        const fallbackTimer = window.setTimeout(scheduleHide, SAFETY_DURATION);

        return () => {
            window.clearTimeout(fallbackTimer);
            if (hideTimerRef.current !== null) {
                window.clearTimeout(hideTimerRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleIframeLoad = () => {
        setIframeReady(true);
        scheduleHide();
    };

    const shouldRenderChildren = Boolean(children);

    if (!isVisible && !shouldRenderChildren) {
        return null;
    }

    return (
        <>
            {isVisible && (
                <div className="fixed inset-0 z-[100] overflow-hidden bg-gradient-to-br from-black via-[#0b0310] to-black">
                    <div className="relative h-full w-full">
                        <div
                            className="absolute left-[-32%] top-[-30%] h-[170%] w-[170%] sm:left-[-24%] sm:top-[-26%] sm:h-[160%] sm:w-[160%] md:left-[-18%] md:top-[-22%] md:h-[150%] md:w-[140%] lg:left-[-12%] lg:top-[-18%] lg:h-[140%] lg:w-[130%] xl:left-[-10%] xl:top-[-14%] xl:h-[130%] xl:w-[120%]"
                        >
                            <iframe
                                src="https://my.spline.design/3dcirculartextcopy-kdwFXa4agwAXjm3DpV4Jg0Jm-kI6/"
                                frameBorder="0"
                                width="100%"
                                height="100%"
                                className={`h-full w-full max-w-none transition-opacity duration-500 ${iframeReady ? "opacity-100" : "opacity-0"}`}
                                title="HumanTee Splash"
                                onLoad={handleIframeLoad}
                            />
                        </div>
                    </div>
                </div>
            )}
            {shouldRenderChildren && !isVisible && (
                <div className="transition-opacity duration-500 opacity-100">
                    {children}
                </div>
            )}
        </>
    );
};

export default Intro;

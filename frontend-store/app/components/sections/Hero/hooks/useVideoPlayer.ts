/**
 * Video Player Hook
 * Manages video playback state and error handling
 */

import { useState, useEffect, useRef } from "react";

export function useVideoPlayer(currentIndex: number, isMobile: boolean) {
    const [videoHasPlayed, setVideoHasPlayed] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Restart video when slide becomes active
    useEffect(() => {
        if (currentIndex === 0 && videoRef.current && !videoHasPlayed) {
            const video = videoRef.current;
            video.currentTime = 0;
            video
                .play()
                .then(() => {
                    // Video started playing successfully
                })
                .catch(() => {
                    setVideoError(true);
                    setVideoHasPlayed(true); // Skip to next slide on error
                });
        }
    }, [currentIndex, videoHasPlayed]);

    const handleVideoEnd = () => {
        setVideoHasPlayed(true);
    };

    const handleVideoError = () => {
        setVideoError(true);
        setVideoHasPlayed(true); // Skip to next slide on error
    };

    return {
        videoRef,
        videoHasPlayed,
        videoError,
        setVideoHasPlayed,
        handleVideoEnd,
        handleVideoError,
    };
}

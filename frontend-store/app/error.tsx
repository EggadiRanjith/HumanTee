"use client";

import ServerError from "@/app/(system)/500/page";
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to Sentry with full context
    Sentry.captureException(error, {
      tags: {
        location: 'global_error_boundary',
        digest: error.digest,
      },
    });

    // Also log to console in dev
    if (process.env.NODE_ENV === 'development') {
      console.error('Global error caught:', error);
    }
  }, [error]);

  return <ServerError error={error} reset={reset} />;
}

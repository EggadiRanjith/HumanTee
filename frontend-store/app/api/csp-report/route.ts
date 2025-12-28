/**
 * CSP Violation Report Endpoint
 * Logs Content Security Policy violations for monitoring
 */

import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export async function POST(request: NextRequest) {
    try {
        const report = await request.json();

        // Log CSP violations
        console.error('[CSP Violation]', {
            documentUri: report['document-uri'],
            violatedDirective: report['violated-directive'],
            blockedUri: report['blocked-uri'],
            sourceFile: report['source-file'],
            lineNumber: report['line-number'],
        });

        // Send to Sentry in production
        if (process.env.NODE_ENV === 'production') {
            Sentry.captureMessage('CSP Violation', {
                level: 'warning',
                extra: {
                    documentUri: report['document-uri'],
                    violatedDirective: report['violated-directive'],
                    blockedUri: report['blocked-uri'],
                    sourceFile: report['source-file'],
                    lineNumber: report['line-number'],
                    columnNumber: report['column-number']
                }
            });
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error('Failed to process CSP report:', error);
        return NextResponse.json({ error: 'Invalid report' }, { status: 400 });
    }
}

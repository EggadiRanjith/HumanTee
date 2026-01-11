/**
 * CSP Violation Report Endpoint
 * Logs Content Security Policy violations for monitoring
 */

import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Browser sends CSP reports in a nested 'csp-report' object
        const report = body['csp-report'] || body;

        // Extract violation details
        const violation = {
            documentUri: report['document-uri'] || report.documentUri,
            violatedDirective: report['violated-directive'] || report.violatedDirective,
            blockedUri: report['blocked-uri'] || report.blockedUri,
            sourceFile: report['source-file'] || report.sourceFile,
            lineNumber: report['line-number'] || report.lineNumber,
            columnNumber: report['column-number'] || report.columnNumber,
        };

        // Only log if we have actual violation data
        if (violation.violatedDirective || violation.blockedUri) {
            console.error('[CSP Violation]', violation);

            // Send to Sentry in production
            if (process.env.NODE_ENV === 'production') {
                Sentry.captureMessage('CSP Violation', {
                    level: 'warning',
                    extra: violation
                });
            }
        } else {
            // Log the raw report for debugging
            console.log('[CSP Report - Empty or Malformed]', JSON.stringify(body, null, 2));
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error('Failed to process CSP report:', error);
        return NextResponse.json({ error: 'Invalid report' }, { status: 400 });
    }
}

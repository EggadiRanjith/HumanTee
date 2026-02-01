/**
 * Real-Time API Call Monitor
 * Paste this in Chrome DevTools Console to track all API calls
 * 
 * Usage:
 * 1. Open Chrome DevTools (F12)
 * 2. Go to Console tab
 * 3. Paste this entire script
 * 4. Perform your test flow (navigate, add to cart, etc.)
 * 5. Run: getAPISummary() to see results
 * 6. Run: getDetailedReport() for full analysis
 */

(function () {
    console.log('%c🔍 API Monitor Started', 'color: #00ff00; font-size: 16px; font-weight: bold');
    console.log('Tracking all API calls...\n');

    // Storage for API calls
    window.apiCallTracker = {
        calls: [],
        startTime: Date.now(),

        // Track a call
        track(url, method, startTime) {
            const endpoint = url.replace(/^https?:\/\/[^\/]+/, '').split('?')[0];
            const callId = this.calls.length + 1;

            return {
                id: callId,
                endpoint,
                method,
                url,
                startTime,
                timestamp: new Date().toISOString()
            };
        },

        // Complete a call
        complete(callData, response, duration) {
            callData.duration = duration;
            callData.status = response.status;
            this.calls.push(callData);

            // Color code by performance
            const color = duration < 500 ? '#00ff00' : duration < 1000 ? '#ffaa00' : '#ff0000';
            const icon = duration < 500 ? '✅' : duration < 1000 ? '⚠️' : '🔴';

            console.log(
                `${icon} API Call #${callData.id}: %c${callData.method} ${callData.endpoint}%c - ${duration}ms`,
                `color: ${color}; font-weight: bold`,
                'color: inherit'
            );
        }
    };

    // Intercept fetch
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        const url = args[0];
        const options = args[1] || {};
        const method = options.method || 'GET';

        // Only track API calls
        if (url.includes('api.humantee.in') || url.includes('localhost:3001') || url.includes('/api/')) {
            const startTime = performance.now();
            const callData = window.apiCallTracker.track(url, method, startTime);

            try {
                const response = await originalFetch.apply(this, args);
                const duration = Math.round(performance.now() - startTime);
                window.apiCallTracker.complete(callData, response, duration);
                return response;
            } catch (error) {
                const duration = Math.round(performance.now() - startTime);
                callData.duration = duration;
                callData.status = 'ERROR';
                callData.error = error.message;
                window.apiCallTracker.calls.push(callData);
                console.error(`❌ API Call #${callData.id} FAILED: ${callData.endpoint}`, error);
                throw error;
            }
        }

        return originalFetch.apply(this, args);
    };

    // Summary function
    window.getAPISummary = function () {
        const calls = window.apiCallTracker.calls;

        if (calls.length === 0) {
            console.log('%c📊 No API calls tracked yet', 'color: #ffaa00; font-size: 14px');
            return;
        }

        // Group by endpoint
        const grouped = {};
        calls.forEach(call => {
            if (!grouped[call.endpoint]) {
                grouped[call.endpoint] = {
                    endpoint: call.endpoint,
                    count: 0,
                    totalTime: 0,
                    avgTime: 0,
                    minTime: Infinity,
                    maxTime: 0,
                    methods: new Set()
                };
            }

            const g = grouped[call.endpoint];
            g.count++;
            g.totalTime += call.duration;
            g.minTime = Math.min(g.minTime, call.duration);
            g.maxTime = Math.max(g.maxTime, call.duration);
            g.methods.add(call.method);
        });

        // Calculate averages
        Object.values(grouped).forEach(g => {
            g.avgTime = Math.round(g.totalTime / g.count);
            g.methods = Array.from(g.methods).join(', ');
        });

        // Sort by count (most called first)
        const summary = Object.values(grouped).sort((a, b) => b.count - a.count);

        console.log('\n%c📊 API CALL SUMMARY', 'color: #00aaff; font-size: 18px; font-weight: bold');
        console.log(`Total API Calls: ${calls.length}`);
        console.log(`Unique Endpoints: ${summary.length}`);
        console.log(`Session Duration: ${Math.round((Date.now() - window.apiCallTracker.startTime) / 1000)}s\n`);

        console.table(summary.map(s => ({
            Endpoint: s.endpoint,
            Calls: s.count,
            'Avg Time (ms)': s.avgTime,
            'Min Time (ms)': s.minTime,
            'Max Time (ms)': s.maxTime,
            Methods: s.methods
        })));

        // Highlight duplicates
        const duplicates = summary.filter(s => s.count > 1);
        if (duplicates.length > 0) {
            console.log('\n%c⚠️ DUPLICATE CALLS DETECTED', 'color: #ff0000; font-size: 16px; font-weight: bold');
            duplicates.forEach(d => {
                console.log(`  🔴 ${d.endpoint} - Called ${d.count} times (${d.totalTime}ms total)`);
            });
        }

        return summary;
    };

    // Detailed report
    window.getDetailedReport = function () {
        const calls = window.apiCallTracker.calls;

        console.log('\n%c📋 DETAILED CALL LOG', 'color: #00aaff; font-size: 18px; font-weight: bold\n');

        calls.forEach(call => {
            const color = call.duration < 500 ? '#00ff00' : call.duration < 1000 ? '#ffaa00' : '#ff0000';
            console.log(
                `#${call.id} [${call.timestamp.split('T')[1].split('.')[0]}] %c${call.method} ${call.endpoint}%c - ${call.duration}ms (${call.status})`,
                `color: ${color}; font-weight: bold`,
                'color: inherit'
            );
        });

        return calls;
    };

    // Reset function
    window.resetAPIMonitor = function () {
        window.apiCallTracker.calls = [];
        window.apiCallTracker.startTime = Date.now();
        console.clear();
        console.log('%c🔄 API Monitor Reset', 'color: #00ff00; font-size: 16px; font-weight: bold');
    };

    // Export to JSON
    window.exportAPIReport = function () {
        const report = {
            sessionStart: new Date(window.apiCallTracker.startTime).toISOString(),
            sessionDuration: Math.round((Date.now() - window.apiCallTracker.startTime) / 1000),
            totalCalls: window.apiCallTracker.calls.length,
            calls: window.apiCallTracker.calls
        };

        const json = JSON.stringify(report, null, 2);
        console.log('%c📤 API Report (copy this):', 'color: #00aaff; font-size: 14px; font-weight: bold');
        console.log(json);

        // Copy to clipboard
        navigator.clipboard.writeText(json).then(() => {
            console.log('%c✅ Copied to clipboard!', 'color: #00ff00; font-weight: bold');
        });

        return report;
    };

    // Help
    window.apiMonitorHelp = function () {
        console.log('\n%c🔍 API Monitor Commands', 'color: #00aaff; font-size: 16px; font-weight: bold\n');
        console.log('%cgetAPISummary()%c      - Show summary table of all API calls', 'color: #00ff00', 'color: inherit');
        console.log('%cgetDetailedReport()%c  - Show detailed log of each call', 'color: #00ff00', 'color: inherit');
        console.log('%cresetAPIMonitor()%c    - Clear all tracked calls and restart', 'color: #00ff00', 'color: inherit');
        console.log('%cexportAPIReport()%c    - Export data as JSON (copies to clipboard)', 'color: #00ff00', 'color: inherit');
        console.log('%capiMonitorHelp()%c     - Show this help message\n', 'color: #00ff00', 'color: inherit');
    };

    console.log('\n%c✅ Monitor Ready!', 'color: #00ff00; font-size: 14px; font-weight: bold');
    console.log('Run %capiMonitorHelp()%c for available commands\n', 'color: #00ff00', 'color: inherit');
})();

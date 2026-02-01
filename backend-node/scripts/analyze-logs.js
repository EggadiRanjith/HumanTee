const fs = require('fs');
const path = require('path');

/**
 * Log Analysis Script
 * Analyzes api-requests.log to identify performance issues and optimization opportunities
 * 
 * Usage: node scripts/analyze-logs.js
 */

const logFile = path.join(__dirname, '..', 'logs', 'api-requests.log');

function analyzeLogs() {
    console.log('\n📊 ANALYZING API PERFORMANCE LOGS\n');

    // Check if log file exists
    if (!fs.existsSync(logFile)) {
        console.error('❌ Log file not found:', logFile);
        console.log('\nMake sure to:');
        console.log('1. Add DetailedLoggerMiddleware to main.ts');
        console.log('2. Restart the backend');
        console.log('3. Make some API requests');
        console.log('4. Run this script again\n');
        return;
    }

    // Read and parse logs
    const logs = fs.readFileSync(logFile, 'utf-8')
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
            try {
                return JSON.parse(line);
            } catch (e) {
                return null;
            }
        })
        .filter(log => log !== null);

    if (logs.length === 0) {
        console.log('⚠️  No logs found. Make some API requests first.\n');
        return;
    }

    console.log(`✅ Loaded ${logs.length} requests\n`);

    // Group by endpoint
    const byEndpoint = {};
    logs.forEach(log => {
        const key = `${log.method} ${log.path}`;
        if (!byEndpoint[key]) {
            byEndpoint[key] = {
                count: 0,
                totalTime: 0,
                totalQueries: 0,
                totalCost: 0,
                maxTime: 0,
                minTime: Infinity,
                calls: []
            };
        }

        const endpoint = byEndpoint[key];
        endpoint.count++;
        endpoint.totalTime += log.durationMs || parseInt(log.duration);
        endpoint.totalQueries += log.dbQueries;
        endpoint.totalCost += parseFloat(log.cost.total);
        endpoint.maxTime = Math.max(endpoint.maxTime, log.durationMs || parseInt(log.duration));
        endpoint.minTime = Math.min(endpoint.minTime, log.durationMs || parseInt(log.duration));
        endpoint.calls.push(log);
    });

    // Calculate averages and sort by total cost
    const summary = Object.entries(byEndpoint)
        .map(([endpoint, stats]) => ({
            endpoint,
            calls: stats.count,
            avgTime: Math.round(stats.totalTime / stats.count),
            maxTime: stats.maxTime,
            minTime: stats.minTime,
            avgQueries: Math.round(stats.totalQueries / stats.count * 10) / 10,
            totalQueries: stats.totalQueries,
            totalCost: stats.totalCost.toFixed(8),
            avgCost: (stats.totalCost / stats.count).toFixed(10)
        }))
        .sort((a, b) => parseFloat(b.totalCost) - parseFloat(a.totalCost));

    // Display summary table
    console.log('═══════════════════════════════════════════════════════════════════════════════');
    console.log('API PERFORMANCE SUMMARY (sorted by total cost)');
    console.log('═══════════════════════════════════════════════════════════════════════════════\n');

    console.table(summary.map(s => ({
        'Endpoint': s.endpoint,
        'Calls': s.calls,
        'Avg Time': `${s.avgTime}ms`,
        'Max Time': `${s.maxTime}ms`,
        'Avg Queries': s.avgQueries,
        'Total Queries': s.totalQueries,
        'Total Cost': `$${s.totalCost}`
    })));

    // Find optimization opportunities
    console.log('\n═══════════════════════════════════════════════════════════════════════════════');
    console.log('🎯 OPTIMIZATION OPPORTUNITIES');
    console.log('═══════════════════════════════════════════════════════════════════════════════\n');

    let hasIssues = false;
    summary.forEach(s => {
        const issues = [];

        if (s.calls > 3) {
            issues.push(`🔴 Called ${s.calls} times - Consider caching or deduplication`);
        }
        if (s.avgQueries > 5) {
            issues.push(`🔴 ${s.avgQueries} avg queries - Likely N+1 problem`);
        }
        if (s.avgTime > 1000) {
            issues.push(`🔴 ${s.avgTime}ms avg time - Too slow, needs optimization`);
        }
        if (s.avgTime > 500 && s.avgTime <= 1000) {
            issues.push(`🟡 ${s.avgTime}ms avg time - Could be faster`);
        }

        if (issues.length > 0) {
            hasIssues = true;
            console.log(`\n${s.endpoint}`);
            console.log(`  Total Cost: $${s.totalCost} (${s.calls} calls)`);
            issues.forEach(issue => console.log(`  ${issue}`));
        }
    });

    if (!hasIssues) {
        console.log('✅ No major issues detected! All endpoints performing well.\n');
    }

    // Cost breakdown
    console.log('\n═══════════════════════════════════════════════════════════════════════════════');
    console.log('💰 COST BREAKDOWN');
    console.log('═══════════════════════════════════════════════════════════════════════════════\n');

    const totalCost = summary.reduce((sum, s) => sum + parseFloat(s.totalCost), 0);
    const totalRequests = logs.length;
    const totalQueries = summary.reduce((sum, s) => sum + s.totalQueries, 0);
    const totalTime = summary.reduce((sum, s) => sum + (s.avgTime * s.calls), 0);

    console.log(`Total Requests:     ${totalRequests}`);
    console.log(`Total DB Queries:   ${totalQueries}`);
    console.log(`Total Duration:     ${(totalTime / 1000).toFixed(2)}s`);
    console.log(`Total Cost:         $${totalCost.toFixed(8)}`);
    console.log(`Avg Cost/Request:   $${(totalCost / totalRequests).toFixed(10)}`);

    // Projected monthly cost (assuming current rate)
    const requestsPerHour = totalRequests / ((logs[logs.length - 1].timestamp - logs[0].timestamp) / 3600000);
    const monthlyRequests = requestsPerHour * 24 * 30;
    const monthlyCost = (totalCost / totalRequests) * monthlyRequests;

    console.log(`\nProjected Monthly Cost (at current rate):`);
    console.log(`  Requests/hour:    ${Math.round(requestsPerHour)}`);
    console.log(`  Monthly requests: ${Math.round(monthlyRequests).toLocaleString()}`);
    console.log(`  Monthly cost:     $${monthlyCost.toFixed(4)}`);

    // Top 5 most expensive endpoints
    console.log('\n═══════════════════════════════════════════════════════════════════════════════');
    console.log('💸 TOP 5 MOST EXPENSIVE ENDPOINTS');
    console.log('═══════════════════════════════════════════════════════════════════════════════\n');

    summary.slice(0, 5).forEach((s, i) => {
        const percentage = (parseFloat(s.totalCost) / totalCost * 100).toFixed(1);
        console.log(`${i + 1}. ${s.endpoint}`);
        console.log(`   Cost: $${s.totalCost} (${percentage}% of total)`);
        console.log(`   Calls: ${s.calls}, Avg Time: ${s.avgTime}ms, Avg Queries: ${s.avgQueries}`);
        console.log('');
    });

    console.log('═══════════════════════════════════════════════════════════════════════════════\n');
}

// Run analysis
try {
    analyzeLogs();
} catch (error) {
    console.error('❌ Error analyzing logs:', error.message);
    console.error(error.stack);
}

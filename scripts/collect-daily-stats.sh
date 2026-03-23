#!/bin/bash

LOG_DIR="./logs/performance-metrics"
STATS_FILE="${LOG_DIR}/daily_stats_$(date +%Y%m%d).txt"

mkdir -p "$LOG_DIR"

echo "API Performance Daily Statistics $(date)" > "$STATS_FILE"
echo "=======================================" >> "$STATS_FILE"

# Get average response time if there are any logs
if [ -f "$LOG_DIR/api-performance.log" ] && grep -q "Response time:" "$LOG_DIR/api-performance.log"; then
    # Get average response time
    AVG_RESPONSE=$(grep "Response time:" "$LOG_DIR/api-performance.log" | sed -n 's/.*Response time: \([0-9]\+\)ms.*/\1/p' | awk '{ total += $1; count++ } END { if (count > 0) print total/count; else print "N/A" }')
    echo "Average response time: ${AVG_RESPONSE}ms" >> "$STATS_FILE"

    # Get 95th percentile (simplified calculation)
    RESPONSE_TIMES=$(grep "Response time:" "$LOG_DIR/api-performance.log" | sed -n 's/.*Response time: \([0-9]\+\)ms.*/\1/p' | sort -n)
    COUNT=$(echo "$RESPONSE_TIMES" | wc -l)
    if [ "$COUNT" -gt 0 ]; then
        PERCENTILE_INDEX=$(echo "($COUNT * 0.95 + 0.5) / 1" | bc)
        PERCENTILE_95=$(echo "$RESPONSE_TIMES" | sed -n "${PERCENTILE_INDEX}p")
        echo "95th percentile response time: ${PERCENTILE_95}ms" >> "$STATS_FILE"
    else
        echo "95th percentile response time: N/A" >> "$STATS_FILE"
    fi
else
    echo "No response time data available yet" >> "$STATS_FILE"
fi

# Count errors and warnings if the alerts log exists
if [ -f "$LOG_DIR/alerts.log" ]; then
    ERROR_COUNT=$(grep -c "\[ALERT-CRITICAL\]" "$LOG_DIR/alerts.log" || echo 0)
    WARNING_COUNT=$(grep -c "\[ALERT-WARNING\]" "$LOG_DIR/alerts.log" || echo 0)
    echo "Errors: $ERROR_COUNT" >> "$STATS_FILE"
    echo "Warnings: $WARNING_COUNT" >> "$STATS_FILE"
else
    echo "No alerts log found" >> "$STATS_FILE"
fi

# Get resource usage stats if there's any data
echo "" >> "$STATS_FILE"
echo "Resource Usage Statistics:" >> "$STATS_FILE"
echo "--------------------------" >> "$STATS_FILE"

if [ -f "$LOG_DIR/api-performance.log" ] && grep -q "CPU:" "$LOG_DIR/api-performance.log"; then
    # CPU Average
    CPU_AVG=$(grep "CPU:" "$LOG_DIR/api-performance.log" | sed -n 's/.*CPU: \([^,]*\)%.*/\1/p' | awk '{ total += $1; count++ } END { if (count > 0) print total/count; else print "N/A" }')
    echo "Average CPU usage: ${CPU_AVG}%" >> "$STATS_FILE"

    # Memory Average
    MEM_AVG=$(grep "Memory:" "$LOG_DIR/api-performance.log" | sed -n 's/.*Memory: \([^,]*\)%.*/\1/p' | awk '{ total += $1; count++ } END { if (count > 0) print total/count; else print "N/A" }')
    echo "Average memory usage: ${MEM_AVG}%" >> "$STATS_FILE"
else
    echo "No resource usage data available yet" >> "$STATS_FILE"
fi

# Display the report
echo "Daily statistics collected. Report saved to $STATS_FILE"
cat "$STATS_FILE"

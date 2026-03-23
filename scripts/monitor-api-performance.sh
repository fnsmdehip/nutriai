#!/bin/bash
# API Performance Monitoring Script

# Configuration
API_ENDPOINT="http://localhost:3001/api/v1/health"
LOG_FILE="./logs/performance-metrics/api-performance.log"
ALERT_THRESHOLD_MS=200  # Alert if response time exceeds 200ms
CRITICAL_THRESHOLD_MS=500  # Critical if response time exceeds 500ms
FAILED_ATTEMPTS_THRESHOLD=3  # Alert after 3 consecutive failures

# Create log directory if it doesn't exist
mkdir -p "$(dirname "$LOG_FILE")"

# Function to log with timestamp
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"  # Also output to console
}

# Function to send critical alerts (modify as needed)
send_alert() {
    local message="$1"
    local severity="$2"
    
    log "[ALERT-${severity}] $message"
    
    # On a production system, you might want to integrate with a proper
    # alerting system like PagerDuty, Slack, or email notification
    # For now, we'll just write to a separate alerts log
    echo "$(date '+%Y-%m-%d %H:%M:%S') - ${severity}: $message" >> "./logs/performance-metrics/alerts.log"
}

# Measure API response time using curl
measure_response_time() {
    # Using curl to measure response time in milliseconds
    local result=$(curl -o /dev/null -s -w "%{http_code} %{time_total}\n" "$API_ENDPOINT")
    local http_code=$(echo "$result" | cut -d' ' -f1)
    local time_total=$(echo "$result" | cut -d' ' -f2)
    
    # Convert to milliseconds (if bc is available)
    if command -v bc > /dev/null; then
        local response_time_ms=$(echo "$time_total * 1000" | bc)
        response_time_ms=${response_time_ms%.*}  # Remove decimal part
    else
        # Fallback if bc is not available (less precise)
        local response_time_ms=$(echo "$time_total * 1000" | awk '{print int($1+0.5)}')
    fi
    
    echo "$http_code $response_time_ms"
}

# Main monitoring logic
main() {
    log "Starting API performance check"
    
    # Measure response time
    local result=$(measure_response_time)
    local http_code=$(echo "$result" | cut -d' ' -f1)
    local response_time_ms=$(echo "$result" | cut -d' ' -f2)
    
    # Log the result
    if [ "$http_code" == "200" ]; then
        log "API health check: OK. Response time: ${response_time_ms}ms"
        
        # Check if response time exceeds thresholds
        if [ "$response_time_ms" -gt "$CRITICAL_THRESHOLD_MS" ]; then
            send_alert "API response time critically high: ${response_time_ms}ms" "CRITICAL"
        elif [ "$response_time_ms" -gt "$ALERT_THRESHOLD_MS" ]; then
            send_alert "API response time high: ${response_time_ms}ms" "WARNING"
        fi
        
        # Reset failed attempts counter
        echo "0" > "/tmp/api_failed_attempts"
    else
        log "API health check failed! HTTP code: ${http_code}, Response time: ${response_time_ms}ms"
        
        # Track consecutive failures
        local failed_attempts=0
        if [ -f "/tmp/api_failed_attempts" ]; then
            failed_attempts=$(cat "/tmp/api_failed_attempts")
        fi
        
        failed_attempts=$((failed_attempts + 1))
        echo "$failed_attempts" > "/tmp/api_failed_attempts"
        
        if [ "$failed_attempts" -ge "$FAILED_ATTEMPTS_THRESHOLD" ]; then
            send_alert "API health check failed ${failed_attempts} consecutive times! Latest HTTP code: ${http_code}" "CRITICAL"
        fi
    fi
    
    # Check Docker container resource usage if Docker is available
    if command -v docker > /dev/null; then
        check_container_resources
    else
        log "Docker not available, skipping container resource check"
    fi
    
    log "Performance check completed"
}

# Function to check Docker container resource usage
check_container_resources() {
    # Check if the API container is running
    if docker ps | grep -q "backend-api-1"; then
        # Get CPU and memory usage for API container
        local container_stats=$(docker stats backend-api-1 --no-stream --format "{{.CPUPerc}}|{{.MemPerc}}|{{.NetIO}}|{{.BlockIO}}")
        
        if [ -n "$container_stats" ]; then
            local cpu_usage=$(echo "$container_stats" | cut -d'|' -f1)
            local mem_usage=$(echo "$container_stats" | cut -d'|' -f2)
            local net_io=$(echo "$container_stats" | cut -d'|' -f3)
            local block_io=$(echo "$container_stats" | cut -d'|' -f4)
            
            log "Container resource usage - CPU: $cpu_usage, Memory: $mem_usage, Network I/O: $net_io, Block I/O: $block_io"
            
            # Extract numeric value from percentage (remove % sign and convert to number)
            if command -v bc > /dev/null; then
                local cpu_value=$(echo "$cpu_usage" | sed 's/%//')
                local mem_value=$(echo "$mem_usage" | sed 's/%//')
                
                # Alert on high resource usage
                if (( $(echo "$cpu_value > 80" | bc -l) )); then
                    send_alert "API container CPU usage high: $cpu_usage" "WARNING"
                fi
                
                if (( $(echo "$mem_value > 80" | bc -l) )); then
                    send_alert "API container memory usage high: $mem_usage" "WARNING"
                fi
            fi
        else
            log "Failed to get container stats for backend-api-1"
        fi
    else
        log "Container backend-api-1 is not running"
    fi
    
    # Also check database container
    if docker ps | grep -q "backend-db-1"; then
        # Get CPU and memory usage for database container
        local db_stats=$(docker stats backend-db-1 --no-stream --format "{{.CPUPerc}}|{{.MemPerc}}|{{.NetIO}}|{{.BlockIO}}")
        
        if [ -n "$db_stats" ]; then
            local cpu_usage=$(echo "$db_stats" | cut -d'|' -f1)
            local mem_usage=$(echo "$db_stats" | cut -d'|' -f2)
            local net_io=$(echo "$db_stats" | cut -d'|' -f3)
            local block_io=$(echo "$db_stats" | cut -d'|' -f4)
            
            log "DB Container resource usage - CPU: $cpu_usage, Memory: $mem_usage, Network I/O: $net_io, Block I/O: $block_io"
            
            # Extract numeric value from percentage (remove % sign and convert to number)
            if command -v bc > /dev/null; then
                local cpu_value=$(echo "$cpu_usage" | sed 's/%//')
                local mem_value=$(echo "$mem_usage" | sed 's/%//')
                
                # Alert on high resource usage
                if (( $(echo "$cpu_value > 80" | bc -l) )); then
                    send_alert "DB container CPU usage high: $cpu_usage" "WARNING"
                fi
                
                if (( $(echo "$mem_value > 80" | bc -l) )); then
                    send_alert "DB container memory usage high: $mem_usage" "WARNING"
                fi
            fi
        fi
    fi
}

# Execute main function
main

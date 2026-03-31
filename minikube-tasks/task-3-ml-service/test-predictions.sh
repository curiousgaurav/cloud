#!/bin/bash

# ML Service Predictions Test Script
# Tests the deployed ML service with various predictions

echo "=========================================="
echo "ML Service Prediction Testing"
echo "=========================================="

# Configuration
BASE_URL="http://localhost:5000"
echo "Base URL: $BASE_URL"
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to make API call
call_api() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    echo -e "${BLUE}REQUEST:${NC} $method $endpoint"
    
    if [ -z "$data" ]; then
        curl -s -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" | python -m json.tool
    else
        echo -e "${BLUE}DATA:${NC}"
        echo $data | python -m json.tool
        curl -s -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data" | python -m json.tool
    fi
    echo ""
}

# Test 1: Health Check
echo -e "${GREEN}Test 1: Health Check${NC}"
call_api "GET" "/health"

# Test 2: Welcome Endpoint
echo -e "${GREEN}Test 2: Welcome Page${NC}"
call_api "GET" "/"

# Test 3: Service Info
echo -e "${GREEN}Test 3: Service Information${NC}"
call_api "GET" "/api/info"

# Test 4: Get Features
echo -e "${GREEN}Test 4: Get Feature Names${NC}"
call_api "GET" "/api/features"

# Test 5: Get Classes
echo -e "${GREEN}Test 5: Get Classification Classes${NC}"
call_api "GET" "/api/classes"

# Test 6: Single Prediction - Setosa
echo -e "${GREEN}Test 6: Predict Setosa (5.1, 3.5, 1.4, 0.2)${NC}"
call_api "POST" "/api/predict" '{"features": [5.1, 3.5, 1.4, 0.2]}'

# Test 7: Single Prediction - Versicolor
echo -e "${GREEN}Test 7: Predict Versicolor (7.0, 3.2, 4.7, 1.4)${NC}"
call_api "POST" "/api/predict" '{"features": [7.0, 3.2, 4.7, 1.4]}'

# Test 8: Single Prediction - Virginica
echo -e "${GREEN}Test 8: Predict Virginica (6.3, 3.3, 6.0, 2.5)${NC}"
call_api "POST" "/api/predict" '{"features": [6.3, 3.3, 6.0, 2.5]}'

# Test 9: Batch Predictions
echo -e "${GREEN}Test 9: Batch Predictions${NC}"
call_api "POST" "/api/predict-batch" '{
  "samples": [
    [5.1, 3.5, 1.4, 0.2],
    [7.0, 3.2, 4.7, 1.4],
    [6.3, 3.3, 6.0, 2.5],
    [5.2, 2.7, 3.9, 1.4]
  ]
}'

# Test 10: Metrics
echo -e "${GREEN}Test 10: Service Metrics${NC}"
call_api "GET" "/metrics"

echo -e "${GREEN}=========================================="
echo "All tests completed!"
echo "==========================================${NC}"

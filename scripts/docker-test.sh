#!/bin/bash

# Cosmic Classroom Docker Test Runner
# This script runs tests inside the existing Docker containers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_color() {
    color=$1
    message=$2
    echo -e "${color}${message}${NC}"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  all              Run all tests"
    echo "  server           Run server tests"
    echo "  client           Run client tests"
    echo "  server:watch     Run server tests in watch mode"
    echo "  client:watch     Run client tests in watch mode"
    echo "  server:coverage  Run server tests with coverage"
    echo "  client:coverage  Run client tests with coverage"
    echo "  help             Show this help message"
    echo ""
    echo "Options:"
    echo "  --build          Build containers before running tests"
    echo "  --clean          Clean up test artifacts after running"
    echo ""
    echo "Examples:"
    echo "  $0 all                    # Run all tests"
    echo "  $0 server --build         # Build and run server tests"
    echo "  $0 client:watch           # Run client tests in watch mode"
}

# Parse command line arguments
COMMAND=${1:-all}
BUILD=false
CLEAN=false

shift
while [[ $# -gt 0 ]]; do
    case $1 in
        --build)
            BUILD=true
            shift
            ;;
        --clean)
            CLEAN=true
            shift
            ;;
        *)
            print_color $RED "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Build containers if requested
if [ "$BUILD" = true ]; then
    print_color $YELLOW "Building containers..."
    docker-compose build
fi

# Ensure containers are running
print_color $YELLOW "Starting containers..."
docker-compose up -d

# Wait for services to be ready
print_color $YELLOW "Waiting for services to be ready..."
sleep 5

# Run tests based on command
case $COMMAND in
    all)
        print_color $GREEN "Running all tests..."
        print_color $YELLOW "Running server tests..."
        docker-compose exec -T server npm test
        print_color $YELLOW "Running client tests..."
        docker-compose exec -T client npm run test:run
        ;;
    server)
        print_color $GREEN "Running server tests..."
        docker-compose exec server npm test
        ;;
    client)
        print_color $GREEN "Running client tests..."
        docker-compose exec client npm run test:run
        ;;
    server:watch)
        print_color $GREEN "Running server tests in watch mode..."
        docker-compose exec server npm run test:watch
        ;;
    client:watch)
        print_color $GREEN "Running client tests in watch mode..."
        docker-compose exec client npm run test:watch
        ;;
    server:coverage)
        print_color $GREEN "Running server tests with coverage..."
        docker-compose exec server npm run test:coverage
        print_color $YELLOW "Coverage report saved to ./server/coverage"
        ;;
    client:coverage)
        print_color $GREEN "Running client tests with coverage..."
        docker-compose exec client npm run test:coverage
        print_color $YELLOW "Coverage report saved to ./client/coverage"
        ;;
    help)
        show_usage
        exit 0
        ;;
    *)
        print_color $RED "Unknown command: $COMMAND"
        show_usage
        exit 1
        ;;
esac

# Clean up if requested
if [ "$CLEAN" = true ]; then
    print_color $YELLOW "Cleaning up test artifacts..."
    rm -rf ./server/coverage ./client/coverage
    find . -name "*.log" -type f -delete
fi

print_color $GREEN "Tests completed!"
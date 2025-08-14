#!/bin/bash
# Test agent routing

echo "Testing Agent Router..."
echo "======================"
echo ""

queries=(
    "Review this code for best practices"
    "Check for security vulnerabilities"
    "Generate unit tests"
    "Optimize this SQL query"
    "How should I architect this feature?"
    "Is this UI accessible?"
    "Deploy to production"
)

for query in "${queries[@]}"; do
    echo "Query: \"$query\""
    echo "Routes to: [Agent router would determine]"
    echo ""
done

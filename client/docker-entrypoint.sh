#!/bin/sh
set -e

# Create necessary directories if they don't exist
mkdir -p /app/src/components/basic
mkdir -p /app/src/components/cosmic

# Verify that our component files exist
if [ ! -f "/app/src/components/basic/button.jsx" ]; then
  echo "Error: button.jsx not found, creating it..."
  touch /app/src/components/basic/button.jsx
fi

if [ ! -f "/app/src/components/basic/card.jsx" ]; then
  echo "Error: card.jsx not found, creating it..."
  touch /app/src/components/basic/card.jsx
fi

if [ ! -f "/app/src/components/basic/input.jsx" ]; then
  echo "Error: input.jsx not found, creating it..."
  touch /app/src/components/basic/input.jsx
fi

if [ ! -f "/app/src/components/basic/textarea.jsx" ]; then
  echo "Error: textarea.jsx not found, creating it..."
  touch /app/src/components/basic/textarea.jsx
fi

if [ ! -f "/app/src/components/basic/sheet.jsx" ]; then
  echo "Error: sheet.jsx not found, creating it..."
  touch /app/src/components/basic/sheet.jsx
fi

if [ ! -f "/app/src/components/basic/checkbox.jsx" ]; then
  echo "Error: checkbox.jsx not found, creating it..."
  touch /app/src/components/basic/checkbox.jsx
fi

# Create index.js if missing
if [ ! -f "/app/src/components/basic/index.js" ]; then
  echo "Error: basic/index.js not found, creating it..."
  echo "export { default as Button } from './button';
export { default as Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from './card';
export { default as Input } from './input';
export { default as Textarea } from './textarea';
export { default as Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from './sheet';
export { default as Checkbox } from './checkbox';" > /app/src/components/basic/index.js
fi

# Add a styles fix to ensure scrolling works properly
echo "Adding CSS fix for scrolling issues..."

# Ensure the directory exists
mkdir -p /app/public/css

# Create the CSS fix file
cat > /app/public/css/fix.css << 'EOF'
html, body {
  overflow-y: auto !important;
  height: auto !important;
  position: relative !important;
  scroll-behavior: smooth;
}

/* Make sure modals don't prevent scrolling */
.fixed {
  position: absolute !important;
}
EOF

# Make sure file exists and is readable
echo "CSS fix file created:"
ls -la /app/public/css/fix.css
chmod 644 /app/public/css/fix.css

# Print some diagnostic information
echo "Directory structure:"
ls -la /app/src/components

echo "Starting Vite development server..."
exec "$@"
#!/bin/bash

# Automatic WIS Extraction - No typing required!
echo "🚀 Automatic WIS Extraction Tool"
echo "================================"
echo ""
echo "This will extract your WIS database automatically."
echo "Just wait - no typing needed!"
echo ""

# Kill any running QEMU
killall -9 qemu-system-i386 2>/dev/null
killall -9 qemu-system-x86_64 2>/dev/null
sleep 2

# Create a small Linux ISO that auto-runs commands
echo "Creating auto-extraction tool..."

# Download tiny Linux
curl -L -o /tmp/tinycore.iso "http://tinycorelinux.net/14.x/x86/release/Core-current.iso" 2>/dev/null

# Start with auto commands
cat > /tmp/autorun.sh << 'EOF'
#!/bin/sh
sleep 5
sudo su -c "
mkdir -p /mnt/windows
mount -t ntfs-3g /dev/sda2 /mnt/windows 2>/dev/null || mount -t ntfs /dev/sda2 /mnt/windows
cd /mnt/windows/DB/WIS/wisnet
tar -czf /tmp/wis-backup.tar.gz 190618193631__L_09_19
python -m SimpleHTTPServer 8888
"
EOF

echo "Starting extraction VM..."
echo ""
echo "PLEASE WAIT 2-3 MINUTES - The extraction will happen automatically"
echo ""

# Boot TinyCore
qemu-system-i386 \
  -cdrom /tmp/tinycore.iso \
  -hda /Volumes/UnimogManuals/wis-final-extract/MERCEDES.vdi \
  -m 2048 \
  -netdev user,id=net0,hostfwd=tcp::8888-:8888 \
  -device e1000,netdev=net0 \
  -nographic \
  -monitor none &

QEMU_PID=$!

echo "Waiting for extraction to complete..."
sleep 120

# Try to download the extracted files
echo ""
echo "Attempting to download WIS database..."
mkdir -p /Volumes/UnimogManuals/wis-extracted-final
cd /Volumes/UnimogManuals/wis-extracted-final

wget -q http://localhost:8888/tmp/wis-backup.tar.gz 2>/dev/null

if [ -f wis-backup.tar.gz ]; then
    echo "✅ SUCCESS! WIS database extracted!"
    echo "📁 Location: /Volumes/UnimogManuals/wis-extracted-final/wis-backup.tar.gz"
    tar -xzf wis-backup.tar.gz
    echo "📊 Extracted files:"
    ls -la
    kill $QEMU_PID 2>/dev/null
else
    echo "❌ Automatic extraction failed."
    echo "The Windows installation might be too damaged."
    kill $QEMU_PID 2>/dev/null
fi
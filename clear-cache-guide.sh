#!/bin/bash

# Script để clear cache và restart services

echo "🧹 CLEARING CACHE & RESTARTING SERVICES"
echo "========================================"

echo ""
echo "📍 BƯỚC 1: Kiểm tra Backend đang chạy..."
if curl -s http://localhost:5001/api/destinations > /dev/null 2>&1; then
    echo "✅ Backend đang chạy"
else
    echo "❌ Backend không chạy - Vui lòng start: cd backend && npm run dev"
fi

echo ""
echo "📍 BƯỚC 2: Kiểm tra Frontend đang chạy..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend đang chạy"
else
    echo "❌ Frontend không chạy - Vui lòng start: cd frontend && npm run dev"
fi

echo ""
echo "📍 BƯỚC 3: Hướng dẫn Clear Cache trên Browser"
echo "=============================================="
echo ""
echo "🌐 Mở browser và làm theo:"
echo ""
echo "   1. Mở trang: http://localhost:3000/destinations"
echo ""
echo "   2. Nhấn F12 để mở DevTools"
echo ""
echo "   3. Tab Application → Storage"
echo "      → Click 'Clear site data'"
echo ""
echo "   4. Hoặc đơn giản nhất:"
echo "      → Nhấn: Ctrl + Shift + R (Hard Refresh)"
echo ""
echo "   5. Tab Network → Check 'Disable cache'"
echo "      → Nhấn F5"
echo ""
echo "=============================================="
echo ""
echo "🗺️  Sau đó vào trang:"
echo "   http://localhost:3000/destinations?search=Bãi+Sao"
echo ""
echo "   Click vào card 'Bãi Sao'"
echo "   → Map sẽ hiển thị đúng vị trí Phú Quốc"
echo "   → Tọa độ: 10.1599, 103.9959"
echo ""
echo "✨ Xong!"

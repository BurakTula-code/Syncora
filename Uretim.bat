@echo off
color 0e
title Syncora Play Hata Ayiklama
echo ===================================================
echo SYNCORA PLAY - INSAAT BASLIYOR...
echo ===================================================

:: 1. Eski artiklari temizle (Eger dosya aciksa hata verir, bunu kontrol eder)
echo [1/4] Eski dosyalar temizleniyor...
rd /s /q dist 2>nul

:: 2. Bagimliliklari kontrol et
echo [2/4] Paketler kontrol ediliyor...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo !!! HATA: 'npm install' sirasinda bir sorun olustu. Internetini kontrol et.
    pause
    exit /b %errorlevel%
)

:: 3. Insaat (Build) baslat
echo [3/4] Exe olusturuluyor (Bu biraz surebilir)...
call npx electron-builder --win
if %errorlevel% neq 0 (
    echo.
    echo !!! HATA: Electron-builder dosyayi uretemedi. 
    echo package.json dosyasindaki yazimlari veya icon.ico dosyasini kontrol et.
    pause
    exit /b %errorlevel%
)

echo.
echo ===================================================
echo [4/4] BASARILI! 'dist' klasorune bak kanka.
echo ===================================================
pause
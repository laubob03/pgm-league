@echo off
chcp 65001 >nul
echo ========================================
echo    PGM联赛 - 一键同步并部署到 GitHub
echo ========================================
echo.

:: === 配置 ===
set "ROOT=C:\Users\J.K\WorkBuddy\20260424000824"
set "DEPLOY=%ROOT%\pgm-league-deploy"

:: === [1/4] 同步文件到 deploy 目录 ===
echo [1/4] 同步文件到 deploy 目录...
copy /Y "%ROOT%\index.html"   "%DEPLOY%\index.html"   >nul
copy /Y "%ROOT%\sw.js"        "%DEPLOY%\sw.js"        >nul
copy /Y "%ROOT%\version.json" "%DEPLOY%\version.json" >nul
echo       已同步: index.html, sw.js, version.json
echo.

:: === [2/4] 检测改动 ===
echo [2/4] 检测改动...
cd /d "%DEPLOY%"
git status --short
echo.

:: === [3/4] 提交并推送 ===
echo [3/4] 提交并推送...
set /p msg=请输入本次改动说明（直接回车跳过）: 
if "%msg%"=="" (
    git add .
    git commit --allow-empty -m "sync: 同步更新"
) else (
    git add .
    git commit -m "%msg%"
)
git push

:: === [4/4] 完成 ===
echo.
echo ========================================
echo    同步完成！
echo    等待 1~2 分钟后访问：
echo    https://laubob03.github.io/pgm-league/
echo ========================================
echo.
pause

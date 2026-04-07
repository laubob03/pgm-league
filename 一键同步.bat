@echo off
chcp 65001 >nul
echo ========================================
echo    PGM联赛 - 一键同步到 GitHub
echo ========================================
echo.

cd /d "C:\Users\J.K\WorkBuddy\20260407120000\PGM联赛"

echo [1/3] 检测改动...
git status --short
echo.

echo [2/3] 提交并推送...
set /p msg=请输入本次改动说明（直接回车跳过）: 
if "%msg%"=="" (
    git add .
    git commit --allow-empty -m "sync: 同步更新"
) else (
    git add .
    git commit -m "%msg%"
)
git push

echo.
echo ========================================
echo    同步完成！
echo    等待 1~2 分钟后访问：
echo    https://laubob03.github.io/pgm-league/
echo ========================================
echo.
pause

@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
set "NAPI_RS_FORCE_WASI=true"
call npm run dev

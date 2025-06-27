@echo off
setlocal

:: Caminhos relativos ao local do .bat
set "NODE_PATH=%~dp0nodejs"

:: Adiciona ambos ao PATH (temporariamente, só pra esse terminal)
set "PATH=%NODE_PATH%;%PATH%"

:: Abre o terminal com tudo pronto
start cmd 
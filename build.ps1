Write-Host "[+] Building react app..." 
npm run build --prefix .\client\
Copy-Item ".\client\build\*" -Destination ".\server\public" -Recurse -Force
Write-Host "[+] Finished!" 
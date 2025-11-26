# === 🔧 VARIABLES
$server = "yao-val-dc01"
$username = "VALDCOM\Administrator"
$password = "Vdl!@?192341"

$angularProjectPath = "C:\Users\HP\Desktop\Valdoz\ClinicSystem\front-end"
$dotnetProjectPath = "C:\Users\LENOVO\Desktop\Vadoz Folder\Clinic\back-end\WebAPI"

$angularBuildOutput = "C:\inetpub\wwwroot\enject_temp"
$dotnetBuildOutput = "C:\inetpub\wwwroot\EnjectManagementAPI_temp"

$angularRemotePath = "Z:\inetpub\wwwroot\enject"
$dotnetRemotePath = "Z:\inetpub\wwwroot\EnjectManagementAPI"
$dotnetRemoteTemp = "Z:\inetpub\wwwroot\EnjectManagementAPI_temp"
$dotnetRemoteBackup = "Z:\inetpub\wwwroot\EnjectManagementAPI_old"

# === 🔐 CREDENTIALS
$securePassword = ConvertTo-SecureString $password -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential ($username, $securePassword)

# === [1/6] BUILD ANGULAR
Write-Host "`n[1/6] Build Angular..."
Set-Location $angularProjectPath
ng build --output-path "$angularBuildOutput" --configuration=production --base-href /enject/

# === [2/6] BUILD .NET CORE
Write-Host "`n[2/6] Build .NET Core..."
Set-Location $dotnetProjectPath
dotnet publish -c Release -o "$dotnetBuildOutput"

# === [3/6] MONTAGE DU DISQUE RÉSEAU
Write-Host "`n[3/6] Connexion au serveur distant..."
New-PSDrive -Name "Z" -PSProvider FileSystem -Root "\\$server\C$" -Credential $credential -Persist

# === [4/6] DÉPLOIEMENT ANGULAR DIRECT (sans arrêt IIS)
Write-Host "[4/6a] Déploiement Angular avec robocopy..."
robocopy "$angularBuildOutput" "$angularRemotePath" /MIR /Z /NP /R:1 /W:1

# === [4/6b] Copier web.config si présent
$localWebConfig = Join-Path $angularProjectPath "web.config"
$remoteWebConfigDest = Join-Path $angularRemotePath "web.config"
if (Test-Path $localWebConfig) {
    Copy-Item -Path $localWebConfig -Destination $remoteWebConfigDest -Force
    Write-Host "[4b] web.config copié."
}

# === [5/6] DÉPLOIEMENT .NET PAR RENOMMAGE ATOMIQUE
Write-Host "`n[5/6] Préparation du déploiement API (renommage)..."

# 1. Copier build local vers dossier temp distant
Write-Host "[5a] Copie vers dossier temporaire distant..."
robocopy "$dotnetBuildOutput" "$dotnetRemoteTemp" /MIR /Z /NP /R:1 /W:1

# 2. Stop IIS
Write-Host "[5b] Arrêt de IIS..."
.\PsExec.exe \\$server -u $username -p $password iisreset /stop
.\PsExec.exe \\$server -u $username -p $password iisreset /stop
.\PsExec.exe \\$server -u $username -p $password iisreset /stop


# 3. Supprimer ancien backup s'il existe
if (Test-Path $dotnetRemoteBackup) {
    Write-Host "[5c] Suppression de l'ancien backup..."
    Remove-Item -Path $dotnetRemoteBackup -Recurse -Force
}

# 4. Renommer API actuelle → backup
if (Test-Path $dotnetRemotePath) {
    Write-Host "[5d] Renommage API actuelle → backup..."
    Rename-Item -Path $dotnetRemotePath -NewName "EnjectManagementAPI_old"
}

# 5. Renommer temp → API active
Write-Host "[5e] Activation du nouveau build..."
Rename-Item -Path $dotnetRemoteTemp -NewName "EnjectManagementAPI"

# 6. Redémarrer IIS
Write-Host "[5f] Redémarrage de IIS..."
.\PsExec.exe \\$server -u $username -p $password iisreset /start
.\PsExec.exe \\$server -u $username -p $password iisreset /start

# === [6/6] CLEAN
Remove-PSDrive -Name "Z"
Write-Host "`n✅ Déploiement terminé avec succès (stratégie safe avec rollback possible)."

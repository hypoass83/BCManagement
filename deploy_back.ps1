<#
    Déploiement Back-end (.NET Core) vers \\$server\inetpub\wwwroot\EnjectManagementAPI
    Stratégie : build local → copie vers dossier _temp → arrêt IIS →
                renommage (backup + swap atomique) → redémarrage IIS.
#>

# === 🔧 VARIABLES ===
$server = "yao-val-dc01"
$username             = "VALDCOM\Administrator"
$password             = "Vdl!@?192341"

$dotnetProjectPath    = "C:\Users\HP\Desktop\Valdoz\ClinicSystem\back-end\WebAPI"
$dotnetBuildOutput    = "C:\inetpub\wwwroot\EnjectManagementAPI_temp"

$dotnetRemotePath     = "Z:\inetpub\wwwroot\EnjectManagementAPI"
$dotnetRemoteTemp     = "Z:\inetpub\wwwroot\EnjectManagementAPI_temp"
$dotnetRemoteBackup   = "Z:\inetpub\wwwroot\EnjectManagementAPI_old"

# PsExec (local) pour piloter IIS à distance
$psExecPath           = ".\PsExec.exe"

# === 🔐 CREDENTIALS ===
$securePassword = ConvertTo-SecureString $password -AsPlainText -Force
$credential     = New-Object System.Management.Automation.PSCredential ($username, $securePassword)

# === [2/6] MONTAGE DU DISQUE RÉSEAU ===
Write-Host "[2/6] Connexion au serveur distant…"
New-PSDrive -Name "Z" -PSProvider FileSystem -Root "\\$server\C$" -Credential $credential -Persist

# === [1/6] BUILD .NET CORE ===
Write-Host "`n[1/6] Build .NET Core…"
Set-Location $dotnetProjectPath
dotnet publish -c Release -o "$dotnetBuildOutput"



# === [3/6] COPIE DU NOUVEAU BUILD ===
Write-Host "[3/6] Copie du build vers le dossier temporaire distant…"
robocopy "$dotnetBuildOutput" "$dotnetRemoteTemp" /MIR /Z /NP /R:1 /W:1

# === [4/6] ARRÊT D’IIS ===
Write-Host "[4/6] Arrêt de IIS…"
& $psExecPath \\$server -u $username -p $password iisreset /stop
& $psExecPath \\$server -u $username -p $password iisreset /stop
& $psExecPath \\$server -u $username -p $password iisreset /stop

# === [5/6] SWAP ATOMIQUE (rollback possible) ===
# 5a. Suppression de l’ancien backup (s’il existe)
if (Test-Path $dotnetRemoteBackup) {
    Write-Host "Suppression de l’ancien backup…"
    Remove-Item -Path $dotnetRemoteBackup -Recurse -Force
}

# 5b. Renommage de l’API actuelle → _old
if (Test-Path $dotnetRemotePath) {
    Write-Host "Renommage de l’API actuelle → backup…"
    Rename-Item -Path $dotnetRemotePath -NewName "EnjectManagementAPI_old"
}

# 5c. Renommage du dossier _temp → API active
Write-Host "Activation du nouveau build…"
Rename-Item -Path $dotnetRemoteTemp -NewName "EnjectManagementAPI"

# === [6/6] REDÉMARRAGE D’IIS & CLEAN ===
Write-Host "[6/6] Redémarrage de IIS…"
& $psExecPath \\$server -u $username -p $password iisreset /start

Remove-PSDrive -Name "Z"
Write-Host "`n✅ Déploiement back-end terminé (rollback => dossier *_old*)."

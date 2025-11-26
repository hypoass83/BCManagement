# ===  VARIABLES
$server = "yao-val-dc01"
$username = "VALDCOM\Administrator"
$password = "Vdl!@?192341"

$angularProjectPath = "C:\Users\HP\Desktop\Valdoz\ClinicSystem\front-end"
$angularBuildOutput = "C:\inetpub\wwwroot\enject_temp"
$angularRemotePath = "Z:\inetpub\wwwroot\enject"

# ===  CREDENTIALS
$securePassword = ConvertTo-SecureString $password -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential ($username, $securePassword)

# === [2/3] CONNEXION AU SERVEUR DISTANT
Write-Host "`n[2/3] Connexion au serveur distant..."
New-PSDrive -Name "Z" -PSProvider FileSystem -Root "\\$server\C$" -Credential $credential -Persist


# === [1/3] BUILD ANGULAR
Write-Host "`n[1/3] Build Angular..."
Set-Location $angularProjectPath
ng build --output-path "$angularBuildOutput" --configuration=production --base-href /enject/


# === [3/3] DÉPLOIEMENT ANGULAR
Write-Host "`n[3/3] Déploiement Angular..."
robocopy "$angularBuildOutput" "$angularRemotePath" /MIR /Z /NP /R:1 /W:1

# Copier web.config si présent
$localWebConfig = Join-Path $angularProjectPath "web.config"
$remoteWebConfigDest = Join-Path $angularRemotePath "web.config"
if (Test-Path $localWebConfig) {
    Copy-Item -Path $localWebConfig -Destination $remoteWebConfigDest -Force
    Write-Host " web.config copié."
}

# Nettoyage
Remove-PSDrive -Name "Z"

Write-Host "`n✅ Front-End déployé avec succès !"

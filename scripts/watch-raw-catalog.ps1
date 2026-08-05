[CmdletBinding()]
param(
  [switch]$ValidateOnly
)

$ErrorActionPreference = 'Stop'

$projectDirectory = 'C:\Users\Administrator\Desktop\v2sunnyseoweb'
$sourceDirectory = 'D:\Furniture pics raw'
$importScript = Join-Path $projectDirectory 'scripts\importRawCatalog.cjs'
$logDirectory = Join-Path $projectDirectory 'logs'
$logFile = Join-Path $logDirectory 'raw-catalog-watcher.log'
$settleSeconds = 90

function Write-Log {
  param([string]$Message)

  $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $Message"
  New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null
  Add-Content -LiteralPath $logFile -Value $line
  Write-Output $line
}

function Assert-Prerequisites {
  if (-not (Test-Path -LiteralPath $sourceDirectory -PathType Container)) {
    throw "Raw image folder was not found: $sourceDirectory"
  }
  if (-not (Test-Path -LiteralPath $projectDirectory -PathType Container)) {
    throw "Website project was not found: $projectDirectory"
  }
  if (-not (Test-Path -LiteralPath $importScript -PathType Leaf)) {
    throw "Catalog importer was not found: $importScript"
  }

  $node = Get-Command node.exe -ErrorAction Stop
  $npm = Get-Command npm.cmd -ErrorAction Stop
  return @{ Node = $node.Source; Npm = $npm.Source }
}

function Invoke-CatalogRefresh {
  param(
    [string]$NodeCommand,
    [string]$NpmCommand
  )

  Write-Log 'Image changes settled. Refreshing the catalogue and publishing the website.'
  Push-Location -LiteralPath $projectDirectory
  try {
    & $NodeCommand $importScript
    if ($LASTEXITCODE -ne 0) { throw "Catalogue import failed with exit code $LASTEXITCODE." }

    & $NpmCommand run build
    if ($LASTEXITCODE -ne 0) { throw "Website build failed with exit code $LASTEXITCODE." }

    & $NpmCommand run deploy
    if ($LASTEXITCODE -ne 0) { throw "Website deployment failed with exit code $LASTEXITCODE." }

    Write-Log 'Published successfully to catalog.sunny.co.th.'
  }
  catch {
    Write-Log "Update failed: $($_.Exception.Message)"
  }
  finally {
    Pop-Location
  }
}

$commands = Assert-Prerequisites
if ($ValidateOnly) {
  Write-Output "Ready: monitoring $sourceDirectory and publishing from $projectDirectory."
  exit 0
}

$createdNew = $false
$mutex = [System.Threading.Mutex]::new($true, 'CatalogRawFolderWatcher', [ref]$createdNew)
if (-not $createdNew) {
  Write-Output 'Catalog raw-folder watcher is already running.'
  exit 0
}

try {
  $watcher = [System.IO.FileSystemWatcher]::new($sourceDirectory)
  $watcher.IncludeSubdirectories = $true
  $watcher.NotifyFilter = [System.IO.NotifyFilters]'FileName, DirectoryName, LastWrite, Size'

  foreach ($eventName in @('Created', 'Changed', 'Deleted', 'Renamed')) {
    Register-ObjectEvent -InputObject $watcher -EventName $eventName -SourceIdentifier "CatalogRaw.$eventName" | Out-Null
  }

  $watcher.EnableRaisingEvents = $true
  Write-Log "Watcher started. Monitoring $sourceDirectory. Changes publish after $settleSeconds seconds without further edits."
  $lastChange = $null

  while ($true) {
    $event = Wait-Event -Timeout 5
    if ($null -ne $event) {
      $lastChange = Get-Date
      Remove-Event -EventIdentifier $event.EventIdentifier -ErrorAction SilentlyContinue
    }

    if ($null -ne $lastChange -and ((Get-Date) - $lastChange).TotalSeconds -ge $settleSeconds) {
      Invoke-CatalogRefresh -NodeCommand $commands.Node -NpmCommand $commands.Npm
      $lastChange = $null
    }
  }
}
finally {
  if ($null -ne $watcher) { $watcher.Dispose() }
  $mutex.ReleaseMutex()
  $mutex.Dispose()
}

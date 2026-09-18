$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$port = 8080

function Get-ContentType([string]$path) {
    switch ([IO.Path]::GetExtension($path).ToLowerInvariant()) {
        '.html' { 'text/html; charset=utf-8' }
        '.css'  { 'text/css; charset=utf-8' }
        '.js'   { 'application/javascript; charset=utf-8' }
        '.json' { 'application/json; charset=utf-8' }
        '.png'  { 'image/png' }
        '.jpg'  { 'image/jpeg' }
        '.jpeg' { 'image/jpeg' }
        '.svg'  { 'image/svg+xml' }
        '.ico'  { 'image/x-icon' }
        '.webp' { 'image/webp' }
        default { 'application/octet-stream' }
    }
}

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
try {
    $listener.Start()
} catch {
    Write-Host "Port $port ist bereits belegt. Schliessen Sie ggf. eine bereits laufende Vorschau und versuchen Sie es erneut." -ForegroundColor Red
    exit 1
}

Write-Host ''
Write-Host 'Mhtrian Uebersetzungen - lokale Vorschau' -ForegroundColor Cyan
Write-Host "Adresse: http://localhost:$port" -ForegroundColor Green
Write-Host 'Zum Beenden dieses Fensters Strg+C druecken oder das Fenster schliessen.' -ForegroundColor Yellow
Write-Host ''

Start-Process "http://localhost:$port"

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        try {
            $stream = $client.GetStream()
            $reader = New-Object System.IO.StreamReader($stream, [Text.Encoding]::ASCII, $false, 1024, $true)
            $requestLine = $reader.ReadLine()
            if ([string]::IsNullOrWhiteSpace($requestLine)) { $client.Close(); continue }

            # Read and ignore the remaining request headers.
            do { $line = $reader.ReadLine() } while ($line -ne $null -and $line -ne '')

            $parts = $requestLine.Split(' ')
            $method = $parts[0]
            $urlPath = if ($parts.Count -gt 1) { $parts[1] } else { '/' }
            $urlPath = $urlPath.Split('?')[0]
            $urlPath = [Uri]::UnescapeDataString($urlPath)

            if ($method -ne 'GET' -and $method -ne 'HEAD') {
                $body = [Text.Encoding]::UTF8.GetBytes('405 Method Not Allowed')
                $header = "HTTP/1.1 405 Method Not Allowed`r`nContent-Type: text/plain; charset=utf-8`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
                $hb = [Text.Encoding]::ASCII.GetBytes($header)
                $stream.Write($hb,0,$hb.Length)
                if ($method -ne 'HEAD') { $stream.Write($body,0,$body.Length) }
                continue
            }

            $relative = $urlPath.TrimStart('/').Replace('/', [IO.Path]::DirectorySeparatorChar)
            if ([string]::IsNullOrWhiteSpace($relative)) { $relative = 'index.html' }

            $candidate = Join-Path $root $relative
            if (Test-Path $candidate -PathType Container) { $candidate = Join-Path $candidate 'index.html' }

            $full = [IO.Path]::GetFullPath($candidate)
            if (-not $full.StartsWith($root, [StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path $full -PathType Leaf)) {
                $full = Join-Path $root '404.html'
                $status = '404 Not Found'
            } else {
                $status = '200 OK'
            }

            $bytes = [IO.File]::ReadAllBytes($full)
            $ctype = Get-ContentType $full
            $header = "HTTP/1.1 $status`r`nContent-Type: $ctype`r`nContent-Length: $($bytes.Length)`r`nCache-Control: no-cache`r`nConnection: close`r`n`r`n"
            $hb = [Text.Encoding]::ASCII.GetBytes($header)
            $stream.Write($hb,0,$hb.Length)
            if ($method -ne 'HEAD') { $stream.Write($bytes,0,$bytes.Length) }
            $stream.Flush()
        } catch {
            # Keep the server running even if one browser request fails.
        } finally {
            $client.Close()
        }
    }
} finally {
    $listener.Stop()
}

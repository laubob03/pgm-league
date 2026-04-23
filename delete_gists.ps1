# Delete duplicate transfer Gists and test Gist
$gistsToDelete = @(
    '300e60769ee48d3c8178cb258492a29c',
    '590b05c02fdfe92feadfb7d0394c4967',
    'abda5354dcf60af9a90953616fd07194',
    'c2b0c1565a4952cbd77945e021435637',
    '5761d287d243ca0db880ba01a6bb668f',
    'aa44578806d9214457701a23401c1164',
    'c37e806d59819ff011bc2e6e2bc71e84',
    '3c716947740c0f3a4b53c8a10a5be558',
    'aba27514fe7a3bac1cb54051e561ed24'
)

# Read token from index.html
$content = Get-Content 'C:\Users\J.K\WorkBuddy\20260407120000\PGM联赛\index.html' -Raw

# Extract RECORDER_BUILTIN_TOKEN parts
if ($content -match 'const _rt\s*=\s*\[([^\]]+)\]') {
    $parts = $Matches[1] -split ',' | ForEach-Object {
        if ($_ -match "'([^']*)'") { $Matches[1] }
        elseif ($_ -match '"([^"]*)"') { $Matches[1] }
    }
    $token = $parts -join ''
} else {
    Write-Error "Cannot extract token"
    exit 1
}

$headers = @{
    'Authorization' = "Bearer $token"
    'Accept' = 'application/vnd.github.v3+json'
}

$deleted = 0
$failed = 0

foreach ($gistId in $gistsToDelete) {
    try {
        $uri = "https://api.github.com/gists/$gistId"
        Invoke-RestMethod -Uri $uri -Method DELETE -Headers $headers
        Write-Output "DELETED: $gistId"
        $deleted++
    } catch {
        Write-Output "FAILED: $gistId - $($_.Exception.Message)"
        $failed++
    }
}

Write-Output ""
Write-Output "Done: $deleted deleted, $failed failed"

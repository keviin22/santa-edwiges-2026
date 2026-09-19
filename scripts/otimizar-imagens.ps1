# Gera cópias leves sem sobrescrever os originais. Execute com PowerShell.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$imageRoot = Join-Path $PSScriptRoot '../assets/images'

function Export-ImageVariant {
    param([string]$Source, [string]$Target, [int]$Width, [int]$Height, [bool]$Png = $false)
    $sourcePath = Join-Path $imageRoot $Source
    $targetPath = Join-Path $imageRoot $Target
    if ($sourcePath -eq $targetPath) { throw 'O arquivo original deve ser preservado.' }
    $image = [System.Drawing.Image]::FromFile($sourcePath)
    $bitmap = [System.Drawing.Bitmap]::new($Width, $Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    try {
        $graphics.Clear([System.Drawing.Color]::Transparent)
        $graphics.CompositingQuality = 'HighQuality'
        $graphics.InterpolationMode = 'HighQualityBicubic'
        $graphics.SmoothingMode = 'HighQuality'
        $graphics.PixelOffsetMode = 'HighQuality'
        $scale = [Math]::Min($Width / $image.Width, $Height / $image.Height)
        $drawWidth = [int][Math]::Round($image.Width * $scale)
        $drawHeight = [int][Math]::Round($image.Height * $scale)
        $x = [int](($Width - $drawWidth) / 2)
        $y = [int](($Height - $drawHeight) / 2)
        $graphics.DrawImage($image, $x, $y, $drawWidth, $drawHeight)
        if ($Png) {
            $bitmap.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
        } else {
            $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
            $parameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
            try {
                $parameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]88)
                $bitmap.Save($targetPath, $encoder, $parameters)
            } finally { $parameters.Dispose() }
        }
        Get-Item -LiteralPath $targetPath | Select-Object Name, Length
    } finally {
        $graphics.Dispose()
        $bitmap.Dispose()
        $image.Dispose()
    }
}

Export-ImageVariant 'banner.png' 'banner-otimizado.jpg' 1307 517
Export-ImageVariant 'banner.png' 'banner-mobile.jpg' 768 304
Export-ImageVariant 'favicon.png' 'brasao-otimizado.png' 160 200 $true
Export-ImageVariant 'favicon.png' 'icone-48.png' 48 48 $true
Export-ImageVariant 'Santa-edwiges-imagem.jpg' 'santa-edwiges-programacao.jpg' 520 780
Export-ImageVariant 'Santa-edwiges-imagem-2.jpg' 'santa-edwiges-historia.jpg' 520 1156

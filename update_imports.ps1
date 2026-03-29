$replacements = @{
    "@/services/auth"     = "@/features/auth"
    "@/services/posts"    = "@/features/posts"
    "@/services/profile"  = "@/features/profile"
    "@/services/comments" = "@/features/comments"
    "@/services/follows"  = "@/features/follows"
    "@/services/likes"    = "@/features/likes"
    "@/hooks/auth"        = "@/features/auth"
    "@/hooks/posts"       = "@/features/posts"
    "@/hooks/profile"      = "@/features/profile"
    "@/store/auth"        = "@/features/auth"
    "@/store/posts"       = "@/features/posts"
    "@/store/profile"     = "@/features/profile"
}

$targetDirs = @("src/features", "src/hooks/settings")

foreach ($dir in $targetDirs) {
    if (Test-Path $dir) {
        $files = Get-ChildItem -Path $dir -Recurse -File -Include *.js,*.jsx
        foreach ($file in $files) {
            $content = Get-Content -Path $file.FullName -Raw
            $newContent = $content
            foreach ($key in $replacements.Keys) {
                # We want to match exactly the string, but sometimes they are in quotes.
                # The user says "Make sure to keep the curly braces if they exist".
                # This means we just replace the string literal.
                $newContent = $newContent -replace [regex]::Escape($key), $replacements[$key]
            }
            if ($newContent -ne $content) {
                Set-Content -Path $file.FullName -Value $newContent -NoNewline
                Write-Host "Updated $($file.FullName)"
            }
        }
    }
}

# Fix src/features/comments/components/CommentSection.jsx specifically
$commentSection = "src/features/comments/components/CommentSection.jsx"
if (Test-Path $commentSection) {
    $content = Get-Content -Path $commentSection -Raw
    # Ensure useComments is from '@/features/comments'
    # It might have been replaced to '@/features/posts' by the script above if it was '@/hooks/posts'
    $newContent = $content -replace [regex]::Escape("from '@/features/posts'"), "from '@/features/comments'"
    if ($newContent -ne $content) {
         Set-Content -Path $commentSection -Value $newContent -NoNewline
         Write-Host "Fixed $commentSection"
    }
}

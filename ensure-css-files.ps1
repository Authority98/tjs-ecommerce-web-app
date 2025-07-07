# Script to ensure CSS files are included in the repository

# Check if the CSS files exist
$cssFiles = @(
    "src/pages/CategorySelection.css",
    "src/pages/CheckoutPage.css",
    "src/pages/ProductPage.css"
)

# Create a .gitkeep file in the same directory to ensure the directory is tracked
foreach ($file in $cssFiles) {
    if (Test-Path $file) {
        Write-Host "$file exists locally"
    } else {
        Write-Host "Creating empty $file"
        New-Item -ItemType File -Path $file -Force
    }
}

Write-Host "CSS files are now ready to be committed to the repository"
Write-Host "Run the following commands to add them to your repository:"
Write-Host "git add src/pages/*.css"
Write-Host "git commit -m 'Add CSS files required for build'"
Write-Host "git push"
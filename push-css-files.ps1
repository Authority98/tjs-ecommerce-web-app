# Script to push CSS files to GitHub repository

# GitHub repository URL
$repoUrl = "https://github.com/Authority98/tjs-ecommerce-web-app"

# Check if git is installed
$gitInstalled = $null
try {
    $gitInstalled = Get-Command git -ErrorAction SilentlyContinue
} catch {
    # Command not found
}

if ($null -eq $gitInstalled) {
    Write-Host "Git is not installed. Please install Git and try again."
    Write-Host "Download Git from: https://git-scm.com/downloads"
    exit 1
}

# Check if the directory is a git repository
$isGitRepo = Test-Path -Path ".git" -PathType Container
if (-not $isGitRepo) {
    Write-Host "This directory is not a Git repository. Initializing..."
    git init
    git remote add origin $repoUrl
}

# Make sure the CSS files exist
$cssFiles = @(
    "src/pages/CategorySelection.css",
    "src/pages/CheckoutPage.css",
    "src/pages/ProductPage.css"
)

foreach ($file in $cssFiles) {
    if (Test-Path $file) {
        Write-Host "$file exists locally"
    } else {
        Write-Host "Error: $file does not exist locally"
        exit 1
    }
}

# Add the CSS files to git
Write-Host "Adding CSS files to git..."
git add src/pages/*.css

# Commit the changes
Write-Host "Committing changes..."
git commit -m "Add CSS files required for Netlify build"

# Push to the repository
Write-Host "Pushing to repository..."
git push -u origin master

Write-Host "Done! The CSS files have been pushed to the repository."
Write-Host "Netlify should now be able to build the site successfully."
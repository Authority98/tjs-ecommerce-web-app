# Script to help deploy to Netlify without Git

# Check if Netlify CLI is installed
$netlifyInstalled = $null
try {
    $netlifyInstalled = Get-Command netlify -ErrorAction SilentlyContinue
} catch {
    # Command not found
}

if ($null -eq $netlifyInstalled) {
    Write-Host "Netlify CLI is not installed. Installing now..."
    npm install -g netlify-cli
}

# Build the project
Write-Host "Building the project..."
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Please fix the errors and try again."
    exit 1
}

# Deploy to Netlify
Write-Host "Deploying to Netlify..."
netlify deploy --prod

Write-Host "\nIf the deployment was successful, your site should now be live on Netlify!"
Write-Host "If you encountered any issues, please refer to the NETLIFY_DEPLOYMENT_FIX.md file for manual instructions."
#!/bin/bash

# List of files to fix
files=(
  "components/ClientLogosSection.tsx"
  "components/Footer.tsx" 
  "components/ProjectsSection.tsx"
  "components/subpages/ContactPage.tsx"
  "components/subpages/AboutPage.tsx"
  "app/services/page.tsx"
  "app/services/[id]/page.tsx"
  "app/blogs/page.tsx"
  "app/blogs/[id]/page.tsx"
  "app/login/page.tsx"
  "app/projects/page.tsx"
  "app/projects/[id]/page.tsx"
  "app/admin/client-logos/page.tsx"
  "app/admin/projects/page.tsx"
  "app/about/page.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Fixing $file..."
    # Remove next/image import
    sed -i "/import Image from 'next\/image'/d" "$file"
    # Replace <Image with <img
    sed -i 's/<Image/<img/g' "$file"
    # Remove fill prop and add basic styling
    sed -i 's/fill/className="w-full h-full object-cover"/g' "$file"
  fi
done

echo "Done! All Image components replaced with img tags."

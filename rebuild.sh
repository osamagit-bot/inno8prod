#!/bin/bash
npm run build
pm2 restart nextjs
echo "Rebuild complete"

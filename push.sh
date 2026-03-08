#!/bin/bash

# Get the commit message from the user
echo "Enter commit message:"
read commit_msg

# Check if message is empty
if [ -z "$commit_msg" ]; then
  commit_msg="Update: $(date +'%Y-%m-%d %H:%M:%S')"
fi

# Git operations
git add .
git commit -m "$commit_msg"
git push

echo "Successfully pushed to GitHub!"

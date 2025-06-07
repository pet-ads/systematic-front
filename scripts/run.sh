#!/usr/bin/env bash

colorize_output() {
  while IFS= read -r line; do
    if echo "$line" | grep -qi "error"; then
      echo -e "\033[31mERROR:\033[0m $line"
    elif echo "$line" | grep -qi "warning"; then
      echo -e "\033[33mWARNING:\033[0m $line"
    else
      echo "$line"
    fi
  done
}

echo -e "\033[34m==> Initializing build...\033[0m"

npm run build 2>&1 | colorize_output

if [ "${PIPESTATUS[0]}" -ne 0 ]; then
  echo -e "\033[31mFailure during build. Exiting.\033[0m"
  exit 1
fi

echo -e "\033[32mBuild complete!\033[0m"
echo ""

echo -e "\033[34m==> Running development server (yarn dev)...\033[0m"

yarn dev 2>&1 | colorize_output

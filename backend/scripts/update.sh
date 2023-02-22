# ---
# UPDATE.sh
# ---

# Pulls the latest version of the repository and restarts the server.
#
# The goal of this script is to be a sort-of manager for the server, so that
# the server can automaically updat and restart whenever a change is made to the
# repository.

# The root directory of the repository.
root="$(dirname -- "$( readlink -f -- "$0"; )";)/../"
cd "$root"

# The id of the server within PM2.
name="server"

# If PM2 is running the server, we'll stop it.
pm2 stop "$name" > /dev/null 2>&1

# We'll pull the latest version of the repository.
git pull > /dev/null 2>&1

# We'll install the latest dependencies.
pnpm install > /dev/null 2>&1

# Finally, we'll start the server again.
pm2 start pnpm --name "$name" --cwd "$root" -- start > /dev/null 2>&1
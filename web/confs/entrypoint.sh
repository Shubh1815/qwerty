set -e

# Migration and static files
python3 backend/manage.py migrate
python3 backend/manage.py collectstatic

# Build
npm --prefix /frontend run build
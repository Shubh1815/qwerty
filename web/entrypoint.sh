set -e

# Build
npm --prefix frontend run build

# Migration and static files
python backend/manage.py migrate
python backend/manage.py collectstatic --no-input

# Gunicorn
gunicorn qwerty.wsgi:application --chdir backend --bind 0.0.0.0:8000
set -e

# Build
npm --prefix frontend run build

# Migration and static files
python backend/manage.py migrate
python backend/manage.py collectstatic --no-input

# Gunicorn
gunicorn --chdir backend qwerty.wsgi:application \
--bind 0.0.0.0:8000 \
--error-logfile /var/log/gunicorn.error.log \
--access-logfile /var/log/gunicorn.access.log 
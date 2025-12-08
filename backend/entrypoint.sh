# Waiting until Postgres is ready
while ! pg_isready -h db -p 5432 -U "$POSTGRES_USER" > /dev/null 2>&1; do
  echo "Waiting for Postgres..."
  sleep 2
done

# Running migrations
echo "Running migrations..."
alembic upgrade head

# Starting FastAPI
echo "Starting backend..."
uvicorn app.main:app --host 0.0.0.0 --port 8000

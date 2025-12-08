FROM python:3.10

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

RUN ["chmod", "+x", "/app/entrypoint.sh"]

ENTRYPOINT ["./entrypoint.sh"]

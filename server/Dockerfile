# base python image
FROM python:3.12-slim

# python runtime settings
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# set working directory
WORKDIR /app

# install system dependencies for psycopg
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev netcat-openbsd postgresql-client \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# copy and install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# copy application source
COPY src/ /app/

# copy init script
COPY init.sh /init.sh
RUN chmod +x /init.sh

# set entrypoint and default command
ENTRYPOINT ["/init.sh"]
CMD ["python", "src/manage.py", "runserver", "0.0.0.0:8000"]

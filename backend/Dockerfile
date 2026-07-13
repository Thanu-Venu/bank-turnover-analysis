FROM python:3.12-slim

# set working directory
WORKDIR /app

# install system deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# copy requirements and install
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# copy app
COPY . /app

# make entrypoint executable
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 8001

CMD ["/bin/bash", "/app/docker-entrypoint.sh"]

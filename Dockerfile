# Stage 1: Build C++ engine and prepare Python environment
FROM python:3.11-slim

# Install system dependencies (C++17 compiler and CMake)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . .

# Build C++ TokenForge core
RUN cmake -B build -S . && cmake --build build

# Create runtime directories
RUN mkdir -p uploads models data

# Expose port (Render sets $PORT dynamically)
EXPOSE 8000

ENV HOST=0.0.0.0
ENV PORT=8000

CMD ["python", "server.py"]


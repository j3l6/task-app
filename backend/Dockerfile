FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt . 
#esto se cambio para online
#COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
#esto se cambio para online
#COPY . .
#CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"] en local

#En nube, Render asigna puerto dinamicamente, no usar en local
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]

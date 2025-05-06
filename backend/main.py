from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from bson import ObjectId
import os

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conexión a MongoDB (¡CAMBIAR EN PRODUCCIÓN!)
client = MongoClient(os.getenv("MONGO_URI"))
db = client.taskdb
collection = db.tasks

class Task(BaseModel):
    title: str
    completed: bool = False

@app.post("/tasks", response_model=dict)
async def create_task(task: Task):
    try:
        result = collection.insert_one(task.model_dump())
        return {"id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/tasks", response_model=list[dict])
async def get_tasks():
    try:
        tasks = []
        for task in collection.find():
            task["_id"] = str(task["_id"])
            tasks.append(task)
        return tasks
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/tasks/{task_id}")
async def delete_task(task_id: str):
    try:
        result = collection.delete_one({"_id": ObjectId(task_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Task not found")
        return {"status": "deleted"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
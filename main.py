from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
import shutil
import os

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Backend is running"}

@app.post("/voice")
async def voice(file: UploadFile = File(...)):
    # Save uploaded audio (just for testing)
    os.makedirs("temp", exist_ok=True)
    input_path = "temp/input.webm"

    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Return a dummy audio file
    return FileResponse(
        path="dummy_response.wav",
        media_type="audio/wav",
        filename="response.wav"
    )

import os
import json
import subprocess
from pathlib import Path
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR
BUILD_DIR = PROJECT_DIR / "build"

def get_cli_exe() -> Optional[Path]:
    """Dynamically resolve the C++ API binary for Windows or Linux."""
    candidates = [
        BUILD_DIR / ("tokenforge_api.exe" if os.name == "nt" else "tokenforge_api"),
        BUILD_DIR / "tokenforge_api",
        BUILD_DIR / "tokenforge_api.exe"
    ]
    for c in candidates:
        if c.exists():
            return c
    return None

MODELS_DIR = PROJECT_DIR / "models"
DATA_DIR = PROJECT_DIR / "data"
UPLOAD_DIR = PROJECT_DIR / "uploads"
WEB_DIR = PROJECT_DIR / "web"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
MODELS_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR.mkdir(parents=True, exist_ok=True)

# In-memory session state — no default dataset; user must upload
CURRENT_STATE = {
    "activeDatasetPath": None,
    "activeDatasetName": None,
    "activeDatasetLines": 0,
    "activeDatasetSize": 0,
    "isTrained": False,
    "lastTrainingStats": None,
    "trainingHistory": [],
    "initialCorpus": []
}

def cleanup_all_storage():
    """Wipes all uploaded files and trained model files, resetting in-memory session."""
    if UPLOAD_DIR.exists():
        for f in UPLOAD_DIR.iterdir():
            if f.is_file() and f.name != ".gitkeep":
                try: f.unlink()
                except Exception: pass

    if MODELS_DIR.exists():
        for f in MODELS_DIR.iterdir():
            if f.is_file() and f.name != ".gitkeep":
                try: f.unlink()
                except Exception: pass

    CURRENT_STATE["activeDatasetPath"] = None
    CURRENT_STATE["activeDatasetName"] = None
    CURRENT_STATE["activeDatasetLines"] = 0
    CURRENT_STATE["activeDatasetSize"] = 0
    CURRENT_STATE["isTrained"] = False
    CURRENT_STATE["lastTrainingStats"] = None
    CURRENT_STATE["trainingHistory"] = []
    CURRENT_STATE["initialCorpus"] = []

# Clean any leftover files on cold boot
cleanup_all_storage()

app = FastAPI(title="TokenForge API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def run_cpp_cli(*args) -> dict:
    cli_exe = get_cli_exe()
    if not cli_exe:
        raise HTTPException(
            status_code=500,
            detail="TokenForge engine binary not found. Please build the C++ project with 'cmake --build build' first."
        )
    cmd = [str(cli_exe)] + list(args)
    try:
        proc = subprocess.run(
            cmd,
            cwd=str(PROJECT_DIR),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=120
        )
    except subprocess.TimeoutExpired:
        raise HTTPException(
            status_code=408,
            detail="Training timed out (exceeded 120 seconds). Please reduce the number of merge iterations."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Engine execution failed: {str(e)}")

    if proc.returncode != 0:
        error_msg = proc.stderr.strip() or proc.stdout.strip()
        try:
            idx = error_msg.find("{")
            if idx != -1:
                return json.loads(error_msg[idx:])
        except Exception:
            pass
        raise HTTPException(status_code=400, detail=f"Engine error: {error_msg}")

    stdout = proc.stdout
    json_start = stdout.find("{")
    if json_start == -1:
        raise HTTPException(status_code=500, detail="Invalid response from engine.")

    json_str = stdout[json_start:]
    try:
        return json.loads(json_str)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse engine response: {str(e)}")

# Request models
class TrainRequest(BaseModel):
    corpusPath: Optional[str] = None
    maxMerges: Optional[int] = 10
    minFrequency: Optional[int] = 2

class TokenizeRequest(BaseModel):
    text: str

class DecodeRequest(BaseModel):
    tokenIds: List[int]

def is_model_ready() -> bool:
    """A model is ONLY ready if a dataset was uploaded AND trained in this session."""
    vocab_file = MODELS_DIR / "vocab.txt"
    merges_file = MODELS_DIR / "merges.txt"
    return bool(
        CURRENT_STATE.get("activeDatasetPath")
        and CURRENT_STATE.get("isTrained")
        and vocab_file.exists()
        and merges_file.exists()
        and vocab_file.stat().st_size > 0
    )

def sync_model_status():
    if not is_model_ready():
        CURRENT_STATE["isTrained"] = False

sync_model_status()

# 1. Dataset Upload
@app.post("/api/dataset/upload")
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith(".txt"):
        raise HTTPException(status_code=400, detail="Only plain text (.txt) files are supported.")

    content_bytes = await file.read()
    if len(content_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    if len(content_bytes) > 50 * 1024 * 1024:  # 50 MB limit
        raise HTTPException(status_code=400, detail="File too large. Maximum upload size is 50 MB.")

    try:
        content_text = content_bytes.decode("utf-8")
    except UnicodeDecodeError:
        try:
            content_text = content_bytes.decode("latin-1")
        except Exception:
            raise HTTPException(status_code=400, detail="File encoding not supported. Please use UTF-8.")

    dest_path = UPLOAD_DIR / file.filename
    with open(dest_path, "w", encoding="utf-8") as f:
        f.write(content_text)

    lines = [line.strip() for line in content_text.splitlines() if line.strip()]
    preview = lines[:10]

    CURRENT_STATE["activeDatasetPath"] = str(dest_path)
    CURRENT_STATE["activeDatasetName"] = file.filename
    CURRENT_STATE["activeDatasetLines"] = len(lines)
    CURRENT_STATE["activeDatasetSize"] = len(content_bytes)
    # Uploading a dataset resets previous training state — user must click Train
    CURRENT_STATE["isTrained"] = False
    CURRENT_STATE["lastTrainingStats"] = None
    CURRENT_STATE["trainingHistory"] = []
    CURRENT_STATE["initialCorpus"] = []

    # Clean previous model files
    for f in [MODELS_DIR / "vocab.txt", MODELS_DIR / "merges.txt"]:
        if f.exists():
            try: f.unlink()
            except Exception: pass

    return {
        "status": "success",
        "filename": file.filename,
        "sizeBytes": len(content_bytes),
        "totalLines": len(lines),
        "preview": preview
    }

# 2. Get active dataset information — never expose filesystem paths
@app.get("/api/dataset/info")
async def get_dataset_info():
    if not CURRENT_STATE["activeDatasetPath"]:
        return {"exists": False, "needsUpload": True}

    path = Path(CURRENT_STATE["activeDatasetPath"])
    if not path.exists():
        # Dataset was removed — reset state
        CURRENT_STATE["activeDatasetPath"] = None
        CURRENT_STATE["activeDatasetName"] = None
        CURRENT_STATE["activeDatasetLines"] = 0
        CURRENT_STATE["activeDatasetSize"] = 0
        return {"exists": False, "needsUpload": True}

    content = path.read_text(encoding="utf-8", errors="replace")
    lines = [line.strip() for line in content.splitlines() if line.strip()]
    return {
        "exists": True,
        "filename": CURRENT_STATE["activeDatasetName"],
        "sizeBytes": path.stat().st_size,
        "totalLines": len(lines),
        "preview": lines[:10]
    }

# 3. Start BPE Training
@app.post("/api/train")
async def train_bpe(req: TrainRequest):
    if not CURRENT_STATE["activeDatasetPath"]:
        raise HTTPException(
            status_code=400,
            detail="No dataset uploaded. Please upload a training dataset (.txt file) before training."
        )

    corpus_file = CURRENT_STATE["activeDatasetPath"]
    if not Path(corpus_file).exists():
        raise HTTPException(status_code=400, detail="Dataset file not found. Please re-upload your dataset.")

    vocab_file = str(MODELS_DIR / "vocab.txt")
    merges_file = str(MODELS_DIR / "merges.txt")

    result = run_cpp_cli("train", corpus_file, str(req.maxMerges), str(req.minFrequency), vocab_file, merges_file)

    CURRENT_STATE["isTrained"] = True
    CURRENT_STATE["lastTrainingStats"] = {
        "initialVocabSize": result.get("initialVocabSize", 256),
        "finalVocabSize": result.get("finalVocabSize", 256),
        "totalMerges": result.get("totalMerges", 0),
        "corpusSequencesCount": result.get("corpusSequencesCount", 0),
        "maxMerges": req.maxMerges,
        "minFrequency": req.minFrequency
    }
    CURRENT_STATE["trainingHistory"] = result.get("history", [])
    CURRENT_STATE["initialCorpus"] = result.get("initialCorpus", [])

    return result

# 4. Training Status and Summary
@app.get("/api/train/status")
async def get_training_status():
    sync_model_status()
    return {
        "isTrained": CURRENT_STATE["isTrained"],
        "hasDataset": CURRENT_STATE["activeDatasetPath"] is not None,
        "activeDataset": {
            "name": CURRENT_STATE["activeDatasetName"],
            "lines": CURRENT_STATE["activeDatasetLines"],
            "size": CURRENT_STATE["activeDatasetSize"]
        },
        "stats": CURRENT_STATE["lastTrainingStats"]
    }

# 5. Training History — only return if trained with an active dataset
@app.get("/api/train/history")
async def get_training_history():
    if not is_model_ready():
        return {
            "initialCorpus": [],
            "history": [],
            "totalSteps": 0
        }
    return {
        "initialCorpus": CURRENT_STATE.get("initialCorpus", []),
        "history": CURRENT_STATE["trainingHistory"],
        "totalSteps": len(CURRENT_STATE["trainingHistory"])
    }

# 6. Retrieve Vocabulary
@app.get("/api/vocabulary")
async def get_vocabulary():
    if not is_model_ready():
        raise HTTPException(
            status_code=400,
            detail="No trained vocabulary found. Please upload a dataset and train the model first."
        )
    vocab_file = str(MODELS_DIR / "vocab.txt")
    if not Path(vocab_file).exists():
        raise HTTPException(status_code=400, detail="No trained vocabulary found. Please train the model first.")
    return run_cpp_cli("vocab", vocab_file)

# 7. Retrieve Merge Rules
@app.get("/api/merges")
async def get_merge_rules():
    if not is_model_ready():
        raise HTTPException(
            status_code=400,
            detail="No merge rules found. Please upload a dataset and train the model first."
        )
    merges_file = str(MODELS_DIR / "merges.txt")
    if not Path(merges_file).exists():
        raise HTTPException(status_code=400, detail="No merge rules found. Please train the model first.")
    return run_cpp_cli("merges", merges_file)

# 8. Tokenize / Encode Text
@app.post("/api/tokenize")
async def tokenize_text(req: TokenizeRequest):
    if not is_model_ready():
        raise HTTPException(
            status_code=400,
            detail="Tokenizer is not trained. Please upload a dataset and train the tokenizer first."
        )
    if not req.text:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    vocab_file = str(MODELS_DIR / "vocab.txt")
    merges_file = str(MODELS_DIR / "merges.txt")

    if not Path(vocab_file).exists() or not Path(merges_file).exists():
        raise HTTPException(status_code=400, detail="No trained model found. Please train a tokenizer first.")

    return run_cpp_cli("tokenize", req.text, vocab_file, merges_file)

# 9. Decode Token IDs
@app.post("/api/decode")
async def decode_token_ids(req: DecodeRequest):
    if not is_model_ready():
        raise HTTPException(
            status_code=400,
            detail="Tokenizer is not trained. Please upload a dataset and train the tokenizer first."
        )
    if not req.tokenIds:
        return {"decoded": "", "count": 0}

    vocab_file = str(MODELS_DIR / "vocab.txt")
    merges_file = str(MODELS_DIR / "merges.txt")
    ids_str = ",".join(str(i) for i in req.tokenIds)

    return run_cpp_cli("decode", ids_str, vocab_file, merges_file)

# 10. Model Status — never expose filesystem paths
@app.get("/api/model/status")
async def get_model_status():
    sync_model_status()
    ready = is_model_ready()
    vocab_file = MODELS_DIR / "vocab.txt"
    merges_file = MODELS_DIR / "merges.txt"

    vocab_size = 0
    merge_count = 0

    if ready and vocab_file.exists():
        with open(vocab_file, "r", encoding="utf-8", errors="replace") as f:
            vocab_size = sum(1 for line in f if line.strip() and not line.startswith("#"))

    if ready and merges_file.exists():
        with open(merges_file, "r", encoding="utf-8", errors="replace") as f:
            merge_count = sum(1 for line in f if line.strip() and not line.startswith("#"))

    return {
        "isTrained": ready,
        "hasDataset": CURRENT_STATE["activeDatasetPath"] is not None,
        "vocabularySize": vocab_size,
        "mergeRulesCount": merge_count,
        "activeDatasetName": CURRENT_STATE["activeDatasetName"],
        "activeDatasetLines": CURRENT_STATE["activeDatasetLines"]
    }

# 11. Session Cleanup when user leaves the site (sendBeacon or unload)
@app.post("/api/session/cleanup")
async def session_cleanup():
    cleanup_all_storage()
    return {"status": "success", "message": "All session inputs, uploads, and model files removed."}

# 12. Reset Model
@app.post("/api/model/reset")
async def reset_model():
    cleanup_all_storage()
    return {"status": "success", "message": "Model and uploaded files have been reset."}

# Serve Frontend static assets if available
assets_dir = WEB_DIR / "assets"
if assets_dir.exists():
    app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404, detail="API endpoint not found")
    file_path = WEB_DIR / full_path
    headers = {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
    }
    if file_path.exists() and file_path.is_file():
        return FileResponse(file_path, headers=headers)
    index_html = WEB_DIR / "index.html"
    if index_html.exists():
        return FileResponse(index_html, headers=headers)
    return JSONResponse({"message": "TokenForge API is running."})

if __name__ == "__main__":
    import uvicorn
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting TokenForge Server on http://{host}:{port}")
    uvicorn.run(app, host=host, port=port)

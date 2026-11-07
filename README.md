# TokenForge — Interactive Byte-Pair Encoding (BPE) Tokenizer Studio

TokenForge is an educational Byte-Pair Encoding (BBPE) tokenizer developed in **modern C++ (C++17)** integrated with a developer-grade **React Web Studio**.

It implements the foundational tokenization principles behind **GPT-2, GPT-4, and Tiktoken**, featuring a full 256-byte foundation, binary max-heap pair extraction, doubly-linked list token mutability, and interactive step-by-step training and encoding explorers.

---

## 🌟 Key Features & Capabilities

1. **Zero Out-of-Vocabulary (OOV) Guarantee**:
   - Pre-initializes all 256 single-byte tokens (IDs `0..255`) mapped reversibly using canonical GPT-2 byte-to-unicode mappings (`Ġ` for space, `Ċ` for newline, `ĉ` for tab).
   - Any arbitrary byte sequence, character, international script, punctuation symbol, or 4-byte emoji (`🚀`) is fully supported without `<unk>`.

2. **100% Lossless Round-Trip Fidelity**:
   - Exact text reconstruction (`decode(encode(text)) == text`) across all inputs, including code, emoji sequences, accents (`café`), and symbols (`$100 & 50%`).

3. **Dynamic User-Driven Dataset Training**:
   - **No Hardcoded Files**: The system requires users to upload their own `.txt` dataset before training.
   - Real-time file validation (UTF-8 encoding check, empty file check, 50 MB upload limit).
   - Shows live dataset metrics (filename, size, line count, and preview) without exposing server-side file paths.

4. **Production & Deployment-Ready Security**:
   - **Zero Filepath Exposure**: Server filesystem paths (`C:\...`, internal model folders) are strictly hidden from all frontend views and API responses.
   - **Sanitized Errors**: Safe, informative error handling without leaking stack traces or internal implementation paths.
   - **Clean Results View**: Displays learned subword tokens, token IDs, and compression ratios cleanly.
   - **Configurable Binding**: Binds to `HOST` (default `0.0.0.0`) and `PORT` (default `8000`) environment variables for seamless deployment on cloud providers (Render, Railway, VPS, Docker).

5. **Eye-Friendly Dual Theme System**:
   - **Comfortable Light Mode**: Warm cream background (`#f0ebe4`), soft ivory surfaces (`#faf6f1`), warm borders (`#e2d9cf`), soft violet accents (`#7c5cbf`), and dark chocolate text (`#2a2118`) that prevents eye fatigue.
   - **Textured Dark Mode**: Sophisticated slate surface with a subtle radial dot-grid texture on the dashboard welcome banner, charcoal containers, and muted violet highlights.
   - **Instant Anti-Flash**: Zero theme flicker on page refresh via pre-render theme bootstrap.

6. **Public Developer Tool (No Auth Required)**:
   - Zero login, signup, or user tracking barriers. Open the URL and begin exploring immediately.

---

## 📁 Project Architecture

```
TokenForge/
├── CMakeLists.txt              # C++17 CMake configuration for TokenForge & tokenforge_api
├── README.md                   # Complete documentation
├── server.py                   # Deployment-ready FastAPI backend adapter
├── build/                      # Compiled C++ binaries (TokenForge.exe, tokenforge_api.exe)
├── data/                       # Optional sample datasets
├── models/                     # Saved vocabulary & merge rules
│   ├── vocab.txt               # Serialized vocabulary (Base 256 + learned merges)
│   └── merges.txt              # Serialized learned BPE merge rules
├── uploads/                    # Uploaded user datasets
├── include/
│   ├── byte_encoder.h          # GPT-2 style reversible 256-byte Unicode mapping
│   ├── vocabulary.h            # Bidirectional vocabulary mapping (Token <-> ID)
│   ├── linked_list.h           # Doubly-linked list for word token sequence mutation
│   ├── max_heap.h              # Binary max-heap for pair frequency priority extraction
│   ├── pair_frequency.h        # Frequency counting structures
│   ├── tokenizer.h             # Word-level baseline helper
│   ├── bpe_trainer.h           # BPE training loop engine & history tracking
│   └── bpe_tokenizer.h         # Inference engine: tokenization, trace, decoding
├── src/
│   ├── vocabulary.cpp
│   ├── linked_list.cpp
│   ├── max_heap.cpp
│   ├── pair_frequency.cpp
│   ├── tokenizer.cpp
│   ├── bpe_trainer.cpp
│   ├── bpe_tokenizer.cpp
│   ├── api_cli.cpp             # JSON API bridge executable for the web application
│   └── main.cpp                # Terminal test suite and verification benchmark
└── web/
    ├── index.html              # Modern SPA HTML host with anti-flash script & CSS variables
    └── app.jsx                 # Full React application with all 8 interactive views
```

---

## 🚀 How to Build and Run

### 1. Build the C++ Core Binaries

Make sure your C++17 compiler (GCC/MinGW/Clang) and CMake are available:

```powershell
Set-Location "project3/TokenForge"
cmake -S . -B build
cmake --build build
```

This compiles:
- `build/TokenForge.exe`: The standalone CLI verification test runner.
- `build/tokenforge_api.exe`: The JSON CLI interface consumed by the Python backend.

### 2. Run Terminal Verification Tests

```powershell
.\build\TokenForge.exe
```

The test runner:
- Pre-loads all 256 base byte tokens.
- Executes BPE training on the dataset.
- Prints the corpus sequence tokenization table.
- Runs 6 verification test cases demonstrating **100% Exact Round-Trip Reconstruction** across plain words, compounds, punctuation, whitespace, and multi-byte UTF-8 emojis (`🚀`).

### 3. Start the Interactive Web Application

```powershell
python server.py
```

Then open your browser at:
👉 **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

---

## 🌐 Web Studio Walkthrough

| View | Purpose |
|---|---|
| **Dashboard** | Overview of model readiness, live vocabulary size, learned rules, and active dataset metrics with textured welcome banner. |
| **Train Tokenizer** | Drag-and-drop or browse `.txt` dataset upload, configure merge iterations and frequency thresholds, and execute BPE training. |
| **Tokenize Text** | Enter arbitrary text or use quick sample chips to view subword tokenization, token IDs, compression ratio, and 100% exact decoded round-trip. |
| **Training Explorer** | Scrub through iterations or press **Play** to visualize highest frequency pair selection from the heap and node merges in corpus linked lists. |
| **Encoding Explorer** | Step through sequential merge rule applications on raw text inputs to see how characters combine into subwords. |
| **Vocabulary Table** | Search, filter (Base Byte vs Learned), and export `vocab.txt`. |
| **Merge Rules** | Chronological ledger of learned BPE pairs, frequencies, and exportable `merges.txt`. |
| **Settings** | Switch between comfortable Light mode and textured Dark mode, inspect model metrics, or reset the model. |

---

## ☁️ Deployment Configuration

To deploy TokenForge to any cloud platform (Render, Railway, Fly.io, or Docker):

1. **Environment Variables**:
   - `HOST`: Set to `0.0.0.0` (default) to bind to all network interfaces.
   - `PORT`: Set by your cloud host (e.g., `8000`, `10000`).

2. **Run Command**:
   ```bash
   python server.py
   ```

3. **Cross-Platform Binary Resolution**:
   - The server automatically resolves `tokenforge_api.exe` on Windows and `tokenforge_api` on Linux/macOS.

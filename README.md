# TokenForge — GPT-Style Byte-Level BPE Tokenizer (256 Byte Base)

TokenForge is a modular, high-performance Byte-Level Byte Pair Encoding (BBPE) tokenizer implemented in modern C++ (C++17), following the tokenization architecture used by GPT-2, GPT-4, and Tiktoken.

---

## 1. Key Enhancements & Capabilities

1. **Pre-Initialized 256 Byte Tokens (IDs 0..255)**:
   - The base vocabulary is pre-loaded with all 256 possible byte values ($0\text{x}00$ through $0\text{xFF}$).
   - **Zero Out-of-Vocabulary (OOV)**: Any arbitrary byte sequence or character in any language can be represented without `<unk>`.
2. **Full UTF-8 Multi-Byte Support**:
   - Accented characters (`é`, `ñ`, `ç`), international scripts, and 4-byte emojis (`🚀`) decompose into their raw UTF-8 constituent bytes.
3. **Lossless Whitespace & Punctuation Handling**:
   - Uses canonical GPT-2 byte-to-unicode mapping: spaces map to visible byte token `Ġ` (byte 32), newlines to `Ċ` (byte 10), and tabs to `ĉ` (byte 9).
   - Punctuation marks (`!`, `$`, `(`, `)`, `%`, `,`, `:`) are preserved consistently without dropping or corrupting symbols.
4. **Learned Subword Merges (IDs 256+)**:
   - Frequent byte pairs merge into subword tokens with IDs starting from 256 onwards.
   - Example: `'l'` (108) + `'ow'` (256) $\to$ `'low'` (ID 258).

---

## 2. Project Structure

```
project3/phase1/
├── CMakeLists.txt              # Build configuration with all source modules
├── README.md                   # Complete documentation
├── data/
│   └── corpus.txt              # Training dataset file
├── models/
│   ├── merges.txt              # Persisted BPE merge rules
│   └── vocab.txt               # Persisted vocabulary with IDs (256 base + merges)
├── include/
│   ├── byte_encoder.h          # GPT-style Byte-to-Unicode mapping (256 bytes)
│   ├── bpe_tokenizer.h         # Inference Tokenizer (encode & decode)
│   ├── bpe_trainer.h           # BPE training engine
│   ├── linked_list.h           # Doubly linked list for token sequences
│   ├── max_heap.h              # Binary max-heap priority queue
│   ├── pair_frequency.h        # Adjacent pair counter
│   ├── tokenizer.h             # Corpus file reader
│   └── vocabulary.h            # Bi-directional token <-> ID mappings
└── src/
    ├── bpe_tokenizer.cpp       # Inference Tokenizer implementation
    ├── bpe_trainer.cpp         # BPE training implementation
    ├── linked_list.cpp         # Linked list & mergeAdjacent implementation
    ├── main.cpp                # Combined corpus ID & input/output test runner
    ├── max_heap.cpp            # Max-heap implementation
    ├── pair_frequency.cpp      # Bigram frequency implementation
    ├── tokenizer.cpp           # File stream reader implementation
    └── vocabulary.cpp          # Vocabulary serialization implementation
```

---

## 3. How to Build & Run

```powershell
# 1. Add compiler and CMake to PATH
$env:PATH = "C:\msys64\ucrt64\bin;" + $env:PATH

# 2. Navigate to phase1 folder
cd "c:\final_year\temp project\ai course\project3\phase1"

# 3. Configure and compile with CMake
cmake -S . -B build
cmake --build build

# 4. Run the executable
.\build\TokenForge.exe
```

---

## 4. Execution Output

### Part 1: ID and Corresponding Corpus
```
======================================================================
          ID AND THEIR CORRESPONDING CORPUS (TRAINING DATA)           
======================================================================

Corpus ID Corpus Text             Token Count   Encoded Token IDs
----------------------------------------------------------------------
Line 1    "low"                   1             [258]
Line 2    "lower"                 2             [258, 257]
Line 3    "lowest"                4             [258, 101, 115, 116]
Line 4    "low"                   1             [258]
Line 5    "lower"                 2             [258, 257]
Line 6    "programming"           4             [265, 105, 110, 103]
Line 7    "programmer"            2             [265, 257]
Line 8    "programming"           4             [265, 105, 110, 103]
Line 9    "computer"              7             [99, 111, 109, 112, 117, 116, 257]
Line 10   "computer science"      15            [99, 111, 109, 112, 117, 116, 257, 32, 115, 99, 105, 101, 110, 99, 101]
```

### Part 2: Input and Corresponding Output
```
======================================================================
                   INPUT AND THEIR CORRESPONDING OUTPUT               
======================================================================

[Test Case 1]
  Input Text     : "lowest programmer"
  Subword Tokens : ['low', 'e', 's', 't', 'Ġ', 'programm', 'er']
  Token IDs      : [258, 101, 115, 116, 32, 265, 257]
  Decoded Output : "lowest programmer"
  Verification   : SUCCESS (Exact 100% Reconstruction)
----------------------------------------------------------------------

[Test Case 2]
  Input Text     : "computer science"
  Subword Tokens : ['c', 'o', 'm', 'p', 'u', 't', 'er', 'Ġ', 's', 'c', 'i', 'e', 'n', 'c', 'e']
  Token IDs      : [99, 111, 109, 112, 117, 116, 257, 32, 115, 99, 105, 101, 110, 99, 101]
  Decoded Output : "computer science"
  Verification   : SUCCESS (Exact 100% Reconstruction)
----------------------------------------------------------------------

[Test Case 3]
  Input Text     : "low, lower, lowest! (Cost: $100 & 50%)"
  Subword Tokens : ['low', ',', 'Ġ', 'low', 'er', ',', 'Ġ', 'low', 'e', 's', 't', '!', 'Ġ', '(', 'C', 'o', 's', 't', ':', 'Ġ', '$', '1', '0', '0', 'Ġ', '&', 'Ġ', '5', '0', '%', ')']
  Token IDs      : [258, 44, 32, 258, 257, 44, 32, 258, 101, 115, 116, 33, 32, 40, 67, 111, 115, 116, 58, 32, 36, 49, 48, 48, 32, 38, 32, 53, 48, 37, 41]
  Decoded Output : "low, lower, lowest! (Cost: $100 & 50%)"
  Verification   : SUCCESS (Exact 100% Reconstruction)
----------------------------------------------------------------------

[Test Case 4]
  Input Text     : "  spaces   and    tabs\t\n"
  Subword Tokens : ['Ġ', 'Ġ', 's', 'p', 'a', 'c', 'e', 's', 'Ġ', 'Ġ', 'Ġ', 'a', 'n', 'd', 'Ġ', 'Ġ', 'Ġ', 'Ġ', 't', 'a', 'b', 's', 'ĉ', 'Ċ']
  Token IDs      : [32, 32, 115, 112, 97, 99, 101, 115, 32, 32, 32, 97, 110, 100, 32, 32, 32, 32, 116, 97, 98, 115, 9, 10]
  Decoded Output : "  spaces   and    tabs\t\n"
  Verification   : SUCCESS (Exact 100% Reconstruction)
----------------------------------------------------------------------

[Test Case 5]
  Input Text     : "TokenForge C++ 🚀 café éñ Français"
  Subword Tokens : ['T', 'o', 'k', 'e', 'n', 'F', 'o', 'r', 'g', 'e', 'Ġ', 'C', '+', '+', 'Ġ', 'ð', 'Ł', 'ļ', 'Ģ', 'Ġ', 'c', 'a', 'f', 'Ã', '©', 'Ġ', 'Ã', '©', 'Ã', '±', 'Ġ', 'F', 'r', 'a', 'n', 'Ã', '§', 'a', 'i', 's']
  Token IDs      : [84, 111, 107, 101, 110, 70, 111, 114, 103, 101, 32, 67, 43, 43, 32, 240, 159, 154, 128, 32, 99, 97, 102, 195, 169, 32, 195, 169, 195, 177, 32, 70, 114, 97, 110, 195, 167, 97, 105, 115]
  Decoded Output : "TokenForge C++ 🚀 café éñ Français"
  Verification   : SUCCESS (Exact 100% Reconstruction)
----------------------------------------------------------------------

[Test Case 6]
  Input Text     : "programmer programming lowest low"
  Subword Tokens : ['programm', 'er', 'Ġ', 'programm', 'i', 'n', 'g', 'Ġ', 'low', 'e', 's', 't', 'Ġ', 'low']
  Token IDs      : [265, 257, 32, 265, 105, 110, 103, 32, 258, 101, 115, 116, 32, 258]
  Decoded Output : "programmer programming lowest low"
  Verification   : SUCCESS (Exact 100% Reconstruction)
----------------------------------------------------------------------

======================================================================
 Summary: 6 / 6 Input/Output Verification Tests Passed Successfully!
 All 256 Byte Tokens, UTF-8 Text, Spaces & Punctuation Handled losslessly.
======================================================================
```

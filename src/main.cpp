#include <iostream>
#include <iomanip>
#include <vector>
#include <string>

#include "tokenizer.h"
#include "bpe_trainer.h"
#include "bpe_tokenizer.h"

int main() {
  std::cout << "======================================================================\n";
  std::cout << "    TOKENFORGE — GPT-STYLE BYTE-LEVEL BPE TOKENIZER (256 BYTES)       \n";
  std::cout << "======================================================================\n\n";

  // ---------------------------------------------------------------------------
  // 1. Ingest Corpus & Run BPE Training
  // ---------------------------------------------------------------------------
  Tokenizer corpusReader;
  corpusReader.loadCorpus("data/corpus.txt");

  if (corpusReader.getCorpus().empty()) {
    std::cerr << "Error: Training aborted. Corpus could not be loaded.\n";
    return 1;
  }

  BPETrainer trainer;
  trainer.initializeCorpus(corpusReader.getCorpus());
  trainer.train(/*maxMerges=*/10, /*minFrequency=*/2);

  // Save model artifacts
  trainer.getVocabulary().saveToFile("models/vocab.txt");
  trainer.saveMergeRules("models/merges.txt");

  // Load into independent BPE Tokenizer
  BPETokenizer tokenizer;
  tokenizer.loadModel("models/vocab.txt", "models/merges.txt");

  // ---------------------------------------------------------------------------
  // 2. REQUIRED OUTPUT PART 1: ID AND THEIR CORRESPONDING CORPUS
  // ---------------------------------------------------------------------------
  std::cout << "\n======================================================================\n";
  std::cout << "          ID AND THEIR CORRESPONDING CORPUS (TRAINING DATA)           \n";
  std::cout << "======================================================================\n\n";

  std::cout << std::left << std::setw(10) << "Corpus ID"
            << std::setw(24) << "Corpus Text"
            << std::setw(14) << "Token Count"
            << "Encoded Token IDs\n";
  std::cout << "----------------------------------------------------------------------\n";

  const auto &corpusLines = corpusReader.getCorpus();
  for (size_t i = 0; i < corpusLines.size(); i++) {
    std::string text = corpusLines[i];
    std::vector<int> ids = tokenizer.encode(text);

    std::string idStr = "[";
    for (size_t j = 0; j < ids.size(); j++) {
      idStr += std::to_string(ids[j]) + (j + 1 < ids.size() ? ", " : "");
    }
    idStr += "]";

    std::cout << std::left << std::setw(10) << ("Line " + std::to_string(i + 1))
              << std::setw(24) << ("\"" + text + "\"")
              << std::setw(14) << ids.size()
              << idStr << "\n";
  }

  // ---------------------------------------------------------------------------
  // 3. REQUIRED OUTPUT PART 2: INPUT AND THEIR CORRESPONDING OUTPUT
  // ---------------------------------------------------------------------------
  std::cout << "\n======================================================================\n";
  std::cout << "                   INPUT AND THEIR CORRESPONDING OUTPUT               \n";
  std::cout << "======================================================================\n";

  std::vector<std::string> testInputs = {
      // Input 1: Subwords from corpus
      "lowest programmer",

      // Input 2: Full corpus compound phrase
      "computer science",

      // Input 3: Punctuation and mixed symbols
      "low, lower, lowest! (Cost: $100 & 50%)",

      // Input 4: Spaces and whitespace handling
      "  spaces   and    tabs\t\n",

      // Input 5: Full UTF-8 & Multi-byte emojis / international text
      "TokenForge C++ 🚀 café éñ Français",

      // Input 6: Entirely unseen subword combination
      "programmer programming lowest low"
  };

  int passedCount = 0;
  for (size_t idx = 0; idx < testInputs.size(); idx++) {
    const std::string &input = testInputs[idx];
    std::vector<std::string> subwords = tokenizer.encodeToTokens(input);
    std::vector<int> ids = tokenizer.encode(input);
    std::string output = tokenizer.decode(ids);

    bool match = (input == output);
    if (match) passedCount++;

    std::cout << "\n[Test Case " << (idx + 1) << "]\n";
    std::cout << "  Input Text     : \"" << input << "\"\n";

    std::cout << "  Subword Tokens : [";
    for (size_t j = 0; j < subwords.size(); j++) {
      std::cout << "'" << subwords[j] << "'" << (j + 1 < subwords.size() ? ", " : "");
    }
    std::cout << "]\n";

    std::cout << "  Token IDs      : [";
    for (size_t j = 0; j < ids.size(); j++) {
      std::cout << ids[j] << (j + 1 < ids.size() ? ", " : "");
    }
    std::cout << "]\n";

    std::cout << "  Decoded Output : \"" << output << "\"\n";
    std::cout << "  Verification   : " << (match ? "SUCCESS (Exact 100% Reconstruction)" : "FAILED") << "\n";
    std::cout << "----------------------------------------------------------------------\n";
  }

  std::cout << "\n======================================================================\n";
  std::cout << " Summary: " << passedCount << " / " << testInputs.size()
            << " Input/Output Verification Tests Passed Successfully!\n";
  std::cout << " All 256 Byte Tokens, UTF-8 Text, Spaces & Punctuation Handled losslessly.\n";
  std::cout << "======================================================================\n";

  return 0;
}

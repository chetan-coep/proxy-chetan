#include "bpe_tokenizer.h"
#include "linked_list.h"

#include <fstream>
#include <iostream>
#include <sstream>
#include <iomanip>

BPETokenizer::BPETokenizer() : unkId(-1) {}

// Step 7.3: Load trained model from files
bool BPETokenizer::loadModel(const std::string &vocabFile,
                            const std::string &mergesFile) {
  mergeRules.clear();

  // Load vocabulary
  if (!vocabulary.loadFromFile(vocabFile)) {
    return false;
  }

  // Load merge rules
  std::ifstream file(mergesFile);
  if (!file.is_open()) {
    file.open("../" + mergesFile);
  }
  if (!file.is_open()) {
    std::cerr << "Error: Unable to open merges file " << mergesFile << "\n";
    return false;
  }

  std::string line;
  while (std::getline(file, line)) {
    if (!line.empty() && line.back() == '\r') {
      line.pop_back();
    }
    if (line.empty() || line[0] == '#') continue;

    std::stringstream ss(line);
    std::string first, second;
    if (ss >> first >> second) {
      mergeRules.push_back({first, second});
    }
  }

  file.close();

  // Check for <unk> token
  unkId = vocabulary.getTokenId("<unk>");

  std::cout << "[Step 7.3] Model loaded successfully: " << vocabulary.size()
            << " vocab tokens, " << mergeRules.size() << " merge rules.\n";
  return true;
}

void BPETokenizer::setModel(
    const Vocabulary &vocab,
    const std::vector<std::pair<std::string, std::string>> &rules) {
  vocabulary = vocab;
  mergeRules = rules;
  unkId = vocabulary.getTokenId("<unk>");
}

// Subword tokenization for a single word
std::vector<std::string> BPETokenizer::tokenizeWord(const std::string &word) const {
  return encodeToTokens(word);
}

// Step 7.4: Implement encoding (Text -> Token IDs)
std::vector<int> BPETokenizer::encode(const std::string &text) const {
  std::vector<int> tokenIds;
  std::vector<std::string> subwords = encodeToTokens(text);

  for (const auto &sw : subwords) {
    int id = vocabulary.getTokenId(sw);
    if (id != -1) {
      tokenIds.push_back(id);
    } else {
      // Fallback: decompose into individual byte tokens (all 256 exist in vocab)
      std::vector<std::string> fallbackBytes = byteEncoder.stringToByteTokens(sw);
      for (const auto &fb : fallbackBytes) {
        int cid = vocabulary.getTokenId(fb);
        tokenIds.push_back(cid != -1 ? cid : unkId);
      }
    }
  }

  return tokenIds;
}

std::vector<std::string> BPETokenizer::encodeToTokens(const std::string &text) const {
  if (text.empty()) return {};

  // 1. Convert any UTF-8 text into GPT-style byte tokens
  std::vector<std::string> byteTokens = byteEncoder.stringToByteTokens(text);

  // 2. Build linked list of byte tokens
  LinkedList list;
  for (const auto &tok : byteTokens) {
    list.append(tok);
  }

  // 3. Sequentially apply learned BPE merge rules
  for (const auto &rule : mergeRules) {
    Node *curr = list.getHead();

    while (curr != nullptr && curr->next != nullptr) {
      if (curr->token == rule.first && curr->next->token == rule.second) {
        list.mergeAdjacent(curr);
        curr = curr->next;
      } else {
        curr = curr->next;
      }
    }
  }

  // 4. Extract merged subword tokens
  std::vector<std::string> tokens;
  Node *curr = list.getHead();
  while (curr != nullptr) {
    tokens.push_back(curr->token);
    curr = curr->next;
  }

  return tokens;
}

// Step 7.5: Implement decoding (Token IDs -> Text)
std::string BPETokenizer::decode(const std::vector<int> &tokenIds) const {
  std::vector<std::string> tokens;
  tokens.reserve(tokenIds.size());

  for (int id : tokenIds) {
    if (id >= 0 && static_cast<size_t>(id) < vocabulary.size()) {
      tokens.push_back(vocabulary.getToken(id));
    }
  }

  // Lossless byte-to-UTF8 reconstruction
  return byteEncoder.byteTokensToString(tokens);
}

// Step 7.6: Round-trip testing
bool BPETokenizer::roundTripTest(const std::string &text) const {
  std::vector<std::string> tokens = encodeToTokens(text);
  std::vector<int> tokenIds = encode(text);
  std::string reconstructed = decode(tokenIds);

  bool passed = (text == reconstructed);

  std::cout << "\n--------------------------------------------------\n";
  std::cout << "Original Text   : \"" << text << "\"\n";
  std::cout << "Encoded Subwords: [";
  for (size_t i = 0; i < tokens.size(); i++) {
    std::cout << "'" << tokens[i] << "'" << (i + 1 < tokens.size() ? ", " : "");
  }
  std::cout << "]\n";

  std::cout << "Token IDs       : [";
  for (size_t i = 0; i < tokenIds.size(); i++) {
    std::cout << tokenIds[i] << (i + 1 < tokenIds.size() ? ", " : "");
  }
  std::cout << "]\n";

  std::cout << "Decoded Text    : \"" << reconstructed << "\"\n";
  std::cout << "Round-Trip Match: " << (passed ? "SUCCESS (Exact Match)" : "FAILED") << "\n";

  return passed;
}

const Vocabulary &BPETokenizer::getVocabulary() const { return vocabulary; }

size_t BPETokenizer::getMergeRulesCount() const { return mergeRules.size(); }


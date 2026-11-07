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

EncodingTrace BPETokenizer::encodeWithTrace(const std::string &text) const {
  EncodingTrace trace;
  trace.rawInput = text;
  if (text.empty()) return trace;

  std::vector<std::string> byteTokens = byteEncoder.stringToByteTokens(text);
  trace.initialTokens = byteTokens;

  LinkedList list;
  for (const auto &tok : byteTokens) {
    list.append(tok);
  }

  auto getTokensFromList = [&list]() {
    std::vector<std::string> cur;
    Node *c = list.getHead();
    while (c != nullptr) {
      cur.push_back(c->token);
      c = c->next;
    }
    return cur;
  };

  int stepCount = 0;
  for (const auto &rule : mergeRules) {
    bool mergedAny = false;
    Node *curr = list.getHead();
    int nodeIdx = 0;

    while (curr != nullptr && curr->next != nullptr) {
      if (curr->token == rule.first && curr->next->token == rule.second) {
        std::vector<std::string> before = getTokensFromList();
        int atIdx = nodeIdx;

        list.mergeAdjacent(curr);
        mergedAny = true;

        std::vector<std::string> after = getTokensFromList();
        std::vector<int> idsAfter;
        for (const auto &tok : after) {
          idsAfter.push_back(vocabulary.getTokenId(tok));
        }

        EncodingStep step;
        step.stepNumber = ++stepCount;
        step.ruleFirst = rule.first;
        step.ruleSecond = rule.second;
        step.mergedToken = rule.first + rule.second;
        step.tokensBefore = before;
        step.tokensAfter = after;
        step.tokenIdsAfter = idsAfter;
        step.mergedIndex = atIdx;

        trace.steps.push_back(step);
        curr = curr->next;
      } else {
        curr = curr->next;
      }
      nodeIdx++;
    }
  }

  trace.finalTokens = getTokensFromList();
  for (const auto &tok : trace.finalTokens) {
    trace.finalTokenIds.push_back(vocabulary.getTokenId(tok));
  }

  return trace;
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

const std::vector<std::pair<std::string, std::string>> &BPETokenizer::getMergeRules() const {
  return mergeRules;
}

size_t BPETokenizer::getMergeRulesCount() const { return mergeRules.size(); }

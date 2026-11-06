#ifndef BPE_TOKENIZER_H
#define BPE_TOKENIZER_H

#include <string>
#include <vector>
#include <utility>
#include "vocabulary.h"
#include "byte_encoder.h"

class BPETokenizer {
private:
  Vocabulary vocabulary;
  std::vector<std::pair<std::string, std::string>> mergeRules;
  ByteEncoder byteEncoder;
  int unkId;

public:
  BPETokenizer();

  // Step 7.3: Load trained model from files
  bool loadModel(const std::string &vocabFile, const std::string &mergesFile);

  // Initialize directly from in-memory vocabulary and merge rules
  void setModel(const Vocabulary &vocab, 
                const std::vector<std::pair<std::string, std::string>> &rules);

  // Subword tokenization for a single word
  std::vector<std::string> tokenizeWord(const std::string &word) const;

  // Step 7.4: Implement encoding (Text -> Token IDs)
  std::vector<int> encode(const std::string &text) const;

  // Encode to subword token strings (for inspection)
  std::vector<std::string> encodeToTokens(const std::string &text) const;

  // Step 7.5: Implement decoding (Token IDs -> Text)
  std::string decode(const std::vector<int> &tokenIds) const;

  // Step 7.6: Round-trip verification
  bool roundTripTest(const std::string &text) const;

  const Vocabulary &getVocabulary() const;
  size_t getMergeRulesCount() const;
};

#endif


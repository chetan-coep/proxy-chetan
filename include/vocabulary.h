
#ifndef VOCABULARY_H
#define VOCABULARY_H

#include <string>
#include <unordered_map>
#include <vector>


class Vocabulary {
private:
  // Token -> ID
  std::unordered_map<std::string, int> tokenToId;

  // ID -> Token
  std::vector<std::string> idToToken;

public:
  // Initialize all 256 base byte tokens (IDs 0..255) for GPT-style BBPE
  void initializeBaseByteTokens();

  int addToken(const std::string &token);

  int getTokenId(const std::string &token) const;

  std::string getToken(int id) const;

  bool contains(const std::string &token) const;

  size_t size() const;

  void displayVocabulary() const;

  bool saveToFile(const std::string &filename) const;

  bool loadFromFile(const std::string &filename);

  void clear();
};

#endif

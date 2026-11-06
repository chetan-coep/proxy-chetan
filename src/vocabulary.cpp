
#include "vocabulary.h"
#include "byte_encoder.h"

#include <fstream>
#include <iomanip>
#include <iostream>
#include <stdexcept>

void Vocabulary::initializeBaseByteTokens() {
  clear();
  ByteEncoder encoder;
  for (int b = 0; b < 256; b++) {
    std::string token = encoder.byteToToken(static_cast<uint8_t>(b));
    tokenToId[token] = b;
    idToToken.push_back(token);
  }
}

int Vocabulary::addToken(const std::string &token) {

  // Check whether token already exists
  auto it = tokenToId.find(token);

  if (it != tokenToId.end()) {
    return it->second;
  }

  // Generate a new ID
  int id = static_cast<int>(idToToken.size());

  // Store in both data structures
  tokenToId[token] = id;
  idToToken.push_back(token);

  return id;
}

int Vocabulary::getTokenId(const std::string &token) const {

  auto it = tokenToId.find(token);

  if (it != tokenToId.end()) {
    return it->second;
  }

  return -1;
}

std::string Vocabulary::getToken(int id) const {

  if (id < 0 || static_cast<size_t>(id) >= idToToken.size()) {
    throw std::out_of_range("Invalid token ID");
  }

  return idToToken[id];
}

bool Vocabulary::contains(const std::string &token) const {

  return tokenToId.find(token) != tokenToId.end();
}

size_t Vocabulary::size() const { return idToToken.size(); }

void Vocabulary::displayVocabulary() const {

  std::cout << "\n========== VOCABULARY ==========\n\n";

  std::cout << std::left << std::setw(15) << "Token"
            << "ID\n";

  std::cout << "----------------------\n";

  for (size_t id = 0; id < idToToken.size(); id++) {

    std::cout << std::left << std::setw(15) << idToToken[id] << id << '\n';
  }
}

bool Vocabulary::saveToFile(const std::string &filename) const {
  std::ofstream file(filename);
  if (!file.is_open()) {
    // Try parent directory fallback if running from build/
    file.open("../" + filename);
  }
  if (!file.is_open()) {
    std::cerr << "Error: Unable to save vocabulary to " << filename << "\n";
    return false;
  }

  for (size_t id = 0; id < idToToken.size(); id++) {
    file << idToToken[id] << "\t" << id << "\n";
  }

  file.close();
  return true;
}

bool Vocabulary::loadFromFile(const std::string &filename) {
  std::ifstream file(filename);
  if (!file.is_open()) {
    // Try parent directory fallback if running from build/
    file.open("../" + filename);
  }
  if (!file.is_open()) {
    std::cerr << "Error: Unable to load vocabulary from " << filename << "\n";
    return false;
  }

  clear();
  std::string line;
  while (std::getline(file, line)) {
    if (!line.empty() && line.back() == '\r') {
      line.pop_back();
    }
    if (line.empty()) continue;

    size_t tabPos = line.rfind('\t');
    if (tabPos == std::string::npos) continue;

    std::string token = line.substr(0, tabPos);
    int id = std::stoi(line.substr(tabPos + 1));

    tokenToId[token] = id;
    if (static_cast<size_t>(id) >= idToToken.size()) {
      idToToken.resize(id + 1);
    }
    idToToken[id] = token;
  }

  file.close();
  return true;
}

void Vocabulary::clear() {
  tokenToId.clear();
  idToToken.clear();
}



#include "tokenizer.h"

#include <fstream>
#include <iostream>


void Tokenizer::loadCorpus(const std::string &filename) {

  corpus.clear();

  std::ifstream file(filename);

  if (!file.is_open()) {
    std::cerr << "Error: Unable to open corpus file!\n";
    return;
  }

  std::string line;

  while (std::getline(file, line)) {
    corpus.push_back(line);
  }

  file.close();

  std::cout << "Corpus loaded successfully!\n";
}

void Tokenizer::displayCorpus() const {

  for (const auto &line : corpus) {
    std::cout << line << '\n';
  }
}

const std::vector<std::string> &Tokenizer::getCorpus() const { return corpus; }

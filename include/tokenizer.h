
#ifndef TOKENIZER_H
#define TOKENIZER_H

#include <string>
#include <vector>

class Tokenizer {
private:
  std::vector<std::string> corpus;

public:
  void loadCorpus(const std::string &filename);

  void displayCorpus() const;

  const std::vector<std::string> &getCorpus() const;
};

#endif

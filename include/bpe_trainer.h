#ifndef BPE_TRAINER_H
#define BPE_TRAINER_H

#include <string>
#include <vector>
#include <unordered_map>
#include "linked_list.h"
#include "vocabulary.h"
#include "max_heap.h"
#include "byte_encoder.h"

struct MergeRule {
  std::string first;
  std::string second;
  std::string merged;
  int frequency;
};

class BPETrainer {
private:
  std::vector<LinkedList*> corpusSequences;
  Vocabulary vocabulary;
  std::vector<MergeRule> mergeRules;

public:
  BPETrainer();
  ~BPETrainer();

  // Step 6.1: Convert corpus words into linked-list token sequences
  void initializeCorpus(const std::vector<std::string> &corpus);

  // Step 6.2: Calculate adjacent token pair frequencies
  std::unordered_map<std::string, int> calculatePairFrequencies() const;

  // Step 6.3: Insert pairs into Max Heap
  MaxHeap buildPairHeap(const std::unordered_map<std::string, int> &pairFrequencies) const;

  // Step 6.4: Select and merge the most frequent pair in all word sequences
  int mergePairInCorpus(const std::string &first, const std::string &second);

  // Step 6.5 & 6.6: Complete training loop until stopping condition
  void train(int maxMerges = 10, int minFrequency = 2);

  // Step 6.7: Display & access results
  void displayCorpusSequences() const;
  void displayMergeRules() const;
  const Vocabulary &getVocabulary() const;
  const std::vector<MergeRule> &getMergeRules() const;
  size_t getCorpusSize() const;
  // Step 7.1 & 7.2: Save trained model (vocabulary & merge rules)
  bool saveMergeRules(const std::string &filename) const;
  bool saveModel(const std::string &vocabPath, const std::string &mergesPath) const;
};

#endif


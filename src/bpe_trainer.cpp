#include "bpe_trainer.h"

#include <fstream>
#include <iostream>
#include <iomanip>
#include <sstream>

BPETrainer::BPETrainer() {}

BPETrainer::~BPETrainer() {
  for (LinkedList *seq : corpusSequences) {
    delete seq;
  }
  corpusSequences.clear();
}

// Step 6.1: Convert corpus words into linked-list token sequences
void BPETrainer::initializeCorpus(const std::vector<std::string> &corpus) {
  // Clear previous allocations
  for (LinkedList *seq : corpusSequences) {
    delete seq;
  }
  corpusSequences.clear();
  mergeRules.clear();

  // Initialize all 256 byte tokens (0..255) for GPT-style Byte-Pair Encoding
  vocabulary.initializeBaseByteTokens();

  ByteEncoder byteEncoder;

  for (const std::string &line : corpus) {
    if (line.empty()) continue;

    LinkedList *seq = new LinkedList();
    std::vector<std::string> byteTokens = byteEncoder.stringToByteTokens(line);

    for (const auto &tok : byteTokens) {
      seq->append(tok);
    }

    corpusSequences.push_back(seq);
  }

  std::cout << "[Step 6.1] Initialized " << corpusSequences.size()
            << " token sequences from corpus.\n"
            << "[Byte-Level BPE] Initialized all 256 base byte tokens (IDs 0..255).\n";
}

// Step 6.2: Calculate adjacent token pair frequencies
std::unordered_map<std::string, int> BPETrainer::calculatePairFrequencies() const {
  std::unordered_map<std::string, int> pairFreq;

  for (const LinkedList *seq : corpusSequences) {
    Node *curr = seq->getHead();

    while (curr != nullptr && curr->next != nullptr) {
      std::string pairKey = curr->token + " " + curr->next->token;
      pairFreq[pairKey]++;
      curr = curr->next;
    }
  }

  return pairFreq;
}

// Step 6.3: Insert pairs into Max Heap
MaxHeap BPETrainer::buildPairHeap(
    const std::unordered_map<std::string, int> &pairFrequencies) const {
  MaxHeap heap;

  for (const auto &entry : pairFrequencies) {
    heap.insert(entry.first, entry.second);
  }

  return heap;
}

// Step 6.4: Select and merge the most frequent pair in all word sequences
int BPETrainer::mergePairInCorpus(const std::string &first,
                                  const std::string &second) {
  int totalMerges = 0;

  for (LinkedList *seq : corpusSequences) {
    Node *curr = seq->getHead();

    while (curr != nullptr && curr->next != nullptr) {
      if (curr->token == first && curr->next->token == second) {
        seq->mergeAdjacent(curr);
        totalMerges++;
        // Move to the next node after merged node
        curr = curr->next;
      } else {
        curr = curr->next;
      }
    }
  }

  return totalMerges;
}

// Step 6.5 & 6.6: Complete training loop until stopping condition
void BPETrainer::train(int maxMerges, int minFrequency) {
  std::cout << "\n========== STARTING BPE TRAINING LOOP ==========\n";
  std::cout << "Max Iterations: " << maxMerges
            << " | Minimum Frequency Threshold: " << minFrequency << "\n\n";

  for (int iter = 1; iter <= maxMerges; iter++) {
    // 6.2: Calculate pair frequencies
    auto pairFreq = calculatePairFrequencies();

    if (pairFreq.empty()) {
      std::cout << "Stopping: No adjacent pairs remaining in the corpus.\n";
      break;
    }

    // 6.3: Insert pairs into Max Heap
    MaxHeap heap = buildPairHeap(pairFreq);

    if (heap.empty()) {
      std::cout << "Stopping: Heap is empty.\n";
      break;
    }

    // 6.4: Select most frequent pair
    HeapNode top = heap.extractMax();

    // 6.6: Stopping condition check
    if (top.frequency < minFrequency) {
      std::cout << "Stopping: Most frequent pair (" << top.pair
                << ") has frequency " << top.frequency
                << " (below threshold " << minFrequency << ").\n";
      break;
    }

    // Separate tokens from "first second"
    size_t spacePos = top.pair.find(' ');
    if (spacePos == std::string::npos) continue;

    std::string first = top.pair.substr(0, spacePos);
    std::string second = top.pair.substr(spacePos + 1);
    std::string merged = first + second;

    // 6.4: Execute merge in corpus linked lists
    int mergesDone = mergePairInCorpus(first, second);

    // 6.5: Update vocabulary and record merge rules
    int newId = vocabulary.addToken(merged);
    mergeRules.push_back({first, second, merged, top.frequency});

    std::cout << "Iteration " << std::setw(2) << iter
              << ": Merged ('" << first << "' + '" << second
              << "') -> '" << merged << "' | Freq: " << top.frequency
              << " | Occurrences: " << mergesDone
              << " | New Token ID: " << newId << "\n";
  }

  std::cout << "\n========== TRAINING COMPLETE ==========\n";
  std::cout << "Total Merge Rules Learned: " << mergeRules.size() << "\n";
  std::cout << "Final Vocabulary Size: " << vocabulary.size() << "\n";
}

void BPETrainer::displayCorpusSequences() const {
  std::cout << "\n========== CURRENT TOKENIZED CORPUS ==========\n\n";
  for (size_t i = 0; i < corpusSequences.size(); i++) {
    std::cout << "Word " << std::setw(2) << (i + 1) << ": ";
    corpusSequences[i]->display();
  }
}

void BPETrainer::displayMergeRules() const {
  std::cout << "\n========== LEARNED MERGE RULES ==========\n\n";
  std::cout << std::left << std::setw(8) << "Step"
            << std::setw(15) << "Pair"
            << std::setw(15) << "Merged Token"
            << "Frequency\n";
  std::cout << "--------------------------------------------------\n";

  for (size_t i = 0; i < mergeRules.size(); i++) {
    std::string pairStr = "'" + mergeRules[i].first + "' + '" + mergeRules[i].second + "'";
    std::cout << std::left << std::setw(8) << (i + 1)
              << std::setw(15) << pairStr
              << std::setw(15) << mergeRules[i].merged
              << mergeRules[i].frequency << "\n";
  }
}

const Vocabulary &BPETrainer::getVocabulary() const { return vocabulary; }

const std::vector<MergeRule> &BPETrainer::getMergeRules() const { return mergeRules; }

size_t BPETrainer::getCorpusSize() const { return corpusSequences.size(); }

bool BPETrainer::saveMergeRules(const std::string &filename) const {
  std::ofstream file(filename);
  if (!file.is_open()) {
    file.open("../" + filename);
  }
  if (!file.is_open()) {
    std::cerr << "Error: Unable to save merge rules to " << filename << "\n";
    return false;
  }

  for (const auto &rule : mergeRules) {
    file << rule.first << " " << rule.second << " " << rule.merged << " " << rule.frequency << "\n";
  }

  file.close();
  return true;
}

bool BPETrainer::saveModel(const std::string &vocabPath, const std::string &mergesPath) const {
  bool vocabSaved = vocabulary.saveToFile(vocabPath);
  bool mergesSaved = saveMergeRules(mergesPath);
  return vocabSaved && mergesSaved;
}



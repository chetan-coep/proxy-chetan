
#include "pair_frequency.h"

#include <iomanip>
#include <iostream>


void PairFrequency::calculateFrequency(const std::vector<std::string> &corpus) {
  // Clear previous results before recalculating
  pairFrequency.clear();

  // Process every line in the corpus
  for (const std::string &word : corpus) {

    // Extract adjacent character pairs
    for (size_t i = 0; i + 1 < word.size(); i++) {

      std::string pair = word.substr(i, 2);

      // Increment pair frequency
      pairFrequency[pair]++;
    }
  }
}

void PairFrequency::displayFrequency() const {

  std::cout << "\n========== PAIR FREQUENCY ==========\n\n";

  std::cout << std::left << std::setw(15) << "Pair"
            << "Frequency\n";

  std::cout << "-----------------------------\n";

  for (const auto &entry : pairFrequency) {

    std::cout << std::left << std::setw(15) << entry.first << entry.second
              << "\n";
  }
}

int PairFrequency::getFrequency(const std::string &pair) const {

  auto it = pairFrequency.find(pair);

  if (it != pairFrequency.end()) {
    return it->second;
  }

  return 0;
}

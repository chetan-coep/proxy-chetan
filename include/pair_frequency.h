
#ifndef PAIR_FREQUENCY_H
#define PAIR_FREQUENCY_H

#include <string>
#include <unordered_map>
#include <vector>


class PairFrequency {
private:
  std::unordered_map<std::string, int> pairFrequency;

public:
  // Calculate frequencies of adjacent character pairs
  void calculateFrequency(const std::vector<std::string> &corpus);

  // Display all pairs and their frequencies
  void displayFrequency() const;

  // Get frequency of a particular pair
  int getFrequency(const std::string &pair) const;
};

#endif

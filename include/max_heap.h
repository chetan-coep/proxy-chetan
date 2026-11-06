
#ifndef MAX_HEAP_H
#define MAX_HEAP_H

#include <string>
#include <vector>

struct HeapNode {
  std::string pair;
  int frequency;
};

class MaxHeap {
private:
  std::vector<HeapNode> heap;

  void heapifyUp(int index);
  void heapifyDown(int index);

public:
  void insert(const std::string &pair, int frequency);

  HeapNode extractMax();

  HeapNode getMax() const;

  bool empty() const;

  int size() const;

  void display() const;
};

#endif

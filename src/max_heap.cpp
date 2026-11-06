
#include "max_heap.h"

#include <iostream>
#include <stdexcept>
#include <utility>

void MaxHeap::heapifyUp(int index) {

  while (index > 0) {

    int parent = (index - 1) / 2;

    if (heap[index].frequency <= heap[parent].frequency) {
      break;
    }

    std::swap(heap[index], heap[parent]);

    index = parent;
  }
}

void MaxHeap::heapifyDown(int index) {

  int n = static_cast<int>(heap.size());

  while (true) {

    int largest = index;

    int left = 2 * index + 1;
    int right = 2 * index + 2;

    if (left < n && heap[left].frequency > heap[largest].frequency) {
      largest = left;
    }

    if (right < n && heap[right].frequency > heap[largest].frequency) {
      largest = right;
    }

    if (largest == index) {
      break;
    }

    std::swap(heap[index], heap[largest]);

    index = largest;
  }
}

void MaxHeap::insert(const std::string &pair, int frequency) {

  HeapNode node = {pair, frequency};

  heap.push_back(node);

  int index = static_cast<int>(heap.size()) - 1;

  heapifyUp(index);
}

HeapNode MaxHeap::extractMax() {

  if (heap.empty()) {
    throw std::runtime_error("Heap is empty");
  }

  HeapNode maximum = heap[0];

  if (heap.size() == 1) {
    heap.pop_back();
    return maximum;
  }

  heap[0] = heap.back();

  heap.pop_back();

  heapifyDown(0);

  return maximum;
}

HeapNode MaxHeap::getMax() const {

  if (heap.empty()) {
    throw std::runtime_error("Heap is empty");
  }

  return heap[0];
}

bool MaxHeap::empty() const { return heap.empty(); }

int MaxHeap::size() const { return static_cast<int>(heap.size()); }

void MaxHeap::display() const {

  std::cout << "\n========== MAX HEAP ==========\n\n";

  for (const auto &node : heap) {

    std::cout << "Pair: " << node.pair << " | Frequency: " << node.frequency
              << '\n';
  }
}

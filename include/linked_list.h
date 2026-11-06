
#ifndef LINKED_LIST_H
#define LINKED_LIST_H

#include <string>

struct Node {
  std::string token;

  Node *prev;
  Node *next;

  Node(const std::string &value) {
    token = value;
    prev = nullptr;
    next = nullptr;
  }
};

class LinkedList {
private:
  Node *head;
  Node *tail;

public:
  LinkedList();

  ~LinkedList();

  void append(const std::string &token);

  bool mergeAdjacent(Node *first);

  void display() const;

  Node *getHead() const;

  int size() const;
};

#endif

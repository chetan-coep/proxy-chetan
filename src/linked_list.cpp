
#include "linked_list.h"

#include <iostream>

LinkedList::LinkedList() {
  head = nullptr;
  tail = nullptr;
}

LinkedList::~LinkedList() {

  Node *current = head;

  while (current != nullptr) {

    Node *nextNode = current->next;

    delete current;

    current = nextNode;
  }
}

void LinkedList::append(const std::string &token) {

  Node *newNode = new Node(token);

  // First node
  if (head == nullptr) {
    head = newNode;
    tail = newNode;
    return;
  }

  // Connect new node to the last node
  tail->next = newNode;
  newNode->prev = tail;

  tail = newNode;
}

bool LinkedList::mergeAdjacent(Node *first) {

  // Check whether first and its next node exist
  if (first == nullptr || first->next == nullptr) {
    return false;
  }

  Node *second = first->next;

  // Combine token values
  first->token += second->token;

  // Connect first node to the node after second
  first->next = second->next;

  if (second->next != nullptr) {
    second->next->prev = first;
  } else {
    tail = first;
  }

  // Delete the second node
  delete second;

  return true;
}

void LinkedList::display() const {

  Node *current = head;

  while (current != nullptr) {

    std::cout << current->token;

    if (current->next != nullptr) {
      std::cout << " <-> ";
    }

    current = current->next;
  }

  std::cout << '\n';
}

Node *LinkedList::getHead() const { return head; }

int LinkedList::size() const {

  int count = 0;

  Node *current = head;

  while (current != nullptr) {
    count++;
    current = current->next;
  }

  return count;
}

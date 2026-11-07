cmake_minimum_required(VERSION 3.16)

project(TokenForge)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 1. Main standalone executable
add_executable(TokenForge
    src/main.cpp
    src/tokenizer.cpp
    src/pair_frequency.cpp
    src/vocabulary.cpp
    src/max_heap.cpp
    src/linked_list.cpp
    src/bpe_trainer.cpp
    src/bpe_tokenizer.cpp
)
target_include_directories(TokenForge PRIVATE include)

# 2. TokenForge API CLI (JSON bridge for the web application)
add_executable(tokenforge_api
    src/api_cli.cpp
    src/tokenizer.cpp
    src/pair_frequency.cpp
    src/vocabulary.cpp
    src/max_heap.cpp
    src/linked_list.cpp
    src/bpe_trainer.cpp
    src/bpe_tokenizer.cpp
)
target_include_directories(tokenforge_api PRIVATE include)

file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/data DESTINATION ${CMAKE_CURRENT_BINARY_DIR})
file(MAKE_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}/models)
file(MAKE_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/models)

#include <iostream>
#include <string>
#include <vector>
#include <fstream>
#include <sstream>
#include <iomanip>
#include "bpe_trainer.h"
#include "bpe_tokenizer.h"

// Simple minimal JSON serializer helpers
static std::string escapeJson(const std::string &s) {
  std::ostringstream o;
  for (auto c : s) {
    if (c == '"') o << "\\\"";
    else if (c == '\\') o << "\\\\";
    else if (c == '\b') o << "\\b";
    else if (c == '\f') o << "\\f";
    else if (c == '\n') o << "\\n";
    else if (c == '\r') o << "\\r";
    else if (c == '\t') o << "\\t";
    else if (static_cast<unsigned char>(c) <= 0x1f) {
      o << "\\u" << std::hex << std::setw(4) << std::setfill('0') << static_cast<int>(c);
    } else {
      o << c;
    }
  }
  return o.str();
}

static std::vector<std::string> readLines(const std::string &filepath) {
  std::vector<std::string> lines;
  std::ifstream file(filepath);
  if (!file.is_open()) {
    file.open("../" + filepath);
  }
  if (!file.is_open()) return lines;

  std::string line;
  while (std::getline(file, line)) {
    if (!line.empty() && line.back() == '\r') line.pop_back();
    if (!line.empty()) lines.push_back(line);
  }
  return lines;
}

int main(int argc, char* argv[]) {
  if (argc < 2) {
    std::cout << "{\"error\": \"Usage: tokenforge_api <command> [args...]\"}\n";
    return 1;
  }

  std::string cmd = argv[1];

  if (cmd == "train") {
    // args: corpus_path, max_merges, min_freq, vocab_out, merges_out
    std::string corpusPath = (argc > 2) ? argv[2] : "data/corpus.txt";
    int maxMerges = (argc > 3) ? std::stoi(argv[3]) : 10;
    int minFreq = (argc > 4) ? std::stoi(argv[4]) : 2;
    std::string vocabOut = (argc > 5) ? argv[5] : "models/vocab.txt";
    std::string mergesOut = (argc > 6) ? argv[6] : "models/merges.txt";

    std::vector<std::string> corpus = readLines(corpusPath);
    if (corpus.empty()) {
      std::cout << "{\"error\": \"Empty or missing corpus file: " << escapeJson(corpusPath) << "\"}\n";
      return 1;
    }

    BPETrainer trainer;
    trainer.initializeCorpus(corpus);
    trainer.train(maxMerges, minFreq);
    trainer.saveModel(vocabOut, mergesOut);

    // Output JSON with full training history and statistics
    std::ostringstream json;
    json << "{\n";
    json << "  \"status\": \"success\",\n";
    json << "  \"initialVocabSize\": 256,\n";
    json << "  \"finalVocabSize\": " << trainer.getVocabulary().size() << ",\n";
    json << "  \"totalMerges\": " << trainer.getMergeRules().size() << ",\n";
    json << "  \"corpusSequencesCount\": " << trainer.getCorpusSize() << ",\n";
    
    // Initial corpus
    json << "  \"initialCorpus\": [\n";
    const auto &initialCorpus = trainer.getInitialRawCorpus();
    for (size_t i = 0; i < initialCorpus.size(); ++i) {
      json << "    \"" << escapeJson(initialCorpus[i]) << "\"" << (i + 1 < initialCorpus.size() ? "," : "") << "\n";
    }
    json << "  ],\n";

    // Training history steps
    json << "  \"history\": [\n";
    const auto &history = trainer.getTrainingHistory();
    for (size_t h = 0; h < history.size(); ++h) {
      const auto &step = history[h];
      json << "    {\n";
      json << "      \"iteration\": " << step.iteration << ",\n";
      json << "      \"first\": \"" << escapeJson(step.selectedFirst) << "\",\n";
      json << "      \"second\": \"" << escapeJson(step.selectedSecond) << "\",\n";
      json << "      \"merged\": \"" << escapeJson(step.mergedToken) << "\",\n";
      json << "      \"frequency\": " << step.frequency << ",\n";
      json << "      \"newVocabularyId\": " << step.newVocabularyId << ",\n";
      json << "      \"vocabularySize\": " << step.vocabularySize << ",\n";
      json << "      \"occurrences\": " << step.totalMergesInCorpus << ",\n";
      json << "      \"pairs\": [\n";
      for (size_t p = 0; p < step.topAdjacentPairs.size(); ++p) {
        json << "        {\"pair\": \"" << escapeJson(step.topAdjacentPairs[p].first) << "\", \"freq\": " << step.topAdjacentPairs[p].second << "}"
             << (p + 1 < step.topAdjacentPairs.size() ? "," : "") << "\n";
      }
      json << "      ],\n";
      json << "      \"corpusTokens\": [\n";
      for (size_t s = 0; s < step.corpusTokensSnapshot.size(); ++s) {
        json << "        [";
        for (size_t t = 0; t < step.corpusTokensSnapshot[s].size(); ++t) {
          json << "\"" << escapeJson(step.corpusTokensSnapshot[s][t]) << "\"" << (t + 1 < step.corpusTokensSnapshot[s].size() ? ", " : "");
        }
        json << "]" << (s + 1 < step.corpusTokensSnapshot.size() ? "," : "") << "\n";
      }
      json << "      ]\n";
      json << "    }" << (h + 1 < history.size() ? "," : "") << "\n";
    }
    json << "  ]\n";
    json << "}\n";

    std::cout << json.str();
    return 0;
  }
  else if (cmd == "tokenize") {
    // args: text, vocab_path, merges_path
    if (argc < 3) {
      std::cout << "{\"error\": \"Missing text to tokenize\"}\n";
      return 1;
    }
    std::string text = argv[2];
    std::string vocabPath = (argc > 3) ? argv[3] : "models/vocab.txt";
    std::string mergesPath = (argc > 4) ? argv[4] : "models/merges.txt";

    BPETokenizer tokenizer;
    if (!tokenizer.loadModel(vocabPath, mergesPath)) {
      std::cout << "{\"error\": \"Failed to load model from " << escapeJson(vocabPath) << " and " << escapeJson(mergesPath) << "\"}\n";
      return 1;
    }

    EncodingTrace trace = tokenizer.encodeWithTrace(text);
    std::vector<int> tokenIds = trace.finalTokenIds;
    std::string decoded = tokenizer.decode(tokenIds);
    bool exactMatch = (text == decoded);

    std::ostringstream json;
    json << "{\n";
    json << "  \"input\": \"" << escapeJson(text) << "\",\n";
    json << "  \"characterCount\": " << text.size() << ",\n";
    json << "  \"tokenCount\": " << trace.finalTokens.size() << ",\n";
    json << "  \"decoded\": \"" << escapeJson(decoded) << "\",\n";
    json << "  \"exactMatch\": " << (exactMatch ? "true" : "false") << ",\n";

    // Initial byte tokens
    json << "  \"initialTokens\": [";
    for (size_t i = 0; i < trace.initialTokens.size(); ++i) {
      json << "\"" << escapeJson(trace.initialTokens[i]) << "\"" << (i + 1 < trace.initialTokens.size() ? ", " : "");
    }
    json << "],\n";

    // Final tokens with info
    json << "  \"tokens\": [\n";
    for (size_t i = 0; i < trace.finalTokens.size(); ++i) {
      std::string tok = trace.finalTokens[i];
      int tid = (i < tokenIds.size()) ? tokenIds[i] : -1;
      bool isBase = (tid >= 0 && tid < 256);
      json << "    {\"token\": \"" << escapeJson(tok) << "\", \"id\": " << tid
           << ", \"length\": " << tok.size()
           << ", \"isBase\": " << (isBase ? "true" : "false") << "}"
           << (i + 1 < trace.finalTokens.size() ? "," : "") << "\n";
    }
    json << "  ],\n";

    // Final Token IDs array
    json << "  \"tokenIds\": [";
    for (size_t i = 0; i < tokenIds.size(); ++i) {
      json << tokenIds[i] << (i + 1 < tokenIds.size() ? ", " : "");
    }
    json << "],\n";

    // Encoding steps trace for Encoding Explorer
    json << "  \"steps\": [\n";
    for (size_t s = 0; s < trace.steps.size(); ++s) {
      const auto &st = trace.steps[s];
      json << "    {\n";
      json << "      \"stepNumber\": " << st.stepNumber << ",\n";
      json << "      \"ruleFirst\": \"" << escapeJson(st.ruleFirst) << "\",\n";
      json << "      \"ruleSecond\": \"" << escapeJson(st.ruleSecond) << "\",\n";
      json << "      \"mergedToken\": \"" << escapeJson(st.mergedToken) << "\",\n";
      json << "      \"mergedIndex\": " << st.mergedIndex << ",\n";
      json << "      \"tokensBefore\": [";
      for (size_t b = 0; b < st.tokensBefore.size(); ++b) {
        json << "\"" << escapeJson(st.tokensBefore[b]) << "\"" << (b + 1 < st.tokensBefore.size() ? ", " : "");
      }
      json << "],\n";
      json << "      \"tokensAfter\": [";
      for (size_t a = 0; a < st.tokensAfter.size(); ++a) {
        json << "\"" << escapeJson(st.tokensAfter[a]) << "\"" << (a + 1 < st.tokensAfter.size() ? ", " : "");
      }
      json << "],\n";
      json << "      \"tokenIdsAfter\": [";
      for (size_t d = 0; d < st.tokenIdsAfter.size(); ++d) {
        json << st.tokenIdsAfter[d] << (d + 1 < st.tokenIdsAfter.size() ? ", " : "");
      }
      json << "]\n";
      json << "    }" << (s + 1 < trace.steps.size() ? "," : "") << "\n";
    }
    json << "  ]\n";
    json << "}\n";

    std::cout << json.str();
    return 0;
  }
  else if (cmd == "decode") {
    // args: ids_comma_separated, vocab_path, merges_path
    if (argc < 3) {
      std::cout << "{\"error\": \"Missing token IDs to decode\"}\n";
      return 1;
    }
    std::string idsStr = argv[2];
    std::string vocabPath = (argc > 3) ? argv[3] : "models/vocab.txt";
    std::string mergesPath = (argc > 4) ? argv[4] : "models/merges.txt";

    BPETokenizer tokenizer;
    if (!tokenizer.loadModel(vocabPath, mergesPath)) {
      std::cout << "{\"error\": \"Failed to load model\"}\n";
      return 1;
    }

    std::vector<int> tokenIds;
    std::stringstream ss(idsStr);
    std::string item;
    while (std::getline(ss, item, ',')) {
      if (!item.empty()) {
        try {
          tokenIds.push_back(std::stoi(item));
        } catch (...) {}
      }
    }

    std::string decoded = tokenizer.decode(tokenIds);
    std::cout << "{\"decoded\": \"" << escapeJson(decoded) << "\", \"count\": " << tokenIds.size() << "}\n";
    return 0;
  }
  else if (cmd == "vocab") {
    std::string vocabPath = (argc > 2) ? argv[2] : "models/vocab.txt";
    Vocabulary vocab;
    if (!vocab.loadFromFile(vocabPath)) {
      std::cout << "{\"error\": \"Failed to load vocabulary file: " << escapeJson(vocabPath) << "\"}\n";
      return 1;
    }

    std::ostringstream json;
    json << "{\n  \"size\": " << vocab.size() << ",\n  \"tokens\": [\n";
    for (size_t i = 0; i < vocab.size(); ++i) {
      std::string t = vocab.getToken(static_cast<int>(i));
      bool isBase = (i < 256);
      json << "    {\"id\": " << i << ", \"token\": \"" << escapeJson(t) << "\", \"length\": " << t.size()
           << ", \"type\": \"" << (isBase ? "base" : "learned") << "\"}"
           << (i + 1 < vocab.size() ? "," : "") << "\n";
    }
    json << "  ]\n}\n";
    std::cout << json.str();
    return 0;
  }
  else if (cmd == "merges") {
    std::string mergesPath = (argc > 2) ? argv[2] : "models/merges.txt";
    std::ifstream file(mergesPath);
    if (!file.is_open()) {
      file.open("../" + mergesPath);
    }
    if (!file.is_open()) {
      std::cout << "{\"error\": \"Failed to load merges file: " << escapeJson(mergesPath) << "\"}\n";
      return 1;
    }

    std::vector<MergeRule> rules;
    std::string line;
    while (std::getline(file, line)) {
      if (!line.empty() && line.back() == '\r') line.pop_back();
      if (line.empty() || line[0] == '#') continue;
      std::stringstream ss(line);
      std::string f, s, m;
      int freq = 0;
      if (ss >> f >> s) {
        if (!(ss >> m)) m = f + s;
        if (!(ss >> freq)) freq = 0;
        rules.push_back({f, s, m, freq});
      }
    }

    std::ostringstream json;
    json << "{\n  \"count\": " << rules.size() << ",\n  \"rules\": [\n";
    for (size_t i = 0; i < rules.size(); ++i) {
      json << "    {\"step\": " << (i + 1)
           << ", \"first\": \"" << escapeJson(rules[i].first) << "\""
           << ", \"second\": \"" << escapeJson(rules[i].second) << "\""
           << ", \"merged\": \"" << escapeJson(rules[i].merged) << "\""
           << ", \"frequency\": " << rules[i].frequency << "}"
           << (i + 1 < rules.size() ? "," : "") << "\n";
    }
    json << "  ]\n}\n";
    std::cout << json.str();
    return 0;
  }
  else {
    std::cout << "{\"error\": \"Unknown command: " << escapeJson(cmd) << "\"}\n";
    return 1;
  }
}

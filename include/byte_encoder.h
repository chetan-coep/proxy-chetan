#ifndef BYTE_ENCODER_H
#define BYTE_ENCODER_H

#include <string>
#include <vector>
#include <unordered_map>
#include <cstdint>

/**
 * ByteEncoder implements GPT-2 / Tiktoken style Byte-to-Unicode mapping.
 * Every byte (0..255) is mapped to a unique, printable UTF-8 character.
 * This guarantees:
 * 1. Zero out-of-vocabulary (OOV) tokens.
 * 2. Perfect UTF-8 representation (multi-byte sequences, emojis, accents).
 * 3. Consistent whitespace and punctuation handling (spaces map to 'Ġ', newlines to 'Ċ').
 * 4. 100% lossless reversible encoding and decoding.
 */
class ByteEncoder {
private:
  std::unordered_map<uint8_t, std::string> byteToUnicodeMap;
  std::unordered_map<std::string, uint8_t> unicodeToByteMap;

  // Helper to convert a Unicode codepoint to a UTF-8 encoded string
  static std::string codepointToUtf8(uint32_t cp) {
    std::string out;
    if (cp <= 0x7F) {
      out.push_back(static_cast<char>(cp));
    } else if (cp <= 0x7FF) {
      out.push_back(static_cast<char>(0xC0 | ((cp >> 6) & 0x1F)));
      out.push_back(static_cast<char>(0x80 | (cp & 0x3F)));
    } else if (cp <= 0xFFFF) {
      out.push_back(static_cast<char>(0xE0 | ((cp >> 12) & 0x0F)));
      out.push_back(static_cast<char>(0x80 | ((cp >> 6) & 0x3F)));
      out.push_back(static_cast<char>(0x80 | (cp & 0x3F)));
    } else {
      out.push_back(static_cast<char>(0xF0 | ((cp >> 18) & 0x07)));
      out.push_back(static_cast<char>(0x80 | ((cp >> 12) & 0x3F)));
      out.push_back(static_cast<char>(0x80 | ((cp >> 6) & 0x3F)));
      out.push_back(static_cast<char>(0x80 | (cp & 0x3F)));
    }
    return out;
  }

public:
  ByteEncoder() {
    std::vector<int> bs;
    // Printable ASCII characters: '!' to '~' (33 to 126)
    for (int b = '!'; b <= '~'; ++b) bs.push_back(b);
    // Printable Latin-1 Supplement: ¡ to ¬ (161 to 172)
    for (int b = 161; b <= 172; ++b) bs.push_back(b);
    // Printable Latin-1 Supplement: ® to ÿ (174 to 255)
    for (int b = 174; b <= 255; ++b) bs.push_back(b);

    std::vector<int> cs = bs;
    std::vector<bool> in_bs(256, false);
    for (int b : bs) in_bs[b] = true;

    // Remaining non-printable/whitespace bytes map to Latin Extended-A (starting at 256)
    int n = 0;
    for (int b = 0; b < 256; ++b) {
      if (!in_bs[b]) {
        bs.push_back(b);
        cs.push_back(256 + n);
        n++;
      }
    }

    for (size_t i = 0; i < bs.size(); ++i) {
      uint8_t byteVal = static_cast<uint8_t>(bs[i]);
      std::string utf8Char = codepointToUtf8(static_cast<uint32_t>(cs[i]));
      byteToUnicodeMap[byteVal] = utf8Char;
      unicodeToByteMap[utf8Char] = byteVal;
    }
  }

  // Convert a single byte (0..255) to its unique printable UTF-8 representation
  std::string byteToToken(uint8_t b) const {
    auto it = byteToUnicodeMap.find(b);
    if (it != byteToUnicodeMap.end()) {
      return it->second;
    }
    return codepointToUtf8(static_cast<uint32_t>(b));
  }

  // Convert a printable representation token back to its raw byte
  bool tokenToByte(const std::string &token, uint8_t &outByte) const {
    auto it = unicodeToByteMap.find(token);
    if (it != unicodeToByteMap.end()) {
      outByte = it->second;
      return true;
    }
    return false;
  }

  // Convert raw text into a sequence of 256-byte printable token strings
  std::vector<std::string> stringToByteTokens(const std::string &text) const {
    std::vector<std::string> tokens;
    tokens.reserve(text.size());
    for (unsigned char ch : text) {
      tokens.push_back(byteToToken(ch));
    }
    return tokens;
  }

  // Reconstruct the exact original string from byte token strings
  std::string byteTokensToString(const std::vector<std::string> &tokens) const {
    std::string text;
    for (const auto &tok : tokens) {
      // If token is composed of multiple mapped bytes (merged subword)
      // extract individual Unicode graphemes
      size_t i = 0;
      while (i < tok.size()) {
        size_t len = 1;
        unsigned char lead = static_cast<unsigned char>(tok[i]);
        if ((lead & 0xE0) == 0xC0) len = 2;
        else if ((lead & 0xF0) == 0xE0) len = 3;
        else if ((lead & 0xF8) == 0xF0) len = 4;

        if (i + len <= tok.size()) {
          std::string unit = tok.substr(i, len);
          uint8_t rawByte = 0;
          if (tokenToByte(unit, rawByte)) {
            text.push_back(static_cast<char>(rawByte));
          } else {
            text += unit;
          }
          i += len;
        } else {
          text.push_back(tok[i]);
          i++;
        }
      }
    }
    return text;
  }

  const std::unordered_map<uint8_t, std::string> &getByteMap() const {
    return byteToUnicodeMap;
  }
};

#endif


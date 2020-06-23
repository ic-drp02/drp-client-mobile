const token = (type, source, start, end) => ({
  type,
  source,
  range: {
    start,
    end,
  },
  value: source.substring(start, end + 1),
});

function parseWhitespace(str, start) {
  let end = start + 1;
  while (end < str.length && /\s/.test(str[end])) {
    end++;
  }
  return token("text", str, start, end);
}

function parseFrom(str, start, char, tokenType) {
  let end = start + 1;
  while (end < str.length && /\S/.test(str[end]) && str[end] !== char) {
    end++;
  }
  if (str[end] === char) {
    return token(tokenType, str, start, end);
  } else {
    return token("text", str, start, end);
  }
}

function parseText(str, start) {
  let end = start + 1;
  while (end < str.length && /\S/.test(str[end])) {
    end++;
  }
  return token("text", str, start, end);
}

export function parse(str) {
  const tokens = [];

  let i = 0;
  while (i < str.length) {
    if (/\s/.test(str[i])) {
      const token = parseWhitespace(str, i);
      tokens.push(token);
      i = token.range.end + 1;
    } else {
      if (str[i] === "_") {
        const token = parseFrom(str, i, "_", "em");
        tokens.push(token);
        i = token.range.end + 1;
      } else if (str[i] === "*") {
        const token = parseFrom(str, i, "*", "strong");
        tokens.push(token);
        i = token.range.end + 1;
      } else if (str[i] === "~") {
        const token = parseFrom(str, i, "~", "s");
        tokens.push(token);
        i = token.range.end + 1;
      } else if (str[i] === "+") {
        const token = parseFrom(str, i, "+", "u");
        tokens.push(token);
        i = token.range.end + 1;
      } else {
        const token = parseText(str, i);
        tokens.push(token);
        i = token.range.end + 1;
      }
    }
  }

  return tokens;
}

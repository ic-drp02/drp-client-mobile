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

function parseFromUnderscore(str, start) {
  let end = start + 1;
  while (end < str.length && /\S/.test(str[end]) && str[end] !== "_") {
    end++;
  }
  if (str[end] === "_") {
    return token("em", str, start, end);
  } else {
    return token("text", str, start, end);
  }
}

function parseFromStar(str, start) {
  let end = start + 1;
  while (end < str.length && /\S/.test(str[end]) && str[end] !== "*") {
    end++;
  }
  if (str[end] === "*") {
    return token("strong", str, start, end);
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
        const token = parseFromUnderscore(str, i);
        tokens.push(token);
        i = token.range.end + 1;
      } else if (str[i] === "*") {
        const token = parseFromStar(str, i);
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

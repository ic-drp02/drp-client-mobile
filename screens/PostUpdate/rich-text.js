const token = (type, source, start, end) => ({
  type,
  source,
  range: {
    start,
    end,
  },
  value: source.substring(start, end + 1),
});

function parseWhitespace(str, state) {
  let start = state.pos++;
  while (state.pos < str.length && /\s/.test(str[state.pos])) {
    state.pos++;
  }
  return token("ws", str, start, state.pos - 1);
}

function parseFrom(str, state, char, tokenType) {
  let start = state.pos++;
  while (
    state.pos < str.length &&
    /\S/.test(str[state.pos]) &&
    str[state.pos] !== char
  ) {
    state.pos++;
  }
  if (str[state.pos] === char) {
    return token(tokenType, str, start, state.pos++);
  } else {
    return token("text", str, start, state.pos - 1);
  }
}

function parseText(str, state) {
  const start = state.pos++;
  while (state.pos < str.length && /\S/.test(str[state.pos])) {
    state.pos++;
  }
  return token("text", str, start, state.pos - 1);
}

export function parse(str) {
  const tokens = [];
  const state = { pos: 0 };

  while (state.pos < str.length) {
    if (/\s/.test(str[state.pos])) {
      const token = parseWhitespace(str, state);
      tokens.push(token);
    } else {
      if (str[state.pos] === "_") {
        const token = parseFrom(str, state, "_", "em");
        tokens.push(token);
      } else if (str[state.pos] === "*") {
        const token = parseFrom(str, state, "*", "strong");
        tokens.push(token);
      } else if (str[state.pos] === "~") {
        const token = parseFrom(str, state, "~", "s");
        tokens.push(token);
      } else if (str[state.pos] === "+") {
        const token = parseFrom(str, state, "+", "u");
        tokens.push(token);
      } else {
        const token = parseText(str, state);
        tokens.push(token);
      }
    }
  }

  return tokens;
}

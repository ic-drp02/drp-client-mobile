export const NodeType = {
  Plain: "PLAIN",
  Bold: "BOLD",
  Italic: "ITALIC",
  Underline: "UNDERLINE",
  Strikethrough: "STRIKETHROUGH",
};

const DELIMITER_MAP = {
  "*": matchBold,
  _: matchItalic,
  "+": matchUnderline,
  "~": matchStrikethrough,
};

const Node = (type, value, children) => ({
  type,
  value,
  children: children || [],
});

const defineNode = (type) => (value, children) => Node(type, value, children);

const Plain = defineNode(NodeType.Plain);
const Bold = defineNode(NodeType.Bold);
const Italic = defineNode(NodeType.Italic);
const Underline = defineNode(NodeType.Underline);
const Strikethrough = defineNode(NodeType.Strikethrough);

function matchPlain(source) {
  if (source.length === 0) {
    return false;
  }

  for (let i = 1; i < source.length; i++) {
    if (
      Object.keys(DELIMITER_MAP).includes(source[i]) &&
      /\s/.test(source[i - 1])
    ) {
      return {
        node: Plain(source.slice(0, i)),
        pos: i,
      };
    }
  }

  return {
    node: Plain(source),
    pos: source.length,
  };
}

function matchDelimited(source, regex, nodeConstructor) {
  const match = source.match(regex);
  if (match) {
    return {
      node: nodeConstructor(source.slice(0, match[0].length), parse(match[1])),
      pos: match[0].length,
    };
  }
  return false;
}

function matchBold(source) {
  return matchDelimited(source, /\*(.*?)\*(?=$|\W)/, Bold);
}

function matchItalic(source) {
  return matchDelimited(source, /_(.*?)_(?=$|\W)/, Italic);
}

function matchUnderline(source) {
  return matchDelimited(source, /\+(.*?)\+(?=$|\W)/, Underline);
}

function matchStrikethrough(source) {
  return matchDelimited(source, /~(.*?)~(?=$|\W)/, Strikethrough);
}

export function parse(source) {
  const nodes = [];
  let pos = 0;
  while (pos < source.length) {
    const slice = source.slice(pos);

    switch (source[pos]) {
      case "*":
      case "_":
      case "+":
      case "~": {
        const result = DELIMITER_MAP[source[pos]](slice);
        if (result) {
          nodes.push(result.node);
          pos += result.pos;
          break;
        }
      }

      default: {
        const result = matchPlain(slice);

        if (!result) {
          throw `failed to match anything: ${slice}`;
        }

        nodes.push(result.node);
        pos += result.pos;
      }
    }
  }
  return nodes;
}

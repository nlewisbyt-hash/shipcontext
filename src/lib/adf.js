/**
 * Tiny Atlassian Document Format helpers. Only used to turn issue
 * descriptions and comments into plain text for decision extraction.
 */

export function adfToText(node) {
  if (node == null) {
    return "";
  }
  if (typeof node === "string") {
    return node;
  }
  if (Array.isArray(node)) {
    return node.map(adfToText).join("");
  }
  if (typeof node !== "object") {
    return String(node);
  }
  if (node.type === "text") {
    return node.text || "";
  }
  const inner = Array.isArray(node.content)
    ? node.content.map(adfToText).join(isBlock(node.type) ? "\n" : "")
    : "";
  if (node.type === "hardBreak") {
    return "\n";
  }
  return inner;
}

function isBlock(type) {
  return (
    type === "paragraph" ||
    type === "heading" ||
    type === "blockquote" ||
    type === "listItem" ||
    type === "bulletList" ||
    type === "orderedList" ||
    type === "codeBlock" ||
    type === "panel" ||
    type === "decisionItem" ||
    type === "decisionList" ||
    type === "rule" ||
    type === "doc"
  );
}

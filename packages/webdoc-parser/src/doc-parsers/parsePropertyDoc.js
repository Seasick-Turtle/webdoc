// @flow
import {
  type Node,
  isExpressionStatement,
  isThisExpression,
  isAssignmentExpression,
  isClassProperty,
  isClassMethod,
} from "@babel/types";
import type {Doc, PropertyDoc} from "@webdoc/types";
import {createDoc} from "@webdoc/model";

// Parse this.member/Object.member = 'value' properties.
function parseAssignedPropertyDoc(node: Node, options: $Shape<Doc>): PropertyDoc {
  options.object = isThisExpression(node.expression.left.object) ?
    "this" : node.expression.left.object.name;

  if (!options.scope) {
    if (options.object === "this") {
      options.scope = "instance";
    } else {
      options.scope = "static";
    }
  }

  return createDoc(node.expression.left.property.name, "PropertyDoc", options);
}

// Parse class className { prop = 'value'; } properties
function parseClassPropertyDoc(node: Node, options: $Shape<Doc>): PropertyDoc {
  if (!options.scope) {
    if (node.static) {
      options.scope = "static";
    } else {
      options.scope = "instance";
    }
  }

  return createDoc(node.key.name, "PropertyDoc", options);
}

// TODO: Getter/setter properties (refer from parseMethodDoc as they are "MethodDefinition"s)

// Parses class/object properties
export function parsePropertyDoc(node: Node, options: $Shape<Doc>): PropertyDoc {
  if (!options.dataType) {
    options.dataType = ["any"];
  }

  if (isExpressionStatement(node) && isAssignmentExpression(node.expression)) {
    return parseAssignedPropertyDoc(node, options);
  }
  if (isClassProperty(node) || (isClassMethod(node) && (node.kind === "get" || node.kind === "set"))) {
    return parseClassPropertyDoc(node, options);
  }

  if (options.name) {
    return createDoc(options.name || "Unknown", "PropertyDoc", options);
  }
}

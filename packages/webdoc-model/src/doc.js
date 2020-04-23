// @flow

import {type Tag} from "./tag";

export type BaseDoc = {
  name: string,
  path: string,
  stack: string[],
  parent: Doc,
  children: Doc[],
  tags: Tag[],
  brief: string,
  description: string,
  visiblity: "public" | "protected" | "private",
  version: "alpha" | "beta" | "internal" | "public" | "deprecated",
  type: "ClassDoc" | "FunctionDoc" | "MethodDoc" | "ObjectDoc" | "RootDoc" | "TypedefDoc"
};

export type Doc = BaseDoc | ClassDoc | ObjectDoc | FunctionDoc | MethodDoc | PropertyDoc
    | TypedefDoc;

export type RootDoc = {
  ...Doc,
  type: "RootDoc"
};

export type ClassDoc = {
  ...Doc,
  type: "ClassDoc"
};

export type FunctionDoc = {
  ...Doc,
  type: "FunctionDoc"
};

export type MethodDoc = {
  ...Doc,
  type: "MethodDoc"
};

export type ObjectDoc = {
  ...Doc,
  type: "ObjectDoc"
};

export type PropertyDoc = {
  ...Doc,
  scope: string | "this",
  type: "PropertyDoc"
};

export type TypedefDoc = {
  ...Doc,
  org: Doc,
  alias: string,
  type: "Typedefdoc",
};

/**
 * Creates a valid doc object with a name & type.
 *
 * @param {string}[name]
 * @param {string}[type="BaseDoc"]
 * @param {*}[options]
 * @return {BaseDoc}
 */
export const createDoc = (name?: string, type?: string = "BaseDoc", options: any) =>
  (Object.assign({
    name,
    path: "",
    stack: [""],
    parent: null,
    children: [],
    tags: [],
    brief: "",
    description: "",
    visiblity: "public",
    version: "public",
    type,
  }, options || {}));

/**
 * Searches for the doc named {@code lname} in the given scoped documentation.
 *
 * @param {string} lname
 * @param {BaseDoc} scope
 * @return {Doc} - the child doc
 */
export function childDoc(lname: string, scope: BaseDoc): ?Doc {
  const {children} = scope;

  for (let i = 0; i < scope.children.length; i++) {
    const child = children[i];

    if (child.name === lname) {
      return child;
    }
  }
}

/**
 * @template T
 * @param {T} doc
 * @param {BaseDoc} scope
 * @return {T}
 */
export function addChildDoc<T: BaseDoc>(doc: T, scope: BaseDoc): T {
  if (doc.parent) {
    const i = doc.parent.children.indexOf(doc);

    if (i >= 0) {
      doc.parent.children.splice(i, 1);
    }
  }

  const {children} = scope;
  let index = -1;

  for (let i = 0; i < scope.children.length; i++) {
    const child = children[i];

    if (child.name === doc.name) {
      children[i] = doc;
      index = i;
      break;
    }
  }

  if (index === -1) {
    children.push(doc);
  }

  doc.parent = scope;
  doc.stack = [...scope.stack, doc.name];
  doc.path = `${scope.path}.${doc.name}`;

  return doc;
}

/**
 * Finds the doc whose relative path is {@code path} w.r.t {@code root}.
 *
 * @param {string | string[]} path
 * @param {BaseDoc} root
 * @return {?Doc}
 */
export function doc(path: string | string[], root: BaseDoc): ?Doc {
  const docStack = Array.isArray(path) ? path : path.split(/[.|#]/);
  let doc = root;

  for (let i = 0; i < docStack.length; i++) {
    const child = childDoc(docStack[i], doc);

    if (!child) {
      return null;
    }

    doc = child;
  }

  return doc;
}

/**
 * Adds a doc at its path in the doc-tree.
 *
 * @template T
 * @param {T} doc
 * @param {BaseDoc} root
 * @return {?T} - the doc, if it was added
 */
export function addDoc<T: BaseDoc>(doc: T, root: BaseDoc): ?T {
  const docStack = doc.stack ? doc.stack : doc.path.split(/[.|#]/);
  let scope = root;

  for (let i = 0; i < docStack.length - 1; i++) {
    const child = childDoc(docStack[i], scope);

    if (!child) {
      return null;
    }

    scope = doc;
  }

  addChildDoc(doc, scope);
  return doc;
}

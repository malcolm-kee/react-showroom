import type { Node } from 'acorn';

export interface LiteralNode extends Node {
  type: 'Literal';
  value: string;
  raw: string;
}

export interface IdentifierNode extends Node {
  type: 'Identifier';
  name: string;
}

export interface ImportSpecifierNode extends Node {
  type: 'ImportSpecifier';
  imported: IdentifierNode;
  local: IdentifierNode;
}

export interface ImportNamespaceSpecifierNode extends Node {
  type: 'ImportNamespaceSpecifier';
  local: IdentifierNode;
}

export interface ImportDefaultSpecifierNode extends Node {
  type: 'ImportDefaultSpecifier';
  local: IdentifierNode;
}

export interface ImportDeclarationNode extends Node {
  type: 'ImportDeclaration';
  source: LiteralNode;
  specifiers: Array<
    | ImportSpecifierNode
    | ImportNamespaceSpecifierNode
    | ImportDefaultSpecifierNode
  >;
}

export interface MemberExpressionNode extends Node {
  type: 'MemberExpression';
  object: IdentifierNode;
  property: IdentifierNode;
}

export interface ExpressionStatementNode extends Node {
  type: 'ExpressionStatement';
  expression: {
    arguments: Array<Node>;
    callee: Node;
  };
}

export interface ProgramNode extends Node {
  type: 'Program';
  body: Array<Node>;
}

import deepDiff from 'deep-diff';

export const types = {
  ADD: 'ADD',
  DELETE: 'DELETE',
  EDIT: 'EDIT',
  NORMAL: 'NORMAL',
  START: 'START',
  END: 'END',
};

const diffTypeMap = {
  N: types.ADD,
  D: types.DELETE,
  E: types.EDIT,
};

export const colors = {
  green: 'green',
  red: 'red',
  black: 'black',
};

function mapObj(obj, func) {
  const mapper = func || (value => value);
  return Object.keys(obj).map(key =>
    mapper(obj[key], key)
  );
}

function createEditNode({ value, key, level }) {
  const { green, red } = colors;
  return [
    {
      level,
      color: red,
      symbol: '-',
      text: `${key}: "${value.lhs}"`,
      newline: true,
    },
    {
      level,
      color: green,
      symbol: '+',
      text: `${key}: "${value.rhs}"`,
      newline: true,
    },
  ];
}

function createAddNode({ value, key, level }) {
  const { green } = colors;
  return {
    level,
    color: green,
    symbol: '+',
    text: `${key}: "${value.rhs}"`,
    newline: true,
  };
}

function createDeleteNode({ value, key, level }) {
  const { red } = colors;
  return {
    level,
    color: red,
    symbol: '-',
    text: `${key}: "${value.lhs}"`,
    newline: true,
  };
}

function createNormalNode({ value, key, level }) {
  const { black } = colors;
  return {
    level,
    color: black,
    text: key ? `${key}: "${value}"` : value,
    newline: true,
  };
}

function toASTNode({ key, value, type, level }) {
  const creator = {
    EDIT: createEditNode,
    ADD: createAddNode,
    DELETE: createDeleteNode,
  }[type] || createNormalNode;

  return creator({
    key,
    level,
    value,
  });
}

const ensureArray = item => (Array.isArray(item) ? item : [item]);
const flatten = (memo, item) => [
  ...ensureArray(memo),
  ...ensureArray(item),
];

function mergeObjDiffs(obj, diffs) {
  const addedDiffs = diffs.reduce((memo, value) => ({
    ...memo,
    [value.path.join('.')]: value,
  }), {});

  return {
    ...obj,
    ...addedDiffs,
  };
}

function calculateType({ kind }) {
  return diffTypeMap[kind] || types.NORMAL;
}

function objToASTNodes(obj) {
  const propNodes = mapObj(obj, (value, key) => ({
    level: 1,
    type: calculateType(value),
    key,
    value,
  }))
  .map(toASTNode)
  .reduce(flatten);

  const start = toASTNode({
    level: 0,
    value: '{',
  });

  const end = toASTNode({
    level: 0,
    value: '}',
  });

  return [
    start,
    ...propNodes,
    end,
  ];
}

export function ast(obj1, obj2) {
  const diff = deepDiff(obj1, obj2);
  console.log('diff: \n', JSON.stringify(diff, null, 2));
  const merged = mergeObjDiffs(obj1, diff);
  console.log('merged: \n', JSON.stringify(merged, null, 2));
  const output = objToASTNodes(merged);
  console.log('output: \n', JSON.stringify(output, null, 2));
  return output;
}

export default function consoleDiff() {
  return {};
}

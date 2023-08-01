import { DataStructure } from '.';

export class Node {
  val: any = undefined;
  left: Node = null;
  right: Node = null;

  constructor(val: any) {
    this.val = val;
  }
}

export function getLevelCoords(index: number): [number, number] {
  let row = Math.floor(Math.log2(index));
  let col = index - (2 ** row - 1);

  return [row, col];
}

export function parent(index: number) {
  return Math.floor((index - 1) / 2);
}

export function leftChild(index: number) {
  return 2 * index + 1;
}

export function rightChild(index: number) {
  return 2 * index + 2;
}

export interface ExportOptionsType {
  language: 'python' | 'java' | 'c++' | 'javascript';
  exportType: 'leetcode' | 'serial' | 'nodes';
}

export default class BinaryTree extends DataStructure {
  name: string = 'Binary Tree';

  height: number;
  nodes: Record<number, Node> = {};
  numberOfNodes: number;

  constructor(arr: Array<number | null> = [1, 2, 3, 4, 5, 6, 7]) {
    super();
    this.buildFromSerialArray(arr);
  }

  private calculateHeight() {
    const getHeight = (index: number) => {
      if (!(index in this.nodes)) return 0;
      return (
        1 + Math.max(getHeight(leftChild(index)), getHeight(rightChild(index)))
      );
    };
    this.height = getHeight(0);
  }

  buildFromSerialArray(arr: Array<string | number | null>) {
    // Set all nodes to null
    this.nodes = {};

    // Create all nodes
    const createNode = (index: number) => {
      if (index >= arr.length || arr[index] == null) {
        return null;
      }

      let node = new Node(arr[index]);
      this.nodes[index] = node;
      node.left = createNode(leftChild(index));
      node.right = createNode(rightChild(index));

      return node;
    };
    createNode(0);

    this.calculateHeight();

    super.onUpdate();
  }

  /**
   * Builds from an array using the LeetCode representation
   * Children of blank nodes are not included in the array
   * @example [1,null,2,null,3] creates a right-aligned tree 1 > 2 > 3
   */
  buildFromLeetCodeArray(arr: Array<string | number | null>) {
    // Reset nodes + base case
    this.nodes = { 0: new Node(arr[0]) };

    // Create all nodes
    let arrIndex = 1;
    let nodeIndex = 1;
    let lastValidNodeIndex = 0;
    while (arrIndex < arr.length) {
      const parentIdx = parent(nodeIndex);

      if (!(parentIdx in this.nodes)) {
        // could run into an infinite loop
        // if the last possible parent has been passed, throw error
        if (rightChild(lastValidNodeIndex) < nodeIndex) {
          throw new Error(`invalid input: ${arr}`);
        }
        ++nodeIndex;
        continue;
      }

      if (arr[arrIndex] != null) {
        lastValidNodeIndex = nodeIndex;
        const newNode = new Node(arr[arrIndex]);
        this.nodes[nodeIndex] = newNode;

        // Set it to be the (correct) child of its parent
        if (leftChild(parentIdx) == nodeIndex) {
          // If left child
          this.nodes[parentIdx].left = newNode;
        } else {
          // If right child
          this.nodes[parentIdx].right = newNode;
        }
      }
      ++arrIndex;
      ++nodeIndex;
    }

    this.calculateHeight();

    super.onUpdate();
  }

  deleteNode(index: number) {
    if (!(index in this.nodes)) return;
    // don't delete the root node
    if (index == 0) return;

    // Delete it's reference from parent
    if (index % 2 == 0) this.nodes[parent(index)].right = null;
    else this.nodes[parent(index)].left = null;

    // recursively delete it and its children
    const deleteRecursively = (index: number) => {
      if (!(index in this.nodes)) return;

      delete this.nodes[index];
      deleteRecursively(leftChild(index));
      deleteRecursively(rightChild(index));
    };
    deleteRecursively(index);

    this.calculateHeight();

    super.onUpdate();
  }

  appendNode(index: number, direction: 'left' | 'right', val: any) {
    if (!(index in this.nodes)) return;
    const newNode = new Node(val);

    if (direction === 'left') {
      this.nodes[index].left = newNode;
      this.nodes[leftChild(index)] = newNode;
    } else {
      this.nodes[index].right = newNode;
      this.nodes[rightChild(index)] = newNode;
    }

    this.calculateHeight();

    super.onUpdate();
  }

  setNodeValue(index: number, val: number) {
    if (!(index in this.nodes)) return;

    this.nodes[index].val = val;

    super.onUpdate();
  }

  toString(): string {
    // @ts-ignore
    return Object.entries(this.nodes)
      .map(([key, node]: [string, Node]) => `${key}:${node.val}`)
      .join('/');
  }

  print() {
    console.log('Binary Tree');
    console.log(this.nodes);
    console.log(this.toString());
  }

  randomise() {
    const arr = new Array(14)
      .fill(0)
      .map((_, i) => (Math.random() > 0.8 ? null : i));
    arr.unshift(1);
    this.buildFromSerialArray(arr);
  }

  exportCode(exportOptions?: ExportOptionsType): string {
    if (!exportOptions)
      return this.exportCode({
        language: 'python',
        exportType: 'serial',
      });

    const { language, exportType } = exportOptions;

    switch (exportType) {
      case 'leetcode':
        return this.exportAsLeetCodeArray(language);
      case 'serial':
        return this.exportAsArray(language);
      case 'nodes':
        return this.exportAsNodes(language);
    }

    return 'DEFAULT';
  }

  private exportAsLeetCodeArray(lang: ExportOptionsType['language']) {
    const queue = [];
    const result = [];

    queue.push(0);
    while (queue.length != 0) {
      const curr = queue.shift();

      if (!(curr in this.nodes)) {
        result.push(null);
        continue;
      }

      result.push(this.nodes[curr].val);

      // Add children
      queue.push(leftChild(curr), rightChild(curr));
    }
    while (result[result.length - 1] == null) {
      result.pop();
    }

    return JSON.stringify(result);
  }

  private exportAsArray(lang: ExportOptionsType['language']) {
    let arr = new Array(2 ** this.height - 1).fill(null);
    for (const [key, node] of Object.entries(this.nodes)) {
      arr[key] = node.val;
    }
    let str = arr.map((val) => (val == null ? 'null' : val)).join(',');

    const BRACKET: [string, string] =
      lang == 'python' ? ['[', ']'] : ['{', '}'];

    return `${BRACKET[0]}${str}${BRACKET[1]}`;
  }

  private exportAsNodes(lang: ExportOptionsType['language']) {
    // TODO: Switch to variables instead of array for sparse trees
    const CLASSNAME = 'TreeNode';
    const DECLARATION =
      (lang == 'python' && '') ||
      (lang == 'java' && `${CLASSNAME}[] `) ||
      (lang == 'c++' && `vector<${CLASSNAME} *> `) ||
      (lang == 'javascript' && 'const ');

    // (lang == 'python' && '') ||
    // (lang == 'java' && '') ||
    // (lang == 'c++' && '') ||
    // (lang == 'javascript' && '');
    const VARIABLENAME = 'nodeArray';
    const SEMICOLON = (lang == 'python' && '') || ';';
    const NULL =
      (lang == 'python' && 'None') ||
      (lang == 'java' && 'null') ||
      (lang == 'c++' && 'NULL') ||
      (lang == 'javascript' && 'null');
    const NEW = lang == 'python' ? '' : 'new ';
    const BRACKET: [string, string] = ((lang == 'python' ||
      lang == 'javascript') && ['[', ']']) || ['{', '}'];
    const FIELD_OPERATOR = (lang == 'c++' && '->') || '.';
    const FUNCTION_KEYWORD =
      (lang == 'python' && 'def') ||
      (lang == 'java' && CLASSNAME) ||
      (lang == 'c++' && `${CLASSNAME} *`) ||
      (lang == 'javascript' && 'function');

    // get internal array representation of values
    let arr = new Array(2 ** this.height - 1).fill(null);
    for (const [key, node] of Object.entries(this.nodes)) {
      arr[key] = node.val;
    }

    const LINES: string[] = [];

    // wrapping function
    LINES.push(
      `${FUNCTION_KEYWORD} testcase()${(lang == 'python' && ':') || ' {'}`,
    );

    // initializing the array where nodes are stored
    const INITIALIZATION = `${DECLARATION}${VARIABLENAME} = ${BRACKET[0]}${arr
      .map((val) => {
        if (val == null) return `${NULL}`;
        return `${NEW}${CLASSNAME}(${val})`;
      })
      .join(', ')}${BRACKET[1]}${SEMICOLON}`;
    LINES.push('    ' + INITIALIZATION);

    // setting 'left' and 'right' fields
    for (const index in this.nodes) {
      const node = this.nodes[index];
      if (!node.left && !node.right) continue;

      if (node.left) {
        LINES.push(
          '    ' +
            `${VARIABLENAME}[${index}]${FIELD_OPERATOR}left = ${VARIABLENAME}[${leftChild(
              parseInt(index),
            )}]${SEMICOLON}`,
        );
      }
      if (node.right) {
        LINES.push(
          '    ' +
            `${VARIABLENAME}[${index}]${FIELD_OPERATOR}right = ${VARIABLENAME}[${rightChild(
              parseInt(index),
            )}]${SEMICOLON}`,
        );
      }
    }

    // return statement
    LINES.push('    ' + `return ${VARIABLENAME}[0]${SEMICOLON}`);

    // end function
    if (lang != 'python') {
      LINES.push('}');
    }

    return LINES.join('\n');
  }
}

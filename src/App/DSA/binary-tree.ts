import { DataStructure, DataStructureID } from '.';

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

export const ExportOptions = {
  lang: ['Python', 'Java', 'C++'] as const,
  asArray: ['Array of values', 'Nodes'] as const,
};

export default class BinaryTree extends DataStructure<typeof ExportOptions> {
  id = DataStructure[DataStructureID['Binary Tree']];
  name: string = 'Binary Tree';

  height: number;
  nodes: Record<number, Node> = {};
  numberOfNodes: number;

  constructor(arr: Array<number | null> = [1, 2, 3]) {
    super();
    this.buildFromArray(arr);
  }

  getExportOptions(): typeof ExportOptions {
    return ExportOptions;
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

  buildFromArray(arr: Array<string | number | null>) {
    console.log('Building from array');

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
    this.buildFromArray(arr);
  }

  exportCode(
    exportOptions?: Record<keyof typeof ExportOptions, number>,
  ): string {
    if (!exportOptions)
      return this.exportCode({
        lang: 0,
        asArray: 0,
      });

    const { lang, asArray } = exportOptions;

    if (asArray == 0) {
      // Return as an array
      return this.exportAsArray(lang);
    }
    return `Export: { ${lang}, ${asArray} }`;
  }

  private exportAsArray(lang: number) {
    console.log('Exported as array');
    return `${Object.keys(this.nodes).length}`;
  }
}

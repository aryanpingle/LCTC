import * as BinaryTree from './binary-tree';

export abstract class DataStructure {
  abstract id: keyof typeof DataStructureID;
  abstract name: string;

  abstract toString(): string;
  abstract print(): void;
  abstract buildFromArray(arr: Array<string | number | null>): void;
  abstract exportCode(options?: Record<any, any>): string;

  subscriptions: Function[] = [];

  subscribe(f: Function) {
    this.subscriptions.push(f);
  }

  onUpdate() {
    this.subscriptions.forEach((f) => f());
  }

  getName() {
    return this.name;
  }
}

export enum DataStructureID {
  'Binary Tree',
  'Bruh',
}

// export type AnyExportOptions = typeof BinaryTree.ExportOptions;

import * as BinaryTree from './binary-tree';

export abstract class DataStructure<ExportOptions> {
  abstract id: keyof typeof DataStructureID;
  abstract name: string;

  abstract toString(): string;
  abstract print(): void;
  abstract buildFromArray(arr: Array<string | number | null>): void;
  abstract exportCode(options?: Record<keyof ExportOptions, number>): string;

  subscriptions: Function[] = [];

  abstract getExportOptions(): ExportOptions;

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

export type AnyExportOptions = typeof BinaryTree.ExportOptions;

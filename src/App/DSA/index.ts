export abstract class DataStructure<ExportOptions> {
  abstract name: string;

  abstract toString(): string;
  abstract print(): void;
  abstract buildFromArray(arr: Array<string | number | null>): void;
  abstract exportCode(options: ExportOptions): string;

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

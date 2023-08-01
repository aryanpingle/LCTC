export abstract class DataStructure {
  abstract name: string;

  abstract toString(): string;
  abstract print(): void;
  abstract buildFromSerialArray(arr: Array<string | number | null>): void;
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

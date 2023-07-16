export class Node {
    static MIN_SIZE = 0;

    id: number = undefined;
    val: any = undefined;
    left: Node = null;
    right: Node = null;

    constructor(id: number, val: any) {
        this.id = id;
        this.val = val;
    }
}

export function getLevelCoords(index: number): [number, number] {
    let row = Math.floor(Math.log2(index));
    let col = index - ( 2**row - 1 );

    return [row, col];
}

export function parent(index: number) {
    return Math.floor((index-1) / 2);
}

export function leftChild(index: number) {
    return 2*index + 1;
}

export function rightChild(index: number) {
    return 2*index + 2;
}

export function validateBinaryTree(arr: Array<any>) {
    return !arr.some((val, index) => {
        if(val !== null) {
            let parentIndex = parent(index);
            if(parentIndex >= 0 && arr[parentIndex] == null) return true;
        }

        return true;
    });
}

/**
 * Ensures that every leaf node has two child nodes
 */
export default class BinaryTree {
    height: number;
    levels: Node[][];
    subscriptions: Function[] = [];

    constructor(arr: Array<number | null> = [1, 2, 3]) {
        this.buildFromArray(arr);
    }

    private getNodeFromIndex(index: number) {
        let h = Math.floor(Math.log2(index + 1)); // for root: h=0
        return this.levels[index - 2**h]
    }

    buildFromArray(arr: Array<number | null>) {
        // this height DOES NOT include sentinel, root is at height=1
        const getHeight = (index: number) => {
            if(index >= arr.length || arr[index] == null) return 0;

            return 1 + Math.max(
                getHeight(leftChild(index)),
                getHeight(rightChild(index)
            ));
        }
        this.height = getHeight(0);

        // Create the skeleton
        this.levels = new Array(this.height);
        for(let i = 0; i < this.levels.length; ++i) {
            this.levels[i] = new Array(2**i).fill(null);
        }
    
        // populate levels
        const createNode = (index: number, height: number) => {
            let col = index - ( 2**height - 1 );

            if(index >= arr.length || arr[index] == null) {
                // const node = new SentinelNode(index);
                // this.levels[height][col] = node;
                // return node;
                return null;
            }

            let node = new Node(index, arr[index]);
            this.levels[height][col] = node;
            node.left = createNode(leftChild(index), height+1);
            node.right = createNode(rightChild(index), height+1);

            return node;
        }
        createNode(0, 0);

        this.onUpdate()
    }

    toString(): string {
        let str = "";

        for(const level of this.levels) {
            str += level.map(e => e ? e.val : "#").join(",") + "/"
        }

        return str;
    }

    print() {
        console.log("Binary Tree", this);
        console.log(this.toString())
    }

    randomise() {
        const arr = new Array(40).fill(0).map((_, i) => (Math.random() > 0.8) ? null : i)
        arr.unshift(1)
        this.buildFromArray(arr)
    }

    subscribe(f: Function) {
        this.subscriptions.push(f)
    }

    onUpdate() {
        this.subscriptions.forEach(f => f())
    }
}
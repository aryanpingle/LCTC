import BinaryTree, { Node, getLevelCoords } from "./binary-tree";

class Box {
    left: number;
    top: number;
    width: number;
    height: number;

    constructor(left:number, top:number, width:number, height:number) {
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
    }

    fill(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = `rgba(0, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.25)`
        ctx.fillRect(this.left, this.top, this.width, this.height)
        ctx.fill()
    }

    getCenter(): [number, number] {
        return [Math.floor(this.left + this.width/2), Math.floor(this.top + this.height/2)]
    }

    joinByLine(ctx: CanvasRenderingContext2D, box2: Box) {
        ctx.strokeStyle = "black"
        ctx.beginPath()
        ctx.moveTo(...this.getCenter())
        ctx.lineTo(...box2.getCenter())
        ctx.closePath()
        ctx.stroke()
    }
}

class BinaryTreeCanvas {
    canvas: HTMLCanvasElement;
    CANVAS_WIDTH: number;
    CANVAS_HEIGHT: number;
    ctx: CanvasRenderingContext2D;
    BT: BinaryTree;

    constructor(canvas: HTMLCanvasElement, BT: BinaryTree) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d")!;

        this.BT = BT;

        this.CANVAS_HEIGHT = this.canvas.height = this.canvas.clientHeight;
        this.CANVAS_WIDTH = this.canvas.width = this.canvas.clientWidth;

        this.paint();
    }

    setStrokeColor(color:string) {
        this.ctx.strokeStyle = color;
    }

    setFillColor(color:string) {
        this.ctx.fillStyle = color;
    }

    fillRect(x:number, y:number, width:number, height:number) {
        this.ctx.fillRect(x, y, width, height);
    }

    fillCircle(cx:number, cy:number, radius:number) {
        this.ctx.beginPath()
        this.ctx.ellipse(cx, cy, radius, radius, 0, 0, 2*Math.PI);
        this.ctx.closePath()
        this.ctx.fill()
    }

    drawCircle(cx:number, cy:number, radius:number) {
        this.ctx.beginPath()
        this.ctx.ellipse(cx, cy, radius, radius, 0, 0, 2*Math.PI);
        this.ctx.closePath()
        this.ctx.stroke()
    }

    drawLine(x1:number, y1:number, x2:number, y2:number) {
        this.ctx.beginPath()
        this.ctx.moveTo(x1, y1)
        this.ctx.lineTo(x2, y2)
        this.ctx.closePath()
        this.ctx.stroke()
    }

    paint() {
        this.setFillColor("white")
        this.setStrokeColor("black")

        const ROWS = this.BT.height;
        const BLOCK_HEIGHT = Math.round(this.CANVAS_HEIGHT/ROWS);

        const boxes = this.BT.levels.map((row, rowIndex) => {
            const COLS = 2 ** rowIndex;
            const BLOCK_WIDTH = Math.round(this.CANVAS_WIDTH/COLS);

            return row.map((_, colIndex) => new Box(colIndex * BLOCK_WIDTH, rowIndex * BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT))
        })

        for(let row = 0; row < ROWS; ++row) {
            const COLS = 2 ** row;
            const BLOCK_WIDTH = Math.round(this.CANVAS_WIDTH/COLS);
            
            for(let col = 0; col < COLS; ++col) {
                const node = this.BT.levels[row][col];
                if(!node) continue;
                
                const box = boxes[row][col]
                // box.fill(this.ctx)

                // draw lines to children 
                if(node.left) box.joinByLine(this.ctx, boxes[row+1][2*col])
                if(node.right) box.joinByLine(this.ctx, boxes[row+1][2*col + 1])

                // draw the node

                let radius = Math.min(
                    20,
                    Math.floor(Math.min(box.width, box.height) / 3)
                )
                this.paintNode(node, box.getCenter(), radius)
            }
        }
    }

    paintNode(node: Node, center: [number, number], radius: number) {
        this.setFillColor("rgb(192, 192, 255)")
        this.fillCircle(...center, radius)
        this.drawCircle(...center, radius)
    }
}
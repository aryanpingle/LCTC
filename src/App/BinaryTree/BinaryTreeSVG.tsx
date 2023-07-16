import { Component, VNode, h, render } from 'preact';
import { Box, getLetterWidth, linkRef, removeUnit } from '../utils';

import style from './styles.css';

import { GLOBAL_BT } from './globals';
import { leftChild, parent, rightChild } from './binary-tree';

interface Props {}

interface State {
  WIDTH: number;
  HEIGHT: number;
  edges: VNode<SVGLineElement>[];
  nodes: VNode<SVGCircleElement>[];
  texts: VNode<SVGTextElement>[];
}

export default class BinaryTreeSVG extends Component<Props, State> {
  private resizeObserver: ResizeObserver;
  svgElement: SVGElement;
  svgContainer: HTMLElement;
  canvas: HTMLCanvasElement;
  postRenderCallback: Function;

  constructor(props: Props) {
    super(props);

    this.resizeObserver = new ResizeObserver((entries) => {
      this._onResize(entries);
    });

    this.setState({
      WIDTH: 100,
      HEIGHT: 100,
      edges: [],
      nodes: [],
      texts: [],
    });
  }

  componentDidUpdate(
    previousProps: Readonly<Props>,
    previousState: Readonly<State>,
    snapshot: any
  ): void {
    if (!this.postRenderCallback) return;
    this.postRenderCallback.call(null);
    this.postRenderCallback = undefined;
  }

  componentDidMount(): void {
    this.resizeObserver.observe(this.svgContainer);
    this.calculateSize();
    GLOBAL_BT.subscribe(this.buildSVG.bind(this));
  }

  private _onResize(entries: ResizeObserverEntry[]) {
    this.calculateSize();
  }

  calculateSize() {
    this.setState({
      WIDTH: this.svgContainer.clientWidth,
      HEIGHT: this.svgContainer.clientHeight,
    });
    this.buildSVG();
  }

  onNodeKeyDown(event: KeyboardEvent) {
    let nodeIndex = parseInt(
      (event.target as HTMLElement).getAttribute('data-node-index')
    );

    if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
      let childIndex =
        event.code === 'ArrowLeft'
          ? leftChild(nodeIndex)
          : rightChild(nodeIndex);

      if (childIndex in GLOBAL_BT.nodes) {
        // @ts-ignore
        event.target.parentElement.children[childIndex].focus();
        return;
      }

      // no child exists, create one
      // this will cause a rerender, so focus it after render
      this.postRenderCallback = () => {
        // @ts-ignore
        event.target.parentElement.children[childIndex].focus();
      };
      GLOBAL_BT.appendNode(
        nodeIndex,
        event.code === 'ArrowLeft' ? 'left' : 'right',
        '*'
      );
    }
    if (event.code === 'ArrowUp') {
      let parentIndex = parent(nodeIndex);
      if (parentIndex < 0) return;
      // @ts-ignore
      event.target.parentElement.children[parentIndex].focus();
    }
    if (event.code === 'Backspace') {
      // Focus the parent, then delete this node
      let parentIndex = parent(nodeIndex);
      if (parentIndex < 0) return;
      // @ts-ignore
      event.target.parentElement.children[parentIndex].focus();
      GLOBAL_BT.deleteNode(nodeIndex);
    }
  }

  buildSVG(): void {
    const edges: VNode<SVGLineElement>[] = [];
    const nodes: VNode<SVGCircleElement>[] = [];
    const texts: VNode<SVGTextElement>[] = [];

    const CANVAS_HEIGHT = this.state.HEIGHT;
    const CANVAS_WIDTH = this.state.WIDTH;

    const ROWS = GLOBAL_BT.height;
    const BLOCK_HEIGHT = Math.round(CANVAS_HEIGHT / ROWS);

    const FONT_HEIGHT =
      removeUnit(
        window.getComputedStyle(this.svgElement).getPropertyValue('font-size')
      ) / 2;

    const LETTER_WIDTH = getLetterWidth(this.canvas, FONT_HEIGHT);

    const boxes = new Array((1 << GLOBAL_BT.height) - 1)
      .fill(0)
      .map((_, index) => {
        const rowIndex = Math.floor(Math.log2(index + 1));
        const COLS = 2 ** rowIndex;
        const colIndex = rowIndex == 0 ? 0 : index + 1 - COLS;

        const BLOCK_WIDTH = Math.floor(CANVAS_WIDTH / COLS);

        return new Box(
          colIndex * BLOCK_WIDTH,
          rowIndex * BLOCK_HEIGHT,
          BLOCK_WIDTH,
          BLOCK_HEIGHT
        );
      });

    for (let index = 0; index < boxes.length; ++index) {
      const row = Math.floor(Math.log2(index + 1));
      const node = GLOBAL_BT.nodes[index];

      const box = boxes[index];

      // create edges to children

      const [cx, cy] = box.getCenter();
      if (row != ROWS - 1) {
        // left line
        let [x2, y2] = boxes[leftChild(index)].getCenter();
        edges.push(
          <line
            class={`${style.edge} ${
              node && node.left ? style['edge--real'] : ''
            }`}
            x1={cx}
            y1={cy}
            x2={x2}
            y2={y2}
          ></line>
        );

        // right line
        [x2, y2] = boxes[rightChild(index)].getCenter();
        edges.push(
          <line
            class={`${style.edge} ${
              node && node.right ? style['edge--real'] : ''
            }`}
            x1={cx}
            y1={cy}
            x2={x2}
            y2={y2}
          ></line>
        );
      }

      // create the node

      // let radius = 50;
      let radius = Math.min(
        20,
        Math.floor(Math.min(box.width, box.height) / 3)
      );
      nodes.push(
        <circle
          {...(node && { tabindex: 0 })}
          data-node-index={nodes.length}
          class={`${style.node} ${node ? style['node--real'] : ''}`}
          cx={cx}
          cy={cy}
          r={radius}
          onKeyDown={(e) => {
            this.onNodeKeyDown(e);
          }}
        ></circle>
      );
      if (node) {
        texts.push(
          <text
            font-weight={700}
            x={cx - (node.val.toString().length * LETTER_WIDTH) / 2}
            y={cy + FONT_HEIGHT / 2 - FONT_HEIGHT / 8}
          >
            {node.val}
          </text>
        );
      }
    }

    this.setState({
      nodes: nodes,
      edges: edges,
      texts: texts,
    });
  }

  render({}: Props, { WIDTH, HEIGHT, edges, nodes, texts }: State) {
    // console.log('BTSVG render');

    return (
      <div
        className={`${style['svg-container']}`}
        ref={linkRef(this, 'svgContainer')}
      >
        <svg
          ref={linkRef(this, 'svgElement')}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        >
          <g id="group--lines">{...edges || []}</g>
          <g id="group--nodes">{...nodes || []}</g>
          <g id="group--texts">{...texts || []}</g>
        </svg>
        <canvas
          style={{ display: 'none' }}
          ref={linkRef(this, 'canvas')}
        ></canvas>
      </div>
    );
  }
}

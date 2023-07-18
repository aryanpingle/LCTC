import { Component, VNode, h, render } from 'preact';
import { Box, getLetterWidth, linkRef, removeUnit } from '../utils';
import { GLOBAL_BT } from './globals';
import { leftChild, parent, rightChild } from '../DSA/binary-tree';

import style from './styles.css';

interface Props {}

interface State {
  WIDTH: number;
  HEIGHT: number;
  edges: VNode<SVGLineElement>[];
  nodes: VNode<SVGCircleElement>[];
  texts: VNode<SVGTextElement>[];
}

const styles = {
  node: {
    stroke: 'lightgray',
    fill: 'white',
    borderRadius: '100%',
    'outline-offset': '2px',
  },

  'node:not(.node--real)': {
    'user-select': 'none',
    'pointer-events': 'none',
  },

  'node--real': {
    'stroke-width': 2,
    stroke: 'black',
    fill: 'rgb(61, 145, 255)',
  },

  edge: {
    stroke: 'lightgray',
  },

  'edge--real': {
    'stroke-width': 2,
    stroke: 'black',
  },

  text: {
    'user-select': 'none',
    'pointer-events': 'none',
    'font-size': '0.5em',
  },
};

export default class BinaryTreeSVG extends Component<Props, State> {
  svgElement: SVGElement;
  canvas: HTMLCanvasElement;
  postRenderCallback: Function;

  constructor(props: Props) {
    super(props);

    this.setState({
      WIDTH: 100,
      HEIGHT: 100,
      edges: [],
      nodes: [],
      texts: [],
    });
  }

  componentDidMount(): void {
    GLOBAL_BT.subscribe(this.buildSVG.bind(this));
    this.buildSVG();
  }

  componentDidUpdate(
    previousProps: Readonly<Props>,
    previousState: Readonly<State>,
    snapshot: any,
  ): void {
    if (!this.postRenderCallback) return;
    this.postRenderCallback.call(null);
    this.postRenderCallback = undefined;
  }

  onNodeKeyDown(event: KeyboardEvent) {
    let nodeIndex = parseInt(
      (event.target as HTMLElement).getAttribute('data-node-index'),
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
        '*',
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

    const BLOCK = 50;

    const ROWS = GLOBAL_BT.height;

    const FINAL_WIDTH = BLOCK * (2 ** GLOBAL_BT.height - 1);
    const BLOCK_HEIGHT = Math.round(FINAL_WIDTH / ROWS);

    const FONT_HEIGHT =
      removeUnit(
        window.getComputedStyle(this.svgElement).getPropertyValue('font-size'),
      ) / 2;

    const LETTER_WIDTH = getLetterWidth(this.canvas, FONT_HEIGHT);

    const boxes = new Array(2 ** GLOBAL_BT.height - 1)
      .fill(0)
      .map((_, index) => {
        const rowIndex = Math.floor(Math.log2(index + 1));
        const COLS = 2 ** rowIndex;
        const colIndex = rowIndex == 0 ? 0 : index + 1 - COLS;

        return new Box(
          BLOCK * colIndex * 2 ** (ROWS - rowIndex),
          rowIndex * BLOCK_HEIGHT,
          BLOCK * (2 ** (ROWS - rowIndex) - 1),
          BLOCK_HEIGHT,
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
            style={{
              ...styles.edge,
              ...(node && node.left && styles['edge--real']),
            }}
          ></line>,
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
            style={{
              ...styles.edge,
              ...(node && node.right && styles['edge--real']),
            }}
          ></line>,
        );
      }

      // create the node

      let radius = Math.round(BLOCK * 0.45);
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
          style={{
            ...styles.node,
            ...(node && styles['node--real']),
          }}
        ></circle>,
      );
      if (node) {
        texts.push(
          <text
            font-weight={700}
            x={cx - (node.val.toString().length * LETTER_WIDTH) / 2}
            y={cy + FONT_HEIGHT / 2 - FONT_HEIGHT / 8}
          >
            {node.val}
          </text>,
        );
      }
    }

    this.setState({
      WIDTH: BLOCK * (2 ** GLOBAL_BT.height - 1),
      HEIGHT: BLOCK_HEIGHT * GLOBAL_BT.height,
      nodes: nodes,
      edges: edges,
      texts: texts,
    });
  }

  render({}: Props, { WIDTH, HEIGHT, edges, nodes, texts }: State) {
    // console.log('BTSVG render');
    const padding = 10;

    return (
      <div
        className={`${style['svg-container']}`}
        ref={linkRef(this, 'svgContainer')}
      >
        <svg
          ref={linkRef(this, 'svgElement')}
          viewBox={`${-padding} ${-padding} ${WIDTH + 2 * padding} ${
            HEIGHT + 2 * padding
          }`}
          style={{
            fontFamily: 'Courier New',
          }}
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

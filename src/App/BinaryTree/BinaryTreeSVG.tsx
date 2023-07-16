import { Component, VNode, h, render } from 'preact';
import { Box, getLetterWidth, linkRef, removeUnit } from '../utils';

import style from './styles.css';

import { GLOBAL_BT } from './globals';

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

  buildSVG(): void {
    const edges: VNode<SVGLineElement>[] = [];
    const nodes: VNode<SVGCircleElement>[] = [];
    const texts: VNode<SVGTextElement>[] = [];

    const BT = GLOBAL_BT;
    const CANVAS_HEIGHT = this.state.HEIGHT;
    const CANVAS_WIDTH = this.state.WIDTH;

    const ROWS = BT.height;
    const BLOCK_HEIGHT = Math.round(CANVAS_HEIGHT / ROWS);

    const FONT_HEIGHT = removeUnit(
      window.getComputedStyle(this.svgElement).getPropertyValue('font-size')
    ) / 2;

    // console.log(FONT_HEIGHT);
    const LETTER_WIDTH = getLetterWidth(this.canvas, FONT_HEIGHT);
    // console.log(LETTER_WIDTH);

    const boxes = BT.levels.map((row, rowIndex) => {
      const COLS = 2 ** rowIndex;
      const BLOCK_WIDTH = Math.floor(CANVAS_WIDTH / COLS);

      return row.map(
        (_, colIndex) =>
          new Box(
            colIndex * BLOCK_WIDTH,
            rowIndex * BLOCK_HEIGHT,
            BLOCK_WIDTH,
            BLOCK_HEIGHT
          )
      );
    });

    for (let row = 0; row < ROWS; ++row) {
      for (let col = 0; col < boxes[row].length; ++col) {
        const node = BT.levels[row][col];
        // if(!node) continue;

        const box = boxes[row][col];

        // create edges to children

        const [x1, y1] = box.getCenter();
        if (row != ROWS - 1) {
          // left line
          let [x2, y2] = boxes[row + 1][2 * col].getCenter();
          edges.push(
            <line
              class={`${style.edge} ${
                node && node.left ? style['edge--real'] : ''
              }`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
            ></line>
          );

          // right line
          [x2, y2] = boxes[row + 1][2 * col + 1].getCenter();
          edges.push(
            <line
              class={`${style.edge} ${
                node && node.right ? style['edge--real'] : ''
              }`}
              x1={x1}
              y1={y1}
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
            class={`${style.node} ${node ? style['node--real'] : ''}`}
            cx={x1}
            cy={y1}
            r={radius}
          ></circle>
        );
        if (node) {
          texts.push(
            <text
              font-weight={700}
              x={x1 - (node.val.toString().length * LETTER_WIDTH) / 2}
              y={y1 + FONT_HEIGHT / 2 - FONT_HEIGHT / 8}
            >
              {node.val}
            </text>
          );
        }
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

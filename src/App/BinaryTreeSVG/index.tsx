import { h, VNode } from 'preact';
import {
  Box,
  getLetterWidth,
  linkRef,
  appendRefToArray,
  removeUnit,
} from '../utils';
import BinaryTree, { leftChild, parent, rightChild } from '../DSA/binary-tree';

import style from './styles.css';
import StructureSVG from '../StructureSVG';
import BTSVGNode from './BTSVGNode';

interface Props {
  BT: BinaryTree;
}

interface State {
  WIDTH: number;
  HEIGHT: number;
  edges: VNode<SVGLineElement>[];
  nodes: VNode<BTSVGNode>[];
}

const styles = {
  edge: {
    stroke: 'lightgray',
  },

  'edge--real': {
    'stroke-width': 2,
    stroke: 'black',
  },
};

export default class BinaryTreeSVG extends StructureSVG<Props, State> {
  svgElement: SVGElement;
  canvas: HTMLCanvasElement;
  postRenderCallback: Function;
  nodeInstances: BTSVGNode[] = [];

  constructor(props: Props) {
    super(props);

    this.setState({
      WIDTH: 100,
      HEIGHT: 100,
      edges: [],
      nodes: [],
    });
  }

  componentDidMount(): void {
    // console.log('this', this);
    this.props.BT.subscribe(this.buildSVG.bind(this));
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

      if (childIndex in this.props.BT.nodes) {
        (
          document.querySelector('#group--nodes').children[childIndex]
            .firstElementChild as HTMLElement
        ).focus();
        return;
      }

      // no child exists, create one
      // this will cause a rerender, so focus it after render
      this.postRenderCallback = () => {
        (
          document.querySelector('#group--nodes').children[childIndex]
            .firstElementChild as HTMLElement
        ).focus();
      };
      this.props.BT.appendNode(
        nodeIndex,
        event.code === 'ArrowLeft' ? 'left' : 'right',
        0,
      );
    }
    if (event.code === 'ArrowUp') {
      let parentIndex = parent(nodeIndex);
      if (parentIndex < 0) return;
      (
        document.querySelector('#group--nodes').children[parentIndex]
          .firstElementChild as HTMLElement
      ).focus();
    }
    if (event.code === 'Backspace') {
      // Focus the parent, then delete this node
      let parentIndex = parent(nodeIndex);
      if (parentIndex < 0) return;
      (
        document.querySelector('#group--nodes').children[parentIndex]
          .firstElementChild as HTMLElement
      ).focus();
      this.props.BT.deleteNode(nodeIndex);
    }
    if (event.code === 'Space') {
      this.nodeInstances[nodeIndex].rotateColor();
    }
    if (event.code === 'Enter') {
      const rawInput = prompt(
        `Enter node value (currently ${this.props.BT.nodes[nodeIndex].val})`,
        '-1',
      );
      if (!rawInput || rawInput.trim() == '') return;
      try {
        const numInput = parseFloat(rawInput);
        this.props.BT.setNodeValue(nodeIndex, numInput);
      } catch (e) {}
    }
    if (event.code.startsWith('Digit')) {
      this.props.BT.setNodeValue(nodeIndex, parseInt(event.code.charAt(5)));
    }
  }

  buildSVG(): void {
    this.nodeInstances = [];
    const edges: VNode<SVGLineElement>[] = [];
    const nodes: VNode<BTSVGNode>[] = [];

    const BLOCK = 50;

    const ROWS = this.props.BT.height;

    const FINAL_WIDTH = BLOCK * (2 ** this.props.BT.height - 1);
    const BLOCK_HEIGHT = Math.round(FINAL_WIDTH / ROWS);

    const FONT_HEIGHT = removeUnit(
      window.getComputedStyle(this.svgElement).getPropertyValue('font-size'),
    );

    const LETTER_WIDTH = getLetterWidth(this.canvas, FONT_HEIGHT);

    const boxes = new Array(2 ** this.props.BT.height - 1)
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
      const node = this.props.BT.nodes[index];

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

      let radius = BLOCK >> 1;
      nodes.push(
        <BTSVGNode
          center={[cx, cy]}
          radius={radius}
          real={!!node}
          index={index}
          text={node && node.val}
          onKeyDown={(e: KeyboardEvent) => {
            this.onNodeKeyDown(e);
          }}
          LETTER_WIDTH={LETTER_WIDTH}
          FONT_HEIGHT={FONT_HEIGHT}
          ref={appendRefToArray(this.nodeInstances)}
        ></BTSVGNode>,
      );
    }

    this.setState({
      WIDTH: BLOCK * (2 ** this.props.BT.height - 1),
      HEIGHT: BLOCK_HEIGHT * this.props.BT.height,
      nodes: nodes,
      edges: edges,
    });
  }

  render({}: Props, { WIDTH, HEIGHT, edges, nodes }: State) {
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
        </svg>
        <canvas
          style={{ display: 'none' }}
          ref={linkRef(this, 'canvas')}
        ></canvas>
      </div>
    );
  }
}

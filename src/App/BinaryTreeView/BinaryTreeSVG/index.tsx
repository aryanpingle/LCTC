import { Component, Fragment, h, VNode } from 'preact';
import {
  Box,
  getLetterWidth,
  linkRef,
  appendRefToArray,
  removeUnit,
} from '../../utils';
import BinaryTree, {
  leftChild,
  parent,
  rightChild,
} from '../../DSA/binary-tree';

import style from './styles.css';
import BTSVGNode from './BTSVGNode';
import ExportSVGToolbar from '../../Components/ExportSVGToolbar';
import Controls, { KeySpan } from '../../Components/Controls';

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

export default class BinaryTreeSVG extends Component<Props, State> {
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
    // prettier-ignore
    const LMB = <svg fill="#000000" version="1.1" width="800px" height="800px" viewBox="0 0 356.572 356.572">
      <path d="M181.563,0C120.762,0,59.215,30.525,59.215,88.873V237.5c0,65.658,53.412,119.071,119.071,119.071 c65.658,0,119.07-53.413,119.07-119.071V88.873C297.356,27.809,237.336,0,181.563,0z M274.945,237.5 c0,53.303-43.362,96.657-96.659,96.657c-53.299,0-96.657-43.354-96.657-96.657v-69.513c20.014,6.055,57.685,15.215,102.221,15.215 c28.515,0,59.831-3.809,91.095-14.567V237.5z M274.945,144.794c-81.683,31.233-168.353,7.716-193.316-0.364V88.873 c0-43.168,51.489-66.46,99.934-66.46c46.481,0,93.382,20.547,93.382,66.46V144.794z M190.893,48.389v81.248 c0,6.187-5.023,11.208-11.206,11.208c-6.185,0-11.207-5.021-11.207-11.208V48.389c0-6.186,5.021-11.207,11.207-11.207 C185.869,37.182,190.893,42.203,190.893,48.389z M154.938,40.068V143.73c-15.879,2.802-62.566-10.271-62.566-10.271 C80.233,41.004,154.938,40.068,154.938,40.068z"/>
    </svg>;

    return (
      <Fragment>
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
        <Controls>
          <Fragment>
            <KeySpan>{LMB}</KeySpan> = Select Node
          </Fragment>
          <Fragment>
            <KeySpan>&larr;</KeySpan> = Left Child
          </Fragment>
          <Fragment>
            <KeySpan>&rarr;</KeySpan> = Right Child
          </Fragment>
          <Fragment>
            <KeySpan>&uarr;</KeySpan> = Parent Node
          </Fragment>
          <Fragment>
            <KeySpan>Space</KeySpan> = Highlight
          </Fragment>
          <Fragment>
            <KeySpan>Tab &#8644;</KeySpan> = Level Order Traverse
          </Fragment>
          <Fragment>
            <KeySpan>Bksp &#x232b;</KeySpan> = Delete
          </Fragment>
          <Fragment>
            <KeySpan>Enter</KeySpan> = Edit Value
          </Fragment>
        </Controls>
        <ExportSVGToolbar svgElement={this.svgElement}></ExportSVGToolbar>
      </Fragment>
    );
  }
}

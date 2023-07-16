import { Component, Fragment, h, render } from 'preact';

import BinaryTree, { validateBinaryTree } from './BinaryTree/binary-tree';
import BinaryTreeSVG from './BinaryTree/BinaryTreeSVG';

import './styles.css';

import { GLOBAL_BT } from './BinaryTree/globals';

interface Props {}

interface State {}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    GLOBAL_BT.randomise();
  }

  private inputChanged = (event: Event) => {
    let text = (event.target as HTMLInputElement).value;
    try {
      let arr = JSON.parse(text);
      if (Array.isArray(arr)) {
        // && validateBinaryTree(arr)) {
        GLOBAL_BT.buildFromArray(arr);
      }
    } catch (e: any) {
      return;
    }
  };

  render(props: Props, state: State) {
    return (
      <Fragment>
        <main>
          <BinaryTreeSVG></BinaryTreeSVG>
        </main>
        <aside>
          <input name="bt-input" onChange={this.inputChanged}></input>
          <button
            onClick={(e) => {
              GLOBAL_BT.randomise();
            }}
          >
            Randomize
          </button>
          <div className="options-container"></div>
        </aside>
      </Fragment>
    );
  }
}

render(<App />, document.body);

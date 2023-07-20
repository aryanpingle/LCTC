import { Component, Fragment, VNode, h, render } from 'preact';
import BinaryTreeSVG from './BinaryTreeSVG';
import ExportCode from './Components/ExportCode';
import ExportSVGToolbar from './Components/ExportSVGToolbar';

import './styles.css';
import InputSection from './Components/InputSection';
import Controls from './Components/Controls';
import { DataStructure } from './DSA';
import BinaryTree from './DSA/binary-tree';

interface Props {
  structureType: 'binarytree' | 'matrix' | 'linkedlist';
}

interface State {}

class App extends Component<Props, State> {
  structure: DataStructure<any>;

  constructor(props: Props) {
    super(props);
  }

  render({ structureType }: Props, state: State) {
    console.log('App rerender');

    if (structureType === 'binarytree') {
      this.structure = new BinaryTree();
    } else {
      // IDK
    }

    return (
      <Fragment>
        <main>
          {structureType === 'binarytree' ? (
            <BinaryTreeSVG BT={this.structure as BinaryTree}></BinaryTreeSVG>
          ) : (
            'IDK'
          )}
          <ExportSVGToolbar></ExportSVGToolbar>
        </main>
        <aside>
          <h1>{this.structure.getName()}</h1>
          <Controls></Controls>
          <InputSection structure={this.structure}></InputSection>
          <ExportCode structure={this.structure}></ExportCode>
          <div className="options-container"></div>
          <footer>made by Aryan Pingle</footer>
        </aside>
      </Fragment>
    );
  }
}

render(<App structureType="binarytree" />, document.body);

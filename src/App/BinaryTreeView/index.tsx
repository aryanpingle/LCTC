import { h, Component, Fragment } from 'preact';
import BinaryTree from '../DSA/binary-tree';
import ExportSVGToolbar from '../Components/ExportSVGToolbar';
import BinaryTreeSVG from './BinaryTreeSVG';
import Controls from '../Components/Controls';
import ExportCode from '../Components/ExportCode';

import { ExportOptionsType } from '../DSA/binary-tree';
import Select from '../Components/Select';

interface Props {}

interface State {}

export default class BinaryTreeView extends Component<Props, State> {
  BT: BinaryTree;

  constructor() {
    super();

    this.BT = new BinaryTree();
  }

  private importFromArray = (inputText: string) => {
    try {
      // Replace commas with spaces, then replace all multiple spaces with a single comma
      inputText = inputText.trim().replace(/,/g, ' ').replace(/\s+/g, ',');
      // Remove brackets
      inputText = inputText.replace(/[\[\]\{\}]/g, '');
      // Replace `*` with null
      inputText = inputText.replace(/\*/g, 'null');

      let arr = JSON.parse(`[${inputText}]`);
      if (Array.isArray(arr)) {
        console.log('Building from', arr);
        this.BT.buildFromArray(arr);
      }
    } catch (e: any) {
      return;
    }
  };

  render() {
    console.log('bruh');

    return (
      <Fragment>
        <main>
          <BinaryTreeSVG BT={this.BT}></BinaryTreeSVG>
        </main>
        <aside>
          <h1>Binary Tree</h1>

          {/* Import from serial array */}
          <section>
            <header>
              <strong>Import From Serial Array</strong>
              Separate numbers using spaces / commas, use <b>null</b> or{' '}
              <b>*</b> to indicate a blank node
            </header>
            <input
              id="code-input"
              onChange={(event) => {
                this.importFromArray((event.target as HTMLInputElement).value);
              }}
            />
            {this.props.children}
          </section>

          {/* Export as code */}
          <ExportCode structure={this.BT}>
            <Select
              name="language"
              options={
                {
                  python: 'Python',
                  java: 'Java',
                  'c++': 'C++',
                  javascript: 'Javascript',
                } as Record<ExportOptionsType['language'], any>
              }
            ></Select>
            <Select
              name="asArray"
              options={
                {
                  'array-of-values': 'Array of values',
                  nodes: 'Nodes',
                } as Record<ExportOptionsType['asArray'], any>
              }
            ></Select>
          </ExportCode>
          <footer>made by Aryan Pingle</footer>
        </aside>
      </Fragment>
    );
  }
}

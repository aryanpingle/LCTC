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
        this.BT.buildFromSerialArray(arr);
      }
    } catch (e: any) {
      // TODO: Return an error into the UI so the user knows
    }
  };

  private importFromLeetCodeArray = (inputText: string) => {
    try {
      // Replace commas with spaces, then replace all multiple spaces with a single comma
      inputText = inputText.trim().replace(/,/g, ' ').replace(/\s+/g, ',');
      // Remove brackets
      inputText = inputText.replace(/[\[\]\{\}]/g, '');

      let arr = JSON.parse(`[${inputText}]`);
      if (Array.isArray(arr)) {
        console.log('Building from', arr);
        this.BT.buildFromLeetCodeArray(arr);
      }
    } catch (e: any) {
      // TODO: Return an error into the UI so the user knows
    }
  };

  render() {
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

          {/* Import from array, LeetCode style */}
          <section>
            <header>
              <strong>Import From Array (LeetCode)</strong>
              Use <b>null</b> for blank nodes. Children of blank nodes are
              omitted, which makes the array smaller.{' '}
              <a href="https://support.leetcode.com/hc/en-us/articles/360011883654-What-does-1-null-2-3-mean-in-binary-tree-representation-">
                LeetCode reference for Binary Tree representation
              </a>
              .
            </header>
            <input
              onChange={(event) => {
                this.importFromLeetCodeArray(
                  (event.target as HTMLInputElement).value,
                );
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
              name="exportType"
              options={
                {
                  leetcode: 'LeetCode Testcases',
                  serial: 'Serial Array',
                  nodes: 'Nodes',
                } as Record<ExportOptionsType['exportType'], any>
              }
            ></Select>
          </ExportCode>
          <footer>made by Aryan Pingle</footer>
        </aside>
      </Fragment>
    );
  }
}

import { Component, Fragment, h, render } from 'preact';
import BinaryTreeSVG from './BinaryTreeSVG';
import ExportTextarea from './ExportTextarea';
import { GLOBAL_BT } from './BinaryTreeSVG/globals';
import ExportSVGToolbar from './ExportSVGToolbar';

import './styles.css';

interface Props {}

interface State {}

class App extends Component<Props, State> {
  offscreenDownloadButton: HTMLLinkElement;

  constructor(props: Props) {
    super(props);
  }

  private inputChanged = (event: Event) => {
    let text = (event.target as HTMLInputElement).value;
    try {
      let arr = JSON.parse(text);
      if (Array.isArray(arr)) GLOBAL_BT.buildFromArray(arr);
    } catch (e: any) {
      return;
    }
  };

  render(props: Props, state: State) {
    console.log("App rerender");

    return (
      <Fragment>
        <main>
          <BinaryTreeSVG></BinaryTreeSVG>
          <ExportSVGToolbar></ExportSVGToolbar>
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
          <ExportTextarea></ExportTextarea>
          <div className="options-container"></div>
        </aside>
      </Fragment>
    );
  }
}

render(<App />, document.body);

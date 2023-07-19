import { Component, Fragment, h, render } from 'preact';
import BinaryTreeSVG from './BinaryTreeSVG';
import ExportSection from './Components/ExportSection';
import { GLOBAL_BT } from './BinaryTreeSVG/globals';
import ExportSVGToolbar from './Components/ExportSVGToolbar';

import './styles.css';
import InputSection from './Components/InputSection';
import Controls from './Components/Controls';

interface Props {}

interface State {}

class App extends Component<Props, State> {
  offscreenDownloadButton: HTMLLinkElement;

  constructor(props: Props) {
    super(props);
  }

  private inputChanged = (inputText: string) => {
    try {
      let arr = JSON.parse(inputText);
      if (Array.isArray(arr)) GLOBAL_BT.buildFromArray(arr);
    } catch (e: any) {
      return;
    }
  };

  render(props: Props, state: State) {
    console.log('App rerender');

    return (
      <Fragment>
        <main>
          <BinaryTreeSVG></BinaryTreeSVG>
          <ExportSVGToolbar></ExportSVGToolbar>
        </main>
        <aside>
          <h1>Binary Trees</h1>
          <Controls></Controls>
          <InputSection onInputChange={this.inputChanged}></InputSection>
          <button
            onClick={(e) => {
              GLOBAL_BT.randomise();
            }}
          >
            Randomize
          </button>
          <ExportSection></ExportSection>
          <div className="options-container"></div>
          <footer>made by Aryan Pingle</footer>
        </aside>
      </Fragment>
    );
  }
}

render(<App />, document.body);

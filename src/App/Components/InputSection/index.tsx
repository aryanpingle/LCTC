import { h, Component } from 'preact';

import styles from './styles.css';
import { DataStructure } from '../../DSA';

interface Props {
  structure: DataStructure<any>;
}

interface State {}

export default class InputSection extends Component<Props, State> {
  private inputChanged = (inputText: string) => {
    try {
      let arr = JSON.parse(inputText);
      if (Array.isArray(arr)) this.props.structure.buildFromArray(arr);
    } catch (e: any) {
      return;
    }
  };

  render() {
    return (
      <section>
        <header>
          <strong>Input Array</strong>
          Use square brackets for arrays eg: [1, 2, null, 3]
        </header>
        <input
          class={styles['code-input']}
          id="code-input"
          onChange={(event) => {
            this.inputChanged((event.target as HTMLInputElement).value);
          }}
        />
      </section>
    );
  }
}

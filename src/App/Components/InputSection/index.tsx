import { h, Component } from 'preact';

import styles from './styles.css';

interface Props {
  onInputChange: Function;
}

interface State {}

export default class InputSection extends Component<Props, State> {
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
            this.props.onInputChange((event.target as HTMLInputElement).value);
          }}
        />
      </section>
    );
  }
}

import { h, Component } from 'preact';
import { GLOBAL_BT } from '../../BinaryTreeSVG/globals';

import styles from './style.css';

interface Props {}

export default class ExportSection extends Component<Props, any> {
  constructor(props: Props) {
    super(props);

    GLOBAL_BT.subscribe(() => {
      this.forceUpdate();
    });
  }

  render() {
    return (
      <section>
        <header>
          <strong>Export</strong>
        </header>
        <div class={styles['export-options']}>
          {/* Python */}
          <input checked type="radio" id="lang-python" name="export-option" />
          <label
            tabIndex={0}
            for="lang-python"
            class={styles['export-option-label']}
          >
            <img src="/images/python.png" alt="" />
          </label>
          {/* Java */}
          <input type="radio" id="lang-java" name="export-option" />
          <label
            tabIndex={0}
            for="lang-java"
            class={styles['export-option-label']}
          >
            <img src="/images/java.png" alt="" />
          </label>
          {/* C++ */}
          <input type="radio" id="lang-c++" name="export-option" />
          <label
            tabIndex={0}
            for="lang-c++"
            class={styles['export-option-label']}
          >
            <img src="/images/C++.png" alt="" />
          </label>
        </div>
        <pre class={styles['export-code']}>{GLOBAL_BT.toString()}</pre>
      </section>
    );
  }
}

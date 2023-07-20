import { h, Component } from 'preact';

import styles from './style.css';
import { DataStructure } from '../../DSA';

interface Props {
  structure: DataStructure<any>;
}

export default class ExportCode extends Component<Props, any> {
  constructor(props: Props) {
    super(props);

    this.props.structure.subscribe(() => {
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
        <pre class={styles['export-code']}>
          {this.props.structure.toString()}
        </pre>
      </section>
    );
  }
}

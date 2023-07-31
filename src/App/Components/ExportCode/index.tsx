import { h, Component, VNode, Fragment } from 'preact';

import styles from './style.css';
import { DataStructure } from '../../DSA';

interface Props {
  structure: DataStructure;
}

enum CopyText {
  default = 'copy',
  copied = 'copied',
}

export default class ExportCode extends Component<Props, any> {
  constructor(props: Props) {
    super(props);

    this.props.structure.subscribe(() => {
      this.updateCode();
    });
  }

  componentDidMount(): void {
    this.updateCode();
  }

  getFormData() {
    let form = document.querySelector('#export-form') as HTMLFormElement;
    if (!form) return {};
    let formData = new FormData(form);

    return Object.fromEntries(formData);
  }

  updateCode() {
    document.querySelector('#export-code').textContent =
      this.props.structure.exportCode(this.getFormData());
    document.querySelector(`.${styles['copy-button']}`).textContent =
      CopyText.default;
  }

  copyCode = () => {
    if (!navigator || !navigator.clipboard) return;
    navigator.clipboard.writeText(
      this.props.structure.exportCode(this.getFormData()),
    );
    document.querySelector(`.${styles['copy-button']}`).textContent =
      CopyText.copied;
  };

  render() {
    return (
      <section>
        <header>
          <strong>Export</strong>
        </header>
        <form
          onChange={() => {
            this.updateCode();
          }}
          id="export-form"
          action=""
          class={styles['export-options']}
        >
          {this.props.children}
        </form>
        <div class={styles['export-code-container']}>
          <button
            class={styles['copy-button']}
            onClick={() => {
              this.copyCode();
            }}
          >
            {CopyText.default}
          </button>
          <pre id="export-code" class={styles['export-code']}></pre>
        </div>
      </section>
    );
  }
}

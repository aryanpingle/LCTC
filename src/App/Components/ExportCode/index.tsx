import { h, Component, VNode, Fragment } from 'preact';

import styles from './style.css';
import { DataStructure, AnyExportOptions } from '../../DSA';

interface Props {
  structure: DataStructure<any>;
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

  // We'll assume everything is a radio

  renderFromExportOption(): VNode[] {
    const formElements: VNode[] = [];

    // Get the export options (will be generic)
    const exportOption: AnyExportOptions =
      this.props.structure.getExportOptions();
    for (const [key, values] of Object.entries(exportOption)) {
      const optionsRow: VNode[] = [<span>{key}: </span>];

      for (let counter = 0; counter < values.length; ++counter) {
        let val = values[counter];
        let id = `${key}_${counter}`;
        optionsRow.push(
          <Fragment>
            <input
              type="radio"
              id={id}
              name={key}
              value={counter}
              {...(counter === 0 && {
                checked: true,
              })}
            />
            <button
              class={styles['export-option-button']}
              onClick={(event) => {
                event.preventDefault();
                event.stopImmediatePropagation();
                // @ts-ignore
                event.target.previousElementSibling.click();
              }}
            >
              {val}
            </button>
          </Fragment>,
        );
      }

      formElements.push(
        <div class={styles['export-options-category']} id={`export-row-${key}`}>
          {...optionsRow}
        </div>,
      );
    }

    return formElements;
  }

  getFormData() {
    let form = document.querySelector('#export-form') as HTMLFormElement;
    if (!form) return {};
    let formData = new FormData(form);

    let exportObject = {};

    for (const [key, value] of Object.entries(Object.fromEntries(formData))) {
      exportObject[key] = parseInt(value as string);
    }

    return exportObject;
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
          {...this.renderFromExportOption()}
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

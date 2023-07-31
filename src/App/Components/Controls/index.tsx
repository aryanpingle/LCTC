import { h, Component } from 'preact';

import styles from './styles.css';

interface Props {}

interface State {}

export class KeySpan extends Component {
  render() {
    return <span class={styles.key}>{this.props.children}</span>;
  }
}

export default class Controls extends Component<Props, State> {
  render() {
    return (
      <div class={styles['controls-bar']}>
        {(this.props.children as Array<any>).map((val) => (
          <div class={styles['controls-item']}>{val}</div>
        ))}
      </div>
    );
  }
}

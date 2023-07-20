import { h, Component } from 'preact';

import styles from './styles.css';

interface Props {}

interface State {}

export default class Controls extends Component<Props, State> {
  render() {
    return (
      <div class={styles['controls-bar']}>
        <div class={styles['controls-item']}>
          <span class={styles.key}>&larr;</span> = Left Child
        </div>
        <div class={styles['controls-item']}>
          <span class={styles.key}>&rarr;</span> = Right Child
        </div>
        <div class={styles['controls-item']}>
          <span class={styles.key}>&uarr;</span> = Parent Node
        </div>
        <div class={styles['controls-item']}>
          <span class={styles.key}>Space</span> = Highlight
        </div>
        <div class={styles['controls-item']}>
          <span class={styles.key}>Tab &#8644;</span> = Level Order Traverse
        </div>
        <div class={styles['controls-item']}>
          <span class={styles.key}>Bksp &#x232b;</span> = Delete
        </div>
        <div class={styles['controls-item']}>
          <span class={styles.key}>1</span> - <span class={styles.key}>9</span>{' '}
          = Set Number
        </div>
      </div>
    );
  }
}

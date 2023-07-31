import { h, Component } from 'preact';

import styles from './styles.css';

interface Props {
  name: string;
  options: Record<string, any>;
}

interface State {}

export default class Select extends Component<Props, State> {
  render({ name, options }: Props) {
    return (
      <div class={styles['select-container']}>
        <select name={name} class={styles.select}>
          {Object.entries(options).map(([key, value]) => (
            <option value={key}>{value}</option>
          ))}
        </select>
      </div>
    );
  }
}

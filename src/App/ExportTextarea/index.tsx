import { h, Component } from 'preact';
import { GLOBAL_BT } from '../BinaryTreeSVG/globals';

import style from './style.css';

interface Props {}

export default class ExportTextarea extends Component<Props, any> {
  constructor(props: Props) {
    super(props);

    GLOBAL_BT.subscribe(() => {
      this.forceUpdate();
    });
  }

  render() {
    console.log('exporttextarea render');

    return <div class={style.export}>{GLOBAL_BT.toString()}</div>;
  }
}

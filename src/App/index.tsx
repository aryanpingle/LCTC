import { Component, Fragment, VNode, h, render } from 'preact';

import './styles.css';

import BinaryTreeView from './BinaryTreeView';

interface Props {
  structureType: 'binarytree' | 'matrix' | 'linkedlist';
}

interface State {}

class App extends Component<Props, State> {
  render({ structureType }: Props, state: State) {
    console.log('App rerender');

    return structureType == 'binarytree' ? (
      <BinaryTreeView></BinaryTreeView>
    ) : (
      <div>Bruh</div>
    );
  }
}

render(<App structureType="binarytree" />, document.body);

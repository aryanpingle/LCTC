import { Component, h } from 'preact';

import style from './styles.css';

interface Props {
  center: [number, number];
  radius: number;
  real: boolean;
  index?: number;
  text?: string | number;
  onKeyDown?: any;
  LETTER_WIDTH: number;
  FONT_HEIGHT: number;
}

// TODO: LETTER_WIDTH and FONT_HEIGHT should be something like SVGProps

interface State {
  fillColorIndex: number;
}

const styles = {
  node: {
    stroke: 'lightgray',
    fill: 'white',
    borderRadius: '100%',
    'outline-offset': '2px',
  },

  'node--real': {
    'stroke-width': 2,
    stroke: 'black',
  },
};

const fillColors = ['springgreen', 'deeppink'];

export default class BTSVGNode extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      fillColorIndex: 0,
    };
  }

  rotateColor() {
    this.setState({
      fillColorIndex: (this.state.fillColorIndex + 1) % fillColors.length,
    });
  }

  render(
    {
      center,
      radius,
      real,
      index,
      text,
      onKeyDown,
      LETTER_WIDTH,
      FONT_HEIGHT,
    }: Props,
    { fillColorIndex }: State,
  ) {
    return (
      <g>
        <circle
          cx={center[0]}
          cy={center[1]}
          r={radius}
          {...(real && {
            tabindex: 0,
          })}
          class={`${style.node} ${real && style['node--real']}`}
          style={{
            ...styles.node,
            ...(real && {
              fill: fillColors[fillColorIndex],
            }),
            ...(real && styles['node--real']),
          }}
          data-node-index={index}
          onKeyDown={onKeyDown}
        ></circle>
        {real && (
          <text
            x={Math.round(
              center[0] - (text.toString().length * LETTER_WIDTH) / 2,
            )}
            y={Math.round(center[1] + FONT_HEIGHT / 2 - FONT_HEIGHT / 8)}
            style={{ fontWeight: 700 }}
            font-size={FONT_HEIGHT}
          >
            {text}
          </text>
        )}
      </g>
    );
  }
}

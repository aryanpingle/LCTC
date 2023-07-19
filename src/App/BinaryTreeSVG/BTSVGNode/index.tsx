import { h } from 'preact';

import style from './styles.css';

interface Props {
  center: [number, number];
  radius: number;
  real: boolean;
  index?: number;
  text?: string | number;
  onKeyDown?: any;
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
    fill: 'springgreen',
  },
};

export default function getBTSVGNode(
  { center, radius, real, index, text, onKeyDown }: Props,
  LETTER_WIDTH: number,
  FONT_HEIGHT: number,
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

import { h, Component } from 'preact';
import { linkRef } from '../../utils';

import style from './styles.css';
import StructureSVG from '../../StructureSVG';

interface Props {}

interface State {}

export default class ExportSVGToolbar extends Component<Props, State> {
  offscreenLink: HTMLLinkElement;
  image: HTMLImageElement;
  offscreenCanvas: HTMLCanvasElement;

  constructor(props: Props) {
    super(props);
  }

  downloadImage(codec: 'png' | 'jpeg' | 'webp') {
    this.image = new Image();
    this.image.src = StructureSVG.singletonInstance.getSVGBlob();
    this.image.onload = () => {
      this.offscreenCanvas.width = 1000;
      this.offscreenCanvas.height = 1000;
      const ctx = this.offscreenCanvas.getContext('2d');
      // If it's JPEG, set background color to white
      if (codec === 'jpeg') {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 1000, 1000);
      }
      ctx.drawImage(this.image, 0, 0, 1000, 1000);
      const imagedata = this.offscreenCanvas.toDataURL(`image/${codec}`);
      this.offscreenLink.href = imagedata;
      this.offscreenLink.click();
    };
  }

  downloadSVG() {
    console.log(this.offscreenLink);
    this.offscreenLink.href = StructureSVG.singletonInstance.getSVGBlob();
    this.offscreenLink.click();
  }

  render() {
    console.log(this.props);

    return (
      <div class={style['export-toolbar']}>
        <button
          onClick={() => {
            this.downloadSVG();
          }}
        >
          SVG
        </button>
        <button
          onClick={() => {
            this.downloadImage('png');
          }}
        >
          PNG
        </button>
        <button
          onClick={() => {
            this.downloadImage('jpeg');
          }}
        >
          JPEG
        </button>
        {/* Offscreen elements */}
        <a
          href=""
          download="data-structure"
          ref={linkRef(this, 'offscreenLink')}
          style={{ display: 'none' }}
        >
          Download SVG
        </a>
        <canvas
          style={{ display: 'none' }}
          ref={linkRef(this, 'offscreenCanvas')}
        ></canvas>
      </div>
    );
  }
}

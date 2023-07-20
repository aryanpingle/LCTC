import { h, Component } from 'preact';

export default abstract class StructureSVG<Props, State> extends Component<
  Props,
  State
> {
  static singletonInstance: StructureSVG<any, any>;

  abstract svgElement: SVGElement;

  constructor(props: Props) {
    super(props);

    StructureSVG.singletonInstance = this;
  }

  getSVGBase64(): string {
    let SVGstring = new XMLSerializer().serializeToString(this.svgElement);
    return window.btoa(SVGstring);
  }

  getSVGBlob(): string {
    return `data:image/svg+xml;base64,${this.getSVGBase64()}`;
  }
}

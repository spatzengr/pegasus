import SliderView from "../Items/SliderView";

export default class TpaCurveItemView extends SliderView {
  constructor(props) {
    super(props);
    this.notifyDirty = props.notifyDirty;
    this.updateCurve = props.updateCurve;
    this.parser = parseInt;
    this.state = {
      isDirty: false,
      inputVal: this.props.item.current
    };
  }
  updateValue(newVal) {
    this.props.item.current = newVal;
    this.setState({ isDirty: true, inputVal: newVal });
    this.updateCurve(this.state).then(() => this.setState({ isDirty: false }));
  }
}

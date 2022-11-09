class StrengthMeter extends React.Component {
    constructor(props) {
      super(props);
      this.state = { strength: 0 };
    }
    handleChange = (input) => {
      var { feedback, score} = zxcvbn(input);
      
      this.setState({
        phrase: feedback.warning,
        strength: score
      });
    }
    render() {
      let {strength, phrase } = this.state;
      return (
        <div>
          <StrengthInput eventHandler={this.handleChange} />
          <StrengthIndicator strength={strength} />
          <StrengthLabel
            strength={strength}
            hint={phrase}
          />
        </div>
      );
    }
  }
  class StrengthInput extends React.Component {
    constructor(props) {
      super(props);
      this.state = { value: "" };
    }
    handleChange = (e) => {
      this.setState({ value: e.target.value });
      this.props.eventHandler(e.target.value);
    }
  
    render() {
      return (
        <input
          type="password"
          value={this.state.value}
          onChange={this.handleChange}
        />
      );
    }
  }
  function StrengthLabel(props) {
      return (
        <div>
          <p>Strength: {props.strength}</p>
          <p>{props.hint}</p>
        </div>
      );
  }
  
  function StrengthIndicator(props) {
      var indicator = <span>░░</span>;
      var divArray = Array(4).fill().map((e)=> indicator);
      for (var i = 0; i < props.strength; i++) {
        divArray[i] = <span>▓▓</span>;
      }
      return <div>{divArray}</div>;
  }
  
  ReactDOM.render(<StrengthMeter />, document.getElementById("meter"));
  
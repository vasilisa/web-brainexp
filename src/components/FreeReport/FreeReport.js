import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
// import { CSSTransitionGroup } from 'react-transition-group';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'; // for newer version 

import Question from '../QuizQuestion/Question';
import ProgressBar from '../QuizQuestion/ProgressBar';


class FreeReport extends React.Component {

  constructor(props){
    super(props);

  this.state = {
    report: '',
    answer: '',
    answercheck: false,
    shouldBlockNavigation: false
  }
  
  this.handleSubmit       = this.handleSubmit.bind(this);  
  this.handleChangeReport = this.handleChangeReport.bind(this);
  this._handleRefresh     = this._handleRefresh.bind(this); 
}

componentDidMount() {
  this._isMounted = true;
  document.getElementById("create-course-form").reset();
  document.body.style.background= '#fff';   
  this.setState({
    report: '',
    answer: '',
    answercheck: false,
    shouldBlockNavigation: false}
    )
  window.history.pushState(window.state, null, window.location.href)
  window.onbeforeunload = null;
  window.addEventListener("keypress", e => this._handleRefresh(e));

}

_handleRefresh(e){
  if (e.key==='Enter') {
  
  
  var test = this.state.report
    
  if ((test!=="") && (test!==null) && (test>parseInt(this.props.constraint[0].min)) && (test<parseInt(this.props.constraint[1].max))) 
  {
    this.setState({
    answercheck: true}
    );

    // Send answers to the parent component
    document.getElementById("create-course-form").reset();
    let prev_report = this.state.report 
        this.setState({
          report: ''}
        )

        this.props.onAnswerSelected(this.state.report,this.props.questionId,e) 
  }
  else {
    e.preventDefault()
  }
 
  }
}

_handleGoBack(event){
    window.history.go(1);
  }

handleChangeReport(event) {

  var test = event.target.value

  // console.log(event.target.value)
     
  this.setState({
    report: event.target.value,
    answercheck: false 
    }
    );
  
  if ((test!=="") && (test!==null)) 
  {
    this.setState({
    answercheck: true}
    );
    // console.log(this.state.answercheck)
  }
  else {
    event.preventDefault()
  }

}
  handleSubmit(event) {
        event.preventDefault();
        let prev_report = this.state.report 
        this.setState({
          report: ''}
        )

        this.props.onAnswerSelected(this.state.report,this.props.questionId,event) // this.state.report

        
  }

render() {
  
  return (
    <CSSTransitionGroup
      className="container"
      component="div"
      transitionName="fade"
      transitionEnterTimeout={800}
      transitionLeaveTimeout={500}
      transitionAppear
      transitionAppearTimeout={500}
    >
      <div key={this.props.questionId}>
        <ProgressBar counter={this.props.questionCount} total={this.props.questionTotal}/>
        <br></br>
        <Question content={this.props.question} />
        <div className="col-md-150 pad-600">
        <form id="create-course-form">
        <input type ="text" inputmode="text" value={this.state.report} onKeyDown={this._handleRefresh} onChange={this.handleChangeReport} name="report" id="report" className="form-control" placeholder="" type="text" inputMode="numeric" required />
        </form>
        </div>
      </div>
      <p></p>
      <div className="col-md-150 pad-600">
        <div>
          <button type="button" className="btn btn-save btn-primary pad-20" disabled={!this.state.answercheck} onClick={this.handleSubmit}>Submit
            </button>
          </div>
      </div>
        </CSSTransitionGroup>
  );
}
}

FreeReport.propTypes = {
  answer: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  questionId: PropTypes.number.isRequired,
  questionTotal: PropTypes.number.isRequired,
  onAnswerSelected: PropTypes.func.isRequired,
  constraint: PropTypes.array.isRequired,
  survey_part: PropTypes.number.isRequired,
  surveyTotal: PropTypes.number.isRequired

};

          
export default withRouter(FreeReport);
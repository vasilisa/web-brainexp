import React from 'react';
import { Button } from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import { API_URL } from '../../config';
import { handleResponse } from '../helpers';

import './Survey.css';


// import other questionnaires the same way
import * as th from '../../questionnaires/th_feedback';
import * as so from '../../questionnaires/so_feedback';
import * as mw from '../../questionnaires/mw_feedback';
import * as scav from '../../questionnaires/scav_feedback';
import * as pm from '../../questionnaires/pm_feedback';
import * as ami from '../../questionnaires/ami_feedback';
import * as bis from '../../questionnaires/bis_feedback';
import * as ocir from '../../questionnaires/ocir_feedback';
import * as iu from '../../questionnaires/iu_feedback'; 
import * as dass from '../../questionnaires/dass_feedback';
import * as ffmrf from '../../questionnaires/ffmrf_feedback';
import * as app from '../../questionnaires/app_feedback';



const survey_names = [
'Treasure Hunt',
'Compulsivity', 
'Space Observer',   
'Impulsivity', 
'Milky Way',    
'Stress', // dass 
'Scavenger', 
'Personality', //fmrf  
'Pirate Market',
'Motivation', // ami    
'Uncertainty', // iu   
'App feedback', // app  
]

const iconnames = [
'treasurehunt_icon.png',
'compulsivity_icon.png', 
'spaceobserver_icon.png', 
'impulsivity_icon.png',
'milkyway_icon.png',   
'stress_icon.png',
'scavenger_icon.png',
'personality_icon.png',
'piratemarket_icon.png',
'motivation_icon.png',
'uncertainty_icon.png',
'appfeedback_icon.png', 
]

var quizData = {
  th: th, 
  ocir: ocir,
  so: so,
  bis: bis,
  mw: mw,
  dass: dass, 
  scav: scav,
  ffmrf: ffmrf,
  pm:pm, 
  ami: ami, 
  iu:iu,
  app: app,
}



// function createQuiz(id,survey_name) {
//      return {
//          id: id,
//          surveytag: survey_name,
//          quizQuestions: quizData[survey_name]
//      };
//  }


class Survey extends React.Component {
  constructor(props){
    super(props);
    
    // Information about a specific block of the Survey: 
    const block_info = {
      surveytag    : this.props.location.state.participant_info.survey_list[0], // First questionnaire in the list 
      surveyname   : survey_names[0], // this.props.location.state.participant_info.survey_names[0],
      survey_names : survey_names, // this.props.location.state.participant_info.survey_names,
      iconnames    : iconnames // this.props.location.state.participant_info.iconnames, 
     }
    
    const n =  this.props.location.state.participant_info.survey_list.length-1;   

    const participant_info = {

      prolific_id           : this.props.location.state.participant_info.prolific_id, 
      participant_id        : this.props.location.state.participant_info.participant_id, 
      survey_list           : this.props.location.state.participant_info.survey_list, 
      TotalBlock            : n, 
      block_number_survey   : this.props.location.state.participant_info.block_number_survey, 
      date_time             : this.props.location.state.participant_info.date_time, 
      date                  : this.props.location.state.participant_info.date, 
      handle                : this.props.location.state.participant_info.handle,
      survey_list           : this.props.location.state.participant_info.survey_list, 
      survey_names          : survey_names, // this.props.location.state.participant_info.survey_names,
      iconnames             : iconnames, // this.props.location.state.participant_info.iconnames
           
  
    }

    
    this.state = {
      participant_info : participant_info,
      block_info       : block_info,
      newblock_frame   : this.props.location.state.newblock_frame,  
      questions        : quizData[participant_info.survey_list[0]].default, // quizData[this.props.location.state.participant_info.survey_list[0]].default,
      finished         : false,
    }

    
    this.getSurveyBlock.bind(this);
    this.redirectToQuiz.bind(this); 
    this.redirectToEnd.bind(this); 
    this._isMounted = false;
    this._handleGoBack.bind(this); 
    this._handleTimeOut.bind(this);  
 
  }

  redirectToQuiz () {
    if((this.props.location.state.participant_info.block_number_survey <= (this.state.participant_info.TotalBlock)))
      
          {           
          if (this.state.newblock_frame){ // TRUE
          this.setState({newblock_frame : false})

          
          this.props.history.push({
           pathname: `/QuizBlock`,
           state: {participant_info: this.state.participant_info,
                   block_info      : this.state.block_info,
                   questions       : this.state.questions,
                 }
          })}
          else // FALSE 
          {
            if (this._isMounted)
            {

              
              if (this.props.location.state.participant_info.block_number_survey===this.state.participant_info.TotalBlock){ // just finished the LAST BLOCK 
              
                // redirect to the final 
                this.setState({finished: true})

              } 
              else if (this.props.location.state.participant_info.block_number_survey<this.state.participant_info.TotalBlock){ // just finished the LAST BLOCK 
              
              const newblocknumber = this.props.location.state.participant_info.block_number_survey + 1
              // console.log(newblocknumber)
              this.getSurveyBlock(newblocknumber,this.state.participant_info.survey_list,this.state.participant_info.survey_names)
              this.setState({newblock_frame: true, participant_info : {...this.state.participant_info, block_number_survey:newblocknumber},})

              }

            }
          }
        }
      }
    
  componentDidMount() { 
  this._isMounted = true;
  document.body.style.background= '#fff'; 
  // this._isMounted && this.getSurveyBlock(this.props.location.state.participant_info.block_number,this.props.location.state.participant_info.survey_list);
    window.history.pushState(window.state, null, window.location.href);
    window.addEventListener('popstate', e => this._handleGoBack(e));
    window.onbeforeunload = this._handleRefresh

  }

  componentWillUnmount() {
    clearTimeout(this._handleTimeOut);
    this._isMounted = false;
  }


  _handleRefresh(evt){
    return false // error message when refresh occurs
  }

  _handleGoBack(event){
    window.history.go(1);
  }

  _handleTimeOut() {
    console.log('Timeout:', this.state)
    setTimeout(() => {
     this.redirectToQuiz()
    }, 1000);
} 

 // Get info about the specific Survey Block: 
 getSurveyBlock(block_number_,survey_list_,survey_name_) {

    // console.log('Block Number Get Survey Block:',block_number_+1)

    const surveytag_block  = survey_list_[block_number_]
    const surveyname_block = survey_name_[block_number_]
    
    console.log('SurveyName Block:',surveyname_block)
 
    this.setState({ loading: true , questions: quizData[survey_list_[block_number_]].default, block_info : {...this.state.block_info, surveytag:surveytag_block, surveyname: surveyname_block}});

}

 redirectToEnd(){

    // Store the cashed data 

    let cashed_ = {}
    if (sessionStorage.hasOwnProperty('cashed')) {
        cashed_ = sessionStorage.getItem('cashed');

        try {
          cashed_ = JSON.parse(cashed_);
          // console.log('parsed cash',cashed_)
        } catch (e) {
          console.log('Cannot parse cashed')
        }
    }

    // Push cashed data to the DB
    var date_time_end = new Date().toLocaleString();

    let body_cashed = {
      'log'          : cashed_,  // this.state.cashed, 
      'date_time'    : this.state.participant_info.date_time, 
      'date_time_end': date_time_end, 
      'log_type'     : 'survey' 
    }

    console.log(body_cashed)

    fetch(`${API_URL}/attempts/save/`+ this.state.participant_info.participant_id + `/` + this.state.participant_info.prolific_id, {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(body_cashed)
    })

      alert("You will now be redirected to the validation page. Please, confirm leaving the page. Thank you!")
      window.location = 'https://app.prolific.co/submissions/complete?cc=67D0ACA0' // + this.props.location.state.participant_info.study_id // CHECK if validation code == stidu id
  }
  
  
render()
  { 
    let text
    let icon_
    if ((this.state.block_info.surveytag === this.props.location.state.participant_info.survey_list[0]) && (this.state.newblock_frame))
    { 
      text = <div className='SurveyIntroText'> <p>Dear Participant,</p>
      <p>Please, now play <span className="bold">Treasure Hunt</span> game in the app.</p>
      <p>You should complete the game <span className="bold">just onc to win 1 star</span>.</p>
      <p>You don't have to complete all 5 stars for the game!</p>
      <p>But first, go through the tutorial carefully.</p>
      <p>Once done, click CONTINUE.</p></div>

    return (
      <div>
      <center> 
      <div className="SurveyButtonContainer">
        <div>
          {text}
        </div> 
        <div className="iconframe">    
          <img className="iconsymbol"  src={require('../../images/treasurehunt_icon.png')} alt='iconsymbol'/> 
        </div>
        <center>
          <Button className="btn btn-save btn-primary pad-20 width=20vh height-8vh" onClick={()=>this.redirectToQuiz()}>
            <span className="bold">CONTINUE</span>
          </Button>
        </center>
      </div>
      </center> 
      </div>);
    } 

     else if ((this.state.block_info.surveytag !== this.props.location.state.participant_info.survey_list[0]) && (this.state.newblock_frame)) 
    { 
        return(<div>{this._handleTimeOut()}</div>);
      }

    else if (this.state.participant_info.block_number_survey === this.state.participant_info.TotalBlock && this.state.finished===true) 
    {
        text = <div className='SurveyIntroText'> <p><span className="bold">You completed all games and surveys!</span></p>
            <br></br>
            <p> Thank you for your help!</p>
            <br></br>
            
            <p>To find more about the Brain Explorer project please click <a href="https://BrainExplorer.net" target="_blank" rel="noopener noreferrer">here</a></p>
            <br></br>
            <p>To get information regarding how to access mental health services please click <a href="https://www.nhs.uk/using-the-nhs/nhs-services/mental-health-services/how-to-access-mental-health-services" target="_blank" rel="noopener noreferrer">here</a></p> 
            <br></br>
            <p>You will now be redirected to the validation page.</p>
            <p>Please, confirm leaving the page if prompted by the browser. Thank you!</p></div>
      
      return (
          <div>
            <center> 
            <div className='SurveyIntroText'>
                {text}  
            </div>
            <div>
              <Button variant="secondary" color="danger" size="lg" className="buttonInstructionFinal" type="submit" id="validate" onClick={() => this.redirectToEnd()}>Validate</Button>
            </div>
            </center>
            </div>
          );        
    }
          
    else if (this.state.block_info.survey_names[this.props.location.state.participant_info.block_number_survey].localeCompare('App feedback'))
    {

          // console.log(this.props.location.state.participant_info.block_number_survey)

          text  = 'Thank you! Please, go back to the app and explore the ' + this.state.block_info.survey_names[this.props.location.state.participant_info.block_number_survey+1] + ' planet now. Again, just complete the game ONCE.'
          icon_ = this.state.block_info.iconnames[this.props.location.state.participant_info.block_number_survey+1]  
        return (
          <div>
            <center> 
            <div className="SurveyButtonContainer">
            <div className='SurveyIntroText'>
              {text}
            </div> 
            <div className="iconframe">    
              <img className="iconsymbol" src={require(`../../images/${icon_}`)} alt='iconsymbol'/> 
            </div>
            <center>
            <Button className="btn btn-save btn-primary pad-20 width=20vh height-8vh" onClick={()=>this.redirectToQuiz()}>
              <span className="bold">CONTINUE</span>
            </Button>
            </center>
          </div>
        </center> 
        </div>);
    }

    else 
    {
      text = 'Thank you! Please, now feel free to explore the app and then continue to the final feedback assignment.'
        return (
      <div>
      <center>
      <div className="SurveyIntroText">
        {text}
      </div>
      <br></br>
      <center>
            <Button className="btn btn-save btn-primary pad-20 width=20vh height-8vh" onClick={()=> this.state.finished ? this.redirectToEnd() : this.redirectToQuiz()}>
              <span className="bold">CONTINUE</span>
            </Button>
            </center>
    </center>
    </div>);
    }        
  }

}

export default withRouter(Survey);
import React from 'react';
import {View} from 'react-native';

import {connect} from 'react-redux';

import PromptSection from './prompts/PromptSection.js';
import CaptionList   from './captions/CaptionList.js';
import SelectImage   from './mediaSelection/SelectImage.js';

class App extends React.Component {
    constructor (props) {
        super (props);
    }

    render = () => {
        if (!this.props.captionSelection && !this.props.imageSelection) {
            return (<PromptSection />)
        } else if (this.props.captionSelection && !this.props.imageSelection) {
            return (<CaptionList />)
        } else if (!this.props.captionSelection && this.props.imageSelection) {
            return (<SelectImage />)
        }
    }

}

const mapStateToProps = state => (
    {imageSelection: state.UploadImageReducer.imageSelection, captionSelection: state.UploadImageReducer.captionSelection}
)

export default connect (mapStateToProps)(App);


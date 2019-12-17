import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Platform,StyleSheet } from 'react-native';

import {connect}             from 'react-redux'; 
import * as uploadImgActions from '../../../storage/actions/uploadMediaActions.js';

import PromptPanel from './PromptPanel.js';

import ImgProcessing from '../mediaHandling/ImageProcessing.js';

const uploadImages = (imgArr, captions, props, platform) => {
      
    ImgProcessing.sendImages (imgArr, platform, {captions, guid: 'A1555'})
    
    props.clearImgSelection (); 
    props.clearCaptions ();
}

const PromptSection = props => (    
    <ScrollView>
        <Text style={styles.titleText}>Add Photos</Text>
        <PromptPanel />
                   
        <TouchableOpacity style={styles.uploadButton} onPress={() => { uploadImages (props.selectedImages, props.captions, props, Platform) }}>
            <Text>Upload Photo(s)</Text>
        </TouchableOpacity>
    </ScrollView>
       
)



const styles = StyleSheet.create (
    {
        titleText: 
            {
                fontWeight: 'bold',
                fontSize: 20,
                justifyContent: 'center',
                textAlign: 'center',
                color: 'grey'
            },
        captionSection: 
            {
                 display: 'flex'
             },
        uploadButton:
             {
                 backgroundColor: '#e300d8',
                 alignItems: 'center',
                 padding: 10,
                 margin: 15,
                 borderRadius: 5
             }
    })

const mapStateToProps = state => {
    const reducer = state.UploadImageReducer;

    return {
                gallery         : reducer.gallery, 
                imageSelection  : reducer.imageSelection, 
                captionSelection: reducer.captionSelection,
                selectedImages  : reducer.selectedImages,
                captions        : reducer.captions
           }
}

const mapDispatchToProps = dispatch => (
    {
        clearImgSelection: () => dispatch (uploadImgActions.clearImgSelection ()),
        clearCaptions    : () => dispatch (uploadImgActions.clearCaptions ())
    }
)

export default connect (mapStateToProps, mapDispatchToProps)(PromptSection);

// arr.filter (el => el === null) 
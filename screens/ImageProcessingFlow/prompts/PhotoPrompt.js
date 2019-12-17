import React from 'react';
import { View, Text, TouchableHighlight, Image, StyleSheet } from 'react-native';

import {connect}             from 'react-redux';
import * as uploadImgActions from '../../../storage/actions/uploadMediaActions.js';

const PhotoPrompt = props => {
    
    addIndexToggleSelection = (key, imageSelect = false) => {
        props.promptIndex (key);
        imageSelect ? props.toggleImages (key) : props.toggleCaptions (key);
    }

    var key      = parseInt (props.promptKey);
    //var imageUri = props.selectedImages[key] ? props.selectedImages[key]._parts[0][1].uri : null;
    var imageUri = props.selectedImages[key] ? props.selectedImages[key].node.image.uri : null;
    console.log (props.selectedImages)
        
    var added = imageUri ? <Image style={styles.imagePreview} source={{uri: imageUri}}/> :
                           <View><Text style={[{fontSize: 70}, styles.addText]}>+</Text>
                           <Text style={[{fontSize: 15}, styles.addText]}>Add</Text></View>;

    return (
    <View style={styles.container}>

            <TouchableHighlight onPress={() => { addIndexToggleSelection (key, true) }}>
                <View style={styles.addBox}>{added}</View>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => { addIndexToggleSelection (key) }}>
                <Text style={styles.captionText}>{ props.captions[key] }</Text>
            </TouchableHighlight>

        </View>
    );  

}

const styles = StyleSheet.create (
    {
        container: 
            {
                display: 'flex',
                flexDirection: 'row'
            },
        addBox: 
            {
                width: 100,
                height: 100,
                borderRadius: 5,
                margin : 10,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 2,
                shadowRadius: 2,   
            },
        addText:
            {
                justifyContent: 'center',
                textAlign: 'center'
            },
        captionText: 
            {
                fontWeight: 'bold',
                top: '44%'
            },
        imagePreview:
            {
                width: 75,
                height: 75
            }

    })

const mapStateToProps = state => (
    {
        selectedImages: state.UploadImageReducer.selectedImages,
        captions      : state.UploadImageReducer.captions
    }
)

const mapDispatchToProps = dispatch => (
    {
        promptIndex   : (key) => dispatch (uploadImgActions.promptIndex (key)),
        toggleImages  : () => dispatch (uploadImgActions.toggleImages ()),
        toggleCaptions: () => dispatch (uploadImgActions.toggleCaptions ())
    }
)

export default connect (mapStateToProps, mapDispatchToProps)(PhotoPrompt);
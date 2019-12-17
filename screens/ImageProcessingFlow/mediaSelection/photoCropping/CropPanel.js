import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

import {connect} from 'react-redux';

const CropPanel = props => (
    <View style={styles.cropPanel}> 
            
        { props.selectedImage && 
        <Image source={ { uri: props.selectedImage.node.image.uri } } style={styles.image} /> 
        }

    </View> 
)

const styles = StyleSheet.create(
        {   
            image:
                {
                    height: 300
                },
            cropPanel: 
                {
                    
                    backgroundColor: '#e1e5eb',
                    height: 300,
                    borderBottomColor: 'black',
                    borderBottomWidth: 10,
                    justifyContent: 'center'
                }
            
        })

const mapStateToProps = state => (
    {selectedImage: state.UploadImageReducer.selectedImage}
)

export default connect (mapStateToProps)(CropPanel);

import React from 'react';
import {
    View,
    Button,
    ScrollView,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';
import { LinearGradient } from 'expo';
import Camera from '../../components/SignUpFlow/Camera'

const styles = {
  imageStyles: {
    justifyContent: 'space-around',
  }
};

export default class SelfiePage extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      defaultUri: 'https://images-na.ssl-images-amazon.com/images/I/61McsadO1OL.jpg'
    }
  }

  handleSelfieSubmit = () => {
    this.props.navigation.navigate('Profile')
  }

  snap = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync({
        quality:1,
        base64:false,
        exif:false,
        onPictureSaved: this.handlePicture,

      });

      console.log(photo)
    }
  };
  handlePicture = (data) => {
    console.log('wwe got data!!')
  }

  render(){
    return(
      <View style={{flex:1, bottom:-40}}>
        <ScrollView>
          <Text>
            This is the selfie page
          </Text>



          <View>
          <Button
            title='Submit selfie'
            onPress={this.handleSelfieSubmit}
          />
          </View>

          <View style={{height:500}}>
          <Camera/>
          </View>
        </ScrollView>
      </View>

      )
  }
}
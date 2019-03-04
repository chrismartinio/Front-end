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
import Camera from '../../components/SignUpFlow/Camera';
import SetProfilePictureAction from '../../storage/actions/SetProfilePictureAction';
import { connect } from 'react-redux'

const styles = {
  imageStyles: {
    justifyContent: 'space-around',
  }
};

class SelfiePage extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      defaultUri: 'https://images-na.ssl-images-amazon.com/images/I/61McsadO1OL.jpg',
      photoData: 'photoExampole'
    }
  }

  handleSelfieSubmit = () => {

    this.props.navigation.navigate('Profile')
  }

  // https://hackernoon.com/replacing-componentwillreceiveprops-with-getderivedstatefromprops-c3956f7ce607
  // we need to integrate static derived props from data for the snap async to work
  //then we need component did update to send the final data to the redux store

  snap = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync({
        quality:1,
        base64:true,
        exif:true,
        onPictureSaved: this.handlePicture,

      });
      this.setState({
        photoData: photo
      })

    }
  };

  static getDerivedStateFromProps(nextProps, prevState){
    if(nextProps !== prevState){
      //return new state in object
      return {someState:nextProps}
    }
    else return null
  }

  componentDidUpdate(prevProps, PrevState){
    if(prevProps !== this.props){
      //perfrom some operation here if we are updating:
    alert('we register a change!')

    this.setState({someState: this.props});
    this.classMethod();
    }
  }

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

const mapStateToProps = (state) => ({
   ...state
})

const mapDispatchToProps = (dispatch) => ({
  SetProfilePictureAction: (payload) => dispatch(SetProfilePictureAction(payload))
})



export default connect(mapStateToProps,mapDispatchToProps)(SelfiePage);
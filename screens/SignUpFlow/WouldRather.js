import react from 'react';
import {
    View, Text
} from 'react-native';
import { LinearGradient } from 'expo';

class WouldRather extends react.Component {

  render(){
    return(
        <LinearGradient
          textStyle={{ color: '#fff' }} colors={['#18cdf6', '#43218c']}
          style={{flex:1}}
        >

        </LinearGradient>
      )
  }
}

export default SpendAWeekend;
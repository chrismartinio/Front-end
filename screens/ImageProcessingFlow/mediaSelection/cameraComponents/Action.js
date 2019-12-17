import React from 'react';
import {Text, Image, View, StyleSheet} from 'react-native';

const Action = props => (
    <View style={{flex: 1}}>
        <Image
      source={{ uri: 'https://cdn.pixabay.com/photo/2017/09/28/08/58/camera-2794769_960_720.png' }}
      style={styles.imageStyles}
      height={36}
      width={48}
      borderRadius={0}
        />
    </View>
)

const styles = StyleSheet.create (
    {
        action: 
            {
                color: 'white',
                justifyContent: 'space-around',
                flex: 0.1,
                alignSelf: 'flex-end',
                alignItems: 'center',
            }
    })

export default Action;
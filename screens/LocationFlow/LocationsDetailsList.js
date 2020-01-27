import React from 'react';
import { Text, StyleSheet, View, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';

const locationsDetailsList = props => {
  return (
    <FlatList
      data={props.data}
      renderItem={({ item }) => {
        return (
          <View style={styles.listItem}>
            <Icon
              style={styles.iconColumn}
              type="font-awesome"
              name="map-marker"
              size={35}
              color="#4b1792"
            />
            <View style={styles.row_cell_item}>
              <Text style={styles.row_name}>{item.name}</Text>
              {item.offer !== '' ? (
                <Text style={styles.row_offer}>{item.offer}</Text>
              ) : null}
            </View>
            <Text style={styles.distanceColumn}>{item.distance} mi</Text>
          </View>
        );
      }}
    />
  );
};

export default locationsDetailsList;

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
    height: 110
  },
  iconColumn: {
    flex: 0,
    fontSize: 15,
    color: 'rgb(75, 23, 146)'
  },
  row_cell_item: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  row_name: {
    flex: 0,
    fontSize: 18,
    paddingLeft: 8,
    paddingRight: 8,
    fontWeight: 'bold',
    color: 'rgb(75, 23, 146)'
  },
  row_offer: {
    flex: 0,
    fontSize: 18,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 2,
    color: 'rgb(72, 185, 240)'
  },
  distanceColumn: {
    flex: 0,
    fontSize: 18,
    color: 'rgb(75, 23, 146)'
  }
});

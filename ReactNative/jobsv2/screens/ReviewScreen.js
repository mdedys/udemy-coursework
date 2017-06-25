import React, { Component } from 'react';
import { View, Text, ScrollView, Linking, Platform } from 'react-native';
import { Button, Card, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { MapView } from 'expo';

class ReviewScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Review Jobs',
    headerRight: (
      <Button
        title='Settings'
        onPress={ () => navigation.navigate('settings') }
        backgroundColor='rgba(0,0,0,0)'
        color='rgba(0,122,255,1)'/>
    ),
    tabBarIcon: ({ tintColor }) => {
      return <Icon name='favorite' size={30} color={tintColor} />
    }
  })

  renderLikedJobs() {
    return this.props.likedJobs.map( job => {

      const { jobkey, company, formattedRelativeTime, url,
        latitude, longitude, jobtitle } = job;

      const initialRegion = {
        longitude: longitude,
        latitude: latitude,
        latitudeDelta: 0.045,
        longitudeDelta: 0.02
      }

      return (
        <Card key={job.jobkey} title={jobtitle}>
          <View style={{ height: 200 }}>
            <MapView
              initialRegion={initialRegion}
              scrollEnabled={false}
              style={{ flex: 1 }}
              cacheEnabled={Platform.OS === 'android'} />
            <View style={styles.detailWrapper}>
              <Text style={styles.italics}>
                { company }
              </Text>
              <Text style={styles.italics}>
                { formattedRelativeTime }
              </Text>
            </View>
            <Button
              title='Apply Now!'
              backgroundColor='#03A9F4'
              onPress={() => Linking.openURL(url)} />
          </View>
        </Card>
      );
    })
  }

  render() {
    return (
      <ScrollView>
        { this.renderLikedJobs() }
      </ScrollView>
    );
  }
}

const styles = {
  detailWrapper: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  italics: {
    fontStyle: 'italic'
  }
}

function mapStateToProps(state) {
  return {
    likedJobs: state.likedJobs
  };
}

export default connect(mapStateToProps)(ReviewScreen);

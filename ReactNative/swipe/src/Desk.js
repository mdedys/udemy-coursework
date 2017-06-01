import React, { Component } from 'react';
import { View, Animated, PanResponder, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get( 'window' ).width;

class Deck extends Component {

  constructor(props) {
    super(props);

    const position = new Animated.ValueXY();

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: () => {
        this.resetPosition();
      }
    });

    this.state = { panResponder, position };
  }

  resetPosition() {

    const { position } = this.state;

    Animated.spring( position, {
      toValue: { x:0, y: 0 }
    }).start();
  }

  getCardStyle() {

    const { position } = this.state;

    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg']
    });

    return {
      ...position.getLayout(),
      transform: [
        { rotate }
      ]
    };
  }

  renderCards() {
    const { panResponder, } = this.state;
    const { data, renderCard } = this.props;

    return data.map( (item, idx) => {

      if ( idx === 0 ) {
        return (
            <Animated.View
              key = {0}
              style = {this.getCardStyle()}
              {...panResponder.panHandlers}>
                { renderCard(item) }
              </Animated.View>
        );
      }

      return renderCard(item);
    });
  }

  render() {

    const { panResponder, position } = this.state;

    return (
      <View>
          { this.renderCards() }
      </View>
    );
  }
}

export default Deck;

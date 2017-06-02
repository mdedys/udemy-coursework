import React, { Component } from 'react';
import { View, Animated, PanResponder, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get( 'window' ).width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class Deck extends Component {

  constructor(props) {
    super(props);

    const position = new Animated.ValueXY();

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {

        if (gesture.dx > SWIPE_THRESHOLD ) {
          this.forceSwipe( 'right' );
        } else if (gesture.dx < -SWIPE_THRESHOLD ) {
          this.forceSwipe( 'left' );
        } else {
          this.resetPosition();
        }
      }
    });

    this.state = { panResponder, position };
  }

  forceSwipe( direction ) {

    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;

    Animated.timing( this.state.position, {
      toValue: { x: x, y: 0 },
      duration: SWIPE_OUT_DURATION
    }).start( () => this.onSwipeCompleted(direction) );
  }

  onSwipeCompleted( direction ) {

    const { onSwipeLeft, onSwipeRight } = this.props;

  }

  resetPosition() {
    Animated.spring( this.state.position, {
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

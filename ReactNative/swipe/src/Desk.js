import React, { Component } from 'react';
import { View, Animated, PanResponder,
  Dimensions, LayoutAnimation, UIManager } from 'react-native';

const SCREEN_WIDTH = Dimensions.get( 'window' ).width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class Deck extends Component {

  static defaultProps = {
    onSwipeRight: () => {} ,
    onSwipeLeft: () => {}
  }

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

    this.state = { panResponder, position, index: 0 };
  }

  componentWillUpdate() {
    // Andriod specific
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental( true );
    LayoutAnimation.spring();
  }

  componentWillReceiveProps(nextProps) {
    if ( nextProps.data !== this.props.data ) {
      this.setState({ index: 0 });
    }
  }

  forceSwipe( direction ) {

    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;

    Animated.timing( this.state.position, {
      toValue: { x: x, y: 0 },
      duration: SWIPE_OUT_DURATION
    }).start( () => this.onSwipeCompleted(direction) );
  }

  onSwipeCompleted( direction ) {

    const { data, onSwipeLeft, onSwipeRight } = this.props;
    const { position, index } = this.state;

    const item = data[index];
    direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);

    position.setValue({ x: 0, y: 0 });
    this.setState({ index: index + 1 });
  }

  resetPosition() {
    Animated.spring( this.state.position, {
      toValue: { x: 0, y: 0 }
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
    const { panResponder, index } = this.state;
    const { data, renderCard, renderNoMoreCards } = this.props;

    if ( index >= data.length ) {
      return renderNoMoreCards();
    }

    return data.map( (item, idx) => {

      if ( idx < index ) {
        return null;
      }

      if ( idx === index ) {
        return (
            <Animated.View
              key = {item.id}
              style = {[this.getCardStyle(), styles.cardStyle]}
              {...panResponder.panHandlers}>
                { renderCard(item) }
            </Animated.View>
        );
      }

      return (
        <Animated.View
          key={item.id}
          style={[styles.cardStyle, { top: 10 * (idx - index) }]}>
          { renderCard(item) }
        </Animated.View>
      );
    }).reverse();
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

const styles = {
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH
  }
};

export default Deck;

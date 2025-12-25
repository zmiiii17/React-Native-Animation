import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SwipeableCard from '../components/SwipeableCard';

// Gunakan require untuk gambar lokal
const INITIAL_CARDS = [
  { id: 1, title: 'Choosing 1', image: require('../../assets/images/Ferrari.jpg') },
  { id: 2, title: 'Choosing 2', image: require('../../assets/images/McLaren.jpg') },
  { id: 3, title: 'Choosing 3', image: require('../../assets/images/Koenigsegg.jpg') },
  { id: 4, title: 'Choosing 4', image: require('../../assets/images/Hennesey.jpg') }, 
];

const Settings = () => {
  const [cards, setCards] = useState(INITIAL_CARDS);

  const rotateCards = () => {
    setCards((prevCards) => {
      const cardsCopy = [...prevCards];
      const movedCard = cardsCopy.pop();

      if (movedCard) {
        const recycledCard = { ...movedCard, id: Date.now() + Math.random() };
        return [recycledCard, ...cardsCopy];
      }
      return prevCards;
    });
  };

  const handleSwipeLeft = (index: number) => {
    console.log('Swipe Kiri (Nope):', cards[index].title);
    rotateCards();
  };

  const handleSwipeRight = (index: number) => {
    console.log('Swipe Kanan (Like):', cards[index].title);
    rotateCards();
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        {cards.map((item, index) => {
          const isTopCard = index === cards.length - 1;
          const stackIndex = cards.length - 1 - index;

          // Hanya tampilkan maksimal 3 kartu tumpukan
          if (stackIndex > 3) return null;

          return (
            <View
              key={item.id}
              style={[
                styles.cardWrapper,
                {
                  zIndex: index,
                  transform: [{ scale: 1 - stackIndex * 0.05 }],
                  opacity: stackIndex === 0 ? 1 : 0.95,
                },
              ]}
              pointerEvents={isTopCard ? 'auto' : 'none'}
            >
              <SwipeableCard
                item={item}
                index={index}
                onSwipeLeft={() => handleSwipeLeft(index)}
                onSwipeRight={() => handleSwipeRight(index)}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWrapper: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Settings;

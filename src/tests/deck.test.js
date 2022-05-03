const jsonData = require('../utils/deck.json');

test('check the deck size, first and last card', () => {
  cards = JSON.parse(JSON.stringify(jsonData.cards));
  expect(cards.length).toBe(52);
  expect(cards[0]).toStrictEqual({ value: 'A', suit: 'spades' });
  expect(cards[51]).toStrictEqual({ value: 'K', suit: 'hearts' });
});

test('correct suit and values', () => {
  cards = JSON.parse(JSON.stringify(jsonData.cards));

  const uniqueCardSuit = cards
    .map((card) => card.suit)
    .filter((value, index, self) => self.indexOf(value) === index);

  expect(uniqueCardSuit).toEqual(['spades', 'diamonds', 'clubs', 'hearts']);

  const uniqueCardValues = cards
    .map((card) => card.value)
    .filter((value, index, self) => self.indexOf(value) === index);

  expect(uniqueCardValues).toEqual([
    'A',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
  ]);
});

import React, { useState, useEffect } from "react";
import cards from "../utils/deck.json";

function Player() {
  enum GameState {
    init,
    userTurn,
    dealerTurn,
  }

  enum Deal {
    user,
    dealer,
    hidden,
  }

  enum Message {
    startGame = "Click start game to begin!",
    hitStand = "Hit or Stand?",
    bust = "Bust!",
    userWin = "You Win!",
    dealerWin = "Dealer Wins!",
    draw = "Draw!",
  }

  const cardData = JSON.parse(JSON.stringify(cards.cards));
  const [deck, setDeck]: any[] = useState(cardData);

  const [userCards, setUserCards]: any[] = useState([]);
  const [userScore, setUserScore] = useState(0);
  const [userCount, setUserCount] = useState(0);

  const [dealerCards, setDealerCards]: any[] = useState([]);
  const [dealerScore, setDealerScore] = useState(0);
  const [dealerCount, setDealerCount] = useState(0);

  const [standCount, setStandCount] = useState(0)

  const [gameState, setGameState] = useState(GameState.init);
  const [message, setMessage] = useState(Message.startGame);

  const startGame = () => {
    drawCard(Deal.user);
    drawCard(Deal.dealer);
    drawCard(Deal.user);
    setGameState(GameState.userTurn);
    setMessage(Message.hitStand);
  };

  const hit = () => {
    drawCard(Deal.user);
  };

  useEffect(() => {
    calculate(userCards, setUserScore);
    setUserCount(userCount + 1);
  }, [userCards]);

  useEffect(() => {
    calculate(dealerCards, setDealerScore);
    setDealerCount(dealerCount + 1);
  }, [dealerCards]);

  useEffect(() => {
    if (userScore === 21) {
      setMessage(Message.userWin);
    } else if (userScore > 21) {
      bust();
    }
  }, [userCount]);


  // 🐛 dealerCount is the culprit 
  useEffect(() => {
    if (gameState === GameState.dealerTurn) {
      if (dealerScore >= 17) {
        checkWin();
      } else {
        drawCard(Deal.dealer);
      }
    }
  }, [dealerCount]);

  const drawCard = (dealType: Deal) => {
    if (deck.length > 0) {
      const randomCardFromDeck = Math.floor(Math.random() * deck.length);
      const card = deck[randomCardFromDeck];
      deck.splice(randomCardFromDeck, 1);
      setDeck([...deck]);

      switch (card.suit) {
        case "spades":
          dealCard(dealType, card.value, "♠");
          break;

        case "diamonds":
          dealCard(dealType, card.value, "♦");
          break;

        case "clubs":
          dealCard(dealType, card.value, "♣");
          break;

        case "hearts":
          dealCard(dealType, card.value, "♥");
          break;

        default:
          break;
      }
    }
  };

  const dealCard = (dealType: Deal, value: string, suit: string) => {
    switch (dealType) {
      case Deal.user:
        userCards.push({ value: value, suit: suit });
        setUserCards([...userCards]);
        break;

      case Deal.dealer:
        dealerCards.push({ value: value, suit: suit });
        setDealerCards([...dealerCards]);
        break;

      default:
        break;
    }
  };

  const calculate = (cards: any[], setScore: any) => {
    let total = 0;
    cards.forEach((card: any) => {
      if (card.value !== "A") {
        switch (card.value) {
          case "K":
            total += 10;
            break;
          case "Q":
            total += 10;
            break;
          case "J":
            total += 10;
            break;
          default:
            total += Number(card.value);
            break;
        }
      }
    });

    const aces = cards.filter((card: any) => {
      return card.value === "A";
    });

    aces.forEach((card: any) => {
      if (total + 11 > 21) {
        total += 1;
      } else if (total + 11 === 21) {
        if (aces.length > 1) {
          total += 1;
        } else {
          total += 11;
        }
      } else {
        total += 11;
      }
    });
    setScore(total);
  };

  const resetGame = () => {
    console.clear();
    setDeck(cardData);

    setUserCards([]);
    setUserScore(0);
    setUserCount(0);

    setDealerCards([]);
    setDealerScore(0);
    setDealerCount(0);
    setMessage(Message.startGame);
  };

  const stand = () => {
    console.log("player is standing");
    setGameState(GameState.dealerTurn);
    drawCard(Deal.dealer);
    setStandCount(standCount + 1);
  };

  const bust = () => {
    setMessage(Message.bust);
  };

  const checkWin = () => {
    if (userScore > dealerScore || dealerScore > 21) {
      setMessage(Message.userWin);
    } else if (dealerScore > userScore) {
      setMessage(Message.dealerWin);
    } else {
      setMessage(Message.draw);
    }
  };

  return (
    <div className="board-container">
      <div className="player-container">
        <h3>Player</h3>
        <h4>Player total: {userScore}</h4>
        <div className="cards-container">
          {userCards.map((card) => {
            const { value, suit } = card;
            return suit === "♠" || suit === "♣" ? (
              <div className="cards">
                <div className="card-value-top-left-black">{value}</div>
                <div className="card-suit-center-black">{suit}</div>
                <div className="card-value-bottom-right-black">{value}</div>
              </div>
            ) : (
              <div className="cards">
                <div className="card-value-top-left-red">{value}</div>
                <div className="card-suit-center-red">{suit}</div>
                <div className="card-value-bottom-right-red">{value}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="player-container">
        <h3>Dealer</h3>
        <h4>Dealer total: {dealerScore}</h4>
        <div className="cards-container">
          {dealerCards.map((card) => {
            const { value, suit } = card;
            return suit === "♠" || suit === "♣" ? (
              <div className="cards">
                <div className="card-value-top-left-black">{value}</div>
                <div className="card-suit-center-black">{suit}</div>
                <div className="card-value-bottom-right-black">{value}</div>
              </div>
            ) : (
              <div className="cards">
                <div className="card-value-top-left-red">{value}</div>
                <div className="card-suit-center-red">{suit}</div>
                <div className="card-value-bottom-right-red">{value}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="user-message">
        <h3>{message}</h3>
        {userScore === 0 &&
          <button type="button" onClick={startGame}>
            Start Game
          </button>
        }
      </div>
      {
        message !== 'Dealer Wins!'
          && message !== 'You Win!'
          && message !== 'Click start game to begin!'
          && message !== 'Bust!'
          && message !== 'Draw!'
          ? (
            <div className="action-buttons">
              <button type="button" onClick={hit}>
                Hit
              </button>
              <button type="button" onClick={stand}>
                Stand
              </button>
            </div>
          ) : (
            <div className="start-reset-buttons">
              <></>
            </div>
          )}

      <button type="button" onClick={resetGame}>
        Reset
      </button>
    </div>
  );
}

export default Player;
// module.exports = Player;

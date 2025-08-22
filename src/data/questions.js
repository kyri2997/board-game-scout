export const questions = [
    {
      id: 1,
      key: "weight",
      component: "WeightQ",
      question: "How much do you know about modern board games?",
      options: [
        {
          id: 1,
          label: "Beginner",
          description: "I know the games that everyone knows",
          examples: "such as... Monopoly, Risk, UNO, Chess",
          averageweight: "up to 1.99"
        },
        {
          id: 2,
          label: "Intermediate",
          description: "I’ve played games other than the classics",
          examples: "such as... Catan, Ticket to Ride, Pandemic, Wingspan",
          averageweight: "2.00 to 2.49"
        },
        {
          id: 3,
          label: "Advanced",
          description: "I have a strong interest in board games",
          examples: "such as... Everdell, Terraforming Mars, 7 Wonders",
          averageweight: "2.5 to 3.49"
        },
        {
          id: 4,
          label: "Expert",
          description: "I like playing some of the most complex games",
          examples: "such as... Ark Nova, Brass Birmingham, Gloomhaven",
          averageweight: "3.5 or more"
        }
      ]
    },
    {
      id: 2,
      key: "type",
      component: "TypeQ",
      question: "Do you prefer card games or board games?",
      options: [
        {
          id: 1,
          label: "Card games (no board)",
          type: "card"
        },
        {
          id: 2,
          label: "Minimalist Board games",
          type: "board-small"
        },
        {
          id: 3,
          label: "Board games which have a big presence on the table",
          type: "board-big"
        },
      ]},
    {
      id: 3,
      key: "playerCount",
      component: "CountQ",
      question: "How many people do you want to play with?",
      options: [
        {
          id: 1,
          label: "Duo - 2 players",
          playerCount: "2"
        },
        {
          id: 2,
          label: "Small group - 3 to 4 players",
          playerCount: "3-4"
        },
        {
          id: 3,
          label: "Medium group - 5 to 6 players",
          playerCount: "5-6"
        },
        {
          id: 4,
          label: "Party - 7 or more players",
          playerCount: "7+"
        },
        {
          id: 5,
          label: "Solo",
          playerCount: "1"
        }
      ]
    },
    {
      id: 4,
      key: "maxPlaytime",
      component: "PlaytimeQ",
      question: "What is the maximum time you are willing to play for?",
      options: [
        {
          id: 1,
          label: "15 minutes or less",
          maxplaytime: "15"
        },
        {
          id: 2,
          label: "30 minutes or less",
          maxplaytime: "30"
        },
        {
          id: 3,
          label: "An hour or less",
          maxplaytime: "60"
        },
        {
          id: 4,
          label: "2 hours or less",
          maxplaytime: "120"
        },
        {
          id: 5,
          label: "No limit",
          maxplaytime: "9999"
        }
      ]
    },
    {
    
        id: 5,
        key: "category",
        component: "CategoryQ",
        question: "What themes or genres do you prefer?",
        options: [
          {
            id: 1,
            label:"No preference/ I don't know",
            // category:""
          },
          {
            id: 2,
            label:"Fantasy/ Mythology",
            // category:""
          },
          {
            id: 3,
            label:"Space/ Science Fiction",
            // category:""
          },
          {
            id: 4,
            label:"Historical",
            // category:""
          },
          {
            id: 5,
            label:"Horror",
            // category:""
          },
          {
            id: 6,
            label:"Abstract",
          // category:""
          },
          {
            id: 7,
            label:"Crime/ Mystery",
          // category:""
          },
          {
            id:8,
            label:"War/ Conflict",
          // category:""
          },
          {
            id: 9,
            label:"Economic/ Trade",
          
          },
          {
            id: 10,
            label:"Racing/ Sports",
          
          }
        ]
      },
    {
    
        id: 6,
        key: "mechanics",
        component: "MechQ",
        question: "What is your favourite game mechanic?",
        options: [
          {
            id: 1,
            label:"No preference/ I don't know",
            mechanic:""
          },
          {
            id: 2,
            label:"Area Control/ Influence",
            // category:""
          },
          {
            id: 3,
            label:"Engine/ Resource Management",
            // category:""
          },
          {
            id: 4,
            label:"Worker Placement",
            // category:""
          },
          {
            id: 5,
            label:"Deck Building",
          // category:""
          },
          {
            id: 6,
            label:"Hidden Roles/Deduction",
          // category:""
          },
          {
            id:7,
            label:"Negotiation",
          // category:""
          },
          {
            id: 8,
            label:"Cooperative Play",
          // category:""
          }
          ,
          {
            id: 9,
            label:"Campaign/ Legacy",
          // category:""
          },
          {
            id: 10,
            label:"Dexterity",
          // category:""
          }
        ]
      },
    
    {
  id: 7,
  key: "favouriteGames",
  component: "FavouriteGamesQ",  // Matches the key in questionComponents
  question: "List your current favourite games (at least 1)",
  options: [],  // You can leave empty or add something relevant if needed
},
    {
  id: 8,
  key: "message",
  component: "MessageQ",  // Matches the key in questionComponents
  question: "Tell us anything else about the kind of recommendation you'd like!",
}
// ,
//     {
//   id: 9,
//   key: "resultsPage",
//   component: "ResultsPage",  // Matches the key in questionComponents
//   question: "Here are your results!",
//   options: [],  // You can leave empty or add something relevant if needed
// }
    ]
  
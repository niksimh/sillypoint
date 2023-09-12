# SillyPoint

SillyPoint is an online multiplayer game based on the game Hand Cricket. It's still under development, so check out the <a href="https://github.com/niksimh/sillypoint/tree/dev">```dev```</a> branch for progress. Below are the rules of the game to get a sense of what this project is working towards. 

## Rules

### Cricket 
This game is based on the sport of cricket. If you are unfamiliar with cricket, visit the following link to get caught up, though you should be fine just reading the rest of this page: https://en.wikipedia.org/wiki/Cricket.

### Gameplay
The game features two innings in which one player bats and another player bowls. Each innings is composed of a sequence of plays (known as balls). During each play, the batter selects a number from one to six. The bowler does the same. Each play lasts for a maximum of fifteen seconds after which a move is selected by the game for players that have not yet selected. If the numbers chosen are different, the batter accumulates the number they put out to their score (known as runs), which starts from zero. If the numbers chosen are the same, then the batter is either out or the bowler has bowled a no ball. A batter has three wickets before their innings is over, and getting out represents losing one wicket. The batter also has thirty balls before their innings is over. So an end-of-innings occurs when either the batter has lost all three wickets or thirty balls have occured. A no ball when the scores put out are the same results in the batter gaining a run while their ball and wicket count stays the same--it's a free run. No balls occur with a certain probability. After the first innings concludes, the two players switch roles. The second batter must accumulate more runs than the first batter to win while also having three wickets and thirty balls to do so. If the runs accumulated are equal, then the game is tied. If players drop out of the game, the computer will automatically takeover for them. When they rejoin, the player resumes control. 

### Toss
The toss starts off the game by determining the order of the turns. One player is designated even and the other odd. The two players independently select a value from one to six. The sum of the chosen values is taken and if even, then the even player gets to choose whether they would like to bat or bowl first, and if odd, then the odd player gets to choose. 

### Game Modes
There are two game modes--public and private games. Public games will result in players matching randomly with another player. Private games result in the ability for two people to play against each other. 

### Player Accounts and the Leaderboard
When playing, a player can play as a guest or they can create an account which they can use to track their progress with respect to the leaderboard. The leaderboard is point-based and resets at the end of each season. The winner of each game earns three points while the loser earns zero points. In the case of a tie, both players earn one point. In the case of a server error, the game is void. Each season lasts for roughly a month. A timer showcasing how long is left until the end of the season is shown on the leaderboard page. Only public games count towards the leaderboard. 


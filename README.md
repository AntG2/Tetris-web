# Russian Square (Tetris) Game

A modern, responsive web-based implementation of the classic Russian Square (Tetris) game with beautiful graphics and smooth animations.

## Features

- **Classic Tetris Gameplay**: All standard Tetris mechanics including piece movement, rotation, line clearing, and scoring
- **Modern UI**: Beautiful dark theme with gradient animations and glassmorphism effects
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Real-time Scoring**: Track your score, lines cleared, and current level
- **Next Piece Preview**: See what piece is coming next
- **Pause/Resume**: Pause the game at any time
- **Game Over Detection**: Automatic game over when pieces reach the top
- **Level Progression**: Speed increases as you clear more lines

## How to Play

1. **Open the Game**: Simply open `index.html` in any modern web browser
2. **Start Playing**: Click "New Game" to begin
3. **Clear Lines**: Arrange falling pieces to create complete horizontal lines
4. **Score Points**: Clear lines to earn points and advance levels
5. **Avoid Game Over**: Don't let pieces stack to the top of the board

## Controls

| Key | Action |
|-----|--------|
| **← →** | Move piece left/right |
| **↓** | Soft drop (move down faster) |
| **↑** | Rotate piece clockwise |
| **Space** | Hard drop (instant drop) |
| **P** | Pause/Resume game |

## Game Mechanics

### Scoring System
- **Line Clear**: 100 points × current level
- **Hard Drop**: 2 points per cell dropped
- **Level Up**: Every 10 lines cleared

### Pieces
The game features all 7 standard Tetris pieces (I, O, T, S, Z, J, L) with unique colors:
- **I Piece** (Cyan): 4-block line
- **O Piece** (Yellow): 2×2 square
- **T Piece** (Purple): T-shaped
- **S Piece** (Green): S-shaped
- **Z Piece** (Red): Z-shaped
- **J Piece** (Blue): J-shaped
- **L Piece** (Orange): L-shaped

### Level System
- **Level 1**: 1000ms drop interval
- **Level 2**: 900ms drop interval
- **Level 3**: 800ms drop interval
- And so on... (100ms faster per level)

## Technical Details

### Built With
- **HTML5**: Semantic structure and canvas elements
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **JavaScript (ES6+)**: Game logic and canvas rendering
- **Google Fonts**: Orbitron font for futuristic appearance

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance
- 60 FPS smooth gameplay
- Optimized canvas rendering
- Efficient collision detection
- Responsive design for all screen sizes

## File Structure

```
Russian Square/
├── index.html      # Main HTML file
├── styles.css      # CSS styling and animations
├── game.js         # Game logic and mechanics
└── README.md       # This file
```

## Running the Game

1. **Download/Clone**: Get all the files in a folder
2. **Open Browser**: Open your preferred web browser
3. **Load File**: Open `index.html` in the browser
4. **Start Playing**: Click "New Game" and enjoy!

No server setup or additional dependencies required - it's a pure client-side game that runs entirely in the browser.

## Customization

You can easily customize the game by modifying:

- **Colors**: Change piece colors in the `pieces` array in `game.js`
- **Speed**: Adjust the `dropInterval` calculation in the `clearLines()` method
- **Scoring**: Modify the scoring system in the `clearLines()` and `hardDrop()` methods
- **Styling**: Update colors, fonts, and animations in `styles.css`

## Future Enhancements

Potential features for future versions:
- Sound effects and background music
- High score tracking with localStorage
- Different game modes (Marathon, Sprint, etc.)
- Hold piece functionality
- Ghost piece preview
- Particle effects for line clears
- Mobile touch controls

## License

This project is open source and available under the MIT License.

---

Enjoy playing Russian Square! 🎮 
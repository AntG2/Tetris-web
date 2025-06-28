class RussianSquare {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextCanvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        this.BOARD_WIDTH = 15;
        this.BOARD_HEIGHT = 20;
        this.BLOCK_SIZE = 30;
        
        this.board = this.createBoard();
        this.currentPiece = null;
        this.nextPiece = null;
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.gameRunning = false;
        this.gamePaused = false;
        this.dropTime = 0;
        this.dropInterval = 1000;
        
        this.pieces = [
            // I piece
            {
                shape: [
                    [1, 1, 1, 1]
                ],
                color: '#00f5ff'
            },
            // O piece
            {
                shape: [
                    [1, 1],
                    [1, 1]
                ],
                color: '#ffff00'
            },
            // T piece
            {
                shape: [
                    [0, 1, 0],
                    [1, 1, 1]
                ],
                color: '#a000f0'
            },
            // S piece
            {
                shape: [
                    [0, 1, 1],
                    [1, 1, 0]
                ],
                color: '#00f000'
            },
            // Z piece
            {
                shape: [
                    [1, 1, 0],
                    [0, 1, 1]
                ],
                color: '#f00000'
            },
            // J piece
            {
                shape: [
                    [1, 0, 0],
                    [1, 1, 1]
                ],
                color: '#0000f0'
            },
            // L piece
            {
                shape: [
                    [0, 0, 1],
                    [1, 1, 1]
                ],
                color: '#ff7f00'
            }
        ];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.spawnPiece();
        this.spawnNextPiece();
        this.updateDisplay();
        this.gameLoop();
    }
    
    createBoard() {
        return Array(this.BOARD_HEIGHT).fill().map(() => Array(this.BOARD_WIDTH).fill(0));
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('newGameBtn').addEventListener('click', () => this.newGame());
        document.getElementById('restartBtn').addEventListener('click', () => this.newGame());
    }
    
    handleKeyPress(e) {
        if (!this.gameRunning || this.gamePaused) return;
        
        switch(e.code) {
            case 'ArrowLeft':
                this.movePiece(-1, 0);
                break;
            case 'ArrowRight':
                this.movePiece(1, 0);
                break;
            case 'ArrowDown':
                this.movePiece(0, 1);
                break;
            case 'ArrowUp':
                this.rotatePiece();
                break;
            case 'Space':
                this.hardDrop();
                break;
            case 'KeyP':
                this.togglePause();
                break;
        }
    }
    
    spawnPiece() {
        if (!this.nextPiece) {
            this.spawnNextPiece();
        }
        
        this.currentPiece = {
            shape: this.nextPiece.shape,
            color: this.nextPiece.color,
            x: Math.floor(this.BOARD_WIDTH / 2) - Math.floor(this.nextPiece.shape[0].length / 2),
            y: 0
        };
        
        this.spawnNextPiece();
        
        if (this.isCollision()) {
            this.gameOver();
        }
    }
    
    spawnNextPiece() {
        const randomIndex = Math.floor(Math.random() * this.pieces.length);
        this.nextPiece = this.pieces[randomIndex];
    }
    
    movePiece(dx, dy) {
        const newX = this.currentPiece.x + dx;
        const newY = this.currentPiece.y + dy;
        
        if (!this.isCollisionAt(newX, newY, this.currentPiece.shape)) {
            this.currentPiece.x = newX;
            this.currentPiece.y = newY;
            return true;
        }
        return false;
    }
    
    rotatePiece() {
        const rotated = this.rotateMatrix(this.currentPiece.shape);
        if (!this.isCollisionAt(this.currentPiece.x, this.currentPiece.y, rotated)) {
            this.currentPiece.shape = rotated;
        }
    }
    
    rotateMatrix(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const rotated = Array(cols).fill().map(() => Array(rows).fill(0));
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                rotated[j][rows - 1 - i] = matrix[i][j];
            }
        }
        
        return rotated;
    }
    
    hardDrop() {
        while (this.movePiece(0, 1)) {
            this.score += 2;
        }
        this.placePiece();
    }
    
    isCollision() {
        return this.isCollisionAt(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape);
    }
    
    isCollisionAt(x, y, shape) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const newX = x + col;
                    const newY = y + row;
                    
                    if (newX < 0 || newX >= this.BOARD_WIDTH || 
                        newY >= this.BOARD_HEIGHT ||
                        (newY >= 0 && this.board[newY][newX])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    placePiece() {
        for (let row = 0; row < this.currentPiece.shape.length; row++) {
            for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
                if (this.currentPiece.shape[row][col]) {
                    const boardX = this.currentPiece.x + col;
                    const boardY = this.currentPiece.y + row;
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentPiece.color;
                    }
                }
            }
        }
        
        this.clearLines();
        this.spawnPiece();
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let row = this.BOARD_HEIGHT - 1; row >= 0; row--) {
            if (this.board[row].every(cell => cell !== 0)) {
                this.board.splice(row, 1);
                this.board.unshift(Array(this.BOARD_WIDTH).fill(0));
                linesCleared++;
                row++; // Check the same row again
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += linesCleared * 100 * this.level;
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
        }
    }
    
    togglePause() {
        if (!this.gameRunning) return;
        
        this.gamePaused = !this.gamePaused;
        const pauseBtn = document.getElementById('pauseBtn');
        pauseBtn.textContent = this.gamePaused ? 'Resume' : 'Pause';
        
        if (this.gamePaused) {
            this.showOverlay('Game Paused', 'Press P to resume');
        } else {
            this.hideOverlay();
        }
    }
    
    newGame() {
        this.board = this.createBoard();
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.dropInterval = 1000;
        this.gameRunning = true;
        this.gamePaused = false;
        this.dropTime = 0;
        
        this.spawnPiece();
        this.spawnNextPiece();
        this.updateDisplay();
        this.hideOverlay();
        
        document.getElementById('pauseBtn').textContent = 'Pause';
    }
    
    gameOver() {
        this.gameRunning = false;
        this.showOverlay('Game Over!', `Final Score: ${this.score}`);
    }
    
    showOverlay(title, message) {
        const overlay = document.getElementById('gameOverlay');
        document.getElementById('overlayTitle').textContent = title;
        document.getElementById('overlayMessage').textContent = message;
        overlay.classList.add('active');
    }
    
    hideOverlay() {
        document.getElementById('gameOverlay').classList.remove('active');
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lines').textContent = this.lines;
        document.getElementById('level').textContent = this.level;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw board
        for (let row = 0; row < this.BOARD_HEIGHT; row++) {
            for (let col = 0; col < this.BOARD_WIDTH; col++) {
                if (this.board[row][col]) {
                    this.drawBlock(this.ctx, col, row, this.board[row][col]);
                }
            }
        }
        
        // Draw current piece
        if (this.currentPiece) {
            for (let row = 0; row < this.currentPiece.shape.length; row++) {
                for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
                    if (this.currentPiece.shape[row][col]) {
                        this.drawBlock(
                            this.ctx,
                            this.currentPiece.x + col,
                            this.currentPiece.y + row,
                            this.currentPiece.color
                        );
                    }
                }
            }
        }
        
        // Draw grid
        this.drawGrid();
        
        // Draw next piece
        this.drawNextPiece();
    }
    
    drawBlock(ctx, x, y, color) {
        const pixelX = x * this.BLOCK_SIZE;
        const pixelY = y * this.BLOCK_SIZE;
        
        // Main block
        ctx.fillStyle = color;
        ctx.fillRect(pixelX, pixelY, this.BLOCK_SIZE, this.BLOCK_SIZE);
        
        // Highlight
        ctx.fillStyle = this.lightenColor(color, 0.3);
        ctx.fillRect(pixelX, pixelY, this.BLOCK_SIZE, 3);
        ctx.fillRect(pixelX, pixelY, 3, this.BLOCK_SIZE);
        
        // Shadow
        ctx.fillStyle = this.darkenColor(color, 0.3);
        ctx.fillRect(pixelX + this.BLOCK_SIZE - 3, pixelY, 3, this.BLOCK_SIZE);
        ctx.fillRect(pixelX, pixelY + this.BLOCK_SIZE - 3, this.BLOCK_SIZE, 3);
        
        // Border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(pixelX, pixelY, this.BLOCK_SIZE, this.BLOCK_SIZE);
    }
    
    drawGrid() {
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x <= this.BOARD_WIDTH; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.BLOCK_SIZE, 0);
            this.ctx.lineTo(x * this.BLOCK_SIZE, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= this.BOARD_HEIGHT; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.BLOCK_SIZE);
            this.ctx.lineTo(this.canvas.width, y * this.BLOCK_SIZE);
            this.ctx.stroke();
        }
    }
    
    drawNextPiece() {
        this.nextCtx.fillStyle = '#000';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        const blockSize = 20;
        const offsetX = (this.nextCanvas.width - this.nextPiece.shape[0].length * blockSize) / 2;
        const offsetY = (this.nextCanvas.height - this.nextPiece.shape.length * blockSize) / 2;
        
        for (let row = 0; row < this.nextPiece.shape.length; row++) {
            for (let col = 0; col < this.nextPiece.shape[row].length; col++) {
                if (this.nextPiece.shape[row][col]) {
                    const x = offsetX + col * blockSize;
                    const y = offsetY + row * blockSize;
                    
                    this.nextCtx.fillStyle = this.nextPiece.color;
                    this.nextCtx.fillRect(x, y, blockSize, blockSize);
                    
                    this.nextCtx.strokeStyle = '#333';
                    this.nextCtx.lineWidth = 1;
                    this.nextCtx.strokeRect(x, y, blockSize, blockSize);
                }
            }
        }
    }
    
    lightenColor(color, amount) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * amount * 100);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    
    darkenColor(color, amount) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * amount * 100);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return '#' + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
            (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
            (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
    }
    
    gameLoop() {
        if (this.gameRunning && !this.gamePaused) {
            this.dropTime += 16; // Assuming 60 FPS
            
            if (this.dropTime >= this.dropInterval) {
                if (!this.movePiece(0, 1)) {
                    this.placePiece();
                }
                this.dropTime = 0;
            }
        }
        
        this.draw();
        this.updateDisplay();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new RussianSquare();
}); 
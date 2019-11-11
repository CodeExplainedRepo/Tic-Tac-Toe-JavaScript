function init(player, OPPONENT){
    // SELECT THE CANVAS
    const canvas = document.getElementById("cvs");
    const ctx = canvas.getContext("2d");

    // load images
    const xImage = new Image();
    xImage.src = "img/X.png";

    const oImage = new Image();
    oImage.src = "img/O.png";

    // GIVE THE FIRST TURN TO HUMAN
    let currentPlayer = player.man;

    // Where we save the moves
    let gameData =  new Array(9);

    // every tile has an id, example: board[1][1] = 5
    // so when we click on a tile we will know teh exact id of the clicked tile.
    let board = [];

    // The board is 3x3
    const column = 3;
    const row = 3;

    // wait for the computer to play
    let WAIT = false;

    // game over
    let GAME_OVER = false;

    // we win the game when we have one of these combinations
    const COMBOS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // A tile is 150x150px
    const SPACE_SIZE = 150;

    // DRAW THE BOARD
    function drawBoard(){
        // first tile has the id=0
        let id = 0;
        
        // draw all the tiles
        for(let i=0; i < row; i++){
            board[i] = [];
            for(let j=0; j < column; j++){
                // give an id from 0 to 8 to the board tiles.
                board[i][j] = id;
                
                let X = j;
                let Y = i;
                // draw tiles
                ctx.strokeStyle = "#000";
                ctx.strokeRect(j * SPACE_SIZE, i * SPACE_SIZE, SPACE_SIZE, SPACE_SIZE);

                // increment the id each time we go to the next tile
                id++
            }
        }
    }
    drawBoard();

    canvas.addEventListener("click", function(event){
        // if game over, exit
        if(GAME_OVER) return;

        // if the computer didn't play yet; wait
        if(WAIT) return;

        console.log(event);

        // X & Y position of mouse click
        let X = event.clientX - canvas.getBoundingClientRect().x;
        let Y = event.clientY - canvas.getBoundingClientRect().y;

        // i & j of the cicked tile
        let i = Math.floor(Y/SPACE_SIZE);
        let j = Math.floor(X/SPACE_SIZE);

        // update the gameData
        if(gameData[getIdOfTile(i, j)]) return;
        gameData[getIdOfTile(i, j)] = currentPlayer;
        
        // draw on board
        drawOnBoard(currentPlayer, i, j);

        // check for winner or tie
        if(isWinner(gameData, currentPlayer)){
            showGameOver(currentPlayer);
            GAME_OVER = true;
            return;
        }

        // Check for draw
        if(isTie(gameData)){
            showGameOver("tie");
            GAME_OVER = true;
            return;
        }

        // RUN AI
        if(OPPONENT == "computer"){

            // if game over, exit
            if(GAME_OVER) return;
        
            WAIT = true;

            let id = AIMove();

            // draw on board
            let IJ = getIJOfTile(id);
            drawOnBoard(player.computer, IJ.i, IJ.j);

            // UPDATE GAME DATA
            gameData[id] = player.computer;

            // check for winner or tie
            if(isWinner(gameData, player.computer)){
                showGameOver(player.computer);
                GAME_OVER = true;
                return;
            }

            // check for draw
            if(isTie(gameData)){
                showGameOver("tie");
                GAME_OVER = true;
                return;
            }

            WAIT = false;
        }else{
            // if the openent is a friend
            // change turn
            currentPlayer = currentPlayer == player.man ? player.friend : player.man;
        
            
        }
    });

    function AIMove(){
        // Check for empty tiles
        let emptyTiles = [];
        for(let i = 0; i < gameData.length; i++){
            if(!gameData[i]){
                emptyTiles.push(i);
            }
        }

        // Check for empty corner tiles
        let emptyCornerTiles = [];
        const corners = [0, 2, 6, 8];
        for(let i = 0; i < emptyTiles.length; i++){
            for( let j = 0; j < corners.length; j++){
                if( corners[j] == emptyTiles[i]){
                    emptyCornerTiles.push(corners[j]);
                }
            }
        }

        // check for empty edge tiles
        let emptyEdgeTiles = [];
        const edges = [1, 3, 5, 7];
        for(let i = 0; i < emptyTiles.length; i++){
            for( let j = 0; j < edges.length; j++){
                if( edges[j] == emptyTiles[i]){
                    emptyEdgeTiles.push(edges[j]);
                }
            }
        }

        // check For Best Move
        
        // FIRST FOR COMPUTER
        for(let i = 0; i < emptyTiles.length; i++){
            let gameDataCopy = [...gameData];
            gameDataCopy[emptyTiles[i]] = player.computer;
            
            if(isWinner(gameDataCopy, player.computer)){
                return emptyTiles[i];
            }
        }
        // THEN FOR MAN
        for(let i = 0; i < emptyTiles.length; i++){
            let gameDataCopy = [...gameData];
            gameDataCopy[emptyTiles[i]] = player.man;
            
            if(isWinner(gameDataCopy, player.man)){
                return emptyTiles[i];
            }
        }

        // center tile id
        let centerTileId = 4;

        // select center tile if it's empty
        for(let i = 0; i < emptyTiles.length; i++){
            if(emptyTiles[i] == centerTileId){
                console.log("empty center");
                return centerTileId;
            }
        }

        // if the user toke the center, then go for a corner tile
        
        // if the user didn't take the center, then go for an edge tile.

        // SELECT a CORNER RANDOMLY
        if(emptyCornerTiles.length > 0){
            let randomIndex = Math.floor(Math.random() * emptyCornerTiles.length);
            id = emptyCornerTiles[randomIndex];
            return id;
        }   

        // SELECT an EDGE RANDOMLY
        if(emptyEdgeTiles.length > 0){
            let randomIndex = Math.floor(Math.random() * emptyEdgeTiles.length);
            id = emptyEdgeTiles[randomIndex];
            return id;
        }


    }

    function getIdOfTile(i, j){
        return board[i][j]; 
    }

    function getIJOfTile(id){
        for(let i=0; i < row; i++){
            for(let j=0; j < column; j++){
                if(board[i][j] == id){
                    let IJ = {
                        i : i,
                        j : j
                    }
                    return IJ;
                }
            }
        }
    }

    function drawOnBoard(player, i, j){
        const img = player == "X" ? xImage : oImage;
        ctx.drawImage(img, j * SPACE_SIZE, i * SPACE_SIZE);
    }

    function isWinner(data, player){

        for(let i = 0; i < COMBOS.length; i++){
            let won = true;

            for(let j = 0; j < COMBOS[i].length; j++){
                let id = COMBOS[i][j];
                won = data[id] == player && won;
            }

            if(won){
                return true;
            }
        }

        return false;
    }

    function isTie(gameData){
        let isBoardFill = true;
        
        for(let i = 0; i < gameData.length; i++){
            isBoardFill = gameData[i] && isBoardFill;
        }

        if(isBoardFill){
            return true;
        }

        return false;
    }

    function showGameOver(player){
        let imgSrc = `img/${player}.png`;
        let message = player == "tie" ? "Oops No Winner" : "The winner is";

        

        gameOverElement.innerHTML = `
            <h1>${message}</h1>
            <img class="winner-img" src=${imgSrc} alt="">
            <div class="play" onclick="location.reload();">PLAY AGAIN!</div>
            `;
        
            gameOverElement.classList.remove("hide");
    }
}
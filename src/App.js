import './App.css';

import Cell from './components/Cell';

import { useState, useEffect, useRef } from 'react';

function App() {
  // {x,y,player}
  const [board, setBoard] = useState([]);
  const [cellRefs,setCellRefs] = useState([]);

  const [match,setMatch] = useState({step: 0, latestMove: {}});

  const boardSize = 3;
  const MAXIMUM_STEP = Math.pow(boardSize,2);

  useEffect(()=>{
    console.log("board ", board);
  },[board])

  const onCellCreated = (x,y, ref) => {
        setBoard(state => {
          const newState = [...state]
          newState.push({ x,y, player: -1 })
          return newState;
        })

        setCellRefs(state => {
          const newState = [...state];
          newState.push(ref);

          return newState;
        })
  }

  // user interaction
  const onCellClick = (x, y, cellRef) => {
    console.log(`match step ${match.step}`);

    // skip if cell has been checked
    if(board[x * boardSize + y].player != -1) return;
    
    // update user step
    setBoard(state => {
      const newState = [...state]
       newState.forEach(cell => {
        if(cell.x == x && cell.y == y){
          cell.player = match.step % 2;
        }
       })
       return newState;
    })

    // render player mark
    cellRef.current.textContent = match.step % 2 == 0 ? "O" : "X"

    setMatch(state=> {
      const newState = {step: state.step + 1,latestMove: {x,y}}
      return newState;
    })

  }

  useEffect(()=>{
    if(match.step == 0) return;

    gameLoop(match)

  },[match])

  // GAME LOGIC

  const gameLoop = (match) => {
    if(checkRow(match.latestMove.x) || checkColumn(match.latestMove.y) || checkDiagonal()){
      alert("player " + (match.step % 2) + " wins");
      resetGame();
      
      return;
    }

    if(match.step == MAXIMUM_STEP){
      alert("Draw!")
      resetGame();
    }

  }

  const resetGame = () => {
    setMatch({step: 0, latestMove: {}})

    // reset player move
    setBoard(state => {
      const newState = [...state]

      return newState.map((state) => {
        state.player = -1;
        return state;
      })
    })

    // reset cell content
    cellRefs.forEach(cellRef => cellRef.current.textContent = "")

  }

  // row
  const checkRow = (x) => {
    const neighborCells = board.filter(cell => cell.x == x)

    console.log("neighborCells " + JSON.stringify(neighborCells));

    return checkSamePlayerFromCells(neighborCells)

  }
  // column
  const checkColumn = (y) => {
    const neighborCells = board.filter(cell => cell.y == y)

    return checkSamePlayerFromCells(neighborCells)
  }

  //diag
  const checkDiagonal = () => {
    // diagonal cells
    const diagCells = board.filter(cell => cell.x == cell.y)
    // anti diagonal cells
    const antiDiagCells = board.filter(cell => cell.x == (boardSize - cell.y - 1))

    return (
      checkSamePlayerFromCells(diagCells) ||
      checkSamePlayerFromCells(antiDiagCells)
    )
  }

  const checkSamePlayerFromCells = (cells) => {
    return cells.every(cell => {
      if(cell.player == -1) return false;

      return cell.player == cells[0].player
    })
  }

  return (
    <div className="App">
      <main>
        <div className="board">
          {
            Array(boardSize).fill(null).map((_, i) => {
              return Array(boardSize).fill(null).map((_, j) => {
                return <Cell key={`${i}-${j}`} x={i} y={j} onCellClick={onCellClick} onInit={onCellCreated}/>
              })
            })
          }
        </div>
      </main>
    </div>
  );
}

export default App;

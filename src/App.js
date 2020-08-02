import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';
import UIfx from 'uifx';
import Footer from './Footer';

import campfire from './audio/crispyFire.wav';
import match from './audio/match.wav';
import lighter from './audio/lighter.wav';
import './App.css';

function App() {
  const numRows = 60;
  const numCols = 100;
  const timeInterval = 80;
  const [grid, setGrid] = useState(generateEmptyGrid());
  const [isRunning, setIsRunning] = useState(false);
  const isRunningRef = useRef();
  isRunningRef.current = isRunning;
  const [numGens, setNumGens] = useState(1);
  const [displayAbout, setDisplayAbout] = useState(false);
  const [displayRules, setDisplayRules] = useState(false);
  const cellSize = 10;
  const [allowAudio, setAllowAudio] = useState(true);

  const matchAudio = new UIfx(match, { volume: 1.0, throttleMs: 100 });
  const lighterAudio = new UIfx(lighter, { volume: 1.0, throttleMs: 100 });

  const generationColors = {
    1: '#FC6400',
    3: '#D73502',
    5: '#B62203',
    7: '#FF7500',
    9: '#FAC000',
    11: '#FFFF33',
    13: '#33FFFF',
  };

  function generateEmptyGrid() {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  }

  const handleCellClick = (i, j) => {
    if (allowAudio) {
      matchAudio.play();
    }
    if (!isRunning) {
      const newGrid = produce(grid, (gridCopy) => {
        if (grid[i][j] === 0) {
          gridCopy[i][j] = 1;
        } else {
          gridCopy[i][j] = 0;
        }
      });
      setGrid(newGrid);
    }
  };

  const campfireAudio = new UIfx(campfire, { volume: 1.0, throttleMs: 100 });

  const generateFlames = () => {
    if (allowAudio) {
      campfireAudio.play();
    }
    const newGrid = produce(grid, (gridCopy) => {
      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
          if (i < numRows && i > numRows - 10 && Math.random() > 0.65) {
            gridCopy[i][j] = 1;
          } else if (
            i < numRows - 9 &&
            i > numRows - 15 &&
            j > 10 &&
            j < numCols - 10 &&
            Math.random() > 0.55
          ) {
            gridCopy[i][j] = 3;
          } else if (
            i === numRows - 15 &&
            j > 15 &&
            j < numCols - 15 &&
            Math.random() > 0.5
          ) {
            gridCopy[i][j] = 5;
          } else if (
            i < numRows - 10 &&
            i > 35 &&
            j > 20 &&
            j < numCols - 20 &&
            Math.random() > 0.85
          ) {
            gridCopy[i][j] = 7;
          } else {
            gridCopy[i][j] = 0;
          }
        }
      }
    });
    setGrid(newGrid);
    setNumGens(1);
    if (!isRunning) {
      toggleRunning();
    }
  };
  const toggleRunning = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      isRunningRef.current = true;
      runGame();
    }
  };

  const runGame = useCallback(() => {
    const neighborPositions = [
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
      [1, 0],
      [-1, 0],
    ];
    const calculateNeighbors = (grid, i, j) => {
      let numNeighbors = 0;
      neighborPositions.forEach(([x, y]) => {
        const newX = x + i;
        const newY = y + j;
        if (newX >= 0 && newX < numRows && newY >= 0 && newY < numCols) {
          if (grid[newX][newY] > 0) {
            numNeighbors += 1;
          }
        }
      });
      return numNeighbors;
    };
    if (!isRunningRef.current) {
      return;
    }
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            const neighbors = calculateNeighbors(g, i, j);
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] > 0) {
              gridCopy[i][j] = ((g[i][j] + 1) % 12) + 1;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });
    setNumGens((prev) => prev + 1);
    setTimeout(runGame, timeInterval);
  }, []);

  function generateRandomGrid() {
    if (allowAudio) {
      lighterAudio.play();
    }
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(
        Array.from(Array(numCols), () => (Math.random() > 0.65 ? 1 : 0))
      );
    }
    setGrid(rows);
    setNumGens(1);
  }
  function handleAbout() {
    if (allowAudio) {
      lighterAudio.play();
    }
    setDisplayAbout(!displayAbout);
  }

  function handleRules() {
    if (allowAudio) {
      lighterAudio.play();
    }
    setDisplayRules(!displayRules);
  }

  function handleAudio() {
    setAllowAudio(!allowAudio);
  }

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div
          className="board"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${numCols}, 1fr)`,
            gridTemplateRows: `repeat(${numRows}, 1fr)`,
            background: 'black',
            border: '1rem solid black',
            margin: '1em',
          }}
        >
          {grid.map((rows, i) =>
            rows.map((cell, j) => (
              <div
                onClick={() => handleCellClick(i, j)}
                key={`cell @[${i},${j}]`}
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor:
                    grid[i][j] > 0 ? generationColors[grid[i][j]] : '#0e1111',
                  border:
                    grid[i][j] > 0
                      ? `1px solid ${generationColors[grid[i][j]]}`
                      : '1px solid #0e1111',
                  borderTopLeftRadius: grid[i][j] > 0 ? '90px' : undefined,
                  borderBottomLeftRadius: grid[i][j] > 0 ? '90px' : undefined,
                  borderBottomRightRadius: grid[i][j] > 0 ? '90px' : undefined,

                  cursor: 'crosshair',
                  transform: grid[i][j] > 0 ? 'rotate(-45deg)' : undefined,
                }}
              />
            ))
          )}
        </div>
        <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          <h1>The Game of Life:</h1>
          <h2>Fire Edition</h2>

          <p>Generations: {numGens}</p>
          <button
            onClick={() => {
              toggleRunning();
              if (allowAudio) {
                lighterAudio.play();
              }
            }}
          >
            {isRunning ? 'Stop' : 'Start'}
          </button>

          <button onClick={generateFlames}>Campfire</button>

          <button
            onClick={() => {
              if (allowAudio) {
                lighterAudio.play();
              }
              setGrid(generateEmptyGrid());
              setNumGens(1);
            }}
          >
            Clear
          </button>
          <button onClick={generateRandomGrid}>Random</button>

          <button onClick={handleAudio}>
            {allowAudio ? 'Turn Audio Off' : 'Allow Audio'}
          </button>
          <button onClick={handleAbout}>About</button>
          {displayAbout && (
            <p>
              The Game of Life is a 'cellular automaton' invented by Cambridge
              mathematician John Conway in 1970. The board contains of cells
              which will live, die or multiply, depending on the rules.
              Depending on the initial layout of the grid, the cells may form
              various patterns as the game advances.
            </p>
          )}
          <button onClick={handleRules}>Rules</button>

          {displayRules && (
            <>
              <h2>The Rules</h2>
              <p>
                If a cell is alive: If it has only 0-1 alive neighbors, it dies,
                representing underpopulation. If it has 2-3 alive neighbors, it
                lives on to the next generation. If it has more than 3 alive
                neighbors, it dies, representing overpopulation.
              </p>
              <p>
                If a cell is dead: If it has exactly 3 alive neighbors, it
                becomes a live cell, representing reproduction. Otherwise, it
                remains dead.
              </p>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;

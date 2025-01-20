import React, { useState } from "react";
import "./App.css";

function App() {
  const [words, setWords] = useState([]); // Words and clues input by user
  const [grid, setGrid] = useState([]); // The crossword grid
  const [clues, setClues] = useState([]); // Clues corresponding to words
  const [isSolved, setIsSolved] = useState(false);
  const [instructionsVisible, setInstructionsVisible] = useState(true);
  const [hints, setHints] = useState(3); // Number of hints allowed

  // Handles input for words and clues
  const handleInputChange = (e, index, field) => {
    const updatedWords = [...words];
    updatedWords[index] = {
      ...updatedWords[index],
      [field]: e.target.value,
    };
    setWords(updatedWords);
  };

  // Add a new word and clue row
  const addWordAndClue = () => {
    setWords([...words, { word: "", clue: "" }]);
  };

  // Generate crossword grid from words
  const generateGrid = () => {
    const size = 10; // Define grid size
    const emptyGrid = Array(size)
      .fill(null)
      .map(() => Array(size).fill(""));

    const placedWords = [];

    words.forEach(({ word }, idx) => {
      const startRow = Math.floor(idx * 2) % size;
      const startCol = (idx * 3) % size;
      word.split("").forEach((char, charIdx) => {
        if (startCol + charIdx < size) {
          emptyGrid[startRow][startCol + charIdx] = char.toUpperCase();
        }
      });
      placedWords.push(word.toUpperCase());
    });

    setGrid(emptyGrid);
    setClues(words.map(({ clue }) => clue));
    setIsSolved(false);
  };

  // Provide a hint by revealing a random letter
  const revealHint = () => {
    if (hints > 0) {
      const hintOptions = [];
      grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell) hintOptions.push({ rowIndex, colIndex, letter: cell });
        });
      });

      if (hintOptions.length) {
        const randomHint = hintOptions[Math.floor(Math.random() * hintOptions.length)];
        const input = document.getElementById(`cell-${randomHint.rowIndex}-${randomHint.colIndex}`);
        input.value = randomHint.letter;
        input.style.color = "blue"; // Highlight the hint in blue
        setHints(hints - 1);
      }
    } else {
      alert("No more hints available!");
    }
  };

  // Check if user's solution matches the grid
  const validateSolution = () => {
    let isCorrect = true;
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const input = document.getElementById(`cell-${rowIndex}-${colIndex}`).value;
        if (cell && input.toUpperCase() !== cell) {
          isCorrect = false;
        }
      });
    });

    if (isCorrect) {
      setIsSolved(true);
      alert("Congratulations! You solved it!");
    } else {
      alert("Wrong! Try again.");
    }
  };

  return (
    <div className="App">
      <h1>Crossword Puzzle Generator</h1>
      {instructionsVisible && (
        <div>
          <h2>How to Play</h2>
          <p>1. Enter words and their clues to generate a crossword puzzle.</p>
          <p>2. Solve the puzzle by filling in the correct letters in the grid.</p>
          <p>3. Use the "Hint" button to reveal letters if needed (limited to 3).</p>
          <button onClick={() => setInstructionsVisible(false)}>Close Instructions</button>
        </div>
      )}
      {!grid.length && (
        <div>
          <h2>Enter Words and Clues</h2>
          {words.map((entry, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Word"
                value={entry.word}
                onChange={(e) => handleInputChange(e, index, "word")}
              />
              <input
                type="text"
                placeholder="Clue"
                value={entry.clue}
                onChange={(e) => handleInputChange(e, index, "clue")}
              />
            </div>
          ))}
          <button onClick={addWordAndClue}>Add Word</button>
          <button onClick={generateGrid}>Generate Puzzle</button>
        </div>
      )}

      {grid.length > 0 && (
        <div>
          <h2>Puzzle Grid</h2>
          <div className="grid">
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="row">
                {row.map((cell, colIndex) => (
                  <input
                    key={colIndex}
                    id={`cell-${rowIndex}-${colIndex}`}
                    className="cell"
                    maxLength={1}
                    disabled={!cell}
                  />
                ))}
              </div>
            ))}
          </div>
          <h2>Clues</h2>
          <ul>
            {clues.map((clue, index) => (
              <li key={index}>{index + 1}. {clue}</li>
            ))}
          </ul>
          <div>
            <button onClick={validateSolution}>Submit Solution</button>
            <button onClick={revealHint}>Hint ({hints} left)</button>
          </div>
        </div>
      )}

      {isSolved && <h2>Well Done! Puzzle Solved!</h2>}
    </div>
  );
}

export default App;

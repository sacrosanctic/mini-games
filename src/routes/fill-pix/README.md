# 🎨 Fill-Pix Puzzle Game

**Overview**: A logic puzzle where players fill cells based on numerical hints indicating how many cells in the 3x3 neighborhood should be filled.

## 📁 File Structure

### Core Game Files

```
📂 fill-pix/
├── 🎯 Fillpix.svelte          # Main game component
├── 🧮 fillpix.svelte.ts       # Game logic & FillPixGame class
├── 🔲 Cell.svelte             # Individual puzzle cell component
├── 📊 CellGrid.svelte         # Development cell state preview
├── 🎲 generator.ts            # Puzzle map generation
├── 🛠️  utils.ts               # Grid manipulation utilities
├── 📖 Cell.stories.svelte     # Storybook component stories
└── 🏠 +page.svelte           # SvelteKit route page
```

### File Purposes & Relationships

**🎯 Fillpix.svelte** (Main Component)

- Initializes `FillPixGame` with generated puzzle
- Implements drag-to-fill interaction
- Renders grid of `Cell` components
- Manages `DragHandler` for mouse interactions

**🧮 fillpix.svelte.ts** (Game Logic)

- `FillPixGame` class managing puzzle state
- Accepts optional `boolean[][]` map for custom puzzles
- Calculates hints from filled cell neighborhoods
- Provides grid access and filled count methods

**🔲 Cell.svelte** (Cell Component)

- Displays numerical hint or filled state
- Handles mouse events (mousedown, mouseenter)
- Supports three states: unmarked, marked, blocked
- Uses Tailwind CSS for styling

**🎲 generator.ts** (Puzzle Generation)

- `generateFillPixPuzzle()` function
- Creates `boolean[][]` maps with filled patterns
- Currently generates centered rectangles
- Returns puzzle with width, height, and solution map

**🛠️ utils.ts** (Utilities)

- `getLocalGrid()` function for 3x3 neighborhood extraction
- Works with any grid type for reusability

**📊 CellGrid.svelte** (Development Tool)

- Displays all possible cell states and hints
- Used for visual testing of `Cell` component
- Shows combinations of hint values and filled counts

**📖 Cell.stories.svelte** (Storybook)

- Interactive component documentation
- Demonstrates `Cell` in different states

## 🔄 Data Flow

```
generator.ts → FillPixGame(map) → Fillpix.svelte → Cell[] → Cell.svelte
       ↓              ↓              ↓              ↓
   boolean[][]   calculates hints   renders grid   displays state
```

## 🎮 Game Mechanics

- **Hints**: Numbers show filled cells in 3x3 area around each cell
- **Interaction**: Click/drag to toggle cell states (empty → filled → blocked → empty)
- **Win Condition**: All hints match actual filled neighbor counts

## 🛠️ Development Notes

- Uses Svelte 5 runes (`$state`) for reactive state
- TypeScript for type safety
- Tailwind CSS for responsive styling
- Drag handling prevents accidental selections

## 🎯 Future Enhancements

- Multiple difficulty levels with complex patterns
- Puzzle validation and solving assistance
- Undo/redo functionality
- Timer and scoring system

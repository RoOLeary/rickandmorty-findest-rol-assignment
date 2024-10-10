# Rick and Morty Explorer - Findest

A **Rick and Morty** Explorer application built using **Vite, React (TypeScript), SCSS, Redux-Toolkit, and RTK Query** to allow users to explore the characters, locations, and episodes from the Rick and Morty universe. The app features a dynamic tabbed interface with pagination, responsive design, and detailed views of each character, location, or episode.

## Features/Requirements

1. **Tabbed Interface**:  
   - Switch between tabs to explore **Characters**, **Locations**, and **Episodes**.
   - Each tab fetches data from the Rick and Morty API.

2. **Pagination**:  
   - Dynamic pagination for navigating large datasets in each tab.
   - Pagination updates automatically based on total items and items per page.

3. **Card Layout**:  
   - Data is displayed in a card format, showing an overview of characters, locations, and episodes.
   - Clicking a card opens a modal with detailed information.

4. **Responsiveness & Animations**:  
   - Aesthetic design and responsive layouts using **SCSS**.
   - Custom animations for smooth transitions between UI elements.
   - **Get Schwifty** font for the Rick and Morty theme.

5. **State Management**:  
   - State management is handled with **Redux Toolkit (RTK)** for optimal code volume and structure.
   - **RTK Query** is used for efficient API data fetching, replacing traditional reducers and action creators.

6. **Testing**:  
   - Unit tests are written using **Jest** and **Testing Library**.
   - Coverage includes components: **Tabs**, **Characters**, **CharacterCards**, **Episodes**, and **Locations**.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/RoOLeary/rickandmorty-finest-rol-assignment
   cd rickandmorty-finest-rol-assignment
   ```

2. **Install dependencies using `pnpm`**:

   First, install **pnpm** if you haven't already:

   ```bash
   npm install -g pnpm
   ```

   Then, install project dependencies:

   ```bash
   pnpm install
   ```

3. **Start the development server**:

   ```bash
   pnpm run dev
   ```

4. **Run Tests**:

   You can run tests using the following command:

   ```bash
   pnpm run test
   ```

   This will run the test suite and display test coverage, including all cases tested, with a list of green checkmarks for successful tests.

## Scripts

Here are some useful scripts you can run with **pnpm**:

- **`pnpm run dev`**: Start the local development server.
- **`pnpm run build`**: Build the project for production.
- **`pnpm run test`**: Run the test suite and display results.
- **`pnpm run lint`**: Lint your codebase using ESLint.

## Testing

Testing has been implemented for the following components:

- **Tabs**: Ensure proper tab navigation and switching.
- **Characters**: Test for API data fetching and rendering.
- **CharacterCards**: Ensure proper layout and modal functionality.
- **Episodes**: Validate pagination and data fetching.
- **Locations**: Verify location data is fetched and rendered correctly.

To view the list of tested cases with green checkmarks for passed tests, make sure **Jest** is set up to show results in verbose mode. You can configure this by adding the following section to your **package.json**:

```json
"jest": {
  "verbose": true
}
```

This will display a detailed list of all test cases when running `pnpm test`.

## API Integration

The app integrates with the [Rick and Morty API](https://rickandmortyapi.com/), fetching characters, locations, and episodes. API responses are paginated and can be filtered dynamically based on the data type (e.g., season, episode, character status).

## UI & Styling

- The application is styled using **SCSS** for enhanced customization and responsiveness.
- **Get Schwifty** font is used for a thematic Rick and Morty aesthetic.
- Responsive layouts ensure the app works across different devices.

## Future Improvements

- Add more advanced filtering options (e.g., by character status, location type).
- Improve performance on larger datasets.
- Expand test coverage to more edge cases.

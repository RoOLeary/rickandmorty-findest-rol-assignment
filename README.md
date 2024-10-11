# Rick and Morty Explorer - Findest

A **Rick and Morty** Explorer application built using **Vite, React (TypeScript), SCSS, Redux-Toolkit, and RTK Query** to allow users to explore the characters, locations, and episodes from the Rick and Morty universe. The app features a dynamic tabbed interface with pagination, responsive design, and detailed views of each character, location, or episode.

## Live Demo

A live demo can be seen [here](https://rickandmorty-findest-rol-assignment.vercel.app/).

Just click on the Portal, and "Awwwwwayyyy we go!"

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/RoOLeary/rickandmorty-findest-rol-assignment
   cd rickandmorty-findest-rol-assignment
   ```

2. **Run the `setup.sh` bash script**:

  Note: You probably won't need to, but if this gives you any grief, you can run:
  
  ```bash
    chmod +x setup.sh
  ```

  and then fire it all up. 

  ```bash
    ./setup.sh
  ```

  And although you may need to chmod +x this fella too, if you run the following:

  ```bash
    ./run.sh
  ```
  .....you'll see some funny/cool ascii art. 

  
  ## ANYWAY....
  
  This will install `pnpm`, as well as all the necessary dependencies. It'll run the test suites and 
  will serve up the application on http://localhost:3000
 

2. (Also 2) **Install dependencies using `pnpm`**:

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

## Scripts

Here are some useful scripts you can run with **pnpm**:

- **`pnpm run dev`**: Start the local development server.
- **`pnpm run build`**: Build the project for production.
- **`pnpm run test`**: Run the test suite and display results.

## Testing

Testing has been implemented for the following components:

- **Tabs**: 
  - Ensure proper tab navigation and switching.
    ✓ should display the spinner during loading
    ✓ should switch tabs correctly
- **Characters**: 
  - Test for API data fetching and rendering.
    ✓ renders search input and filters correctly 
    ✓ search input updates and triggers debounced search 
    ✓ pagination works and calls API on next page click 
    ✓ pagination disables "Previous" button on first page 
    ✓ filters work and call API on species filter change 
- **CharacterCards**: 
  - Ensure proper layout and modal functionality.
    ✓ renders character details correctly 
    ✓ does not show the modal initially 
    ✓ opens the modal when the character card is clicked 
- **Episodes**: 
  - Validate pagination and data fetching.
    ✓ renders and fetches episodes for a season 
    ✓ displays loading message while fetching data 
    ✓ displays error message when fetching fails 
    ✓ navigates to the next page on clicking the Next button 
    ✓ navigates to the previous page on clicking the Previous button 
- **Locations**: 
  - Verify location data is fetched and rendered correctly.
    ✓ renders and fetches locations data 
    ✓ displays loading message while fetching data 
    ✓ handles search input and triggers debounced search 
    ✓ handles pagination - clicking next and previous
    ✓ displays error message when fetching fails
    ✓ displays no results message when no locations found
    ✓ handles type and dimension filters
- **Modal**: 
  - Renders the modal component
    ✓ prevents closing the modal when clicking inside the content

To view the list of tested cases with green checkmarks for passed tests, make sure **Jest** is set up to show results in verbose mode. You can configure this by adding the following section to your **package.json**:

```
pnpm test --verbose
```

This will display a detailed list of all test cases when running `pnpm test`.

## API Integration

The app integrates with the [Rick and Morty API](https://rickandmortyapi.com/), fetching characters, locations, and episodes. API responses are paginated and can be filtered dynamically based on the data type (e.g., season, episode, character status).

Here’s a brief outline of what an API, like the Rick and Morty API, can and cannot fetch, using a common example of character details and episodes.

### What the API Can Fetch:
- **Character Details**: You can fetch detailed information about characters, including their name, species, gender, status (alive, dead, unknown), and origin.
  - Example response for a character:
    ```json
    {
      "id": 1,
      "name": "Rick Sanchez",
      "status": "Alive",
      "species": "Human",
      "gender": "Male",
      "origin": { "name": "Earth", "url": "https://rickandmortyapi.com/api/location/1" },
      "episode": [
        "https://rickandmortyapi.com/api/episode/1",
        "https://rickandmortyapi.com/api/episode/2",
        // additional episode URLs
      ]
    }
    ```

- **Locations**: You can retrieve information about specific locations or planets, such as the name, type, and dimension.

- **Episodes**: You can retrieve details about episodes, including the title, air date, and which characters appeared in each episode.

### What the API Cannot Fetch in One Call:
- **Character Details with Episode Names**: When fetching character details, the episode field only provides **URLs** pointing to episode endpoints. To get the **names or titles of the episodes**, you need to make **a second API call** for each episode using the provided URL.
  - Example of needing a second call:
    - First call to get character details:
      ```bash
      GET https://rickandmortyapi.com/api/character/1
      ```
      Response includes a list of episode URLs:
      ```json
      "episode": [
        "https://rickandmortyapi.com/api/episode/1",
        "https://rickandmortyapi.com/api/episode/2"
      ]
      ```
    - Second call to get episode details:
      ```bash
      GET https://rickandmortyapi.com/api/episode/1
      GET https://rickandmortyapi.com/api/episode/2
      ```
      To retrieve episode names, you must call each episode URL.

### Key Limitations:
- **Nested Data**: The API does not return all related data in a single response. For example, if you want to get a character’s episode names or locations, you’ll need to make additional API calls to resolve those URLs.
- **Batch Queries**: While the API supports querying multiple characters or episodes by IDs, some nested data must still be fetched separately.

## UI & Styling

- The application is styled using **SCSS** for enhanced customization and responsiveness.
- **Get Schwifty** font is used for a thematic Rick and Morty aesthetic.
- Responsive layouts ensure the app works across different devices.

## Future Improvements

- Add more advanced filtering options (e.g., by character status, location type).
- Improve performance on larger datasets.
- Expand test coverage to more edge cases.

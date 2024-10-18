// src/setupTests.ts
import "@testing-library/jest-dom"; // Provides custom jest matchers from RTL

// Create a full mock of the `Response` object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockFetchResponse = (data: any): Response => {
  return {
    ok: true,
    status: 200,
    statusText: "OK",
    redirected: false,
    headers: new Headers(),
    url: "",
    type: "basic",
    body: null,
    bodyUsed: false,
    clone: jest.fn(),
    arrayBuffer: jest.fn(),
    blob: jest.fn(),
    formData: jest.fn(),
    text: jest.fn(),
    json: jest.fn().mockResolvedValue(data), // Mock the json() method to return provided data
  } as unknown as Response; // Cast as Response to satisfy TypeScript
};

// Mock global fetch
global.fetch = jest.fn((input: RequestInfo | URL) => {
  const url = input.toString(); // Convert URL or RequestInfo to a string

  // Mock character fetch response
  if (url.includes("character")) {
    return Promise.resolve(
      mockFetchResponse({
        name: "Rick Sanchez",
        image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
      }),
    );
  }

  // Default mock response for other fetches
  return Promise.resolve(mockFetchResponse({}));
});

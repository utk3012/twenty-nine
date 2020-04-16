import Firebase from 'firebase'

const firebaseApp = Firebase.initializeApp({
  // Populate your firebase configuration data here.
  apiKey: 'AIzaSyC7VuiuyQyAaIjnEXbMR69U26TmJfHKXyM',
  databaseURL: 'https://twenty-nine-game.firebaseio.com/',
  projectId: 'twenty-nine-game'
});

// Export the database for components to use.
// If you want to get fancy, use mixins or provide / inject to avoid redundant imports.
export const db = firebaseApp.database();
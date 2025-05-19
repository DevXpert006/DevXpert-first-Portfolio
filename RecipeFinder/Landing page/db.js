// Mock database
let users = [
  {
      id: 1,
      username: 'demo',
      email: 'demo@example.com',
      password: 'password', // In a real app, passwords should be hashed
      profileImage: 'assets/images/default-profile.png'
  }
];

// Get current user from localStorage
function getCurrentUser() {
  const userData = localStorage.getItem('currentUser');
  return userData ? JSON.parse(userData) : null;
}

// Set current user in localStorage
function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

// Remove current user from localStorage
function logoutUser() {
  localStorage.removeItem('currentUser');
}

// Authenticate user
function authenticateUser(email, password) {
  return users.find(user => user.email === email && user.password === password);
}

// Create new user
function createUser(username, email, password, profileImage) {
  // Check if email already exists
  if (users.some(user => user.email === email)) {
      return null;
  }
  
  const newUser = {
      id: users.length + 1,
      username,
      email,
      password, // In a real app, hash the password
      profileImage
  };
  
  users.push(newUser);
  return newUser;
}
// DOM Elements
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const showLogin = document.getElementById('show-login');
const showSignup = document.getElementById('show-signup');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const closeButtons = document.querySelectorAll('.close');

// Event Listeners
showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.style.display = 'none';
    loginModal.style.display = 'block';
});

showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'none';
    signupModal.style.display = 'block';
});

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        loginModal.style.display = 'none';
        signupModal.style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target === loginModal) loginModal.style.display = 'none';
    if (e.target === signupModal) signupModal.style.display = 'none';
});

loginForm.addEventListener('submit', handleLogin);
signupForm.addEventListener('submit', handleSignup);
document.getElementById('logout-btn').addEventListener('click', handleLogout);

// Show login modal
function showLoginModal() {
    loginModal.style.display = 'block';
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const user = authenticateUser(email, password);
    
    if (user) {
        loginModal.style.display = 'none';
        currentUser = user;
        setCurrentUser(user);
        checkAuthState();
        loadBookmarks();
        fetchRandomRecipes();
    } else {
        alert('Invalid email or password');
    }
}

// Handle signup
function handleSignup(e) {
    e.preventDefault();
    
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const profileImage = document.getElementById('profile-image').files[0];
    
    let profileImageUrl = 'assets/images/default-profile.png';
    
    if (profileImage) {
        profileImageUrl = URL.createObjectURL(profileImage);
    }
    
    const newUser = createUser(username, email, password, profileImageUrl);
    
    if (newUser) {
        signupModal.style.display = 'none';
        currentUser = newUser;
        setCurrentUser(newUser);
        checkAuthState();
        fetchRandomRecipes();
    } else {
        alert('Email already exists');
    }
}

// Handle logout
function handleLogout(e) {
    e.preventDefault();
    logoutUser();
    currentUser = null;
    bookmarkedRecipes = [];
    app.classList.add('hidden');
    showLoginModal();
}
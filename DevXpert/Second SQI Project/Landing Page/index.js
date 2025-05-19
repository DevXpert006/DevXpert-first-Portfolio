// Toggle the mobile menu
function toggleMenu() {
    let navLinks = document.querySelector('.nav-links-1, .nav-links-2');
    navLinks.classList.toggle('active');
}
const locationInput = document.getElementById("location-input");
const locationDropdown = document.getElementById("location-dropdown");
const serviceInput = document.getElementById("service-input");
const serviceDropdown = document.getElementById("service-dropdown");
const formError = document.getElementById("form-error");

async function fetchCountries(query) {
  if (!query) return [];
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${query}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map(country => ({
        name: country.name.common,
        flag: country.flags?.png || "🌍"
      }));
    }
    return [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

const serviceList = [
  "Dentist", "Cardiologist", "ENT", "Pediatrician", "General Clinic",
  "Eye Clinic", "Maternity", "Orthopedic", "Radiology", "Oncology",
  "Neurologist", "Urologist", "Dermatologist", "Psychiatrist", "Gastroenterologist",
  "Surgeon", "Chiropractor", "Nutritionist", "Pathologist", "Ambulance Service",
  "Physiotherapist", "Hearing Center", "Fertility Clinic", "Pain Management"
];

function filterServiceList(query) {
  return serviceList.filter(service =>
    service.toLowerCase().includes(query.toLowerCase())
  ).map(name => ({ name }));
}

function showDropdown(inputEl, dropdownEl, items, hasFlags = false) {
  dropdownEl.innerHTML = '';
  if (items.length === 0) {
    dropdownEl.innerHTML = `<p class='no-match'>No match found</p>`;
  } else {
    items.forEach(item => {
      const p = document.createElement('p');
      if (hasFlags && item.flag) {
        const img = document.createElement('img');
        img.src = item.flag;
        img.alt = item.name;
        img.className = 'flag';
        img.style.width = '20px';
        img.style.height = '14px';
        p.appendChild(img);
        const style = document.createElement("style");
        style.textContent = `
          .dropdown {
            display: flex;
            flex-direction: column;
            background-color: #ffffff;
            border: 1px solid #ccc;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            margin-top:-150px;
            overflow-y: auto;
            line-height: 0px;
            z-index: 10;
          }
            
          .dropdown p {
            display: flex;
            align-items: center;
            padding: 10px;
            gap: 10px;
            background-color: #f9f9f9;
            cursor: pointer;
          }
            
          .dropdown p:hover {
            background-color: #e0f0ff;
          }
        `;
        document.head.appendChild(style);

      } else {
        const icon = document.createElement('i');
        icon.className = 'fas fa-circle-dot';
        icon.style.color = '#007bff';
        p.appendChild(icon);
      }
      p.appendChild(document.createTextNode(item.name));
      p.addEventListener('click', () => {
        inputEl.value = item.name;
        dropdownEl.classList.remove('show');
      });
      dropdownEl.appendChild(p);
    });
  }
  dropdownEl.classList.add('show');
}

locationInput.addEventListener('input', async () => {
  const query = locationInput.value.trim();
  if (query.length < 1) {
    locationDropdown.classList.remove('show');
    return;
  }
  const countries = await fetchCountries(query);
  showDropdown(locationInput, locationDropdown, countries, true);
});

serviceInput.addEventListener('input', () => {
  const query = serviceInput.value.trim();
  if (query.length < 1) {
    serviceDropdown.classList.remove('show');
    return;
  }
  const services = filterServiceList(query);
  showDropdown(serviceInput, serviceDropdown, services);
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.input-box')) {
    locationDropdown.classList.remove('show');
    serviceDropdown.classList.remove('show');
  }
});

document.getElementById('use-location-btn').addEventListener('click', async () => {
  try {
    const res = await fetch("https://ipapi.co/json");
    const data = await res.json();
    const country = data.country_name;
    if (country) {
      locationInput.value = country;
    } else {
      formError.textContent = "Could not detect your location.";
      formError.style.display = "block";
    }
  } catch (err) {
    formError.textContent = "Error detecting location.";
    formError.style.display = "block";
    console.error(err);
  }
});

document.getElementById('smart-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const location = locationInput.value.trim();
  const service = serviceInput.value.trim();

  if (!location || !service) {
    formError.textContent = "Please fill out both Location and Service fields.";
    formError.style.display = "block";
    return;
  }

  formError.style.display = "none";
  formError.textContent = `Submitted Location: ${location} | Service: ${service}🩺`;
  formError.style.display = "block";
  formError.style.color = "green";
  alert(`Submitted Location: ${location} | Service: ${service}`);

  // TODO: Add Firebase submission logic here
});
``




container.addEventListener('scroll', () => {
  console.log("Current scroll position:", container.scrollLeft);
});

  function scrollRight() {
    document.getElementById("appointmentCards").scrollBy({
      left: 300,
      behavior: "smooth",
    });
  }

  function scrollLeft() {
    document.getElementById("appointmentCards").scrollBy({
      left: -300,
      behavior: "smooth",
    });
  }


  const track = document.querySelector('.testimonial-track');
  const dots = document.querySelectorAll('.dot');
  const leftArrow = document.querySelector('.arrow.left');
  const rightArrow = document.querySelector('.arrow.right');

  let index = 0;

  function showSlide(i) {
    track.style.transform = `translateX(-${i * 100}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[i].classList.add('active');
  }

  rightArrow.addEventListener('click', () => {
    index = (index + 1) % dots.length;
    showSlide(index);
  });

  leftArrow.addEventListener('click', () => {
    index = (index - 1 + dots.length) % dots.length;
    showSlide(index);
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      index = i;
      showSlide(index);
    });
  });

  // Auto scroll every 5 seconds
  setInterval(() => {
    index = (index + 1) % dots.length;
    showSlide(index);
  }, 5000);

  showSlide(index);



  const animatedElements = document.querySelectorAll('.animated');

  function showOnScroll() {
    const triggerBottom = window.innerHeight * 0.85;

    animatedElements.forEach(el => {
      const rect = el.getBoundingClientRect().top;
      if (rect < triggerBottom) {
        el.classList.add(el.dataset.animation);
      }
    });
  }

  window.addEventListener('scroll', showOnScroll);
  window.addEventListener('load', showOnScroll);


  function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            // Will automatically use Google account name
        });
}
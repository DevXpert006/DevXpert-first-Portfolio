// Enhanced Dashboard with CRUD Operations
const dashboardData = {
    totalPatients: 5,
    totalDoctors: 18,
    availableBeds: 42,
    monthlyAdmissions: [120, 190, 150, 220, 180, 250, 300, 280, 310, 290, 320, 350],
    allPatients: [
        { id: "P1001", age: 45, gender: "M", condition: "Hypertension" },
        { id: "P1002",  age: 32, gender: "F", condition: "Diabetes" },
        { id: "P1003", age: 58, gender: "M", condition: "Arthritis" },
        { id: "P1004",  age: 27, gender: "F", condition: "Migraine" },
        { id: "P1005", age: 63, gender: "M", condition: "Asthma" }
    ],
    allAppointments: [
        { id: "A1001", patientId: "P1001", doctor: "Dr. Taiwo", time: "10:00 AM", date: new Date() },
        { id: "A1002", patientId: "P1002", doctor: "Dr. Tinuke", time: "11:30 AM", date: new Date()},
        { id: "A1003", patientId: "P1003", doctor: "Dr. Shola", time: "01:15 PM", date: new Date()},
        { id: "A1004", patientId: "P1004", doctor: "Dr. James", time: "02:45 PM", date: new Date()},
        { id: "A1005", patientId: "P1005", doctor: "Dr. Peter", time: "04:00 PM", date: new Date()}
    ]
};

// DOM Elements
const elements = {
    // Stats elements
    stats: {
        totalPatients: document.getElementById('total-patients'),
        todayAppointments: document.getElementById('today-appointments'),
        totalDoctors: document.getElementById('total-doctors'),
        availableBeds: document.getElementById('available-beds')
    },
    // Table elements
    tables: {
        appointments: document.querySelector('#appointments-table tbody'),
        patients: document.querySelector('#patients-table tbody')
    },
    // Button elements
    buttons: {
        addPatient: document.getElementById('add-patient-btn'),
        addAppointment: document.getElementById('add-appointment-btn')
    },
    // Modal elements
    modals: {
        patient: document.getElementById('patient-modal'),
        appointment: document.getElementById('appointment-modal')
    },
    // Form elements
    forms: {
        patient: document.getElementById('patient-form'),
        appointment: document.getElementById('appointment-form')
    },
    // Other elements
    closeButtons: document.querySelectorAll('.close-btn'),
    searchInput: document.querySelector('.search-bar input')
};

// Initialize the dashboard
function initDashboard() {
    updateStats();
    renderPatientsTable();
    renderAppointmentsTable();
    initChart();
    setupEventListeners();
}

// Update statistics
function updateStats() {
    const today = new Date().toDateString();
    const todaysAppointments = dashboardData.allAppointments.filter(apt => 
        new Date(apt.date).toDateString() === today
    );
    
    elements.stats.totalPatients.textContent = dashboardData.totalPatients;
    elements.stats.todayAppointments.textContent = todaysAppointments.length;
    elements.stats.totalDoctors.textContent = dashboardData.totalDoctors;
    elements.stats.availableBeds.textContent = dashboardData.availableBeds;
}

// Render patients table
function renderPatientsTable() {
    elements.tables.patients.innerHTML = '';
    dashboardData.allPatients.slice(-5).forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.id}</td>
            <td>${patient.age}</td>
            <td>${patient.gender}</td>
            <td>${patient.condition}</td>
            <td>
                <button class="action-btn delete-btn" data-id="${patient.id}">Delete</button>
            </td>
        `;
        elements.tables.patients.appendChild(row);
    });
}

// Render appointments table
function renderAppointmentsTable() {
    elements.tables.appointments.innerHTML = '';
    const today = new Date().toDateString();
    const todaysAppointments = dashboardData.allAppointments.filter(apt => 
        new Date(apt.date).toDateString() === today
    );
    
    todaysAppointments.forEach(appointment => {
        const patient = dashboardData.allPatients.find(p => p.id === appointment.patientId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient ? patient.id : 'Unknown Patient'}</td>
            <td>${appointment.doctor}</td>
            <td>${appointment.time}</td>
            <td>
                <button class="action-btn delete-btn" data-id="${appointment.id}">Delete</button>
            </td>
        `;
        elements.tables.appointments.appendChild(row);
    });
}

// Add new patient
function addPatient(patientData) {
    const newId = `P${1000 + dashboardData.allPatients.length + 1}`;
    const newPatient = {
        id: newId,
        ...patientData
    };
    
    dashboardData.allPatients.push(newPatient);
    dashboardData.totalPatients++;
    updateStats();
    renderPatientsTable();
    
    if (patientData.isNewAdmission) {
        const currentMonth = new Date().getMonth();
        dashboardData.monthlyAdmissions[currentMonth]++;
        updateChart();
    }
    
    return newId;
}

// Add new appointment
function addAppointment(appointmentData) {
    const newId = `A${1000 + dashboardData.allAppointments.length + 1}`;
    const newAppointment = {
        id: newId,
        date: new Date(),
        ...appointmentData
    };
    
    dashboardData.allAppointments.push(newAppointment);
    updateStats();
    renderAppointmentsTable();
    
    return newId;
}

// Delete patient
function deletePatient(patientId) {
    const index = dashboardData.allPatients.findIndex(p => p.id === patientId);
    if (index !== -1) {
        dashboardData.allPatients.splice(index, 1);
        dashboardData.totalPatients--;
        // Also delete related appointments
        dashboardData.allAppointments = dashboardData.allAppointments.filter(apt => apt.patientId !== patientId);
        updateStats();
        renderPatientsTable();
        renderAppointmentsTable();
    }
}

// Delete appointment
function deleteAppointment(appointmentId) {
    const index = dashboardData.allAppointments.findIndex(apt => apt.id === appointmentId);
    if (index !== -1) {
        dashboardData.allAppointments.splice(index, 1);
        updateStats();
        renderAppointmentsTable();
    }
}

// Initialize chart
function initChart() {
    const ctx = document.getElementById('admissionsChart').getContext('2d');
    window.admissionsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Monthly Admissions',
                data: dashboardData.monthlyAdmissions,
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 50
                    }
                }
            }
        }
    });
}

// Update chart
function updateChart() {
    window.admissionsChart.data.datasets[0].data = dashboardData.monthlyAdmissions;
    window.admissionsChart.update();
}

// Setup event listeners
function setupEventListeners() {
    // Modal toggles
    elements.buttons.addPatient.addEventListener('click', () => {
        elements.modals.patient.style.display = 'block';
    });
    
    elements.buttons.addAppointment.addEventListener('click', () => {
        elements.modals.appointment.style.display = 'block';
        populatePatientSelect();
    });
    
    // Close modals
    elements.closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.modals.patient.style.display = 'none';
            elements.modals.appointment.style.display = 'none';
        });
    });
    
    // Form submissions
    elements.forms.patient.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const patientData = {
            name: formData.get('name'),
            age: parseInt(formData.get('age')),
            gender: formData.get('gender'),
            condition: formData.get('condition'),
            isNewAdmission: formData.get('admission') === 'yes'
        };
        addPatient(patientData);
        e.target.reset();
        elements.modals.patient.style.display = 'none';
    });
    
    elements.forms.appointment.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const appointmentData = {
            patientId: formData.get('patient'),
            doctor: formData.get('doctor'),
            time: formData.get('time')
        };
        addAppointment(appointmentData);
        e.target.reset();
        elements.modals.appointment.style.display = 'none';
    });
    
    // Delete buttons (using event delegation)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            if (id.startsWith('P')) {
                if (confirm('Delete this patient and all their appointments?')) {
                    deletePatient(id);
                }
            } else if (id.startsWith('A')) {
                if (confirm('Delete this appointment?')) {
                    deleteAppointment(id);
                }
            }
        }
    });
    
    // Search functionality
    elements.searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        if (searchTerm) {
            const filteredPatients = dashboardData.allPatients.filter(patient => 
                patient.name.toLowerCase().includes(searchTerm) ||
                patient.id.toLowerCase().includes(searchTerm)
            );
            renderFilteredPatients(filteredPatients);
        } else {
            renderPatientsTable();
        }
    });
}

// Populate patient select in appointment form
function populatePatientSelect() {
    const select = elements.forms.appointment.querySelector('select[name="patient"]');
    select.innerHTML = '';
    dashboardData.allPatients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.id;
        option.textContent = `${patient.name} (${patient.id})`;
        select.appendChild(option);
    });
}

// Render filtered patients
function renderFilteredPatients(patients) {
    elements.tables.patients.innerHTML = '';
    patients.slice(0, 5).forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.id}</td>
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.gender}</td>
            <td>${patient.condition}</td>
            <td>
                <button class="action-btn delete-btn" data-id="${patient.id}">Delete</button>
            </td>
        `;
        elements.tables.patients.appendChild(row);
    });
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', initDashboard);
document.addEventListener("DOMContentLoaded", () => {

  // --- MOCK DATABASES ---
  const STORES_DATABASE = [
    { name: "WiseDrive Central", address: "742 Evergreen Terrace, Springfield", deliveryDays: 3 },
    { name: "Elite Motors North", address: "1010 Binary Blvd, Tech City", deliveryDays: 5 },
    { name: "Summit Auto South", address: "55 Blue Harbor Way, Coastal Port", deliveryDays: 2 }
  ];

  // Note: Assuming CARS_DATABASE is defined globally or imported. 
  // If not, ensure it exists with car.name and car.id properties.

  let currentStep = 1;
  const totalSteps = 5;
  const answers = {
    budget: 65000,
    type: "",
    lifestyle: "",
    fuel: "",
    priority: ""
  };
  
  let matchedCars = [];
  let comparedCars = []; 
  
  // DOM Elements
  const homeSection = document.getElementById("home-section");
  const quizSection = document.getElementById("quiz-section");
  const resultsSection = document.getElementById("results-section");
  const showroomSection = document.getElementById("showroom-section");
  const startQuizBtn = document.getElementById("start-quiz-btn");
  const redoQuizBtn = document.getElementById("redo-quiz-btn");
  const quizSteps = document.querySelectorAll(".quiz-step");
  const nextStepBtn = document.getElementById("next-step-btn");
  const prevStepBtn = document.getElementById("prev-step-btn");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");
  const budgetSlider = document.getElementById("budget-slider");
  const budgetValueText = document.getElementById("budget-value-text");
  const optionCards = document.querySelectorAll(".option-card");
  const resultsGrid = document.getElementById("results-grid");
  const showroomGrid = document.getElementById("showroom-grid");
  const brandFilter = document.getElementById("brand-filter");
  const typeFilter = document.getElementById("type-filter");
  const fuelFilter = document.getElementById("fuel-filter");
  const priceFilter = document.getElementById("price-filter");
  const compareTray = document.getElementById("compare-tray");
  const compareAddedCars = document.getElementById("compare-added-cars");
  const compareBtnTrigger = document.getElementById("compare-btn-trigger");
  const compareModal = document.getElementById("compare-modal");
  const compareModalClose = document.getElementById("compare-modal-close");
  const compareTableContent = document.getElementById("compare-table-content");
  const chatbotBubble = document.getElementById("chatbot-bubble");
  const chatWindow = document.getElementById("chat-window");
  const chatCloseBtn = document.getElementById("chat-close-btn");
  const chatMessages = document.getElementById("chat-messages");
  const chatInput = document.getElementById("chat-input");
  const chatSendBtn = document.getElementById("chat-send-btn");
  const navLinks = document.querySelectorAll("nav a");
  const logoWrapper = document.getElementById("logo-wrapper");

  // --- NEW: ORDERING & LOCATION LOGIC ---

  /**
   * Simulates an API call to locate the nearest store based on user IP/GPS
   */
  function fetchNearestStore() {
    // In a real app: return fetch('/api/v1/stores/nearest').then(res => res.json());
    const randomIndex = Math.floor(Math.random() * STORES_DATABASE.length);
    return STORES_DATABASE[randomIndex];
  }

  /**
   * Handles the "Purchase" transaction logic
   */
  function handlePlaceOrder(carName) {
    const store = fetchNearestStore();
    
    // Calculate delivery date based on store lead time
    const today = new Date();
    today.setDate(today.getDate() + store.deliveryDays);
    const dateString = today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Final Success Notification
    alert(
      `✅ Order Placed Successfully!\n\n` +
      `Vehicle: ${carName}\n` +
      `Pickup Location: ${store.name}\n` +
      `Address: ${store.address}\n\n` +
      `Estimated Pickup Date: ${dateString}\n\n` +
      `A confirmation email has been sent to your inbox.`
    );
  }

  // --- UPDATED MODAL FUNCTION ---

  function openDetailModal(carId) {
    const car = CARS_DATABASE.find(c => c.id === carId);
    if (!car) return;
    
    const modalEl = document.createElement("div");
    modalEl.className = "detail-modal open";
    modalEl.innerHTML = `
      <div class="glass-panel detail-modal-box">
        <button class="compare-modal-close" id="detail-modal-close">
          <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
        <div class="car-brand" style="font-size:14px; margin-bottom:10px;">${car.brand}</div>
        <h3 class="detail-modal-title">${car.name}</h3>
        <div class="car-price-badge" style="margin-bottom:24px;">$${car.price.toLocaleString()}</div>
        
        <div class="car-vector-art" style="height:140px; margin-bottom:20px;">
           <svg viewBox="0 0 120 60">
            <defs>
              <linearGradient id="grad-det-${car.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${car.color}" />
                <stop offset="100%" stop-color="var(--accent-violet)" />
              </linearGradient>
            </defs>
            <path d="M10 40 L18 28 C22 22, 35 15, 50 14 C65 13, 85 18, 92 25 L108 30 C114 32, 116 38, 112 42 L106 43 C104 43, 98 42, 94 40 C84 40, 80 46, 70 46 C60 46, 56 40, 36 40 C26 40, 22 46, 12 46 Z" fill="url(#grad-det-${car.id})" opacity="0.85"/>
            <circle cx="24" cy="44" r="9" fill="#0E0E1F" stroke="${car.color}" stroke-width="2" />
            <circle cx="82" cy="44" r="9" fill="#0E0E1F" stroke="${car.color}" stroke-width="2" />
          </svg>
        </div>
        
        <div class="compare-grid-table" style="max-height:180px; overflow-y:auto; border:1px solid rgba(255,255,255,0.1); border-radius:12px; margin-bottom:20px;">
          <table style="width:100%; border-collapse:collapse; font-size: 13px;">
            <tr style="border-bottom:1px solid rgba(255,255,255,0.05);"><td style="padding:8px; color:var(--text-muted);">Range/Fuel</td><td style="padding:8px; color:#fff;">${car.specs.range}</td></tr>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.05);"><td style="padding:8px; color:var(--text-muted);">0-60 MPH</td><td style="padding:8px; color:#fff;">${car.specs.acceleration}</td></tr>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.05);"><td style="padding:8px; color:var(--text-muted);">Capacity</td><td style="padding:8px; color:#fff;">${car.specs.seats} Seats</td></tr>
          </table>
        </div>

        <div style="display: flex; gap: 12px;">
          <button id="order-btn" class="btn-card-primary" style="flex: 2; background: var(--accent-cyan); color: #07070c;">Place Order</button>
          <button id="detail-modal-close-btn" class="btn-secondary" style="flex: 1;">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modalEl);
    
    // Event: Close Modal
    const closeModal = () => modalEl.remove();
    modalEl.querySelector("#detail-modal-close").addEventListener("click", closeModal);
    modalEl.querySelector("#detail-modal-close-btn").addEventListener("click", closeModal);

    // Event: Place Order
    modalEl.querySelector("#order-btn").addEventListener("click", () => {
      handlePlaceOrder(car.name);
      closeModal();
    });
  }

  // --- REST OF YOUR EXISTING INITIALIZATION CODE ---
  
  initShowroom();
  updateCompareTray();

  logoWrapper.addEventListener("click", () => showSection("home"));

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSection = link.getAttribute("data-target");
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      if (targetSection === "home") showSection("home");
      else if (targetSection === "quiz") startQuiz();
      else if (targetSection === "showroom") showSection("showroom");
    });
  });

  function showSection(sectionName) {
    homeSection.style.display = sectionName === "home" ? "block" : "none";
    quizSection.style.display = sectionName === "quiz" ? "block" : "none";
    resultsSection.style.display = sectionName === "results" ? "block" : "none";
    showroomSection.style.display = sectionName === "showroom" ? "block" : "none";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ... (Continue with the rest of your original logic for startQuiz, calculateMatches, etc.)
  // Ensure that calculateMatches and initShowroom still call openDetailModal()
  // No changes needed to the call-sites, as the logic inside openDetailModal was updated!

});
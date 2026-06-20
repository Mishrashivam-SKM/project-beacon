/* ═══════════════════════════════════════════════════════
   GOVERNMENT PORTAL UI - JAVASCRIPT LOGIC
   ═══════════════════════════════════════════════════════ */

let currentStep = 1;
const totalSteps = 4;

function updateProgressUI() {
  // Update step indicators
  for (let i = 1; i <= totalSteps; i++) {
    const indicator = document.getElementById(`step${i}-indicator`);
    if (i < currentStep) {
      indicator.className = 'step completed';
    } else if (i === currentStep) {
      indicator.className = 'step active';
    } else {
      indicator.className = 'step';
    }
  }

  // Show/Hide content sections
  for (let i = 1; i <= totalSteps; i++) {
    const content = document.getElementById(`step${i}-content`);
    if (content) {
      content.style.display = (i === currentStep) ? 'block' : 'none';
    }
  }
}

function nextStep() {
  if (currentStep < totalSteps) {
    currentStep++;
    updateProgressUI();
    // Scroll to tracker
    document.getElementById('apply-heading').scrollIntoView({ behavior: 'smooth' });
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    updateProgressUI();
    document.getElementById('apply-heading').scrollIntoView({ behavior: 'smooth' });
  }
}

function submitApplication() {
  // Hide all steps
  for (let i = 1; i <= totalSteps; i++) {
    const content = document.getElementById(`step${i}-content`);
    if (content) content.style.display = 'none';
  }
  
  // Show success message
  document.getElementById('step-success').style.display = 'block';
  
  // Update final tracker state
  for (let i = 1; i <= totalSteps; i++) {
    document.getElementById(`step${i}-indicator`).className = 'step completed';
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateProgressUI();
});

const formSteps = document.querySelectorAll('.form-step');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');
const form = document.getElementById('forgot-form');
const subtitle = document.getElementById('wizard-subtitle');

let currentStep = 0;

//FUNCT FOR STEP FORMS VISIBILITY
function updateFormSteps(){
    formSteps.forEach(step => {
        step.classList.remove('active');
    });
    formSteps[currentStep].classList.add('active');

    if (currentStep === 0) {
        btnPrev.style.display = 'none';
        btnNext.textContent = 'Send Code';
        subtitle.textContent = "Enter your email that you used to sign in. We'll send you a recovery code.";
    } else {
        btnPrev.style.display = 'block';
    }

    // Handle Step 2 styling
    if (currentStep === 1) {
        btnNext.textContent = 'Verify Code';
        subtitle.textContent = "Check your email. We've sent a 6-digit verification code to you.";
    }

    // Handle Step 3 styling
    if (currentStep === formSteps.length - 1) {
        btnNext.textContent = 'Reset Password';
        subtitle.textContent = "Secure your account with a new, strong password.";
    }
}

// CHECK INPUT FIELDS IF VALID

function validateCurrentStep() {
    const currentFormStep = formSteps[currentStep];
    const inputs = currentFormStep.querySelectorAll('input, select');
    let isValid = true;

    const rePasswordInput = document.getElementById('re-password');
    if(rePasswordInput) {
        rePasswordInput.setCustomValidity("");
    }

    // Specific check for Step 3 (Password Match)
    if (currentStep === 2) {
        const pwd = document.getElementById('password').value;
        if (pwd !== rePasswordInput.value) {
            rePasswordInput.setCustomValidity("Passwords do not match!");
        }
    }

    for (let i = 0; i < inputs.length; i++) {
        if (!inputs[i].checkValidity()) {
            inputs[i].reportValidity(); 
            isValid = false;
            break;
        }
    }
    return isValid;
}




//BTN NEXT ACTION HANDLING
btnNext.addEventListener('click', () => {
    // 1. Check if fields are filled
    if (validateCurrentStep()) {
        // 2. If valid, either go to next step OR submit form
        if (currentStep < formSteps.length - 1) {
            currentStep++;
            updateFormSteps();
        } else {
            //TODO: CONNECT TO DB
            // Final Submit
            btnNext.textContent = 'Resetting...';
                    
            // Simulate Backend connection delay
            setTimeout(() => {
                document.querySelector('.wizard-container').innerHTML = `
                    <div style="text-align: center; padding: 40px 0;">
                        <div style="font-size: 50px; margin-bottom: 20px;">✅</div>
                        <h1 style="color: #1b1464; margin-top: 0;">Password Reset!</h1>
                        <p style="color: #64748b; margin-bottom: 30px;">Your password has been successfully updated.</p>
                        <a href="login.html" class="btn btn-primary" style="text-decoration: none; display: inline-block;">Return to Login</a>
                    </div>
                `;
            }, 1500); //DELAY
        }
    }
});

//BTN PREV ACTION HANDLING
btnPrev.addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        updateFormSteps();
    }
});

//PREVENT DEFAULT BEHAVIOUR WHEN PRESSING ENTER
form.addEventListener('submit', (e) => {
    e.preventDefault();
});
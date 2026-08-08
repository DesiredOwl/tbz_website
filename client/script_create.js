const formSteps = document.querySelectorAll('.form-step');
const progressSteps = document.querySelectorAll('.step')
const progressBar = document.getElementById('progress');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');
const form = document.getElementById('register-form');

let currentStep = 0;

//FUNCT FOR STEP FORMS VISIBILITY
function updateFormSteps(){
    formSteps.forEach(step => {
        step.classList.remove('active');
    });
    formSteps[currentStep].classList.add('active');

    //STEP NUMBER UPDATE
    progressSteps.forEach((step,index) =>{
        if(index < currentStep){
            step.classList.add('completed');
            step.classList.remove('active');
            step.innerHTML = '✓';
        }else if(index === currentStep){
            step.classList.add('active');
            step.classList.remove('completed');
            step.innerHTML = index + 1;
        }else{
            step.classList.remove('active', 'completed');
            step.innerHTML = index + 1;
        }
    });


    // PROGRESS BAR ACTION
    const activeSteps = document.querySelectorAll('.step.active, .step.completed');
    progressBar.style.width = ((activeSteps.length - 1) / (progressSteps.length - 1)) * 100 + '%';

    //UPDATE BTN TEXTS
    if (currentStep === 0) {
        btnPrev.style.display = 'none';
    } else {
        btnPrev.style.display = 'block';
    }
    if (currentStep === formSteps.length - 1) {
        btnNext.textContent = 'Create Account';
    } else {
        btnNext.textContent = 'Next Step';
    }
}

// CHECK INPUT FIELDS IF VALID

function validateCurrentStep() {
    const currentFormStep = formSteps[currentStep];
    const inputs = currentFormStep.querySelectorAll('input, select');
    let isValid = true;

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
btnNext.addEventListener('click', async () => {
    // 1. Check if fields are filled
    if (validateCurrentStep()) {
        // 2. If valid, either go to next step OR submit form
        if (currentStep < formSteps.length - 1) {
            currentStep++;
            updateFormSteps();
        } else {

            // On the last step, submit the form
            btnNext.textContent = 'Creating...';
            btnNext.disabled = true;

            const payload = {
                first_name: document.getElementById('fname').value,
                last_name: document.getElementById('lname').value,
                phone: document.getElementById('phone').value,
                city: document.getElementById('city').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            }
            
            try {
                // Send POST request to Flask backend API
                const response = await fetch('http://127.0.0.1:5000/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();


                if (response.ok) {
                    // Show success screen
                    document.querySelector('.wizard-container').innerHTML = `
                        <div style="text-align: center; padding: 40px 0;">
                            <div style="font-size: 50px; margin-bottom: 20px;">🎉</div>
                            <h1 style="color: #1b1464; margin-top: 0;">Account Created!</h1>
                            <p style="color: #64748b; margin-bottom: 30px;">Welcome to TBZ Car Rental.</p>
                            <a href="login.html" class="btn btn-next" style="text-decoration: none;">Proceed to Login</a>
                        </div>
                    `;
                } else {
                    // Show server error (Email already exists!)
                    alert(data.error || 'Account creation failed. Please try again.');
                    btnNext.textContent = 'Create Account';
                    btnNext.disabled = false;
                }
            } catch (err) {
                console.error('Fetch error:', err);
                alert('Could not connect to the server. Please try again.');
                btnNext.textContent = 'Create Account';
                btnNext.disabled = false;
            }
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
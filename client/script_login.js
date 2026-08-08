const loginForm = document.getElementById('login-form');
const btnLogin = document.getElementById('btn-login');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page reload
              
    // Visual feedback for the user
    const originalText = btnLogin.textContent;
    btnLogin.textContent = 'Authenticating...';
    btnLogin.style.opacity = '0.8';
    btnLogin.disabled = true;

    const payload = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }

    try{
        const response = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok){

            // 1. CRITICAL: Save the token and user data to the browser!
            localStorage.setItem('access_token', data.access_token);
            if (data.user) {
                localStorage.setItem('user_first_name', data.user.first_name);
                localStorage.setItem('user_last_name', data.user.last_name);
                localStorage.setItem('user_email', data.user.email);
            }


            document.querySelector('.wizard-container').innerHTML = `
            <div style="text-align: center; padding: 40px 0;">
                <div style="font-size: 50px; margin-bottom: 20px;">🎉</div>
                    <h1 style="color: #1b1464; margin-top: 0;">Login Succes!</h1>
                    <p style="color: #64748b; margin-bottom: 30px;">Welcome to TBZ Car Rental.</p>
                    <a href="login.html" class="btn btn-next" style="text-decoration: none;">Redirecting to main page...</a>
            </div>
        `;


        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);

        } else{
            alert(data.error || 'Login Failed. Please try again.');
            btnLogin.textContent = originalText;
            btnLogin.style.opacity = '1';
            btnLogin.disabled = false;
        }
    } catch(err){
        console.error('Fetch error:', err);
        alert('Could not connect to Server. Please try again.')
        btnLogin.style.opacity = '1';
        btnLogin.textContent = originalText;
        btnLogin.disabled = false;
    }
});
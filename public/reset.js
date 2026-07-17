// Reset form.

const form = document.querySelector('form');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');

   form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get the values.
        
        const paths = window
            .location
            .pathname
            .split("/")
            .filter(path => path !== "");

        const token = (paths[paths.length - 1]);
        const email = form.email.value;
        const password = form.password.value;


        try {
            const res = await fetch(`/reset/token/${token}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({email, password})
            });

            if (!res.ok) {
                throw new Error("Could not fetch ressource");
            }

            const data = await res.json();
            console.log(data);

                if (data.errors) {
                    emailError.textContent = data.errors.email;
                    passwordError.textContent = data.errors.password;
                    confirmPasswordError.textContent = data.errors.confirmPassword;
                }

                if (data.user) {
                    location.assign('/user');
                }

        } catch (error) {
            console.log(error);
        }
   })
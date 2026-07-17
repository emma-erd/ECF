// Login form.

const form = document.querySelector('form');
   const emailError = document.getElementById('emailError');
   const passwordError = document.getElementById('passwordError');

   form.addEventListener('submit', async (e) => {
       e.preventDefault();

       // Get the values.
       const email = form.email.value;
       const password = form.password.value;

       try {
           const res = await fetch('/login', {
               method: 'POST',
               body: JSON.stringify({ email, password }),
               headers: { 'Content-Type': 'application/json'}
           });
           const data = await res.json();
           console.log(data);

               if (data.errors) {
                   emailError.textContent = data.errors.email;
                   passwordError.textContent = data.errors.password;
               }

               if (data.user) {
                   location.assign('/user');
               }

       } catch (err) {
           console.log(err);
       }
   })
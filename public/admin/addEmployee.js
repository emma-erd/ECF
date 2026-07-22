// Register employe form.

const form = document.querySelector('form');
const firstNameError = document.getElementById('firstNameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

   form.addEventListener('submit', async (e) => {
       e.preventDefault();

       // Get the values.
       const firstName = form.firstName.value;
       const email = form.email.value;
       const password = form.password.value;

       try {
           const res = await fetch('/admin/addEmployee', {
               method: 'POST',
               body: JSON.stringify({ firstName, email, password }),
               headers: { 'Content-Type': 'application/json'}
           });
           const data = await res.json();
           console.log(data.user.role);

               if (data.errors) {
                    firstNameError.textContent = data.errors.firstName;
                   emailError.textContent = data.errors.email;
                   passwordError.textContent = data.errors.password;
               }

               if (data.user) {
                    location.assign('/admin/employees');
                }

       } catch (err) {
           console.log(err);
       }
   })
// Forgot form.

const form = document.querySelector('form');
   const emailError = document.getElementById('emailError');

   form.addEventListener('submit', async (e) => {
       e.preventDefault();

       // Get the values.
       const email = form.email.value;

       try {
           const res = await fetch('/forgot', {
               method: 'POST',
               body: JSON.stringify({ email }),
               headers: { 'Content-Type': 'application/json'}
           });
           const data = await res.json();
           console.log(data);

               if (data.errors) {
                   emailError.textContent = data.errors.email;
               }

               if (data.user) {
                   //location.assign('/data');
               }

       } catch (err) {
           console.log(err);
       }
   })
   // Register form.

   const form = document.querySelector('form');
   const firstNameError = document.getElementById('firstNameError');
   const lastNameError = document.getElementById('lastNameError');
   const emailError = document.getElementById('emailError');
   const passwordError = document.getElementById('passwordError');
   const phoneError = document.getElementById('phoneError');
   const postCodeError = document.getElementById('postCodeError');
   const addressError = document.getElementById('addressError');
   const cityError = document.getElementById('cityError');


   form. addEventListener('submit', async (e) => {
       e.preventDefault();

       // Get the values.
       const firstName = form.firstName.value;
       const lastName = form.lastName.value;
       const email = form.email.value;
       const password = form.password.value;
       const phone = form.phone.value;
       const postCode = form.postCode.value;
       const address = form.address.value;
       const city = form.city.value;

       try {
           const res = await fetch('/register', {
               method: 'POST',
               body: JSON.stringify({ firstName, lastName, email, password, phone, postCode, address, city }),
               headers: { 'Content-Type': 'application/json'}
           });
           const data = await res.json();
           console.log(data);

               if (data.errors) {
                    firstNameError.textContent = data.errors.firstName;
                    lastName.textContent = data.errors.lastName;
                    emailError.textContent = data.errors.email;
                    passwordError.textContent = data.errors.password;
                    phoneError.textContent = data.errors.phone;
                    postCodeError.textContent = data.errors.postCode;
                    addressError.textContent = data.errors.address;
                    cityError.textContent = data.errors.city;
               }

               if (data.user) {
                   location.assign('/user');
               }

       } catch (err) {
           console.log(err);
       }
   })
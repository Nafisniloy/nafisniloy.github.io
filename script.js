const loadMoreBtn = document.getElementById('load-more');
let visibleProjects = 3;
// write code to initially show three projects only
const allProjects = document.querySelectorAll('.project-card');
window.onload = () => {
    console.log('Window loaded successfully');
  allProjects.forEach((project, index) => {
    if (index >= visibleProjects) {
      project.style.display = 'none';
    }
  });
};


loadMoreBtn.addEventListener('click', () => {
  const allProjects = document.querySelectorAll('.project-card');
  for (let i = visibleProjects; i < visibleProjects + 3; i++) {
    if (allProjects[i]) {
      allProjects[i].style.display = 'block';
    }
  }
  visibleProjects += 3;
  if (visibleProjects >= allProjects.length) {
    loadMoreBtn.style.display = 'none'; // Hide button when all projects are loaded
  }
});


document.getElementById('contact-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const status = document.getElementById('status');
  const submitBtn = document.getElementById('submit-btn');

  // Display sending animation
  status.classList.add('sending');
  status.textContent = 'Sending...';
  
   // EmailJS integration
  emailjs.init('gD8n3KFLY0wOentDL'); // Replace with your public key
  
  const serviceID = 'service_fc98qrh'; // Replace with service ID
  const templateID = 'template_dou7wdd'; // Replace with template ID
  const templateParams = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value
  };

  emailjs.send(serviceID, templateID, templateParams)
    .then(function(response) {
      status.classList.remove('sending');
      status.classList.add('sent');
      status.textContent = 'Message sent!';
    }, function(error) {
      status.classList.remove('sending');
      status.classList.add('error');
      status.textContent = 'Failed to send message. Try again!';
    });

  document.getElementById('contact-form').reset();
});

 
document.querySelectorAll('.toggle-password').forEach(icon => {
  const input = icon.previousElementSibling;
  
  // Başlangıçta ikon durumunu input tipine göre ayarla
  if(input.getAttribute('type') === 'password') {
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }

  icon.addEventListener('click', () => {
    const isPassword = input.getAttribute('type') === 'password';
    input.setAttribute('type', isPassword ? 'text' : 'password');

    if(isPassword) {
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    } else {
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    }
  });
});

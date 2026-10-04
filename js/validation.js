const form = document.getElementById('contact-form');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function check(field) {
  const v = field.value.trim();
  let msg = '';
  if (!v) msg = 'This field is required.';
  else if (field.type === 'email' && !emailPattern.test(v)) msg = 'Enter an email like name@example.com.';
  else if (field.id === 'message' && v.length < 10) msg = 'Write at least 10 characters.';
  document.getElementById(field.id + '-error').textContent = msg;
  field.classList.toggle('invalid', !!msg);
  return !msg;
}

const fields = [...form.querySelectorAll('input, textarea')];
fields.forEach(f => f.addEventListener('blur', () => check(f)));

form.addEventListener('submit', e => {
  e.preventDefault();
  const ok = fields.map(check).every(Boolean);
  const success = document.getElementById('form-success');
  if (ok) {
    success.textContent = 'Message sent. Maya will reply soon.';
    form.reset();
  } else {
    success.textContent = '';
    fields.find(f => f.classList.contains('invalid')).focus();
  }
});

const targetDiv = document.querySelector('.pal h2');
const button = document.createElement('button');
button.innerText = 'Show Images';
targetDiv.insertAdjacentElement('afterend', button);

const showWindow = (htmlContent) => {
  const newWindow = window.open('', '_blank', 'width=600,height=400');
  newWindow.document.write('<html><head><title>Images</title></head><body>');
  newWindow.document.write('<div style="display: grid; grid-template-columns: repeat(8, 1fr); grid-gap: 10px;">');
  newWindow.document.write(htmlContent);
  newWindow.document.write('</div></body></html>');
};

button.addEventListener('click', () => {
  let images = document.querySelectorAll('label.presence-user.pam.success.checked img');
  let htmlContent = '';
  
  images.forEach(img => {
    const altText = img.alt || '';
    htmlContent += `<div style="text-align: center;"><img style="width: 100px; height: 100px; object-fit: cover;" src="${img.src}" alt="${altText}"><br><p>${altText}</p></div>`;
  });

  if (htmlContent) {
    showWindow(htmlContent);
  } else {
    console.error('No images found');
  }
});

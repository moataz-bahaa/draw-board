const canvas = document.querySelector('canvas'),
  fillColor = document.querySelector('#fill-color'),
  sizeSlider = document.querySelector('#size-slider'),
  colorBtns = document.querySelectorAll('.colors .option'),
  colorPicker = document.querySelector('#color-picker'),
  ctx = canvas.getContext('2d'),
  tools = document.querySelectorAll('.tool');

let isDrawing = false,
  brushWidth = sizeSlider.value,
  selectedTool = 'brush',
  prevMouseX,
  prevMouseY,
  snapshot,
  selectedColor = '#000';

const setCanvasBackground = () => {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

const drawRect = (x, y) => {
  if (fillColor.checked) {
    ctx.fillRect(x, y, prevMouseX - x, prevMouseY - y);
  } else {
    ctx.strokeRect(x, y, prevMouseX - x, prevMouseY - y);
  }
};

const drawCircle = (x, y) => {
  const radius = Math.sqrt(Math.pow(prevMouseX - x, 2) + Math.pow(prevMouseY - y, 2));
  ctx.beginPath();
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawTrianlge = (x, y) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(x, y);
  ctx.lineTo(prevMouseX * 2 - x, y);
  // ctx.lineTo(prevMouseX, prevMouseY);
  ctx.closePath(); // third line is drawed automatically
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawLine = (x, y) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(x, y);
  ctx.stroke();
};

const drawing = (e) => {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0);
  switch (selectedTool) {
    case 'brush':
    case 'eraser':
      ctx.strokeStyle = selectedTool === 'eraser' ? '#fff' : selectedColor;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      break;
    case 'rectangle':
      drawRect(e.offsetX, e.offsetY);
      break;
    case 'triangle':
      drawTrianlge(e.offsetX, e.offsetY);
      break;
    case 'circle':
      drawCircle(e.offsetX, e.offsetY);
      break;
    case 'line':
      drawLine(e.offsetX, e.offsetY);
      break;
    default:
      break;
  }
};

const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const stopDraw = () => {
  isDrawing = false;
};

window.addEventListener('load', (e) => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

tools.forEach((tool) => {
  tool.addEventListener('click', () => {
    document.querySelector('.options .option.active')?.classList.remove('active');
    tool.classList.add('active');
    selectedTool = tool.id;
  });
});

colorBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelector('.colors .option.selected')?.classList.remove('selected');
    btn.classList.add('selected');
    selectedColor = getComputedStyle(btn).backgroundColor;
  });
});

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mouseup', stopDraw);
canvas.addEventListener('mouseleave', stopDraw);
canvas.addEventListener('mousemove', drawing);

sizeSlider.addEventListener('change', () => {
  brushWidth = +sizeSlider.value;
});

// clear board
document.querySelector('.clear').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.querySelector('.save-img').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = `${Date.now()}.jpg`;
  const imgUrl = canvas.toDataURL('image/jpg');
  link.href = imgUrl;
  link.click();
});

colorPicker.addEventListener('change', (e) => {
  colorPicker.parentElement.style.background = e.target.value;
  colorPicker.parentElement.click();
});

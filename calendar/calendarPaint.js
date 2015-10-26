var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

registerPaint('event', function(ctx, width, height, styleMap) {
  //console.log(JSON.stringify(styleMap));


  var x = days.indexOf(styleMap['--day'].trim());

  var time = Number(styleMap['--time']);
  var y = Math.floor(time / 100) - 9;
  y += (time % 100) / 60;

  var duration = Number(styleMap['--duration']) / 60;

  var posX = Math.floor(x / 7 * width);
  var posY = Math.floor(y / 8 * height);
  var posWidth = Math.floor(width / 7);
  var posHeight = Math.floor(duration * height / 8);

  var mouseX = Number(styleMap['--x']);
  var mouseY = Number(styleMap['--y']);


  var pp = [{x: posX, y: posY}, {x: posX + posWidth, y: posY}, {x: posX + posWidth, y: posY + posHeight}, {x: posX, y: posY + posHeight}];
  var sp = [{x: posX, y: posY}, {x: posX + posWidth, y: posY}, {x: posX + posWidth, y: posY + posHeight}, {x: posX, y: posY + posHeight}];
  var dragging = styleMap['--state'].trim() == 'dragging';
  var title = styleMap['--title'].trim();
  title = title.slice(1, title.length - 1);

  if (dragging) {
    var dx = Number(styleMap['--dx'].trim());
    var dy = Number(styleMap['--dy'].trim());


    var deltax = posX - dx + mouseX;
    var deltay = posY - dy + mouseY;

    var xSnapped = false;
    var ySnapped = false;

    var snapx = deltax * 7 / width;
    if (Math.abs(snapx - Math.round(snapx)) < 0.1) {
      deltax = Math.round(snapx) * width / 7;
      xSnapped = true;
    }

    var snapy = deltay * 16 / height;
    if (Math.abs(snapy - Math.round(snapy)) < 0.2) {
      deltay = Math.round(snapy) * height / 16;
      ySnapped = true;
    }
      
    if (xSnapped && ySnapped) {
      ctx.fillStyle = 'rgba(87, 187, 138, 0.33)';
    } else {
      ctx.fillStyle = 'rgba(123, 170, 247, 0.33)';
    }
    ctx.fillRect(deltax, deltay, posWidth, posHeight);

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.font = '14px';
    ctx.strokeText(title, deltax + 8, deltay + 14);
    

    var dx = mouseX - dx;
    if (dx < 0) {
      pp[1].x += dx/20;
      pp[1].y += dx/40;
      pp[2].x += dx/20;
      pp[2].y -= dx/40;

      sp[1].x -= dx/80;
      sp[1].y += dx/40;
      sp[2].x -= dx/80;
      sp[2].y -= dx/40;
    } else {
      pp[0].x += dx/20;
      pp[0].y -= dx/40;
      pp[3].x += dx/20;
      pp[3].y += dx/40;

      sp[0].x -= dx/80;
      sp[0].y -= dx/40;
      sp[3].x -= dx/80;
      sp[3].y += dx/40;
    }

    var dy = mouseY - dy;
    if (dy < 0) {
      pp[2].x -= dy/40;
      pp[2].y += dy/20;
      pp[3].x += dy/40;
      pp[3].y += dy/20;

      sp[2].x -= dy/40;
      sp[2].y -= dy/80;
      sp[3].x += dy/40;
      sp[3].y -= dy/80;
    } else {
      pp[1].x += dy/40;
      pp[1].y += dy/20;
      pp[0].x -= dy/40;
      pp[0].y += dy/20;

      sp[1].x += dy/40;
      sp[1].y -= dy/80;
      sp[0].x -= dy/40;
      sp[0].y -= dy/80;
    }
  }

  ctx.fillStyle = 'black';
  ctx.shadowBlur = 2;
  ctx.shadowColor = '#9E9E9E';
  ctx.shadowOffsetX = 1 + 2 * width;
  ctx.shadowOffsetY = 5;
  ctx.moveTo(sp[0].x - 2 * width, sp[0].y);
  ctx.lineTo(sp[1].x - 2 * width, sp[1].y);
  ctx.lineTo(sp[2].x - 2 * width, sp[2].y);
  ctx.lineTo(sp[3].x - 2 * width, sp[3].y);
  ctx.lineTo(sp[0].x - 2 * width, sp[0].y);

  ctx.fill();

  ctx.beginPath();

  ctx.fillStyle = styleMap['--color'].trim();
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.moveTo(pp[0].x, pp[0].y);
  ctx.lineTo(pp[1].x, pp[1].y);
  ctx.lineTo(pp[2].x, pp[2].y);
  ctx.lineTo(pp[3].x, pp[3].y);
  ctx.lineTo(pp[0].x, pp[0].y);

  ctx.fill();

  ctx.beginPath();

  ctx.rect(posX, posY, posWidth, posHeight);
  ctx.clip();


  if (!dragging) {
    ctx.strokeText(title, posX + 8, posY + 14);
  }

  var r = parseInt(ctx.fillStyle.slice(1, 3), 16);
  var g = parseInt(ctx.fillStyle.slice(3, 5), 16);
  var b = parseInt(ctx.fillStyle.slice(5, 7), 16);

  if (mouseX >= posX && mouseX <= posX + posWidth && mouseY >= posY && mouseY <= posY + posHeight) {
    var gradient = ctx.createRadialGradient(mouseX, mouseY, 35, mouseX, mouseY, 4);
    gradient.addColorStop(0, "rgba(" + r + ", " + g + ", " + b + ", 0)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0.3)");
    ctx.fillStyle = gradient;
    ctx.fillRect(mouseX - 30, mouseY - 30, 60, 60);
  }

}, ['--day', '--time', '--duration', '--color', '--x', '--y']);

registerPaint('background', function(ctx, width, height, styleMap) {
  ctx.beginPath();
  ctx.strokeStyle = '#E0E0E0';
  for (var i = 1; i < 7; i++) {
    ctx.moveTo(Math.floor(i * width / 7), 0);
    ctx.lineTo(Math.floor(i * width / 7), height);
  }
  
  ctx.stroke();

  for (var i = 1; i < 16; i++) {
    ctx.beginPath();
    if (i % 2)
      ctx.strokeStyle = '#F5F5F5';
    else  
      ctx.strokeStyle = '#E0E0E0';
    ctx.moveTo(0, Math.floor(i * height / 16));
    ctx.lineTo(width, Math.floor(i * height / 16));
    ctx.stroke();
  }

}, ['--update'])

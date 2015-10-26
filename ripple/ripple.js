'use strict';

const tokenIndexKeys = [
  'x', 'y', 'progress', 'released'
];

const maxRadius = 300;

function radius(containerWidth, containerHeight, progress) {
  let width2 = containerWidth * containerWidth;
  let height2 = containerHeight * containerHeight;
  let waveRadius = Math.min(
    Math.sqrt(width2 + height2),
    maxRadius
  ) * 1.1 + 5;
  let duration = 1.1 - 0.2 * (waveRadius / maxRadius);
  let timeNow = progress / duration;
  let size = waveRadius * (1 - Math.pow(80, -timeNow));

  return Math.abs(size);
}

function clamp(progress, low, high) {
  return progress < low ? low :
         progress > high ? high :
         progress;
}

function alpha(progress) {
  progress = clamp(progress, 0, 1);
  return Math.sin(Math.PI * progress) / 2;
}

function parseRipples(ripples) {
  return ripples.split(',').map(function(ripple) {
    return ripple.split(' ').reduce(function(ripple, token, index) {
      ripple[tokenIndexKeys[index]] = parseFloat(token);
      return ripple;
    }, {});
  });
}

registerPaint('ripples', function(context, width, height, style) {
  let ripples = parseRipples(style['--ripples']);
  let pressedDuration = parseFloat(style['--ripple-pressed-duration']);
  let releasedDuration = parseFloat(style['--ripple-released-duration']);
  let color = style['--ripple-color'] || 'blue';

  context.fillStyle = color;
  ripples.forEach(function(ripple) {
    let progress = ripple.released ?
      ripple.progress + ripple.released : ripple.progress
    let currentRadius = radius(
      width,
      height,
      progress
    );
    let halfCurrentRadius = currentRadius / 2;

    context.save();
    context.globalAlpha = alpha(progress);
    context.beginPath();
    context.arc(
      ripple.x,
      ripple.y,
      currentRadius,
      0,
      Math.PI * 2
    );
    context.fill();
    context.restore();
  });
}, ['--ripple-pressed-duration', '--ripple-released-duration', '--ripples', '--ripple-color']);


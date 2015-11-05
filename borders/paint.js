var drawLine = function(ctx, grad, x1, y1, x2, y2) {
    var gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, 'black');
    gradient.addColorStop(0.5, 'black');
    gradient.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = grad ? gradient : 'black';
    ctx.stroke();
};

registerPaint('border', function(ctx, w, h, styleMap) {
    var type = (styleMap.get('--border-corner-type').value).split(',');
    var length = styleMap.get('--border-corner-length').value;
    var width = (styleMap.get('--border-corner-width').value || 1) * 2;
    var gradient = !!styleMap.get('--border-corner-gradient').value;

    ctx.imageSmoothingEnabled = false;
    ctx.lineWidth = width;

    try {
        if (parseInt(type[0])) {
            drawLine(ctx, gradient, 0, 0, length, 0);
            drawLine(ctx, gradient, 0, 0, 0, length);
        }

        if (parseInt(type[1])) {
            drawLine(ctx, gradient, w, 0, w-length, 0);
            drawLine(ctx, gradient, w, 0, w, length);
        }

        if (parseInt(type[2])) {
            drawLine(ctx, gradient, w, h, w-length, h);
            drawLine(ctx, gradient, w, h, w, h-length);
        }

        if (parseInt(type[3])) {
            drawLine(ctx, gradient, 0, h, length, h);
            drawLine(ctx, gradient, 0, h, 0, h-length);
        }
    } catch (e) {
        console.log(e);
    }
}, ['--border-corner-type', '--border-corner-length', '--border-corner-width']);

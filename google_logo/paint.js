var HALF_STROKE_WIDTH = 0.55 / 2;
var LISTENING_WOBBLE = 0.4;
var LISTENING_SMOOTHING_MULTIPLIER = [0.6, 1, 1, 0.6];

var interpolate = function(start, end, time) {
    return (1-time)*start + time*end;
};

var Interpolator = function(relativeLengthOfMainChange, startDelay) {
    this.relativeLengthOfMainChange = relativeLengthOfMainChange;
    this.startDelay = Math.min(1-relativeLengthOfMainChange, startDelay);
};

Interpolator.prototype.interpolate = function(input) {
    var val = (input - this.startDelay) / this.relativeLengthOfMainChange;
    val = Math.max(0, Math.min(1, val));
    return (input + val) / 2;
};

var Stroker = function(x, y, dotX, dotY, draw, interpolator, red) {
    this.x = x;
    this.y = y;
    this.dotX = dotX;
    this.dotY = dotY;
    this.draw = draw;
    this.interpolator = interpolator;
    this.red = !!red;
};

var drawUppercaseG = function(ctx, time) {
    ctx.save();
    ctx.strokeStyle = 'rgb(66,133,244)';
    var x = interpolate(this.dotX, this.x, time);
    var y = interpolate(this.dotY, this.y, time);
    var radius = interpolate(0, 1.8, time);
    if (radius < 0.5) {
        ctx.beginPath();
        ctx.arc(x, y, 0.275, 0, 2*Math.PI);
        ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.moveTo(x + 0.1, y);
        ctx.lineTo(x + radius, y);
        ctx.arc(x, y, radius, 0, 315/180*Math.PI);
        ctx.stroke();
    }
    ctx.restore();
};

var drawLowercaseO = function(ctx, time) {
    ctx.save();
    ctx.strokeStyle = this.red ? 'rgb(234,67,53)' : 'rgb(251,188,5)';
    var x = interpolate(this.dotX, this.x, time);
    var y = interpolate(this.dotY, this.y, time);
    var radius = Math.max(0.275, interpolate(0, 1.1, time));
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2*Math.PI);
    ctx.stroke();
    ctx.restore();
};

var drawLowercaseG = function(ctx, time) {
    ctx.save();
    ctx.strokeStyle = 'rgb(66,133,244)';
    var x = interpolate(this.dotX, this.x, time);
    var y = interpolate(this.dotY, this.y, time);
    var radius = interpolate(0, 1.05, time);
    if (radius < 0.275) {
        ctx.save();
        ctx.lineWidth = radius * 2;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2*Math.PI);
        ctx.stroke();
        ctx.restore();
    } else {
        ctx.beginPath();
        ctx.moveTo(x + radius, y - radius - HALF_STROKE_WIDTH);
        ctx.lineTo(x + radius, y + radius + HALF_STROKE_WIDTH);
        ctx.ellipse(x, y + HALF_STROKE_WIDTH + radius, radius, radius, 0, 0, 160/180*Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2*Math.PI);
        ctx.stroke();
    }
    ctx.restore();
};

var drawLowercaseL = function(ctx, time) {
    ctx.save();
    ctx.strokeStyle = 'rgb(52,168,83)';
    var x = interpolate(this.dotX, this.x, time);
    var y1 = interpolate(this.dotY, 1.33, time);
    var y2 = interpolate(this.dotY, -2.75, time);
    var radius = (y1 - y2) / 4;
    if (radius < 0.275) {
        ctx.beginPath();
        ctx.arc(x, (y1 + y2) / 2, 0.275, 0, 2*Math.PI);
        ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.moveTo(x,y1);
        ctx.lineTo(x,y2);
        ctx.stroke();
    }
    ctx.restore();
};

var drawLowercaseE = function(ctx, time) {
    ctx.save();
    ctx.strokeStyle = 'rgb(234,67,53)';
    var x = interpolate(this.dotX, this.x, time);
    var y = interpolate(this.dotY, this.y, time);
    var radius = interpolate(0, 1.05, time);
    if (radius < 0.275) {
        ctx.save();
        ctx.lineWidth = radius * 2;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2*Math.PI);
        ctx.stroke();
        ctx.restore();
    } else {
        var lineRadius = radius + HALF_STROKE_WIDTH;
        var startAngle = 160/180*Math.PI;
        var startX = x + Math.cos(startAngle) * radius;
        var startY = y + Math.sin(startAngle) * radius;
        var endAngle = 335/180*Math.PI;
        var endX = x + Math.cos(endAngle) * lineRadius;
        var endY = y + Math.sin(endAngle) * lineRadius;
        ctx.beginPath();
        ctx.arc(x, y, radius, 30/180*Math.PI, 335/180*Math.PI);
        ctx.moveTo(endX, endY);
        ctx.lineTo(startX, startY);
        ctx.stroke();
    }
    ctx.restore();
};

var GOOGLE_LOGO = [
    new Stroker(-6.65, -0.7, -3, 0, drawUppercaseG, new Interpolator(.5, 0)),
    new Stroker(-2.95, 0, -1, 0, drawLowercaseO, new Interpolator(.5, .1), true),
    new Stroker(0.1, 0, 1, 0, drawLowercaseO, new Interpolator(.5, .2)),
    new Stroker(5.1, 0, 3, 0, drawLowercaseL, new Interpolator(.5, .3)),
    new Stroker(3.05, 0, 2, 0, drawLowercaseG, new Interpolator(.5, .4)),
    new Stroker(7.1, 0, 4, 0, drawLowercaseE, new Interpolator(.5, .5))
];

registerPaint('logo', function(ctx, width, height, styleMap) {
    var actualTime = styleMap.get('--scale').value;
    var totalTime = styleMap.get('--total').value || 0;
    console.log(actualTime);

    ctx.translate(width / 2, height / 2);
    var factor = Math.min(width, height) / 2 / 9; // MAGIC!
    ctx.scale(factor, factor);

    try {
        for (var i = 0; i < 4; i++) {
            var yDiff = Math.sin(Math.PI / 700 * totalTime + i * Math.PI / 2) * LISTENING_WOBBLE + LISTENING_WOBBLE;
            yDiff *= LISTENING_SMOOTHING_MULTIPLIER[i];
            GOOGLE_LOGO[i].dotY = yDiff;
        }

        ctx.lineWidth = 0.55;// interpolate(0.5, 0.55, time);

        for (var i = 0; i < GOOGLE_LOGO.length; i++) {
            var stroker = GOOGLE_LOGO[i];
            var time = stroker.interpolator.interpolate(actualTime);
            stroker.draw(ctx, time);
        }
    } catch (e) {
        console.log(e);
    }

}, ['--scale', '--total']);

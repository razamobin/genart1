const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {

  const colorCount = 5;//random.rangeFloor(2, 6);
  const palette = random.shuffle(random.pick(palettes)).slice(0,colorCount);
  console.log(palette);

  const createGrid = () => {
    const points = [];
    const count = 50;
    for (let x = 0; x < count; x++) {
        for (let y = 0; y < count; y++) {
            const u = count <= 1? 0.5 : x / (count - 1);
            const v = count <= 1? 0.5 : y / (count - 1);

            // better to use u and v for this, because they are between 0 and 1
            const freq = 10;
            const radius = Math.abs(random.noise2D(freq*u, freq*v))*.1;

            points.push({
                color: random.pick(palette),
                radius: radius,//Math.abs(0.01 +  random.gaussian()*.01),
                rotation: random.noise2D(1.1*u, 1.1*v),
                position: [u,v]
            });
        }
    }
    return points;

  };

  //random.setSeed(1);
  const points = createGrid().filter(() => random.value() > .7);
  const margin = 400;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0,0,width,height);

    points.forEach(data => {
        const {
            color,
            position,
            radius,
            rotation
        } = data;

        const [u,v] = position;

        const x = lerp(margin, width - margin, u);//u*width;
        const y = lerp(margin, height - margin, v);//u*width;

/*
        context.beginPath();
        context.arc(x,y,radius*width,0,Math.PI*2, false);
        context.strokeStyle = 'black';
        context.fillStyle = color;
        context.fill();
        //context.lineWidth = 4;
        //context.stroke();
        */

        context.save();
        context.fillStyle = color;
        //context.font = '${radius*width*100}px "serif"';
        fsize = Math.round(radius*width*1.2);
        context.font = `${fsize}px "serif"`;
        context.translate(x,y);
        context.rotate(Math.PI*.5 + rotation);
        context.fillText("`", 0, 0);
        context.rect(10,10,0,0);
        context.fill();


        context.restore();

    });
  };
};

canvasSketch(sketch, settings);

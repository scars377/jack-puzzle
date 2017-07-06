function init() {
  // Aliases
  const Texture = PIXI.Texture;
  const Sprite = PIXI.Sprite;

  const GRAVITY = 1;
  const DECAY = 0.98;
  const STATES = ['fall', 'game', 'kill'];
  const logic = {
    dropCounter: 40,
    state: STATES[0],
    setState(pState) {
      this.state = pState;
      if (this.state == 'fall') {
        const newTexture = getNextTexture();
        sheep.visible = true;
        sheep.filters = [sheepBlurFilter];
      }
    },
    updatePointer() {
      const p = renderer.plugins.interaction.mouse.global;
      if (p.x < 0 || p.y < 0) {
        p.x = window.innerWidth >> 1;
        p.y = window.innerHeight / 3;
      }
      pointer.x += (p.x - pointer.x) * 0.17;
      pointer.y += (p.y - pointer.y) * 0.17;
      return p;
    },
    reset() {
      sheep.y = -400;
      sheep.vx = sheep.vy = 0;
      this.dropCounter = 40;
    },
    onTick() {
      switch (this.state) {
        case STATES[0]:
          sheep.vy += GRAVITY;
          sheep.vx *= DECAY;
          sheep.vy *= DECAY;
          sheep.x += sheep.vx;
          sheep.y += sheep.vy;
          if (sheep.y > pointer.y) {
            ball.visible = true;
            this.setState(STATES[1]);
          }
          var p = this.updatePointer();
          sheep.x = p.x;
          ball.x = sheep.x;
          ball.y = sheep.y;
          sheepBlurFilter.blurX = 0;
          sheepBlurFilter.blurY = 8;
          break;
        case STATES[1]:
          this.updatePointer();

          var absVX = Math.abs(sheep.vx);
          var absVY = Math.abs(sheep.vy);
          if (absVX > 34 || absVY > 34) {
            if (this.dropCounter > 0) {
              this.dropCounter--;
            } else if (sheep.vy <= 0 && sheep.y < 260) {
              this.setState(STATES[2]);
            }
          }
          chainerBall(ball, 180);
          chainerSheep(ball, sheep, 5);
          break;
        case STATES[2]:
          this.updatePointer();
          sheep.vy += GRAVITY;
          sheep.vx *= DECAY;
          sheep.vy *= DECAY;
          sheep.x += sheep.vx;
          sheep.y += sheep.vy;
          shape.clear();
          ball.visible = false;
          if (sheep.y > window.innerHeight + 100) {
            this.reset();
            this.setState(STATES[0]);
          }
          break;
      }
    },
  };


  const stage = new PIXI.Container();
  var renderer = PIXI.autoDetectRenderer(
    window.innerWidth,
    640,
    { antialias: true }
  );
  renderer.backgroundColor = 0xffffff;
  renderer.view.style.display = 'block';
  document.getElementById('canvas_wrap').appendChild(renderer.view);


  var shape = new PIXI.Graphics();
  window.shape = shape;
  stage.addChild(shape);

  let textureIndex = -1;
  const textureArr = [
    PIXI.Texture.fromImage(require('../jack_thumb.png')),
  ];
  var getNextTexture = function () {
    textureIndex++;
    textureIndex %= textureArr.length;
    return textureArr[textureIndex];
  };
  const texture = textureArr[0];
  const sheepAvator = new PIXI.Sprite(texture);
  sheepAvator.pivot.set(95, 50);
  sheepAvator.vx = 0;
  sheepAvator.vy = 0;
  sheepAvator.visible = false;
  stage.addChild(sheepAvator);

  var sheep = sheepAvator;


  var sheepBlurFilter = new PIXI.filters.BlurFilter();
  sheep.filters = [sheepBlurFilter];

  var pointer = new PIXI.Graphics();
  pointer.beginFill(0xFF3300);
  pointer.drawCircle(0, 0, 10);
  stage.addChild(pointer);

  var ball = new PIXI.Graphics();
  ball.vx = 0;
  ball.vy = 0;
  ball.beginFill(0);
  ball.drawCircle(0, 0, 8);
  stage.addChild(ball);

  const w2 = window.innerWidth >> 1;
  const h2 = window.innerHeight / 3;
  sheep.y = -1000;
  sheep.rotation = Math.PI / -2;
  sheep.x = pointer.x = ball.x = w2;
  pointer.y = ball.y = h2;


  function chainerBall(ball, lineLength) {
    const pointerX = pointer.x;
    const pointerY = pointer.y;
    const ballX = ball.x;
    const ballY = ball.y;
    let ballNewX = ball.x;
    let ballNewY = ball.y;
    ball.vy += GRAVITY;
    ball.vx *= DECAY;
    ball.vy *= DECAY;
    ballNewX += ball.vx;
    ballNewY += ball.vy;
    const a = pointerX - ballNewX;
    const b = pointerY - ballNewY;
    const distance = Math.sqrt(a * a + b * b);
    const g = shape;
    if (distance > lineLength) {
      ballNewX = pointerX - (a / distance * lineLength);
      ballNewY = pointerY - (b / distance * lineLength);
      ball.vx = ballNewX - ballX;
      ball.vy = ballNewY - ballY;
      g.clear();
      g.lineStyle(3, 0);
      g.moveTo(ballNewX, ballNewY);
      g.lineTo(pointerX, pointerY);
    } else {
      g.clear();
      g.lineStyle(4, 0);
      g.moveTo(ballNewX, ballNewY);
      const controlX = (ballNewX + pointerX) / 2;
      const controlY = (ballNewY + pointerY) / 2;
      g.quadraticCurveTo(controlX, controlY + (lineLength - distance), pointerX, pointerY);
    }
    // 3.0.7 Graphics Bug
    g.currentPath.shape.closed = false;
    //
    ball.x = ballNewX;
    ball.y = ballNewY;
  }

  function chainerSheep(ball, sheep, lineLength) {
    const ballX = ball.x;
    const ballY = ball.y;
    const oldx = sheep.x;
    const oldy = sheep.y;
    let newX = sheep.x;
    let newY = sheep.y;
    sheep.vy += GRAVITY;
    sheep.vx *= DECAY;
    sheep.vy *= DECAY;
    newX += sheep.vx;
    newY += sheep.vy;
    const a = ballX - newX;
    const b = ballY - newY;
    const distance = Math.sqrt(a * a + b * b);
    const PI = Math.PI;
    let rotation = sheep.rotation;
    const angle = Math.atan2(b, a);
    const radian = angle;
    let newAngle = radian - rotation;
    if (newAngle > PI) {
      newAngle -= PI * 2;
    } else if (newAngle < -PI) {
      newAngle += PI * 2;
    }
    rotation += newAngle * 0.3;
    sheep.rotation = rotation;

    if (distance > lineLength) {
      newX = ballX - a / distance * lineLength;
      newY = ballY - b / distance * lineLength;
      sheep.vx = newX - oldx;
      sheep.vy = newY - oldy;
    }
    sheep.x = newX;
    sheep.y = newY;
    sheepBlurFilter.blurX = Math.abs(sheep.vx);
    sheepBlurFilter.blurY = Math.abs(sheep.vy);
  }


  function animate() {
    logic.onTick();
    renderer.render(stage);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
  logic.setState(STATES[0]);
}

export default {
  init,
};

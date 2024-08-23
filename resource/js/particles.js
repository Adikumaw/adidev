let canvas = document.getElementById("c");
let ctx = canvas.getContext("2d");
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

let NUM_PARTICLES = 700;
if (width > 1200) NUM_PARTICLES = 1000;

let verly = new Verly(16, canvas, ctx);
let mouse = new Point(0, 0).setForceAcc(-30).setRadius(100);

let mBehavior = 2;
window.addEventListener("mousemove", (e) => {
  if (e.altKey) addParticles(e.offsetX, e.offsetY);

  mouse.pos.setXY(e.clientX, e.clientY);
});

window.addEventListener("mousedown", () => (mBehavior = -5));
window.addEventListener("mouseup", () => (mBehavior = 5));

let particles = new Entity(16, verly);
function addParticles(x, y) {
  particles.addPoint(x, y).setRadius(4).setGravity(new Vector(0, 0));
}

for (let i = 0; i < NUM_PARTICLES; i++) {
  addParticles(random(width * 3), random(height));
}

let hexa = verly.createHexagon(100, 100, 16, 100);
particles = verly.joinEntities(particles, hexa);

function animate() {
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < particles.points.length; i++) {
    for (let j = 0; j < particles.points.length; j++) {
      if (particles.points[i] !== particles.points[j]) {
        particles.points[j].resolveBehaviors(particles.points[i], 20, 3);
      }
    }
    particles.points[i].resolveBehaviors(mouse, mouse.radius, mBehavior);
  }
  verly.update();
  verly.render();
  verly.interact();
  //   verly.renderPointIndex();
  requestAnimationFrame(animate);
}
animate();

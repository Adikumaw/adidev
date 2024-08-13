(() => {
  var A = function () {
      return Math.random() * 2 - 1;
    },
    R = function (n, t, i) {
      return Math.max(t, Math.min(n, i));
    },
    T = function (n, t, i) {
      return arguments.length === 1
        ? Math.random() * arguments[0]
        : (arguments.length == 2 && ((i = t), (t = n), (n = Math.random)),
          !t && !i
            ? Math.random()
            : i
            ? n() * (i - t) + t
            : ((i = t), n() * i));
    },
    D = function (n, t, i) {
      return (t - n) * i + n;
    },
    F = function (n) {
      return (n * Math.PI) / 180;
    },
    C = function (n) {
      return (n * 180) / Math.PI;
    };
  var f = class {
    constructor(t, i, s) {
      (this.entities = t),
        (this.draggedPoint = null),
        (this.down = !1),
        (this.coord = new Vector()),
        (this.offset = new Vector()),
        (this.offsetCoord = new Vector()),
        (this.canvas = i),
        (this.ctx = s),
        this.canvas.addEventListener("mousedown", (e) => {
          (this.down = !0),
            this.draggedPoint &&
              (this.offset.setXY(
                e.offsetX - this.draggedPoint.pos.x,
                e.offsetY - this.draggedPoint.pos.y
              ),
              (this.offsetCoord = Vector.sub(this.coord, this.offset)));
        }),
        this.canvas.addEventListener("mouseup", (e) => {
          this.draggedPoint && this.draggedPoint.resetVelocity(),
            (this.down = !1),
            (this.draggedPoint = null);
        }),
        this.canvas.addEventListener("mousemove", (e) => {
          this.coord.setXY(e.offsetX, e.offsetY),
            (this.offsetCoord = Vector.sub(this.coord, this.offset));
        }),
        this.canvas.addEventListener("touchstart", (e) => {
          let o = e.touches[0];
          (this.down = !0),
            this.draggedPoint &&
              (this.offset.setXY(
                o.clientX - this.draggedPoint.pos.x,
                o.clientY - this.draggedPoint.pos.y
              ),
              (this.offsetCoord = Vector.sub(this.coord, this.offset)));
        }),
        this.canvas.addEventListener("touchend", (e) => {
          this.draggedPoint && this.draggedPoint.resetVelocity(),
            (this.down = !1),
            (this.draggedPoint = null);
        }),
        this.canvas.addEventListener("touchmove", (e) => {
          let o = e.touches[0];
          this.coord.setXY(o.pageX, o.pageY),
            (this.offsetCoord = Vector.sub(this.coord, this.offset));
        });
    }
    dragPoint() {
      this.down &&
        this.draggedPoint.pos.setXY(this.offsetCoord.x, this.offsetCoord.y);
    }
    drag() {
      this.down || (this.draggedPoint = this.getNearestPoint()),
        this.draggedPoint &&
          (this.renderDraggedPoint(this.draggedPoint), this.dragPoint());
    }
    renderDraggedPoint(t) {
      this.ctx.beginPath(),
        (this.ctx.strokeStyle = "black"),
        this.ctx.arc(t.pos.x, t.pos.y, t.radius * 1.5, 0, Math.PI * 2),
        this.ctx.stroke(),
        this.ctx.closePath();
    }
    getNearestPoint() {
      let t = 20,
        i = null;
      for (let s = 0; s < this.entities.length; s++)
        for (let e = 0; e < this.entities[s].points.length; e++)
          this.entities[s].points[e].pos.dist(this.coord) < t &&
            (i = this.entities[s].points[e]);
      return i;
    }
  };
  var m = class {
      constructor(t, i, s) {
        (this.entities = []),
          (this.iterations = t),
          (this.currentFrame = 0),
          (this.canvas = i),
          (this.WIDTH = i.width),
          (this.HEIGHT = i.height),
          (this.ctx = s),
          (this.mouse = new f(this.entities, this.canvas, this.ctx));
      }
      setDPI() {
        (this.canvas.style.width =
          this.canvas.style.width || this.canvas.width + "px"),
          (this.canvas.style.height =
            this.canvas.style.height || this.canvas.height + "px");
        var t = window.devicePixelRatio / 1,
          i = parseFloat(this.canvas.style.width),
          s = parseFloat(this.canvas.style.height),
          e = this.canvas.width / i,
          o = t / e,
          r = this.canvas.cloneNode(!1);
        r.getContext("2d").drawImage(this.canvas, 0, 0),
          (this.canvas.width = Math.ceil(i * t)),
          (this.canvas.height = Math.ceil(s * t)),
          this.ctx.setTransform(o, 0, 0, o, 0, 0),
          this.ctx.drawImage(r, 0, 0),
          this.ctx.setTransform(t, 0, 0, t, 0, 0);
      }
      joinEntities(...t) {
        let i = new Entity(this.iterations, this),
          s = [],
          e = [];
        for (let o = 0; o < t.length; o++) {
          s.push(t[o].points), e.push(t[o].sticks);
          let r = this.entities.indexOf(t[o]);
          this.entities.splice(r, 1);
        }
        return (
          (s = [].concat.apply([], s)),
          (e = [].concat.apply([], e)),
          (i.points = s),
          (i.sticks = e),
          this.addEntity(i),
          i
        );
      }
      addEntity(t) {
        this.entities.push(t);
      }
      interact() {
        this.mouse.drag();
      }
      update() {
        for (let t = 0; t < this.entities.length; t++)
          this.entities[t].update();
        this.currentFrame++;
      }
      renderPointIndex() {
        for (let t = 0; t < this.entities.length; t++)
          this.entities[t].renderPointIndex(this.ctx);
      }
      render() {
        for (let t = 0; t < this.entities.length; t++)
          this.entities[t].render(this.ctx);
      }
      createBox(t, i, s, e) {
        let o = new Entity(this.iterations, this, "Box");
        return (
          o.addPoint(t, i, 0, 0),
          o.addPoint(t + s, i, 0, 0),
          o.addPoint(t + s, i + e, 0, 0),
          o.addPoint(t, i + e, 0, 0),
          o.addStick(0, 1),
          o.addStick(1, 2),
          o.addStick(2, 3),
          o.addStick(3, 0),
          o.addStick(3, 1),
          this.addEntity(o),
          o
        );
      }
      createHexagon(t, i, s, e = 50, o = 1, r = 5) {
        let h = new Entity(this.iterations, this, "Hexagon"),
          a = (2 * Math.PI) / s;
        for (let d = 0; d < s; ++d) {
          let p = d * a;
          h.addPoint(t + Math.cos(p) * e, i + Math.sin(p) * e, 0, 0);
        }
        let l = h.addPoint(t, i, 0, 0);
        for (let d = 0; d < s; ++d)
          h.addStick(d, (d + o) % s),
            h.addStick(new Stick(h.points[d], l)),
            h.addStick(d, (d + r) % s);
        return this.addEntity(h), h;
      }
      createCloth(t, i, s, e, o, r) {
        let h = new Entity(this.iterations, this, "Cloth"),
          a = s / o,
          l = e / o,
          d,
          p;
        for (p = 0; p < o; ++p)
          for (d = 0; d < o; ++d) {
            let x = t + d * a - s / 2 + a / 2,
              u = i + p * l - e / 2 + l / 2;
            h.addPoint(x, u),
              d > 0 && h.addStick(p * o + d, p * o + d - 1),
              p > 0 && h.addStick(p * o + d, (p - 1) * o + d);
          }
        function L(x) {
          for (let u = 0; u < h.sticks.length; u++)
            h.sticks[u].startPoint.pos.dist(h.sticks[u].endPoint.pos) >
              (x || 20) && h.removeSticks(h.sticks[u].startPoint);
        }
        for (h.tear = L, d = 0; d < o; ++d) d % r == 0 && h.pin(d);
        return !this.dontPush && this.addEntity(h), h;
      }
      createRope(t, i, s = 10, e = 15, o) {
        let r = new Entity(this.iterations, this, "Rope");
        for (let h = 0; h < s; h++) r.addPoint(t + h * e, i, 0, 0);
        for (let h = 0; h < s - 1; h++) r.addStick(h, (h + 1) % s);
        return o !== void 0 && r.pin(o), this.addEntity(r), r;
      }
      createRagdoll(t, i) {
        let s = new Entity(this.iterations, this, "Ragdoll");
        return (
          s.addPoint(t, i).setRadius(15).setMass(5),
          s.addPoint(t, i + 100),
          s.addPoint(t + 30, i + 90),
          s.addPoint(t - 30, i + 90),
          s.addPoint(t + 20, i + 150),
          s.addPoint(t - 20, i + 150),
          s
            .addPoint(t + 30, i + 190)
            .setRadius(10)
            .setMass(20),
          s
            .addPoint(t - 30, i + 190)
            .setRadius(10)
            .setMass(20),
          s.addPoint(t, i + 25),
          s.addPoint(t + 25, i + 30),
          s.addPoint(t - 25, i + 30),
          s
            .addPoint(t + 15, i + 105)
            .setRadius(10)
            .setMass(5),
          s
            .addPoint(t - 15, i + 105)
            .setRadius(10)
            .setMass(5),
          s.addStick(0, 9),
          s.addStick(0, 10),
          s.addStick(9, 10),
          s.addStick(9, 2),
          s.addStick(10, 3),
          s.addStick(9, 3),
          s.addStick(10, 2),
          s.addStick(2, 6),
          s.addStick(3, 7),
          s.addStick(2, 7),
          s.addStick(3, 6),
          s.addStick(0, 1),
          s.addStick(2, 3),
          s.addStick(9, 2),
          s.addStick(10, 3),
          s.addStick(0, 4),
          s.addStick(0, 5),
          s.addStick(0, 6),
          s.addStick(0, 7),
          s.addStick(1, 2),
          s.addStick(1, 3),
          s.addStick(2, 4),
          s.addStick(3, 5),
          s.addStick(4, 6),
          s.addStick(5, 7),
          s.addStick(0, 8),
          s.addStick(8, 1),
          s.addStick(8, 9),
          s.addStick(9, 11),
          s.addStick(8, 10),
          s.addStick(10, 12),
          this.addEntity(s),
          s
        );
      }
    },
    P = m;
  var k = class n {
      constructor(t, i) {
        (this.x = t || 0), (this.y = i || 0);
      }
      static dist(t, i) {
        return t.dist(i);
      }
      static distSq(t, i) {
        return t.distSq(i);
      }
      static sub(t, i) {
        return new n(t.x - i.x, t.y - i.y);
      }
      static add(t, i) {
        return new n(t.x + i.x, t.y + i.y);
      }
      static fromAngle(t) {
        let i = new n(0, 0);
        return (i.x = Math.cos(t)), (i.y = Math.sin(t)), i;
      }
      static random2D() {
        return n.fromAngle(Math.random() * Math.PI * 180);
      }
      jitter(t, i) {
        var s = new n(t, i);
        return (
          (this.x += normalizedRandom() * s.x),
          (this.y += normalizedRandom() * s.y),
          this
        );
      }
      add(t, i) {
        return (
          arguments.length === 1
            ? ((this.x += t.x), (this.y += t.y))
            : arguments.length === 2 && ((this.x += t), (this.y += i)),
          this
        );
      }
      sub(t, i) {
        return (
          arguments.length === 1
            ? ((this.x -= t.x), (this.y -= t.y))
            : arguments.length === 2 && ((this.x -= t), (this.y -= i)),
          this
        );
      }
      mult(t) {
        return (
          typeof t == "number"
            ? ((this.x *= t), (this.y *= t))
            : ((this.x *= t.x), (this.y *= t.y)),
          this
        );
      }
      div(t) {
        return (
          typeof t == "number"
            ? ((this.x /= t), (this.y /= t))
            : ((this.x /= t.x), (this.y /= t.y)),
          this
        );
      }
      setAngle(t) {
        var i = this.mag();
        (this.x = Math.cos(t) * i), (this.y = Math.sin(t) * i);
      }
      angle(t) {
        return Math.atan2(
          this.x * t.y - this.y * t.x,
          this.x * t.x + this.y * t.y
        );
      }
      angle2(t, i) {
        return n.sub(t, this).angle(n.sub(i, this));
      }
      rotateBy(t, i) {
        var s = this.x - t.x,
          e = this.y - t.y;
        return new n(
          s * Math.cos(i) - e * Math.sin(i) + t.x,
          s * Math.sin(i) + e * Math.cos(i) + t.y
        );
      }
      mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
      }
      magSq() {
        return this.x * this.x + this.y * this.y;
      }
      setXY(t, i) {
        return (this.x = t), (this.y = i), this;
      }
      setMag(t) {
        return this.normalize(), this.mult(t), this;
      }
      normalize() {
        let t = this.mag();
        return t > 0 && this.div(t), this;
      }
      normalizeTo(t) {
        var i = this.mag();
        return i > 0 && ((i = t / i), this.mult(i)), this;
      }
      limit(t) {
        return this.mag() > t && (this.normalize(), this.mult(t)), this;
      }
      heading() {
        return -Math.atan2(-this.y, this.x);
      }
      dist(t) {
        let i = this.x - t.x,
          s = this.y - t.y;
        return Math.sqrt(i * i + s * s);
      }
      distSq(t) {
        let i = this.x - t.x,
          s = this.y - t.y;
        return i * i + s * s;
      }
      copy() {
        return new n(this.x, this.y);
      }
      negative() {
        return (this.x = -this.x), (this.y = -this.y), this;
      }
      array() {
        return [this.x, this.y];
      }
      toString() {
        return "[" + this.x + ", " + this.y + ", " + this.z + "]";
      }
      project(t) {
        var i = (this.x * t.x + this.y * t.y) / (t.x * t.x + t.y * t.y);
        return (this.x = i * t.x), (this.y = i * t.y), this;
      }
      rotate(t) {
        var i = this.heading() + t,
          s = this.mag();
        (this.x = Math.cos(i) * s), (this.y = Math.sin(i) * s);
      }
    },
    y = k;
  var w = class {
      constructor(t, i, s, e, o) {
        (this.pos = new Vector(t, i)),
          (this.oldpos = new Vector(t + (s || 0), i + (e || 0))),
          (this.bounce = 0.99),
          (this.friction = 0.97),
          (this.groundFriction = 0.7),
          (this.gravity = new Vector(0, 1)),
          (this.pinned = !1),
          (this.radius = o || 5),
          (this.color = "#6B2F81"),
          (this.mass = 1),
          (this.sticks = []),
          (this.forceAcc = 1),
          (this.uid = "");
      }
      setGravity(t) {
        return (this.gravity = t), this;
      }
      setFriction(t) {
        return (this.friction = t), this;
      }
      setGroundFriction(t) {
        return (this.groundFriction = t), this;
      }
      setBounce(t) {
        return (this.bounce = t), this;
      }
      setForceAcc(t) {
        return (this.forceAcc = t), this;
      }
      setMass(t) {
        return (this.mass = t), this;
      }
      setRadius(t) {
        return (this.radius = t), this;
      }
      setColor(t) {
        return (this.color = t), this;
      }
      setVelocity(t) {
        return this.oldpos.setXY(t.x, t.y), this;
      }
      pin() {
        return (this.pinned = !0), this;
      }
      unpin() {
        return (this.pinned = !1), this;
      }
      resetVelocity() {
        this.oldpos.setXY(this.pos.x, this.pos.y);
      }
      rotate(t, i) {
        let s =
            i.x +
            (this.pos.x - i.x) * Math.cos(t) -
            (this.pos.y - i.y) * Math.sin(t),
          e =
            i.y +
            (this.pos.x - i.x) * Math.sin(t) +
            (this.pos.y - i.y) * Math.cos(t);
        this.pos.setXY(s, e);
      }
      resolveBehaviors(t, i = this.radius, s = this.forceAcc) {
        var e = Vector.sub(this.pos, t.pos),
          o = e.magSq();
        let r = i * i;
        if (o < r) {
          var h = e.normalizeTo(1 - o / r).mult(s);
          this.applyForce(h);
        }
      }
      applyForce(t) {
        this.pos.add(t);
      }
      addMotor(t, i, s, e, o) {
        (this.pos.x = t + e * Math.cos(s * o)),
          (this.pos.y = i + e * Math.sin(s * o));
      }
      constrain(t) {
        this.pos.x > t.WIDTH - this.radius &&
          (this.pos.x = t.WIDTH - this.radius),
          this.pos.x < this.radius && (this.pos.x = this.radius),
          this.pos.y > t.HEIGHT - this.radius &&
            (this.pos.y = t.HEIGHT - this.radius),
          this.pos.y < this.radius && (this.pos.y = this.radius);
      }
      update(t) {
        if (this.pinned) return;
        let i = Vector.sub(this.pos, this.oldpos);
        if (
          (i.mult(this.friction),
          this.pos.y >= t.HEIGHT - this.radius && i.magSq() > 1e-6)
        ) {
          var s = i.mag();
          (i.x /= s), (i.y /= s), i.mult(s * this.groundFriction);
        }
        this.oldpos.setXY(this.pos.x, this.pos.y),
          this.pos.add(i),
          this.pos.add(this.gravity);
      }
      render(t) {
        t.beginPath(),
          (t.fillStyle = this.color),
          t.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2),
          t.fill(),
          t.closePath();
      }
    },
    N = w;
  var S = class {
      constructor(t, i, s, e, o) {
        (this.startPoint = t),
          (this.endPoint = i),
          (this.stiffness = e || 2),
          (this.color = "#6B2F81"),
          (this.hidden = o),
          s
            ? (this.length = s)
            : (this.length = this.startPoint.pos.dist(this.endPoint.pos)),
          this.startPoint.sticks.push(this),
          this.endPoint.sticks.push(this);
      }
      update(t) {
        let i = this.endPoint.pos.x - this.startPoint.pos.x,
          s = this.endPoint.pos.y - this.startPoint.pos.y,
          e = Math.sqrt(i * i + s * s),
          o = ((this.length - e) / e) * this.stiffness,
          r = i * o * 0.5,
          h = s * o * 0.5,
          a = this.startPoint.mass + this.endPoint.mass,
          l = this.startPoint.mass / a;
        (a = this.endPoint.mass / a),
          this.startPoint.pinned ||
            ((this.startPoint.pos.x -= r * a),
            (this.startPoint.pos.y -= h * a)),
          this.endPoint.pinned ||
            ((this.endPoint.pos.x += r * l), (this.endPoint.pos.y += h * l));
      }
      setColor(t) {
        return (this.color = t), this;
      }
      setLength(t) {
        return (this.length = t), this;
      }
      setStiffness(t) {
        return (this.stiffness = t), this;
      }
      setHidden(t) {
        return (this.hidden = t), this;
      }
      render(t) {
        this.hidden ||
          (t.beginPath(),
          (t.strokeStyle = this.color),
          t.moveTo(this.startPoint.pos.x, this.startPoint.pos.y),
          t.lineTo(this.endPoint.pos.x, this.endPoint.pos.y),
          t.stroke(),
          t.closePath());
      }
    },
    U = S;
  var v = class {
      constructor(t, i, s, e) {
        (this.a = t),
          (this.b = i),
          (this.c = s),
          (this.angle = this.b.pos.angle2(this.a.pos, this.c.pos)),
          (this.stiffness = e);
      }
      update() {
        var t = this.b.pos.angle2(this.a.pos, this.c.pos),
          i = t - this.angle;
        i <= -Math.PI ? (i += 2 * Math.PI) : i >= Math.PI && (i -= 2 * Math.PI),
          (i *= 0.1 * this.stiffness),
          (this.a.pos = this.a.pos.rotateBy(this.b.pos, i)),
          (this.c.pos = this.c.pos.rotateBy(this.b.pos, -i)),
          (this.b.pos = this.b.pos.rotateBy(this.a.pos, i)),
          (this.b.pos = this.b.pos.rotateBy(this.c.pos, -i));
      }
      render(t) {
        t.beginPath(),
          t.moveTo(this.a.pos.x, this.a.pos.y),
          t.lineTo(this.b.pos.x, this.b.pos.y),
          t.lineTo(this.c.pos.x, this.c.pos.y);
        var i = t.lineWidth;
        (t.lineWidth = 5),
          (t.strokeStyle = "rgba(0, 0, 255, 0.5)"),
          t.stroke(),
          (t.lineWidth = i);
      }
    },
    H = v;
  var g,
    B = new Uint8Array(16);
  function M() {
    if (
      !g &&
      ((g =
        typeof crypto < "u" &&
        crypto.getRandomValues &&
        crypto.getRandomValues.bind(crypto)),
      !g)
    )
      throw new Error(
        "crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported"
      );
    return g(B);
  }
  var c = [];
  for (let n = 0; n < 256; ++n) c.push((n + 256).toString(16).slice(1));
  function X(n, t = 0) {
    return (
      c[n[t + 0]] +
      c[n[t + 1]] +
      c[n[t + 2]] +
      c[n[t + 3]] +
      "-" +
      c[n[t + 4]] +
      c[n[t + 5]] +
      "-" +
      c[n[t + 6]] +
      c[n[t + 7]] +
      "-" +
      c[n[t + 8]] +
      c[n[t + 9]] +
      "-" +
      c[n[t + 10]] +
      c[n[t + 11]] +
      c[n[t + 12]] +
      c[n[t + 13]] +
      c[n[t + 14]] +
      c[n[t + 15]]
    );
  }
  var G =
      typeof crypto < "u" &&
      crypto.randomUUID &&
      crypto.randomUUID.bind(crypto),
    b = { randomUUID: G };
  function q(n, t, i) {
    if (b.randomUUID && !t && !n) return b.randomUUID();
    n = n || {};
    let s = n.random || (n.rng || M)();
    if (((s[6] = (s[6] & 15) | 64), (s[8] = (s[8] & 63) | 128), t)) {
      i = i || 0;
      for (let e = 0; e < 16; ++e) t[i + e] = s[e];
      return t;
    }
    return X(s);
  }
  var I = q;
  var E = class {
      constructor(t, i, s) {
        (this.points = []),
          (this.sticks = []),
          (this.domNodes = []),
          (this.name = s),
          (this.verlyInstance = i),
          (this.iterations = t || 16);
      }
      updateDOMNodePosition(t, i) {
        t &&
          ((t.style.left = `${i.pos.x}px`), (t.style.top = `${i.pos.y - 1}px`));
      }
      findActiveFocusedNode() {
        let t = document.activeElement.getAttribute("data-nodeid");
        if (!t) return null;
        let i = this.points.find((s) => s.uid === t);
        return i || null;
      }
      handleKeyDown(t) {
        let i = this.findActiveFocusedNode();
        if (!i) return;
        let e = !!t.shiftKey ? 5 : 1,
          o = {
            ArrowLeft: () => {
              this.setVelocityToPoint(i, -e, 0);
            },
            ArrowRight: () => {
              this.setVelocityToPoint(i, e, 0);
            },
            ArrowUp: () => {
              this.setVelocityToPoint(i, 0, -e);
            },
            ArrowDown: () => {
              this.setVelocityToPoint(i, 0, e);
            },
          };
        o[t.key] && (i.pin(), o[t.key]());
      }
      handleKeyUp(t) {
        let i = this.findActiveFocusedNode();
        i && (i.resetVelocity(), t.key === " " && i.unpin());
      }
      setupAccessibility() {
        window.addEventListener("keydown", this.handleKeyDown.bind(this)),
          window.addEventListener("keyup", this.handleKeyUp.bind(this)),
          this.points.forEach((t, i) => {
            let s = document.createElement("div");
            (s.tabIndex = 0),
              s.setAttribute("data-nodeid", t.uid),
              s.setAttribute(
                "aria-label",
                `Point of ${this.name}, use arrow keys to move point, press space to unpin`
              ),
              s.classList.add("point"),
              this.updateDOMNodePosition(s, t),
              document.body.appendChild(s),
              this.domNodes.push(s);
          });
      }
      setGravity(t) {
        for (let i = 0; i < this.points.length; i++)
          this.points[i].setGravity(t);
      }
      setFriction(t) {
        for (let i = 0; i < this.points.length; i++)
          this.points[i].setFriction(t);
      }
      pin(t) {
        this.points[t].pin();
      }
      removeSticks(t) {
        this.sticks.splice(this.sticks.indexOf(t.sticks[0]), 1),
          t.sticks.splice(0, 1);
      }
      setVelocityToPoint(t, i, s) {
        t.applyForce(new y(i, s));
      }
      setVelocity(t, i) {
        this.points.map((s) => {
          (s.oldpos.x += t), (s.oldpos.y += i);
        });
      }
      addPoint(t, i, s, e, o) {
        let r = I(),
          h;
        return (
          t instanceof Point ? (h = t) : (h = new Point(t, i, s, e, o)),
          (h.uid = r),
          this.points.push(h),
          h
        );
      }
      addStick(t, i, s, e, o) {
        let r;
        return (
          t instanceof Stick
            ? (r = t)
            : (r = new Stick(this.points[t], this.points[i], s, e, o)),
          this.sticks.push(r),
          r
        );
      }
      addAngleStick(t, i, s, e) {
        let o;
        return (
          t instanceof AngleStick
            ? (o = t)
            : (o = new AngleStick(
                this.points[t],
                this.points[i],
                this.points[s],
                e
              )),
          this.sticks.push(o),
          o
        );
      }
      updatePoints() {
        for (let t = 0; t < this.points.length; t++)
          this.points[t].update(this.verlyInstance),
            this.updateDOMNodePosition(this.domNodes[t], this.points[t]);
      }
      updateSticks(t) {
        for (let i = 0; i < this.sticks.length; i++) this.sticks[i].update(t);
      }
      updateConstraints() {
        for (let t = 0; t < this.points.length; t++)
          this.points[t].constrain(this.verlyInstance);
      }
      update() {
        this.updatePoints();
        for (let t = 0; t < this.iterations; ++t)
          this.updateSticks(), this.updateConstraints();
      }
      renderPoints() {
        for (let t = 0; t < this.points.length; t++)
          this.points[t].render(this.verlyInstance.ctx);
      }
      renderSticks() {
        for (let t = 0; t < this.sticks.length; t++)
          this.sticks[t].render(this.verlyInstance.ctx);
      }
      renderPointIndex() {
        for (let t = 0; t < this.points.length; t++)
          this.verlyInstance.ctx.beginPath(),
            (this.verlyInstance.ctx.fillStyle = "black"),
            this.verlyInstance.ctx.fillText(
              t,
              this.points[t].pos.x + 5,
              this.points[t].pos.y - 6
            ),
            this.verlyInstance.ctx.closePath();
      }
      render() {
        this.renderPoints(), this.renderSticks();
      }
    },
    Y = E;
  var V = class {
      constructor(t, i, s, e, o) {
        (this.x = t),
          (this.y = i),
          (this.size = s),
          (this.stickDistance = this.size),
          (this.iterations = 50),
          (this.A = [
            [0, 0, 1, 0, 0],
            [0, 1, 1, 1, 0],
            [0, 1, 0, 1, 0],
            [1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1],
          ]),
          (this.B = [
            [1, 1, 1, 0, 0],
            [1, 1, 1, 1, 0],
            [1, 1, 1, 0, 0],
            [1, 1, 1, 1, 0],
            [1, 1, 1, 0, 0],
          ]),
          (this.C = [
            [1, 1, 1, 1, 0],
            [1, 1, 1, 1, 0],
            [1, 1, 0, 0, 0],
            [1, 1, 1, 1, 0],
            [1, 1, 1, 1, 0],
          ]),
          (this.D = [
            [1, 1, 1, 0, 0],
            [1, 1, 1, 1, 0],
            [1, 1, 1, 1, 0],
            [1, 1, 1, 1, 0],
            [1, 1, 1, 0, 0],
          ]),
          (this.E = [
            [0, 1, 1, 1, 0],
            [0, 1, 1, 0, 0],
            [0, 1, 1, 1, 0],
            [0, 1, 1, 0, 0],
            [0, 1, 1, 1, 0],
          ]),
          (this.S = [
            [0, 1, 1, 1, 0],
            [1, 1, 1, 0, 0],
            [1, 1, 1, 1, 0],
            [0, 1, 1, 1, 0],
            [1, 1, 1, 0, 0],
          ]),
          (this.I = [
            [0, 0, 1, 0, 0],
            [0, 1, 1, 1, 0],
            [0, 1, 1, 1, 0],
            [0, 1, 1, 1, 0],
            [0, 1, 1, 1, 0],
          ]),
          (this.K = [
            [1, 0, 1, 1, 0],
            [1, 1, 1, 0, 0],
            [1, 1, 0, 0, 0],
            [1, 1, 1, 0, 0],
            [1, 0, 1, 1, 0],
          ]),
          (this.U = [
            [1, 1, 0, 1, 1],
            [1, 1, 0, 1, 1],
            [1, 1, 0, 1, 1],
            [1, 1, 1, 1, 1],
            [0, 1, 1, 1, 0],
          ]),
          (this.N = [
            [0, 0, 0, 0, 0, 0],
            [1, 1, 0, 0, 1, 1],
            [1, 1, 1, 0, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 0, 1, 1, 1],
            [1, 1, 0, 0, 1, 1],
          ]),
          (this.R = [
            [1, 1, 1, 0, 0],
            [1, 1, 1, 1, 0],
            [1, 1, 1, 1, 0],
            [1, 1, 1, 0, 0],
            [1, 1, 1, 1, 0],
          ]),
          (this.G = [
            [0, 1, 1, 1, 0],
            [1, 1, 1, 0, 0],
            [1, 1, 0, 1, 1],
            [1, 1, 1, 1, 1],
            [0, 1, 1, 1, 0],
          ]),
          (this.L = [
            [1, 1, 0, 0, 0],
            [1, 1, 0, 0, 0],
            [1, 1, 0, 0, 0],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
          ]),
          (this.Y = [
            [1, 1, 0, 1, 1],
            [1, 1, 0, 1, 1],
            [0, 1, 1, 1, 0],
            [0, 1, 1, 1, 0],
            [0, 1, 1, 1, 0],
          ]),
          (this.V = [
            [1, 0, 0, 0, 1],
            [1, 1, 0, 1, 1],
            [1, 1, 0, 1, 1],
            [1, 1, 1, 1, 1],
            [0, 1, 1, 1, 0],
          ]),
          (this.X = [
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
          ]),
          (this.P = [
            [1, 1, 1, 0, 0],
            [1, 1, 1, 1, 0],
            [1, 1, 1, 1, 0],
            [1, 1, 1, 0, 0],
            [1, 1, 1, 0, 0],
          ]),
          (this.H = [
            [1, 1, 0, 1, 1],
            [1, 1, 0, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 0, 1, 1],
            [1, 1, 0, 1, 1],
          ]),
          (this.O = [
            [0, 1, 1, 1, 0],
            [1, 1, 0, 1, 1],
            [1, 1, 0, 1, 1],
            [1, 1, 0, 1, 1],
            [0, 1, 1, 1, 0],
          ]),
          (this.letters = {
            A: this.A,
            B: this.B,
            C: this.C,
            D: this.D,
            E: this.E,
            K: this.K,
            I: this.I,
            S: this.S,
            U: this.U,
            N: this.N,
            R: this.R,
            G: this.G,
            L: this.L,
            Y: this.Y,
            V: this.V,
            X: this.X,
            P: this.P,
            H: this.H,
            O: this.O,
          });
        let r = this.letters[e];
        this.text = new Entity(this.iterations, o);
        for (let h = 0; h < r.length; h++)
          for (let a = 0; a < r[h].length; a++)
            if (r[a][h] == 1) {
              let l = new Point(this.x + h * this.size, this.y + a * this.size);
              l.setRadius(2), this.text.addPoint(l);
            }
        for (let h = 0; h < this.text.points.length; h++)
          for (
            let a = 0;
            a < this.text.points.length &&
            this.text.points[h] != this.text.points[a];
            a++
          ) {
            let l = this.text.points[h].pos.dist(this.text.points[a].pos);
            l > 0 &&
              l < this.size + this.stickDistance &&
              this.text.addStick(h, a);
          }
      }
    },
    z = V;
  window.Verly = P;
  window.Vector = y;
  window.Point = N;
  window.Stick = U;
  window.AngleStick = H;
  window.Entity = Y;
  window.TypoGraphy = z;
  window.random = T;
  window.radians = F;
  window.degrees = C;
  window.clamp = R;
  window.normalizedRandom = A;
  window.lerp = D;
  var wt = P;
})();

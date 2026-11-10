/*
 * The Contour Waves background of the brand book, alive: a height field drawn as topographic
 * lines, black to deep blue, bending toward the pointer. Raw WebGL, no library. The contours fade
 * out behind the text, so the background supports and never competes. Stops when off screen and
 * gives up on slow devices.
 */
const VERTEX = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const FRAGMENT = `#extension GL_OES_standard_derivatives:enable
precision mediump float;
uniform vec2 r;uniform vec2 m;uniform float t;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/r;
  vec2 p=(gl_FragCoord.xy-.5*r)/r.y;
  vec2 d=p-((m-.5)*vec2(r.x/r.y,1.));
  float near=exp(-dot(d,d)*7.);
  vec2 q=p*1.35+vec2(t*.018,-t*.012);
  float h=fbm(q+.55*fbm(q*1.4-t*.02))+near*.16;
  float c=h*16.;
  float w=fwidth(c);
  float line=1.-smoothstep(0.,1.3,abs(fract(c)-.5)/max(w,.0001));
  float fade=smoothstep(.12,.92,uv.x*.82+(1.-uv.y)*.05+h*.25);
  vec3 deep=vec3(0.,.1,.3)*smoothstep(.25,.85,h);
  vec3 ink=mix(vec3(0.,.39,.97),vec3(.3,.88,.73),near*.9);
  vec3 col=deep*.75*fade+ink*line*(.16+.55*fade+near*.5);
  gl_FragColor=vec4(col,1.)*fade+vec4(0.,0.,0.,0.);
  gl_FragColor.a=clamp(max(line*(.2+fade),h*fade*.9),0.,1.)*(.35+.65*fade);
}`;

export default function field(canvas) {
  const gl = canvas.getContext('webgl', {
    alpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power',
  });
  if (!gl || !gl.getExtension('OES_standard_derivatives')) return;

  const shader = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const program = gl.createProgram();
  gl.attachShader(program, shader(gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'p');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const [res, mouse, time] = ['r', 'm', 't'].map((u) => gl.getUniformLocation(program, u));

  let scale = Math.min(window.devicePixelRatio, 1.25) * (window.innerWidth < 700 ? 0.6 : 0.8);
  const resize = () => {
    canvas.width = Math.ceil(canvas.clientWidth * scale);
    canvas.height = Math.ceil(canvas.clientHeight * scale);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(res, canvas.width, canvas.height);
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const pointer = {
    x: 0.75, y: 0.6, tx: 0.75, ty: 0.6,
  };
  window.addEventListener('pointermove', (e) => {
    const box = canvas.getBoundingClientRect();
    pointer.tx = (e.clientX - box.left) / box.width;
    pointer.ty = 1 - (e.clientY - box.top) / box.height;
  }, { passive: true });

  let visible = true;
  let raf = 0;
  let last = 0;
  let slow = 0;
  const begin = performance.now();

  const draw = (now) => {
    raf = visible && !document.hidden ? requestAnimationFrame(draw) : 0;
    const spent = now - last;
    if (spent < 30) return; // about 30 frames a second is enough for slow contours
    last = now;
    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;
    gl.uniform2f(mouse, pointer.x, pointer.y);
    gl.uniform1f(time, (now - begin) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (spent > 70) slow += 1;
    if (slow === 6) {
      scale *= 0.6;
      resize();
    }
    if (slow > 30) {
      cancelAnimationFrame(raf);
      raf = -1; // too slow: keep the last frame, it is a fine still
    }
  };
  const wake = () => {
    if (!raf && visible && !document.hidden) raf = requestAnimationFrame(draw);
  };
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    wake();
  }).observe(canvas);
  document.addEventListener('visibilitychange', wake);
  wake();
  canvas.classList.add('is-live');
}

(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,56420,e=>{"use strict";var t=e.i(71645);let r=(...e)=>e.filter((e,t,r)=>!!e&&""!==e.trim()&&r.indexOf(e)===t).join(" ").trim(),o=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,r)=>r?r.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var a={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let i=(0,t.createContext)({}),n=(0,t.forwardRef)(({color:e,size:o,strokeWidth:n,absoluteStrokeWidth:l,className:s="",children:c,iconNode:u,...m},d)=>{let{size:x=24,strokeWidth:h=2,absoluteStrokeWidth:g=!1,color:p="currentColor",className:f=""}=(0,t.useContext)(i)??{},v=l??g?24*Number(n??h)/Number(o??x):n??h;return(0,t.createElement)("svg",{ref:d,...a,width:o??x??a.width,height:o??x??a.height,stroke:e??p,strokeWidth:v,className:r("lucide",f,s),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(m)&&{"aria-hidden":"true"},...m},[...u.map(([e,r])=>(0,t.createElement)(e,r)),...Array.isArray(c)?c:[c]])});e.s(["default",0,(e,a)=>{let i=(0,t.forwardRef)(({className:i,...l},s)=>(0,t.createElement)(n,{ref:s,iconNode:a,className:r(`lucide-${o(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,i),...l}));return i.displayName=o(e),i}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,r)=>{t.exports=e.r(76562)},73815,e=>{"use strict";var t=e.i(43476),r=e.i(71645),o=e.i(92989),a=e.i(94800),i=e.i(48546),n=e.i(90072);let l=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,s=`
uniform float uTime;
uniform float uMaxIterations;
uniform float uZoom;
uniform vec2 uCenter;
uniform float uEscapeRadius;
uniform int uColorScheme;
uniform vec2 uResolution;

varying vec2 vUv;

// HSV to RGB conversion (defined BEFORE use)
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Smooth coloring using logarithm
vec3 getColor(float iterations, float maxIter, int scheme) {
  if (iterations >= maxIter) {
    return vec3(0.0, 0.0, 0.0);
  }

  // Smooth coloring using log2
  float logZn = log(iterations + 1.0) / log(2.0);
  float smoothIter = iterations + 1.0 - logZn;
  float t = smoothIter / maxIter;

  if (scheme == 0) {
    // Rainbow
    float hue = 0.8 * t;
    return hsv2rgb(vec3(hue, 0.85, 0.95));
  } else if (scheme == 1) {
    // Fire
    return vec3(
      min(1.0, t * 3.0),
      max(0.0, min(1.0, t * 2.0 - 0.5)),
      max(0.0, t * 1.5 - 1.0)
    );
  } else if (scheme == 2) {
    // Grayscale
    float gray = t;
    return vec3(gray, gray, gray);
  } else if (scheme == 3) {
    // Electric
    float t2 = sin(t * 6.28) * 0.5 + 0.5;
    return vec3(
      0.1 + 0.9 * t2 * t2,
      0.3 + 0.7 * t * t2,
      0.9 + 0.1 * sin(t * 12.56)
    );
  } else {
    // Ocean
    return vec3(
      0.0 + t * 0.2,
      0.3 + t * 0.5,
      0.6 + t * 0.4
    );
  }
}

void main() {
  // Map UV to complex plane coordinates
  vec2 uv = vUv - 0.5;
  float aspect = uResolution.x / uResolution.y;

  // Calculate coordinates in complex plane
  float scale = 4.0 / uZoom;
  vec2 c = uCenter + uv * vec2(scale * aspect, scale);

  // Mandelbrot iteration
  vec2 z = vec2(0.0);
  float iterations = 0.0;
  float maxIter = uMaxIterations;
  float escapeRadius2 = uEscapeRadius * uEscapeRadius;

  for (float i = 0.0; i < 500.0; i++) {
    if (i >= maxIter) break;

    float x2 = z.x * z.x;
    float y2 = z.y * z.y;

    if (x2 + y2 > escapeRadius2) {
      // Smooth iteration count using Renyi extrapolation
      float logZn = log(x2 + y2) / 2.0;
      float nu = log(logZn / log(2.0)) / log(2.0);
      iterations = i + 1.0 - nu;
      break;
    }

    z = vec2(x2 - y2, 2.0 * z.x * z.y) + c;
    iterations = i;
  }

  if (iterations >= maxIter - 1.0) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  } else {
    vec3 color = getColor(iterations, maxIter, uColorScheme);
    gl_FragColor = vec4(color, 1.0);
  }
}
`;function c({maxIterations:e,zoom:o,centerX:u,centerY:m,colorScheme:d,isPlaying:x,onDataChange:h,onCenterChange:g,onZoomChange:p}){let f=(0,r.useRef)(null),v=(0,r.useRef)(null),{size:y,camera:b}=(0,i.useThree)(),C=(0,r.useRef)(0),j=(0,r.useRef)(o),w=(0,r.useRef)({x:u,y:m}),R=(0,r.useRef)(o),S=(0,r.useRef)({x:u,y:m}),M=(0,r.useRef)(!1),[z,k]=(0,r.useState)({maxIterations:e,zoom:o,centerX:u,centerY:m,escapeRadius:2,zoomTargetX:u,zoomTargetY:m}),N=(0,r.useMemo)(()=>({rainbow:0,fire:1,grayscale:2,electric:3,ocean:4})[d]??0,[d]),I=(0,r.useMemo)(()=>new n.ShaderMaterial({vertexShader:l,fragmentShader:s,uniforms:{uTime:{value:0},uMaxIterations:{value:e},uZoom:{value:o},uCenter:{value:new n.Vector2(u,m)},uEscapeRadius:{value:2},uColorScheme:{value:N},uResolution:{value:new n.Vector2(y.width,y.height)}},side:n.DoubleSide}),[]);v.current=I;let E=(0,r.useCallback)(e=>{e.stopPropagation?.();let t=e.uv;if(!t)return;let r=y.width/y.height,o=4/j.current,a=w.current.x+(t.x-.5)*o*r,i=w.current.y+(t.y-.5)*o;S.current={x:a,y:i},R.current=Math.min(3*j.current,1e5),M.current=!0,g?.(a,i)},[y.width,y.height,g]);return(0,r.useEffect)(()=>{v.current&&(R.current=o,S.current={x:u,y:m},v.current.uniforms.uMaxIterations.value=e,v.current.uniforms.uColorScheme.value=N,v.current.uniforms.uResolution.value.set(y.width,y.height))},[e,o,u,m,N,y.width,y.height]),(0,r.useEffect)(()=>{v.current&&v.current.uniforms.uResolution.value.set(y.width,y.height)},[y.width,y.height]),(0,a.useFrame)((t,r)=>{if(!v.current)return;C.current++;let a=t.clock.getElapsedTime();if(v.current.uniforms.uTime.value=a,M.current||x){j.current+=(R.current-j.current)*.08,w.current.x+=(S.current.x-w.current.x)*.08,w.current.y+=(S.current.y-w.current.y)*.08;let e=Math.abs(R.current-j.current),t=Math.sqrt(Math.pow(S.current.x-w.current.x,2)+Math.pow(S.current.y-w.current.y,2));e<.001&&t<1e-4&&(M.current=!1),v.current.uniforms.uZoom.value=j.current,v.current.uniforms.uCenter.value.set(w.current.x,w.current.y),Math.abs(j.current-o)>.01&&p?.(j.current)}if(C.current%8==0){let t={maxIterations:e,zoom:j.current,centerX:w.current.x,centerY:w.current.y,escapeRadius:2,zoomTargetX:S.current.x,zoomTargetY:S.current.y};k(t),h?.(t)}}),(0,r.useEffect)(()=>{b instanceof n.PerspectiveCamera&&(b.position.set(0,15,0),b.lookAt(0,0,0))},[b]),(0,t.jsxs)("group",{children:[(0,t.jsxs)("mesh",{ref:f,rotation:[-Math.PI/2,0,0],position:[0,0,0],onClick:E,children:[(0,t.jsx)("planeGeometry",{args:[16,16,1,1]}),(0,t.jsx)("primitive",{object:I,attach:"material"})]}),(0,t.jsxs)("mesh",{rotation:[-Math.PI/2,0,0],position:[0,.01,0],children:[(0,t.jsx)("ringGeometry",{args:[8.01,8.1,64]}),(0,t.jsx)("meshBasicMaterial",{color:"#8b5cf6",side:n.DoubleSide,transparent:!0,opacity:.5})]}),[[-7.5,7.5],[7.5,7.5],[7.5,-7.5],[-7.5,-7.5]].map(([e,r],o)=>(0,t.jsxs)("mesh",{position:[e,.02,r],children:[(0,t.jsx)("sphereGeometry",{args:[.15,16,16]}),(0,t.jsx)("meshBasicMaterial",{color:"#a855f7"})]},o))]})}e.i(81413);var u=e.i(48205),m=e.i(82192),d=e.i(68647),x=e.i(14228),h=e.i(4685);let g=["rainbow","fire","grayscale","electric","ocean"];e.s(["default",0,function(){let e=(0,o.useRouter)(),[a,i]=(0,r.useState)(null),[n,l]=(0,r.useState)(!0),[s,p]=(0,r.useState)(!0),[f,v]=(0,r.useState)(1),[y,b]=(0,r.useState)(0),[C,j]=(0,r.useState)(100),[w,R]=(0,r.useState)(1),[S,M]=(0,r.useState)(-.5),[z,k]=(0,r.useState)(0),[N,I]=(0,r.useState)("electric"),E=(0,r.useCallback)(e=>{i(e)},[]),P=(0,r.useCallback)((e,t)=>{M(e),k(t)},[]),T=(0,r.useCallback)(e=>{R(e)},[]),Z=()=>{b(e=>e+1),p(!0),v(1),j(100),R(1),M(-.5),k(0)},F=(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)(d.ControlGroup,{title:"Fractal Parameters",children:[(0,t.jsx)(d.ControlSlider,{label:"Max Iterations",value:C,unit:"",min:50,max:500,step:10,color:"#a855f7",onChange:j,decimals:0}),(0,t.jsx)(d.ControlSlider,{label:"Zoom Level",value:Math.log10(w),unit:"log₁₀",min:Math.log10(.5),max:Math.log10(1e5),step:.1,color:"#8b5cf6",onChange:e=>R(Math.pow(10,e)),decimals:2})]}),(0,t.jsxs)(d.ControlGroup,{title:"Navigation",children:[(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-2",children:[(0,t.jsx)("button",{onClick:()=>{R(e=>Math.min(2*e,1e5))},className:"py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all font-medium text-sm",children:"🔍+ Zoom In"}),(0,t.jsx)("button",{onClick:()=>{R(e=>Math.max(e/2,.5))},className:"py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all font-medium text-sm",children:"🔍- Zoom Out"})]}),(0,t.jsx)("button",{onClick:Z,className:"w-full py-2 px-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all font-medium text-sm",children:"🔄 Reset View"})]}),(0,t.jsx)(d.ControlGroup,{title:"Color Scheme",children:(0,t.jsx)("div",{className:"grid grid-cols-2 gap-2",children:g.map(e=>(0,t.jsx)("button",{onClick:()=>I(e),className:`py-2 px-3 text-sm rounded-lg transition-all capitalize ${N===e?"bg-purple-600 text-white shadow-lg shadow-purple-500/50":"bg-gray-200 text-gray-700 hover:bg-gray-300"}`,children:e},e))})}),(0,t.jsxs)("div",{className:"bg-purple-50/50 rounded-lg p-3 border border-purple-200/50",children:[(0,t.jsx)("div",{className:"text-xs text-gray-600 mb-2 font-medium",children:"Mandelbrot Set"}),(0,t.jsx)("div",{className:"text-xs text-gray-500 font-mono",children:"zₙ₊₁ = zₙ² + c"}),(0,t.jsx)("div",{className:"text-xs text-gray-500 mt-1",children:"Click on the fractal to zoom into that region"})]}),(0,t.jsx)("button",{onClick:()=>e.push("/experiments/mandelbrot/details"),className:"w-full py-2.5 bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-700 font-medium text-sm rounded-lg transition-all border border-purple-300/50 flex items-center justify-center gap-2",children:"📖 View Experiment Details"})]}),A=a?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(d.DataGrid,{data:{zoom:{value:Math.log10(a.zoom),unit:"log₁₀",color:"#8b5cf6",decimals:2},real:{value:a.centerX,unit:"Re",color:"#7c3aed",decimals:6},imaginary:{value:a.centerY,unit:"Im",color:"#6d28d9",decimals:6},iterations:{value:a.maxIterations,unit:"max",color:"#a855f7",decimals:0},escapeRadius:{value:a.escapeRadius,unit:"R",color:"#5b21b6",decimals:1}},columns:2}),(0,t.jsx)("div",{className:"mt-3 p-3 bg-gray-800/50 rounded-lg",children:(0,t.jsx)("div",{className:"text-center font-mono text-purple-400 text-sm",children:"zₙ₊₁ = zₙ² + c"})}),a.zoom>10&&(0,t.jsx)("div",{className:"mt-2 p-2 bg-purple-900/30 rounded-lg border border-purple-500/30",children:(0,t.jsxs)("div",{className:"text-xs text-purple-300 text-center",children:["Deep zoom: ",a.zoom<1e3?`${a.zoom.toFixed(1)}\xd7`:`${a.zoom.toExponential(2)}\xd7`]})})]}):(0,t.jsx)("div",{className:"text-center text-gray-500 text-sm py-8",children:"Waiting for simulation data..."});return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(u.ExperimentContainer,{title:"Mandelbrot Fractal",description:"Explore the infinite complexity of the Mandelbrot set",cameraPosition:[0,15,0],backgroundColor:"#050510",controls:null,dataPanel:null,children:(0,t.jsx)(c,{onDataChange:E,onCenterChange:P,onZoomChange:T,maxIterations:C,zoom:w,centerX:S,centerY:z,colorScheme:N,isPlaying:s})}),(0,t.jsx)(x.SimulationController,{isPlaying:s,onPlayPause:()=>p(e=>!e),onReset:Z,speed:f,onSpeedChange:v}),(0,t.jsx)(m.FloatingControlPanel,{title:"⚙️ Fractal Settings",initialPosition:{x:20,y:80},children:F}),(0,t.jsx)(h.DataPanel,{isVisible:n,onToggle:()=>l(!n),children:A})]})}],73815)}]);
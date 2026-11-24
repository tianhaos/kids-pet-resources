(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,i;var r=e.i(31067),n=e.i(71645),s=e.i(90072),a=e.i(48546),o=s,l=s;let c=new l.Box3,d=new l.Vector3;class u extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(i,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let r=new l.InstancedInterleavedBuffer(i,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(r,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(r,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),c.setFromBufferAttribute(t),this.boundingBox.union(c))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let r=0;for(let n=0,s=e.count;n<s;n++)d.fromBufferAttribute(e,n),r=Math.max(r,i.distanceToSquared(d)),d.fromBufferAttribute(t,n),r=Math.max(r,i.distanceToSquared(d));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var f=s,h=e.i(8560),m=e.i(31497);class p extends f.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:f.UniformsUtils.clone(f.UniformsUtils.merge([h.UniformsLib.common,h.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new f.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${m.version>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let x=m.version>=125?"uv1":"uv2",v=new o.Vector4,y=new o.Vector3,g=new o.Vector3,b=new o.Vector4,S=new o.Vector4,w=new o.Vector4,j=new o.Vector3,M=new o.Matrix4,E=new o.Line3,A=new o.Vector3,C=new o.Box3,_=new o.Sphere,L=new o.Vector4;function U(e,t,r){return L.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),L.multiplyScalar(1/L.w),L.x=i/r.width,L.y=i/r.height,L.applyMatrix4(e.projectionMatrixInverse),L.multiplyScalar(1/L.w),Math.abs(Math.max(L.x,L.y))}class z extends o.Mesh{constructor(e=new u,t=new p({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,n=0,s=t.count;e<s;e++,n+=2)y.fromBufferAttribute(t,e),g.fromBufferAttribute(i,e),r[n]=0===n?0:r[n-1],r[n+1]=r[n]+y.distanceTo(g);let n=new o.InstancedInterleavedBuffer(r,2,1);return e.setAttribute("instanceDistanceStart",new o.InterleavedBufferAttribute(n,1,0)),e.setAttribute("instanceDistanceEnd",new o.InterleavedBufferAttribute(n,1,1)),this}raycast(e,r){let n,s,a=this.material.worldUnits,l=e.camera;null!==l||a||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let d=this.matrixWorld,u=this.geometry,f=this.material;if(i=f.linewidth+c,null===u.boundingSphere&&u.computeBoundingSphere(),_.copy(u.boundingSphere).applyMatrix4(d),a)n=.5*i;else{let e=Math.max(l.near,_.distanceToPoint(t.origin));n=U(l,e,f.resolution)}if(_.radius+=n,!1!==t.intersectsSphere(_)){if(null===u.boundingBox&&u.computeBoundingBox(),C.copy(u.boundingBox).applyMatrix4(d),a)s=.5*i;else{let e=Math.max(l.near,C.distanceToPoint(t.origin));s=U(l,e,f.resolution)}C.expandByScalar(s),!1!==t.intersectsBox(C)&&(a?function(e,r){let n=e.matrixWorld,s=e.geometry,a=s.attributes.instanceStart,l=s.attributes.instanceEnd,c=Math.min(s.instanceCount,a.count);for(let s=0;s<c;s++){E.start.fromBufferAttribute(a,s),E.end.fromBufferAttribute(l,s),E.applyMatrix4(n);let c=new o.Vector3,d=new o.Vector3;t.distanceSqToSegment(E.start,E.end,d,c),d.distanceTo(c)<.5*i&&r.push({point:d,pointOnLine:c,distance:t.origin.distanceTo(d),object:e,face:null,faceIndex:s,uv:null,[x]:null})}}(this,r):function(e,r,n){let s=r.projectionMatrix,a=e.material.resolution,l=e.matrixWorld,c=e.geometry,d=c.attributes.instanceStart,u=c.attributes.instanceEnd,f=Math.min(c.instanceCount,d.count),h=-r.near;t.at(1,w),w.w=1,w.applyMatrix4(r.matrixWorldInverse),w.applyMatrix4(s),w.multiplyScalar(1/w.w),w.x*=a.x/2,w.y*=a.y/2,w.z=0,j.copy(w),M.multiplyMatrices(r.matrixWorldInverse,l);for(let r=0;r<f;r++){if(b.fromBufferAttribute(d,r),S.fromBufferAttribute(u,r),b.w=1,S.w=1,b.applyMatrix4(M),S.applyMatrix4(M),b.z>h&&S.z>h)continue;if(b.z>h){let e=b.z-S.z,t=(b.z-h)/e;b.lerp(S,t)}else if(S.z>h){let e=S.z-b.z,t=(S.z-h)/e;S.lerp(b,t)}b.applyMatrix4(s),S.applyMatrix4(s),b.multiplyScalar(1/b.w),S.multiplyScalar(1/S.w),b.x*=a.x/2,b.y*=a.y/2,S.x*=a.x/2,S.y*=a.y/2,E.start.copy(b),E.start.z=0,E.end.copy(S),E.end.z=0;let c=E.closestPointToPointParameter(j,!0);E.at(c,A);let f=o.MathUtils.lerp(b.z,S.z,c),m=f>=-1&&f<=1,p=j.distanceTo(A)<.5*i;if(m&&p){E.start.fromBufferAttribute(d,r),E.end.fromBufferAttribute(u,r),E.start.applyMatrix4(l),E.end.applyMatrix4(l);let i=new o.Vector3,s=new o.Vector3;t.distanceSqToSegment(E.start,E.end,s,i),n.push({point:s,pointOnLine:i,distance:t.origin.distanceTo(s),object:e,face:null,faceIndex:r,uv:null,[x]:null})}}}(this,l,r))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(v),this.material.uniforms.resolution.value.set(v.z,v.w))}}class B extends u{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let r=0;r<t;r+=3)i[2*r]=e[r],i[2*r+1]=e[r+1],i[2*r+2]=e[r+2],i[2*r+3]=e[r+3],i[2*r+4]=e[r+4],i[2*r+5]=e[r+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,r=new Float32Array(2*i);if(3===t)for(let n=0;n<i;n+=t)r[2*n]=e[n],r[2*n+1]=e[n+1],r[2*n+2]=e[n+2],r[2*n+3]=e[n+3],r[2*n+4]=e[n+4],r[2*n+5]=e[n+5];else for(let n=0;n<i;n+=t)r[2*n]=e[n],r[2*n+1]=e[n+1],r[2*n+2]=e[n+2],r[2*n+3]=e[n+3],r[2*n+4]=e[n+4],r[2*n+5]=e[n+5],r[2*n+6]=e[n+6],r[2*n+7]=e[n+7];return super.setColors(r,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class D extends z{constructor(e=new B,t=new p({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let O=n.forwardRef(function({points:e,color:t=0xffffff,vertexColors:i,linewidth:o,lineWidth:l,segments:c,dashed:d,...f},h){var m,x;let v=(0,a.useThree)(e=>e.size),y=n.useMemo(()=>c?new z:new D,[c]),[g]=n.useState(()=>new p),b=(null==i||null==(m=i[0])?void 0:m.length)===4?4:3,S=n.useMemo(()=>{let r=c?new u:new B,n=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Vector3||e instanceof s.Vector4?[e.x,e.y,e.z]:e instanceof s.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(r.setPositions(n.flat()),i){t=0xffffff;let e=i.map(e=>e instanceof s.Color?e.toArray():e);r.setColors(e.flat(),b)}return r},[e,c,i,b]);return n.useLayoutEffect(()=>{y.computeLineDistances()},[e,y]),n.useLayoutEffect(()=>{d?g.defines.USE_DASH="":delete g.defines.USE_DASH,g.needsUpdate=!0},[d,g]),n.useEffect(()=>()=>{S.dispose(),g.dispose()},[S]),n.createElement("primitive",(0,r.default)({object:y,ref:h},f),n.createElement("primitive",{object:S,attach:"geometry"}),n.createElement("primitive",(0,r.default)({object:g,attach:"material",color:t,vertexColors:!!i,resolution:[v.width,v.height],linewidth:null!=(x=null!=o?o:l)?x:1,dashed:d,transparent:4===b},f)))});e.s(["Line",0,O],43216)},56420,e=>{"use strict";var t=e.i(71645);let i=(...e)=>e.filter((e,t,i)=>!!e&&""!==e.trim()&&i.indexOf(e)===t).join(" ").trim(),r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,i)=>i?i.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var n={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,t.createContext)({}),a=(0,t.forwardRef)(({color:e,size:r,strokeWidth:a,absoluteStrokeWidth:o,className:l="",children:c,iconNode:d,...u},f)=>{let{size:h=24,strokeWidth:m=2,absoluteStrokeWidth:p=!1,color:x="currentColor",className:v=""}=(0,t.useContext)(s)??{},y=o??p?24*Number(a??m)/Number(r??h):a??m;return(0,t.createElement)("svg",{ref:f,...n,width:r??h??n.width,height:r??h??n.height,stroke:e??x,strokeWidth:y,className:i("lucide",v,l),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,i])=>(0,t.createElement)(e,i)),...Array.isArray(c)?c:[c]])});e.s(["default",0,(e,n)=>{let s=(0,t.forwardRef)(({className:s,...o},l)=>(0,t.createElement)(a,{ref:l,iconNode:n,className:i(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...o}));return s.displayName=r(e),s}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,i)=>{t.exports=e.r(76562)},18715,e=>{"use strict";var t=e.i(43476),i=e.i(71645),r=e.i(92989);e.i(81413);var n=e.i(48205),s=e.i(14228),a=e.i(82192),o=e.i(4685),l=e.i(68647),c=e.i(94800),d=e.i(43216),u=e.i(90072);let f=(e,t=.001)=>Math.max(t,Math.abs(e)),h=new u.Object3D;function m({onDataChange:e,isPlaying:r=!0,simulationSpeed:n=1,resetTrigger:s=0,temperature:a=1,poreSize:o=1,particleCount:l=1}){let p=(0,i.useRef)(null),x=(0,i.useRef)(null),v=(0,i.useRef)([]),y=(0,i.useRef)(0),g=(0,i.useRef)(0),b=(0,i.useRef)(null),S=(0,i.useRef)(null),[w,j]=(0,i.useState)({leftConcentration:60,rightConcentration:15,temperature:298,timeElapsed:0,equilibrium:0,gradientIndex:100});(0,i.useEffect)(()=>{let e=Math.min(Math.floor(70*l),280),t=Math.min(Math.floor(20*l),120),i=[];b.current=new Float32Array(1200);for(let t=0;t<e;t++)i.push({position:new u.Vector3((Math.random()-.5)*4-2,(Math.random()-.5)*4,(Math.random()-.5)*4),velocity:new u.Vector3((Math.random()-.5)*.02,(Math.random()-.5)*.02,(Math.random()-.5)*.02),side:"left"});for(let e=0;e<t;e++)i.push({position:new u.Vector3((Math.random()-.5)*4+2,(Math.random()-.5)*4,(Math.random()-.5)*4),velocity:new u.Vector3((Math.random()-.5)*.02,(Math.random()-.5)*.02,(Math.random()-.5)*.02),side:"right"});v.current=i,g.current=0},[s,l]);let M=(0,i.useCallback)(()=>{if(!x.current||!b.current)return;let e=v.current,t=b.current;for(let i=0;i<400;i++){let r=e[i];if(!r){t[3*i]=0,t[3*i+1]=0,t[3*i+2]=0;continue}let n=f((r.position.x+5)/10),s=Math.max(0,1-1.5*n),o=Math.max(0,1.5*n-.5),l=Math.max(0,(a-1)*.3);t[3*i]=Math.min(1,.9*s+l),t[3*i+1]=Math.min(1,.5*l+.1),t[3*i+2]=Math.min(1,.9*o)}let i=S.current;i?i.needsUpdate=!0:(S.current=i=new u.BufferAttribute(t,3),x.current.geometry.setAttribute("color",i))},[a]);(0,c.useFrame)((t,i)=>{if(!p.current||!r)return;let s=v.current,l=Math.max(.1,2.5*a),c=Math.min(.9,Math.max(.01,.2*o));for(let e of s){e.velocity.x+=(Math.random()-.5)*.01*l,e.velocity.y+=(Math.random()-.5)*.01*l,e.velocity.z+=(Math.random()-.5)*.01*l;let t=Math.max(.01,.08*a);e.velocity.length()>t&&e.velocity.normalize().multiplyScalar(t),e.position.add(new u.Vector3(e.velocity.x*n,e.velocity.y*n,e.velocity.z*n)),Math.abs(e.position.y)>2.5&&(e.velocity.y*=-1,e.position.y=2.5*Math.sign(e.position.y)),Math.abs(e.position.z)>2.5&&(e.velocity.z*=-1,e.position.z=2.5*Math.sign(e.position.z)),.3>Math.abs(e.position.x)?Math.random()>c&&(e.velocity.x*=-1,e.position.x=e.position.x>0?.3:-.3):(e.position.x<-5||e.position.x>5)&&(e.velocity.x*=-1,e.position.x=5*Math.sign(e.position.x))}if(g.current+=i*n,y.current++,x.current){for(let e=0;e<400;e++){let t=s[e];if(t){h.position.copy(t.position);let i=Math.max(.01,.08+(a-1)*.02);h.scale.set(i,i,i),h.updateMatrix(),x.current.setMatrixAt(e,h.matrix)}else h.position.set(0,-100,0),h.scale.set(.001,.001,.001),h.updateMatrix(),x.current.setMatrixAt(e,h.matrix)}x.current.instanceMatrix.needsUpdate=!0,M()}if(y.current%8==0){let t=s.filter(e=>e.position.x<0).length,i=s.filter(e=>e.position.x>=0).length,r=s.length/2,n=Math.max(0,1-Math.abs(t-r)/r),o=Math.round(100*Math.max(0,1-Math.abs(t-i)/Math.max(t+i,1))),l={leftConcentration:t,rightConcentration:i,temperature:Math.round(273+25*a),timeElapsed:g.current,equilibrium:Math.round(100*n),gradientIndex:o};j(l),e?.(l)}});let E=(0,i.useMemo)(()=>{let e=w.leftConcentration,t=w.rightConcentration,i=Math.max(e,t,10);return[[-1,-1.2,3],[-1,-1.2+f(Math.max(.1,e/i*2)),3],[1,-1.2+f(Math.max(.1,t/i*2)),3],[1,-1.2,3]]},[w]),A=(0,i.useMemo)(()=>{let e=w.leftConcentration,t=w.rightConcentration,i=[];if(Math.abs(e-t)>5){let r=e>t?1:-1;for(let e=0;e<3;e++){let t=-1+.8*e;i.push([-.6*r,t,2.6]),i.push([.6*r,t,2.6])}}return i},[w]);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("ambientLight",{intensity:.5}),(0,t.jsx)("directionalLight",{position:[10,10,5],intensity:.8,castShadow:!0}),(0,t.jsx)("pointLight",{position:[0,0,0],intensity:.4,color:"#6366f1"}),(0,t.jsxs)("group",{ref:p,children:[(0,t.jsxs)("mesh",{position:[-2.5,0,0],children:[(0,t.jsx)("boxGeometry",{args:[f(5),f(5),f(5)]}),(0,t.jsx)("meshPhysicalMaterial",{color:"#ef4444",transparent:!0,opacity:.06,roughness:.3,side:u.DoubleSide})]}),(0,t.jsxs)("mesh",{position:[2.5,0,0],children:[(0,t.jsx)("boxGeometry",{args:[f(5),f(5),f(5)]}),(0,t.jsx)("meshPhysicalMaterial",{color:"#3b82f6",transparent:!0,opacity:.06,roughness:.3,side:u.DoubleSide})]}),(0,t.jsxs)("group",{position:[0,0,0],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("planeGeometry",{args:[f(.15),f(5),8,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#f59e0b",transparent:!0,opacity:.3,side:u.DoubleSide})]}),(0,t.jsxs)("mesh",{position:[0,0,0],children:[(0,t.jsx)("boxGeometry",{args:[f(.1),f(5.2),f(5.2)]}),(0,t.jsx)("meshStandardMaterial",{color:"#d97706",metalness:.5,roughness:.3})]}),Array.from({length:8}).map((e,i)=>{let r=f(.08*o,.03);return(0,t.jsxs)("group",{position:[.06,-2+4*i/7,0],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("circleGeometry",{args:[r,16]}),(0,t.jsx)("meshBasicMaterial",{color:"#000000",transparent:!0,opacity:.6})]}),(0,t.jsxs)("mesh",{children:[(0,t.jsx)("ringGeometry",{args:[r,f(r+.015),16]}),(0,t.jsx)("meshStandardMaterial",{color:"#f59e0b",emissive:"#f59e0b",emissiveIntensity:.4,side:u.DoubleSide})]})]},i)})]}),(0,t.jsxs)("instancedMesh",{ref:x,args:[void 0,void 0,400],children:[(0,t.jsx)("sphereGeometry",{args:[f(1),12,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#ffffff",vertexColors:!0,transparent:!0,opacity:.85,metalness:.1,roughness:.2})]}),(0,t.jsx)("group",{position:[-2.5,3.2,0],children:(0,t.jsxs)("mesh",{children:[(0,t.jsx)("boxGeometry",{args:[f(1.8),f(.3),f(.05)]}),(0,t.jsx)("meshBasicMaterial",{color:"#ef4444"})]})}),(0,t.jsx)("group",{position:[2.5,3.2,0],children:(0,t.jsxs)("mesh",{children:[(0,t.jsx)("boxGeometry",{args:[f(1.6),f(.3),f(.05)]}),(0,t.jsx)("meshBasicMaterial",{color:"#3b82f6"})]})}),Array.from({length:A.length/2}).map((e,i)=>(0,t.jsxs)("group",{children:[(0,t.jsx)(d.Line,{points:[A[2*i],A[2*i+1]],color:"#22c55e",lineWidth:2}),(0,t.jsxs)("mesh",{position:A[2*i+1],children:[(0,t.jsx)("coneGeometry",{args:[f(.08),f(.15),8]}),(0,t.jsx)("meshStandardMaterial",{color:"#22c55e",emissive:"#22c55e",emissiveIntensity:.5})]})]},`arrow-${i}`)),(0,t.jsxs)("group",{position:[0,-1,3.5],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("boxGeometry",{args:[f(3),f(2.5),f(.1)]}),(0,t.jsx)("meshStandardMaterial",{color:"#1a1a2e"})]}),(0,t.jsxs)("mesh",{position:[-.8,0,.06],children:[(0,t.jsx)("boxGeometry",{args:[f(.6),f(w.leftConcentration/100*2,.01),f(.05)]}),(0,t.jsx)("meshStandardMaterial",{color:"#ef4444",emissive:"#ef4444",emissiveIntensity:.4})]}),(0,t.jsxs)("mesh",{position:[.8,0,.06],children:[(0,t.jsx)("boxGeometry",{args:[f(.6),f(w.rightConcentration/100*2,.01),f(.05)]}),(0,t.jsx)("meshStandardMaterial",{color:"#3b82f6",emissive:"#3b82f6",emissiveIntensity:.4})]}),(0,t.jsx)(d.Line,{points:E,color:"#22c55e",lineWidth:2}),(0,t.jsxs)("mesh",{position:[-.8,-1.5,.1],children:[(0,t.jsx)("boxGeometry",{args:[f(.4),f(.15),f(.02)]}),(0,t.jsx)("meshBasicMaterial",{color:"#ef4444"})]}),(0,t.jsxs)("mesh",{position:[.8,-1.5,.1],children:[(0,t.jsx)("boxGeometry",{args:[f(.4),f(.15),f(.02)]}),(0,t.jsx)("meshBasicMaterial",{color:"#3b82f6"})]})]}),(0,t.jsxs)("group",{position:[0,-3.5,0],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("boxGeometry",{args:[f(5),f(.25),f(.1)]}),(0,t.jsx)("meshStandardMaterial",{color:"#1a1a2e"})]}),(0,t.jsxs)("mesh",{position:[-2+w.equilibrium/100*4,0,.06],children:[(0,t.jsx)("boxGeometry",{args:[f(w.equilibrium/100*4,.01),f(.18),f(.05)]}),(0,t.jsx)("meshStandardMaterial",{color:w.equilibrium>=95?"#4ade80":w.equilibrium>=80?"#facc15":"#fb923c",emissive:w.equilibrium>=95?"#4ade80":w.equilibrium>=80?"#facc15":"#fb923c",emissiveIntensity:.5})]}),(0,t.jsxs)("mesh",{position:[-2,.2,0],children:[(0,t.jsx)("sphereGeometry",{args:[f(.05),8,8]}),(0,t.jsx)("meshBasicMaterial",{color:"#ef4444"})]}),(0,t.jsxs)("mesh",{position:[0,.2,0],children:[(0,t.jsx)("sphereGeometry",{args:[f(.05),8,8]}),(0,t.jsx)("meshBasicMaterial",{color:"#4ade80"})]}),(0,t.jsxs)("mesh",{position:[2,.2,0],children:[(0,t.jsx)("sphereGeometry",{args:[f(.05),8,8]}),(0,t.jsx)("meshBasicMaterial",{color:"#3b82f6"})]})]}),(0,t.jsxs)("group",{position:[-4,2,0],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("boxGeometry",{args:[f(.8),f(.8),f(.1)]}),(0,t.jsx)("meshStandardMaterial",{color:"#1a1a2e"})]}),(0,t.jsxs)("mesh",{position:[0,(a-1)*.3,.06],children:[(0,t.jsx)("boxGeometry",{args:[f(.6),f(.5*a,.01),f(.05)]}),(0,t.jsx)("meshStandardMaterial",{color:a>2?"#ef4444":a>1.3?"#f59e0b":"#3b82f6",emissive:a>2?"#ef4444":a>1.3?"#f59e0b":"#3b82f6",emissiveIntensity:.6})]})]}),w.equilibrium>=95&&(0,t.jsxs)("group",{position:[0,2,0],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("planeGeometry",{args:[f(3),f(.5)]}),(0,t.jsx)("meshStandardMaterial",{color:"#0a0a1a",transparent:!0,opacity:.8})]}),(0,t.jsxs)("mesh",{position:[0,.15,0],children:[(0,t.jsx)("sphereGeometry",{args:[f(.08),16,16]}),(0,t.jsx)("meshBasicMaterial",{color:"#4ade80"})]})]})]}),(0,t.jsx)("gridHelper",{args:[12,24,"#1a1a3e","#1a1a3e"],position:[0,-3.5,0]})]})}e.s(["default",0,function(){let e=(0,r.useRouter)(),[c,d]=(0,i.useState)(!0),[u,f]=(0,i.useState)(1),[h,p]=(0,i.useState)(0),[x,v]=(0,i.useState)(!0),[y,g]=(0,i.useState)(1),[b,S]=(0,i.useState)(1),[w,j]=(0,i.useState)(1),[M,E]=(0,i.useState)({leftConcentration:50,rightConcentration:10,temperature:298,timeElapsed:0,equilibrium:0,gradientIndex:0}),A=(0,i.useCallback)(()=>{d(e=>!e)},[]),C=(0,i.useCallback)(()=>{p(e=>e+1),g(1),S(1),j(1)},[]),_=(0,i.useCallback)(e=>{f(e)},[]),L=(0,i.useCallback)(e=>{E(e)},[]),U=(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)(l.ControlGroup,{title:"Diffusion Parameters",children:[(0,t.jsx)(l.ControlSlider,{label:"Temperature",value:y,unit:"",min:.5,max:3,step:.1,color:"#f59e0b",onChange:g,decimals:1}),(0,t.jsx)(l.ControlSlider,{label:"Membrane Pore Size",value:b,unit:"",min:.1,max:1,step:.1,color:"#8b5cf6",onChange:S,decimals:1}),(0,t.jsx)(l.ControlSlider,{label:"Particle Count",value:w,unit:"x",min:.5,max:2,step:.1,color:"#06b6d4",onChange:j,decimals:1})]}),(0,t.jsx)("button",{onClick:()=>e.push("/experiments/diffusion/details"),className:"w-full py-2.5 bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-700 font-medium text-sm rounded-lg transition-all border border-purple-300/50 flex items-center justify-center gap-2",children:"📖 View Experiment Details"})]}),z=(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(l.DataGrid,{data:{leftConcentration:{value:M.leftConcentration,unit:"particles",color:"#ef4444",decimals:0},rightConcentration:{value:M.rightConcentration,unit:"particles",color:"#3b82f6",decimals:0},equilibrium:{value:M.equilibrium,unit:"%",color:"#22c55e",decimals:1},temperature:{value:M.temperature,unit:"K",color:"#f59e0b",decimals:0}},columns:2}),(0,t.jsxs)("div",{className:"mt-3 p-3 bg-gray-800/50 rounded-lg",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)("span",{className:"text-gray-400 text-sm",children:"Time Elapsed:"}),(0,t.jsxs)("span",{className:"font-mono text-purple-400",children:[M.timeElapsed.toFixed(1),"s"]})]}),(0,t.jsxs)("div",{className:"flex items-center justify-between mt-2",children:[(0,t.jsx)("span",{className:"text-gray-400 text-sm",children:"Status:"}),(0,t.jsx)("span",{className:"font-mono text-green-400 text-sm",children:M.equilibrium>=95?"⚖️ Equilibrium":"↔️ Diffusing..."})]})]})]});return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.ExperimentContainer,{title:"Molecular Diffusion",description:"Particle movement from high to low concentration through a semi-permeable membrane",cameraPosition:[0,2,12],backgroundColor:"#050510",controls:null,dataPanel:null,children:(0,t.jsx)(m,{onDataChange:L,isPlaying:c,simulationSpeed:u,resetTrigger:h,temperature:y,poreSize:b,particleCount:w})}),(0,t.jsx)(s.SimulationController,{isPlaying:c,onPlayPause:A,onReset:C,speed:u,onSpeedChange:_}),(0,t.jsx)(a.FloatingControlPanel,{title:"⚙️ Diffusion Parameters",initialPosition:{x:20,y:80},children:U}),(0,t.jsx)(o.DataPanel,{isVisible:x,onToggle:()=>v(!x),children:z})]})}],18715)}]);
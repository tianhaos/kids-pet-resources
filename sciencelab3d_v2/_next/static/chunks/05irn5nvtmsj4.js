(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,i;var r=e.i(31067),n=e.i(71645),s=e.i(90072),a=e.i(48546),o=s,l=s;let c=new l.Box3,d=new l.Vector3;class f extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(i,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let r=new l.InstancedInterleavedBuffer(i,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(r,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(r,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),c.setFromBufferAttribute(t),this.boundingBox.union(c))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let r=0;for(let n=0,s=e.count;n<s;n++)d.fromBufferAttribute(e,n),r=Math.max(r,i.distanceToSquared(d)),d.fromBufferAttribute(t,n),r=Math.max(r,i.distanceToSquared(d));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var u=s,h=e.i(8560),p=e.i(31497);class m extends u.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:u.UniformsUtils.clone(u.UniformsUtils.merge([h.UniformsLib.common,h.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new u.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
					#include <${p.version>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let v=p.version>=125?"uv1":"uv2",x=new o.Vector4,y=new o.Vector3,g=new o.Vector3,S=new o.Vector4,w=new o.Vector4,b=new o.Vector4,j=new o.Vector3,M=new o.Matrix4,A=new o.Line3,E=new o.Vector3,_=new o.Box3,L=new o.Sphere,C=new o.Vector4;function U(e,t,r){return C.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),C.multiplyScalar(1/C.w),C.x=i/r.width,C.y=i/r.height,C.applyMatrix4(e.projectionMatrixInverse),C.multiplyScalar(1/C.w),Math.abs(Math.max(C.x,C.y))}class B extends o.Mesh{constructor(e=new f,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,n=0,s=t.count;e<s;e++,n+=2)y.fromBufferAttribute(t,e),g.fromBufferAttribute(i,e),r[n]=0===n?0:r[n-1],r[n+1]=r[n]+y.distanceTo(g);let n=new o.InstancedInterleavedBuffer(r,2,1);return e.setAttribute("instanceDistanceStart",new o.InterleavedBufferAttribute(n,1,0)),e.setAttribute("instanceDistanceEnd",new o.InterleavedBufferAttribute(n,1,1)),this}raycast(e,r){let n,s,a=this.material.worldUnits,l=e.camera;null!==l||a||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let d=this.matrixWorld,f=this.geometry,u=this.material;if(i=u.linewidth+c,null===f.boundingSphere&&f.computeBoundingSphere(),L.copy(f.boundingSphere).applyMatrix4(d),a)n=.5*i;else{let e=Math.max(l.near,L.distanceToPoint(t.origin));n=U(l,e,u.resolution)}if(L.radius+=n,!1!==t.intersectsSphere(L)){if(null===f.boundingBox&&f.computeBoundingBox(),_.copy(f.boundingBox).applyMatrix4(d),a)s=.5*i;else{let e=Math.max(l.near,_.distanceToPoint(t.origin));s=U(l,e,u.resolution)}_.expandByScalar(s),!1!==t.intersectsBox(_)&&(a?function(e,r){let n=e.matrixWorld,s=e.geometry,a=s.attributes.instanceStart,l=s.attributes.instanceEnd,c=Math.min(s.instanceCount,a.count);for(let s=0;s<c;s++){A.start.fromBufferAttribute(a,s),A.end.fromBufferAttribute(l,s),A.applyMatrix4(n);let c=new o.Vector3,d=new o.Vector3;t.distanceSqToSegment(A.start,A.end,d,c),d.distanceTo(c)<.5*i&&r.push({point:d,pointOnLine:c,distance:t.origin.distanceTo(d),object:e,face:null,faceIndex:s,uv:null,[v]:null})}}(this,r):function(e,r,n){let s=r.projectionMatrix,a=e.material.resolution,l=e.matrixWorld,c=e.geometry,d=c.attributes.instanceStart,f=c.attributes.instanceEnd,u=Math.min(c.instanceCount,d.count),h=-r.near;t.at(1,b),b.w=1,b.applyMatrix4(r.matrixWorldInverse),b.applyMatrix4(s),b.multiplyScalar(1/b.w),b.x*=a.x/2,b.y*=a.y/2,b.z=0,j.copy(b),M.multiplyMatrices(r.matrixWorldInverse,l);for(let r=0;r<u;r++){if(S.fromBufferAttribute(d,r),w.fromBufferAttribute(f,r),S.w=1,w.w=1,S.applyMatrix4(M),w.applyMatrix4(M),S.z>h&&w.z>h)continue;if(S.z>h){let e=S.z-w.z,t=(S.z-h)/e;S.lerp(w,t)}else if(w.z>h){let e=w.z-S.z,t=(w.z-h)/e;w.lerp(S,t)}S.applyMatrix4(s),w.applyMatrix4(s),S.multiplyScalar(1/S.w),w.multiplyScalar(1/w.w),S.x*=a.x/2,S.y*=a.y/2,w.x*=a.x/2,w.y*=a.y/2,A.start.copy(S),A.start.z=0,A.end.copy(w),A.end.z=0;let c=A.closestPointToPointParameter(j,!0);A.at(c,E);let u=o.MathUtils.lerp(S.z,w.z,c),p=u>=-1&&u<=1,m=j.distanceTo(E)<.5*i;if(p&&m){A.start.fromBufferAttribute(d,r),A.end.fromBufferAttribute(f,r),A.start.applyMatrix4(l),A.end.applyMatrix4(l);let i=new o.Vector3,s=new o.Vector3;t.distanceSqToSegment(A.start,A.end,s,i),n.push({point:s,pointOnLine:i,distance:t.origin.distanceTo(s),object:e,face:null,faceIndex:r,uv:null,[v]:null})}}}(this,l,r))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(x),this.material.uniforms.resolution.value.set(x.z,x.w))}}class z extends f{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let r=0;r<t;r+=3)i[2*r]=e[r],i[2*r+1]=e[r+1],i[2*r+2]=e[r+2],i[2*r+3]=e[r+3],i[2*r+4]=e[r+4],i[2*r+5]=e[r+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,r=new Float32Array(2*i);if(3===t)for(let n=0;n<i;n+=t)r[2*n]=e[n],r[2*n+1]=e[n+1],r[2*n+2]=e[n+2],r[2*n+3]=e[n+3],r[2*n+4]=e[n+4],r[2*n+5]=e[n+5];else for(let n=0;n<i;n+=t)r[2*n]=e[n],r[2*n+1]=e[n+1],r[2*n+2]=e[n+2],r[2*n+3]=e[n+3],r[2*n+4]=e[n+4],r[2*n+5]=e[n+5],r[2*n+6]=e[n+6],r[2*n+7]=e[n+7];return super.setColors(r,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class P extends B{constructor(e=new z,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let O=n.forwardRef(function({points:e,color:t=0xffffff,vertexColors:i,linewidth:o,lineWidth:l,segments:c,dashed:d,...u},h){var p,v;let x=(0,a.useThree)(e=>e.size),y=n.useMemo(()=>c?new B:new P,[c]),[g]=n.useState(()=>new m),S=(null==i||null==(p=i[0])?void 0:p.length)===4?4:3,w=n.useMemo(()=>{let r=c?new f:new z,n=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Vector3||e instanceof s.Vector4?[e.x,e.y,e.z]:e instanceof s.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(r.setPositions(n.flat()),i){t=0xffffff;let e=i.map(e=>e instanceof s.Color?e.toArray():e);r.setColors(e.flat(),S)}return r},[e,c,i,S]);return n.useLayoutEffect(()=>{y.computeLineDistances()},[e,y]),n.useLayoutEffect(()=>{d?g.defines.USE_DASH="":delete g.defines.USE_DASH,g.needsUpdate=!0},[d,g]),n.useEffect(()=>()=>{w.dispose(),g.dispose()},[w]),n.createElement("primitive",(0,r.default)({object:y,ref:h},u),n.createElement("primitive",{object:w,attach:"geometry"}),n.createElement("primitive",(0,r.default)({object:g,attach:"material",color:t,vertexColors:!!i,resolution:[x.width,x.height],linewidth:null!=(v=null!=o?o:l)?v:1,dashed:d,transparent:4===S},u)))});e.s(["Line",0,O],43216)},56420,e=>{"use strict";var t=e.i(71645);let i=(...e)=>e.filter((e,t,i)=>!!e&&""!==e.trim()&&i.indexOf(e)===t).join(" ").trim(),r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,i)=>i?i.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var n={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,t.createContext)({}),a=(0,t.forwardRef)(({color:e,size:r,strokeWidth:a,absoluteStrokeWidth:o,className:l="",children:c,iconNode:d,...f},u)=>{let{size:h=24,strokeWidth:p=2,absoluteStrokeWidth:m=!1,color:v="currentColor",className:x=""}=(0,t.useContext)(s)??{},y=o??m?24*Number(a??p)/Number(r??h):a??p;return(0,t.createElement)("svg",{ref:u,...n,width:r??h??n.width,height:r??h??n.height,stroke:e??v,strokeWidth:y,className:i("lucide",x,l),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(f)&&{"aria-hidden":"true"},...f},[...d.map(([e,i])=>(0,t.createElement)(e,i)),...Array.isArray(c)?c:[c]])});e.s(["default",0,(e,n)=>{let s=(0,t.forwardRef)(({className:s,...o},l)=>(0,t.createElement)(a,{ref:l,iconNode:n,className:i(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...o}));return s.displayName=r(e),s}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,i)=>{t.exports=e.r(76562)},55485,e=>{"use strict";var t=e.i(43476),i=e.i(71645),r=e.i(92989),n=e.i(94800),s=e.i(43216),a=e.i(90072);function o({onDataChange:e,frequency:r=2,amplitude:l=1,wavelength:c=3,sourceSeparation:d=6,showNodes:f=!0,isPlaying:u=!0,simulationSpeed:h=1,resetTrigger:p}){let m=(0,i.useRef)(null),v=(0,i.useRef)({time:0,maxAmplitude:0,frameCount:0,lastDataUpdate:0}),x=c*r,y=2*Math.PI/c,g=2*Math.PI*r,S=(0,i.useMemo)(()=>{let e=new a.PlaneGeometry(40,40,150,150),t=new Float32Array(68403);return e.setAttribute("color",new a.BufferAttribute(t,3)),e},[]),w=(0,i.useMemo)(()=>{if(!f)return{constructive:[],destructive:[]};let e=[],t=[];for(let i=-18;i<=18;i+=.5){let r=Math.sqrt(324-i*i);if(!isNaN(r)){for(let t=0;t<10;t++)if(.5>Math.abs(Math.sqrt((r+d/2)**2+i*i)-Math.sqrt((r-d/2)**2+i*i)-t*c)){e.push(i);break}for(let e=0;e<10;e++)if(.5>Math.abs(Math.sqrt((r+d/2)**2+i*i)-Math.sqrt((r-d/2)**2+i*i)-(e+.5)*c)){t.push(i);break}}}return{constructive:e,destructive:t}},[c,d,f]);(0,i.useEffect)(()=>{void 0!==p&&p>0&&(v.current={time:0,maxAmplitude:0,frameCount:0,lastDataUpdate:0})},[p]),(0,n.useFrame)((t,i)=>{if(!m.current)return;u&&(v.current.time+=i*h);let n=v.current.time,s=m.current.geometry.attributes.position,a=m.current.geometry.attributes.color,o=s.array,f=a.array,p=-d/2,S=d/2,b=0;for(let e=0;e<=150;e++)for(let t=0;t<=150;t++){let i=151*e+t,r=t/150*40-20,s=e/150*40-20,a=Math.sqrt((r-p)**2+s*s),c=Math.sqrt((r-S)**2+s*s),d=Math.max(.1,1/(1+.15*a))*Math.sin(y*a-g*n)+Math.max(.1,1/(1+.15*c))*Math.sin(y*c-g*n),u=d*l;if(o[3*i+2]=u,b=Math.max(b,Math.abs(u)),d>0){let e=Math.min(1,d/1.5);f[3*i]=.8+.2*e,f[3*i+1]=.3*e,f[3*i+2]=.2*e}else{let e=Math.min(1,Math.abs(d)/1.5);f[3*i]=.2*e,f[3*i+1]=.5*e,f[3*i+2]=.8+.2*e}if(Math.abs(d)>1.5){let e=(Math.abs(d)-1.5)/.5;f[3*i]=Math.min(1,f[3*i]+.5*e),f[3*i+1]=Math.min(1,f[3*i+1]+.5*e),f[3*i+2]=Math.min(1,f[3*i+2]+.3*e)}}s.needsUpdate=!0,a.needsUpdate=!0,v.current.frameCount++,v.current.frameCount%4==0&&m.current.geometry.computeVertexNormals(),v.current.maxAmplitude=b,v.current.lastDataUpdate++,v.current.lastDataUpdate>=7&&e&&(v.current.lastDataUpdate=0,e({wavelength:c,frequency:r,sourceSeparation:d,maxAmplitude:b,constructiveNodes:w.constructive.length,destructiveNodes:w.destructive.length,waveSpeed:x}))}),(0,i.useEffect)(()=>()=>{S.dispose()},[S]);let b=1+.15*Math.sin(5*v.current.time);return(0,t.jsxs)("group",{children:[(0,t.jsx)("pointLight",{position:[0,15,0],intensity:1.2,color:"#ffffff"}),(0,t.jsx)("pointLight",{position:[-15,8,8],intensity:.6,color:"#ff4444"}),(0,t.jsx)("pointLight",{position:[15,8,8],intensity:.6,color:"#4444ff"}),(0,t.jsx)("spotLight",{position:[0,20,0],angle:.3,penumbra:.5,intensity:.8,color:"#ffffff",castShadow:!0}),(0,t.jsx)("mesh",{ref:m,geometry:S,rotation:[-Math.PI/2,0,0],position:[0,.8,0],castShadow:!0,receiveShadow:!0,children:(0,t.jsx)("meshStandardMaterial",{vertexColors:!0,side:a.DoubleSide,transparent:!0,opacity:.9,metalness:.4,roughness:.2,envMapIntensity:.8,emissive:"#1a1a2e",emissiveIntensity:.1})}),(0,t.jsxs)("group",{position:[-d/2,1.2,0],children:[(0,t.jsxs)("mesh",{castShadow:!0,children:[(0,t.jsx)("sphereGeometry",{args:[.5,32,32]}),(0,t.jsx)("meshStandardMaterial",{color:"#ff3333",emissive:"#ff0000",emissiveIntensity:u?2:.5,metalness:.9,roughness:.1})]}),(0,t.jsxs)("mesh",{rotation:[-Math.PI/2,0,0],scale:b,children:[(0,t.jsx)("ringGeometry",{args:[.6,.75,32]}),(0,t.jsx)("meshBasicMaterial",{color:"#ff6666",transparent:!0,opacity:.7})]}),(0,t.jsxs)("mesh",{rotation:[-Math.PI/2,0,0],scale:1.5*b,children:[(0,t.jsx)("ringGeometry",{args:[.9,1,32]}),(0,t.jsx)("meshBasicMaterial",{color:"#ff4444",transparent:!0,opacity:.4})]}),(0,t.jsxs)("mesh",{scale:1.2,children:[(0,t.jsx)("sphereGeometry",{args:[.5,16,16]}),(0,t.jsx)("meshBasicMaterial",{color:"#ff0000",transparent:!0,opacity:u?.3:.1})]})]}),(0,t.jsxs)("group",{position:[d/2,1.2,0],children:[(0,t.jsxs)("mesh",{castShadow:!0,children:[(0,t.jsx)("sphereGeometry",{args:[.5,32,32]}),(0,t.jsx)("meshStandardMaterial",{color:"#3333ff",emissive:"#0000ff",emissiveIntensity:u?2:.5,metalness:.9,roughness:.1})]}),(0,t.jsxs)("mesh",{rotation:[-Math.PI/2,0,0],scale:b,children:[(0,t.jsx)("ringGeometry",{args:[.6,.75,32]}),(0,t.jsx)("meshBasicMaterial",{color:"#6666ff",transparent:!0,opacity:.7})]}),(0,t.jsxs)("mesh",{rotation:[-Math.PI/2,0,0],scale:1.5*b,children:[(0,t.jsx)("ringGeometry",{args:[.9,1,32]}),(0,t.jsx)("meshBasicMaterial",{color:"#4444ff",transparent:!0,opacity:.4})]}),(0,t.jsxs)("mesh",{scale:1.2,children:[(0,t.jsx)("sphereGeometry",{args:[.5,16,16]}),(0,t.jsx)("meshBasicMaterial",{color:"#0000ff",transparent:!0,opacity:u?.3:.1})]})]}),Array.from({length:5}).map((e,i)=>(0,t.jsx)("group",{position:[-d/2,.85,0],children:(0,t.jsxs)("mesh",{rotation:[-Math.PI/2,0,0],children:[(0,t.jsx)("ringGeometry",{args:[c*(i+1)*.8,c*(i+1)*.8+.08,64]}),(0,t.jsx)("meshBasicMaterial",{color:"#ff4444",transparent:!0,opacity:.15-.02*i})]})},`wave1-${i}`)),Array.from({length:5}).map((e,i)=>(0,t.jsx)("group",{position:[d/2,.85,0],children:(0,t.jsxs)("mesh",{rotation:[-Math.PI/2,0,0],children:[(0,t.jsx)("ringGeometry",{args:[c*(i+1)*.8,c*(i+1)*.8+.08,64]}),(0,t.jsx)("meshBasicMaterial",{color:"#4444ff",transparent:!0,opacity:.15-.02*i})]})},`wave2-${i}`)),f&&w.constructive.map((e,i)=>(0,t.jsxs)("group",{position:[12,.9,e],children:[(0,t.jsxs)("mesh",{rotation:[-Math.PI/2,0,0],children:[(0,t.jsx)("ringGeometry",{args:[.25,.35,16]}),(0,t.jsx)("meshBasicMaterial",{color:"#00ff88",transparent:!0,opacity:.8})]}),(0,t.jsxs)("mesh",{position:[0,.2,0],children:[(0,t.jsx)("sphereGeometry",{args:[.1,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#00ff88",emissive:"#00ff88",emissiveIntensity:2})]})]},`constructive-${i}`)),f&&w.destructive.map((e,i)=>(0,t.jsxs)("group",{position:[12,.9,e],children:[(0,t.jsx)(s.Line,{points:[[-.2,-.2,.05],[.2,.2,.05]],color:"#ffaa00",lineWidth:3}),(0,t.jsx)(s.Line,{points:[[-.2,.2,.05],[.2,-.2,.05]],color:"#ffaa00",lineWidth:3})]},`destructive-${i}`)),(0,t.jsxs)("group",{position:[0,.3,0],children:[(0,t.jsxs)("mesh",{position:[0,0,-20.5],receiveShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[42,.4,1]}),(0,t.jsx)("meshStandardMaterial",{color:"#1a1a2e",metalness:.7,roughness:.3})]}),(0,t.jsxs)("mesh",{position:[0,0,20.5],receiveShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[42,.4,1]}),(0,t.jsx)("meshStandardMaterial",{color:"#1a1a2e",metalness:.7,roughness:.3})]}),(0,t.jsxs)("mesh",{position:[-20.5,0,0],receiveShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[1,.4,41]}),(0,t.jsx)("meshStandardMaterial",{color:"#1a1a2e",metalness:.7,roughness:.3})]}),(0,t.jsxs)("mesh",{position:[20.5,0,0],receiveShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[1,.4,41]}),(0,t.jsx)("meshStandardMaterial",{color:"#1a1a2e",metalness:.7,roughness:.3})]}),(0,t.jsxs)("mesh",{position:[0,-.2,0],receiveShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[42,.4,42]}),(0,t.jsx)("meshStandardMaterial",{color:"#0a0a15",metalness:.3,roughness:.8})]})]})]})}e.i(81413);var l=e.i(48205),c=e.i(68647),d=e.i(82192),f=e.i(14228),u=e.i(4685);e.s(["default",0,function(){let e=(0,r.useRouter)(),[n,s]=(0,i.useState)(null),[a,h]=(0,i.useState)(!0),[p,m]=(0,i.useState)(!0),[v,x]=(0,i.useState)(1),[y,g]=(0,i.useState)(0),[S,w]=(0,i.useState)(2),[b,j]=(0,i.useState)(1),[M,A]=(0,i.useState)(3),[E,_]=(0,i.useState)(6),[L,C]=(0,i.useState)(!0),U=(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)(c.ControlGroup,{title:"Wave Parameters",children:[(0,t.jsx)(c.ControlSlider,{label:"Frequency",value:S,unit:"Hz",min:.5,max:5,step:.1,color:"#ff4444",onChange:w,decimals:1}),(0,t.jsx)(c.ControlSlider,{label:"Wavelength",value:M,unit:"m",min:1,max:8,step:.25,color:"#4444ff",onChange:A,decimals:2}),(0,t.jsx)(c.ControlSlider,{label:"Amplitude",value:b,unit:"",min:.2,max:2,step:.1,color:"#aa44ff",onChange:j,decimals:1}),(0,t.jsx)(c.ControlSlider,{label:"Source Separation",value:E,unit:"m",min:2,max:12,step:.5,color:"#00cc88",onChange:_,decimals:1})]}),(0,t.jsx)(c.ControlGroup,{title:"Display Options",children:(0,t.jsx)(c.ControlCheckbox,{label:"Show Interference Nodes",checked:L,onChange:C,color:"#00cc88"})}),(0,t.jsx)("button",{onClick:()=>e.push("/experiments/wave-interference/details"),className:"w-full py-2.5 bg-gradient-to-r from-red-100 via-purple-100 to-blue-100 hover:from-red-200 hover:via-purple-200 hover:to-blue-200 text-gray-700 font-medium text-sm rounded-lg transition-all border border-gray-300/50 flex items-center justify-center gap-2",children:"📖 View Experiment Details"})]}),B=n?(0,t.jsx)(c.DataGrid,{data:{wavelength:{value:n.wavelength,unit:"m",color:"#4444ff",decimals:2},frequency:{value:n.frequency,unit:"Hz",color:"#ff4444",decimals:1},sourceSep:{value:n.sourceSeparation,unit:"m",color:"#00cc88",decimals:1},waveSpeed:{value:n.waveSpeed,unit:"m/s",color:"#aa44ff",decimals:1},maxAmp:{value:n.maxAmplitude,unit:"m",color:"#ff8800",decimals:2},constructive:{value:n.constructiveNodes,unit:"",color:"#00ff88",decimals:0},destructive:{value:n.destructiveNodes,unit:"",color:"#ffaa00",decimals:0}},columns:2}):(0,t.jsx)("div",{className:"text-center text-gray-500 text-sm py-8",children:"Initializing simulation..."});return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(l.ExperimentContainer,{title:"Wave Interference",description:"Observe constructive and destructive interference patterns from two wave sources",cameraPosition:[30,22,30],backgroundColor:"#050510",controls:null,dataPanel:null,children:(0,t.jsx)(o,{onDataChange:s,frequency:S,amplitude:b,wavelength:M,sourceSeparation:E,showNodes:L,isPlaying:p,simulationSpeed:v,resetTrigger:y})}),(0,t.jsx)(f.SimulationController,{isPlaying:p,onPlayPause:()=>m(e=>!e),onReset:()=>{g(e=>e+1),m(!0),x(1)},speed:v,onSpeedChange:x}),(0,t.jsx)(d.FloatingControlPanel,{title:"⚙️ Parameters",initialPosition:{x:20,y:80},children:U}),(0,t.jsx)(u.DataPanel,{isVisible:a,onToggle:()=>h(!a),children:B})]})}],55485)}]);
(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,i;var r=e.i(31067),n=e.i(71645),s=e.i(90072),a=e.i(48546),o=s,l=s;let c=new l.Box3,d=new l.Vector3;class u extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(i,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let r=new l.InstancedInterleavedBuffer(i,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(r,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(r,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),c.setFromBufferAttribute(t),this.boundingBox.union(c))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let r=0;for(let n=0,s=e.count;n<s;n++)d.fromBufferAttribute(e,n),r=Math.max(r,i.distanceToSquared(d)),d.fromBufferAttribute(t,n),r=Math.max(r,i.distanceToSquared(d));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var p=s,h=e.i(8560),f=e.i(31497);class m extends p.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:p.UniformsUtils.clone(p.UniformsUtils.merge([h.UniformsLib.common,h.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new p.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
					#include <${f.version>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let x=f.version>=125?"uv1":"uv2",v=new o.Vector4,g=new o.Vector3,y=new o.Vector3,b=new o.Vector4,S=new o.Vector4,w=new o.Vector4,j=new o.Vector3,M=new o.Matrix4,E=new o.Line3,N=new o.Vector3,z=new o.Box3,A=new o.Sphere,C=new o.Vector4;function P(e,t,r){return C.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),C.multiplyScalar(1/C.w),C.x=i/r.width,C.y=i/r.height,C.applyMatrix4(e.projectionMatrixInverse),C.multiplyScalar(1/C.w),Math.abs(Math.max(C.x,C.y))}class L extends o.Mesh{constructor(e=new u,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,n=0,s=t.count;e<s;e++,n+=2)g.fromBufferAttribute(t,e),y.fromBufferAttribute(i,e),r[n]=0===n?0:r[n-1],r[n+1]=r[n]+g.distanceTo(y);let n=new o.InstancedInterleavedBuffer(r,2,1);return e.setAttribute("instanceDistanceStart",new o.InterleavedBufferAttribute(n,1,0)),e.setAttribute("instanceDistanceEnd",new o.InterleavedBufferAttribute(n,1,1)),this}raycast(e,r){let n,s,a=this.material.worldUnits,l=e.camera;null!==l||a||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let d=this.matrixWorld,u=this.geometry,p=this.material;if(i=p.linewidth+c,null===u.boundingSphere&&u.computeBoundingSphere(),A.copy(u.boundingSphere).applyMatrix4(d),a)n=.5*i;else{let e=Math.max(l.near,A.distanceToPoint(t.origin));n=P(l,e,p.resolution)}if(A.radius+=n,!1!==t.intersectsSphere(A)){if(null===u.boundingBox&&u.computeBoundingBox(),z.copy(u.boundingBox).applyMatrix4(d),a)s=.5*i;else{let e=Math.max(l.near,z.distanceToPoint(t.origin));s=P(l,e,p.resolution)}z.expandByScalar(s),!1!==t.intersectsBox(z)&&(a?function(e,r){let n=e.matrixWorld,s=e.geometry,a=s.attributes.instanceStart,l=s.attributes.instanceEnd,c=Math.min(s.instanceCount,a.count);for(let s=0;s<c;s++){E.start.fromBufferAttribute(a,s),E.end.fromBufferAttribute(l,s),E.applyMatrix4(n);let c=new o.Vector3,d=new o.Vector3;t.distanceSqToSegment(E.start,E.end,d,c),d.distanceTo(c)<.5*i&&r.push({point:d,pointOnLine:c,distance:t.origin.distanceTo(d),object:e,face:null,faceIndex:s,uv:null,[x]:null})}}(this,r):function(e,r,n){let s=r.projectionMatrix,a=e.material.resolution,l=e.matrixWorld,c=e.geometry,d=c.attributes.instanceStart,u=c.attributes.instanceEnd,p=Math.min(c.instanceCount,d.count),h=-r.near;t.at(1,w),w.w=1,w.applyMatrix4(r.matrixWorldInverse),w.applyMatrix4(s),w.multiplyScalar(1/w.w),w.x*=a.x/2,w.y*=a.y/2,w.z=0,j.copy(w),M.multiplyMatrices(r.matrixWorldInverse,l);for(let r=0;r<p;r++){if(b.fromBufferAttribute(d,r),S.fromBufferAttribute(u,r),b.w=1,S.w=1,b.applyMatrix4(M),S.applyMatrix4(M),b.z>h&&S.z>h)continue;if(b.z>h){let e=b.z-S.z,t=(b.z-h)/e;b.lerp(S,t)}else if(S.z>h){let e=S.z-b.z,t=(S.z-h)/e;S.lerp(b,t)}b.applyMatrix4(s),S.applyMatrix4(s),b.multiplyScalar(1/b.w),S.multiplyScalar(1/S.w),b.x*=a.x/2,b.y*=a.y/2,S.x*=a.x/2,S.y*=a.y/2,E.start.copy(b),E.start.z=0,E.end.copy(S),E.end.z=0;let c=E.closestPointToPointParameter(j,!0);E.at(c,N);let p=o.MathUtils.lerp(b.z,S.z,c),f=p>=-1&&p<=1,m=j.distanceTo(N)<.5*i;if(f&&m){E.start.fromBufferAttribute(d,r),E.end.fromBufferAttribute(u,r),E.start.applyMatrix4(l),E.end.applyMatrix4(l);let i=new o.Vector3,s=new o.Vector3;t.distanceSqToSegment(E.start,E.end,s,i),n.push({point:s,pointOnLine:i,distance:t.origin.distanceTo(s),object:e,face:null,faceIndex:r,uv:null,[x]:null})}}}(this,l,r))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(v),this.material.uniforms.resolution.value.set(v.z,v.w))}}class _ extends u{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let r=0;r<t;r+=3)i[2*r]=e[r],i[2*r+1]=e[r+1],i[2*r+2]=e[r+2],i[2*r+3]=e[r+3],i[2*r+4]=e[r+4],i[2*r+5]=e[r+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,r=new Float32Array(2*i);if(3===t)for(let n=0;n<i;n+=t)r[2*n]=e[n],r[2*n+1]=e[n+1],r[2*n+2]=e[n+2],r[2*n+3]=e[n+3],r[2*n+4]=e[n+4],r[2*n+5]=e[n+5];else for(let n=0;n<i;n+=t)r[2*n]=e[n],r[2*n+1]=e[n+1],r[2*n+2]=e[n+2],r[2*n+3]=e[n+3],r[2*n+4]=e[n+4],r[2*n+5]=e[n+5],r[2*n+6]=e[n+6],r[2*n+7]=e[n+7];return super.setColors(r,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class U extends L{constructor(e=new _,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let O=n.forwardRef(function({points:e,color:t=0xffffff,vertexColors:i,linewidth:o,lineWidth:l,segments:c,dashed:d,...p},h){var f,x;let v=(0,a.useThree)(e=>e.size),g=n.useMemo(()=>c?new L:new U,[c]),[y]=n.useState(()=>new m),b=(null==i||null==(f=i[0])?void 0:f.length)===4?4:3,S=n.useMemo(()=>{let r=c?new u:new _,n=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Vector3||e instanceof s.Vector4?[e.x,e.y,e.z]:e instanceof s.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(r.setPositions(n.flat()),i){t=0xffffff;let e=i.map(e=>e instanceof s.Color?e.toArray():e);r.setColors(e.flat(),b)}return r},[e,c,i,b]);return n.useLayoutEffect(()=>{g.computeLineDistances()},[e,g]),n.useLayoutEffect(()=>{d?y.defines.USE_DASH="":delete y.defines.USE_DASH,y.needsUpdate=!0},[d,y]),n.useEffect(()=>()=>{S.dispose(),y.dispose()},[S]),n.createElement("primitive",(0,r.default)({object:g,ref:h},p),n.createElement("primitive",{object:S,attach:"geometry"}),n.createElement("primitive",(0,r.default)({object:y,attach:"material",color:t,vertexColors:!!i,resolution:[v.width,v.height],linewidth:null!=(x=null!=o?o:l)?x:1,dashed:d,transparent:4===b},p)))});e.s(["Line",0,O],43216)},60099,e=>{"use strict";let t,i;var r=e.i(31067),n=e.i(71645),s=e.i(88014),a=e.i(90072),o=e.i(48546),l=e.i(94800);let c=new a.Vector3,d=new a.Vector3,u=new a.Vector3,p=new a.Vector2;function h(e,t,i){let r=c.setFromMatrixPosition(e.matrixWorld);r.project(t);let n=i.width/2,s=i.height/2;return[r.x*n+n,-(r.y*s)+s]}let f=e=>1e-10>Math.abs(e)?0:e;function m(e,t,i=""){let r="matrix3d(";for(let i=0;16!==i;i++)r+=f(t[i]*e.elements[i])+(15!==i?",":")");return i+r}let x=(t=[1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1],e=>m(e,t)),v=(i=e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1],(e,t)=>m(e,i(t),"translate(-50%,-50%)")),g=n.forwardRef(({children:e,eps:t=.001,style:i,className:m,prepend:g,center:y,fullscreen:b,portal:S,distanceFactor:w,sprite:j=!1,transform:M=!1,occlude:E,onOcclude:N,castShadow:z,receiveShadow:A,material:C,geometry:P,zIndexRange:L=[0x1000037,0],calculatePosition:_=h,as:U="div",wrapperClass:O,pointerEvents:R="auto",...I},B)=>{let{gl:k,camera:T,scene:V,size:H,raycaster:D,events:W,viewport:F}=(0,o.useThree)(),[G]=n.useState(()=>document.createElement(U)),$=n.useRef(null),K=n.useRef(null),q=n.useRef(0),Z=n.useRef([0,0]),J=n.useRef(null),X=n.useRef(null),Q=(null==S?void 0:S.current)||W.connected||k.domElement.parentNode,Y=n.useRef(null),ee=n.useRef(!1),et=n.useMemo(()=>{var e;return E&&"blending"!==E||Array.isArray(E)&&E.length&&(e=E[0])&&"object"==typeof e&&"current"in e},[E]);n.useLayoutEffect(()=>{let e=k.domElement;E&&"blending"===E?(e.style.zIndex=`${Math.floor(L[0]/2)}`,e.style.position="absolute",e.style.pointerEvents="none"):(e.style.zIndex=null,e.style.position=null,e.style.pointerEvents=null)},[E]),n.useLayoutEffect(()=>{if(K.current){let e=$.current=s.createRoot(G);if(V.updateMatrixWorld(),M)G.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";else{let e=_(K.current,T,H);G.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${e[0]}px,${e[1]}px,0);transform-origin:0 0;`}return Q&&(g?Q.prepend(G):Q.appendChild(G)),()=>{Q&&Q.removeChild(G),e.unmount()}}},[Q,M]),n.useLayoutEffect(()=>{O&&(G.className=O)},[O]);let ei=n.useMemo(()=>M?{position:"absolute",top:0,left:0,width:H.width,height:H.height,transformStyle:"preserve-3d",pointerEvents:"none"}:{position:"absolute",transform:y?"translate3d(-50%,-50%,0)":"none",...b&&{top:-H.height/2,left:-H.width/2,width:H.width,height:H.height},...i},[i,y,b,H,M]),er=n.useMemo(()=>({position:"absolute",pointerEvents:R}),[R]);n.useLayoutEffect(()=>{var t,r;ee.current=!1,M?null==(t=$.current)||t.render(n.createElement("div",{ref:J,style:ei},n.createElement("div",{ref:X,style:er},n.createElement("div",{ref:B,className:m,style:i,children:e})))):null==(r=$.current)||r.render(n.createElement("div",{ref:B,style:ei,className:m,children:e}))});let en=n.useRef(!0);(0,l.useFrame)(e=>{if(K.current){T.updateMatrixWorld(),K.current.updateWorldMatrix(!0,!1);let e=M?Z.current:_(K.current,T,H);if(M||Math.abs(q.current-T.zoom)>t||Math.abs(Z.current[0]-e[0])>t||Math.abs(Z.current[1]-e[1])>t){var i;let t,r,n,s,o=(i=K.current,t=c.setFromMatrixPosition(i.matrixWorld),r=d.setFromMatrixPosition(T.matrixWorld),n=t.sub(r),s=T.getWorldDirection(u),n.angleTo(s)>Math.PI/2),l=!1;et&&(Array.isArray(E)?l=E.map(e=>e.current):"blending"!==E&&(l=[V]));let h=en.current;l?en.current=function(e,t,i,r){let n=c.setFromMatrixPosition(e.matrixWorld),s=n.clone();s.project(t),p.set(s.x,s.y),i.setFromCamera(p,t);let a=i.intersectObjects(r,!0);if(a.length){let e=a[0].distance;return n.distanceTo(i.ray.origin)<e}return!0}(K.current,T,D,l)&&!o:en.current=!o,h!==en.current&&(N?N(!en.current):G.style.display=en.current?"block":"none");let m=Math.floor(L[0]/2),g=E?et?[L[0],m]:[m-1,0]:L;if(G.style.zIndex=`${function(e,t,i){if(t instanceof a.PerspectiveCamera||t instanceof a.OrthographicCamera){let r=c.setFromMatrixPosition(e.matrixWorld),n=d.setFromMatrixPosition(t.matrixWorld),s=r.distanceTo(n),a=(i[1]-i[0])/(t.far-t.near),o=i[1]-a*t.far;return Math.round(a*s+o)}}(K.current,T,g)}`,M){let[e,t]=[H.width/2,H.height/2],i=T.projectionMatrix.elements[5]*t,{isOrthographicCamera:r,top:n,left:s,bottom:a,right:o}=T,l=x(T.matrixWorldInverse),c=r?`scale(${i})translate(${f(-(o+s)/2)}px,${f((n+a)/2)}px)`:`translateZ(${i}px)`,d=K.current.matrixWorld;j&&((d=T.matrixWorldInverse.clone().transpose().copyPosition(d).scale(K.current.scale)).elements[3]=d.elements[7]=d.elements[11]=0,d.elements[15]=1),G.style.width=H.width+"px",G.style.height=H.height+"px",G.style.perspective=r?"":`${i}px`,J.current&&X.current&&(J.current.style.transform=`${c}${l}translate(${e}px,${t}px)`,X.current.style.transform=v(d,1/((w||10)/400)))}else{let t=void 0===w?1:function(e,t){if(t instanceof a.OrthographicCamera)return t.zoom;if(!(t instanceof a.PerspectiveCamera))return 1;{let i=c.setFromMatrixPosition(e.matrixWorld),r=d.setFromMatrixPosition(t.matrixWorld);return 1/(2*Math.tan(t.fov*Math.PI/180/2)*i.distanceTo(r))}}(K.current,T)*w;G.style.transform=`translate3d(${e[0]}px,${e[1]}px,0) scale(${t})`}Z.current=e,q.current=T.zoom}}if(!et&&Y.current&&!ee.current)if(M){if(J.current){let e=J.current.children[0];if(null!=e&&e.clientWidth&&null!=e&&e.clientHeight){let{isOrthographicCamera:t}=T;if(t||P)I.scale&&(Array.isArray(I.scale)?I.scale instanceof a.Vector3?Y.current.scale.copy(I.scale.clone().divideScalar(1)):Y.current.scale.set(1/I.scale[0],1/I.scale[1],1/I.scale[2]):Y.current.scale.setScalar(1/I.scale));else{let t=(w||10)/400,i=e.clientWidth*t,r=e.clientHeight*t;Y.current.scale.set(i,r,1)}ee.current=!0}}}else{let t=G.children[0];if(null!=t&&t.clientWidth&&null!=t&&t.clientHeight){let e=1/F.factor,i=t.clientWidth*e,r=t.clientHeight*e;Y.current.scale.set(i,r,1),ee.current=!0}Y.current.lookAt(e.camera.position)}});let es=n.useMemo(()=>({vertexShader:M?void 0:`
          /*
            This shader is from the THREE's SpriteMaterial.
            We need to turn the backing plane into a Sprite
            (make it always face the camera) if "transfrom"
            is false.
          */
          #include <common>

          void main() {
            vec2 center = vec2(0., 1.);
            float rotation = 0.0;

            // This is somewhat arbitrary, but it seems to work well
            // Need to figure out how to derive this dynamically if it even matters
            float size = 0.03;

            vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
            vec2 scale;
            scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
            scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );

            bool isPerspective = isPerspectiveMatrix( projectionMatrix );
            if ( isPerspective ) scale *= - mvPosition.z;

            vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale * size;
            vec2 rotatedPosition;
            rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
            rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
            mvPosition.xy += rotatedPosition;

            gl_Position = projectionMatrix * mvPosition;
          }
      `,fragmentShader:`
        void main() {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        }
      `}),[M]);return n.createElement("group",(0,r.default)({},I,{ref:K}),E&&!et&&n.createElement("mesh",{castShadow:z,receiveShadow:A,ref:Y},P||n.createElement("planeGeometry",null),C||n.createElement("shaderMaterial",{side:a.DoubleSide,vertexShader:es.vertexShader,fragmentShader:es.fragmentShader})))});e.s(["Html",0,g])},56420,e=>{"use strict";var t=e.i(71645);let i=(...e)=>e.filter((e,t,i)=>!!e&&""!==e.trim()&&i.indexOf(e)===t).join(" ").trim(),r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,i)=>i?i.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var n={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,t.createContext)({}),a=(0,t.forwardRef)(({color:e,size:r,strokeWidth:a,absoluteStrokeWidth:o,className:l="",children:c,iconNode:d,...u},p)=>{let{size:h=24,strokeWidth:f=2,absoluteStrokeWidth:m=!1,color:x="currentColor",className:v=""}=(0,t.useContext)(s)??{},g=o??m?24*Number(a??f)/Number(r??h):a??f;return(0,t.createElement)("svg",{ref:p,...n,width:r??h??n.width,height:r??h??n.height,stroke:e??x,strokeWidth:g,className:i("lucide",v,l),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,i])=>(0,t.createElement)(e,i)),...Array.isArray(c)?c:[c]])});e.s(["default",0,(e,n)=>{let s=(0,t.forwardRef)(({className:s,...o},l)=>(0,t.createElement)(a,{ref:l,iconNode:n,className:i(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...o}));return s.displayName=r(e),s}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,i)=>{t.exports=e.r(76562)},5873,e=>{"use strict";var t=e.i(43476),i=e.i(71645);e.i(81413);var r=e.i(48205),n=e.i(14228),s=e.i(82192),a=e.i(4685),o=e.i(68647),l=e.i(94800),c=e.i(30297),d=e.i(60099),u=e.i(43216),p=e.i(90072);function h({onDataChange:e,isPlaying:r=!0,simulationSpeed:n=1,resetTrigger:s=0,stepMode:a=!1,speed:o=1,showIonChannels:f=!0,showMyelin:m=!0,step:x=0}){let v=(0,i.useRef)(null),g=(0,i.useRef)(0),y=(0,i.useRef)("resting"),b=(0,i.useRef)(-70),S=(0,i.useRef)(0),w=(0,i.useRef)([]),j=(0,i.useRef)(-12),M=(0,i.useRef)([]),E=(0,i.useRef)(0),N=(0,i.useRef)([]),[z,A]=(0,i.useState)({voltage:-70,phase:"Resting",naStatus:"Closed",kStatus:"Closed",speed:120,description:"Neuron at resting potential (-70mV)"});(0,i.useEffect)(()=>{let e=[];for(let t=0;t<50;t++)e.push({id:t,position:[-10+20*Math.random(),.7+.6*Math.random(),-.5+ +Math.random()],type:"Na",active:!1,velocity:[0,0,0],inside:!1});for(let t=0;t<50;t++)e.push({id:50+t,position:[-10+20*Math.random(),-.2-.3*Math.random(),-.3+.6*Math.random()],type:"K",active:!1,velocity:[0,0,0],inside:!0});w.current=e,M.current=[];let t=[];for(let e=0;e<8;e++){let i=e/8*Math.PI*2;t.push({position:[7.5,.2*Math.sin(i),.2*Math.cos(i)],released:!1})}N.current=t,j.current=-12,y.current="resting",b.current=-70,S.current=0,E.current=0},[s]);let C=(0,i.useMemo)(()=>{let e=[];for(let t=0;t<10;t++){let i=t/10*Math.PI*2,r=1.8+1.2*Math.random();e.push({start:[-12.5,0,0],end:[-12.5-Math.cos(i)*r,.6*Math.sin(i),Math.sin(i)*r],level:0});for(let t=0;t<4;t++){let t=i+(Math.random()-.5)*1.2,n=.6+.6*Math.random(),s=-12.5-Math.cos(i)*r,a=Math.sin(i)*r;e.push({start:[s,.6*Math.sin(i),a],end:[s-Math.cos(t)*n,.6*Math.sin(i)+.4*Math.sin(t),a+Math.sin(t)*n],level:1})}}return e},[]),P=(0,i.useMemo)(()=>{let e=[];if(m)for(let t=0;t<4;t++)e.push({start:-8+3.5*t,end:-5.5+3.5*t});return e},[m]);(0,l.useFrame)((t,i)=>{if(!v.current||!r)return;g.current++,S.current+=i*n*o,E.current+=i*n*o;let s=y.current,l=j.current;if(a){let e=["resting","stimulus","depolarization","repolarization","hyperpolarization","synapse"];x>=0&&x<e.length&&(y.current=e[x],E.current=1.5*x)}else"resting"===s&&E.current>2?(y.current="stimulus",E.current=0):"stimulus"===s&&E.current>1.2?(y.current="depolarization",E.current=0):"depolarization"===s&&E.current>1.8?(y.current="repolarization",E.current=0):"repolarization"===s&&E.current>1.8?(y.current="hyperpolarization",E.current=0):"hyperpolarization"===s&&E.current>1.2?(y.current="synapse",E.current=0):"synapse"===s&&E.current>2.5&&(y.current="resting",E.current=0,j.current=-12,M.current=[],N.current.forEach(e=>e.released=!1));switch(y.current){case"resting":b.current=-70,j.current=-12+Math.min(2,.5*E.current);break;case"stimulus":b.current=-70+15*E.current,j.current=-11.5+1.5*E.current;break;case"depolarization":b.current=-55+55*E.current,j.current=-10+5*E.current;break;case"repolarization":b.current=40-75*E.current,j.current=-1+4*E.current;break;case"hyperpolarization":b.current=-35-35*E.current,j.current=3+2*E.current;break;case"synapse":b.current=-70,j.current=8}if(w.current.forEach(e=>{"Na"===e.type?"depolarization"===y.current&&2.5>Math.abs(e.position[0]-l)?(e.active=!0,e.velocity[1]=-.025*n,e.position[1]+=e.velocity[1],e.position[1]<0&&(e.inside=!0)):e.inside&&e.position[1]<.6&&(e.position[1]+=.003*n,e.position[1]>.6&&(e.inside=!1)):"K"===e.type&&("repolarization"===y.current&&2.5>Math.abs(e.position[0]-l)?(e.active=!0,e.velocity[1]=.025*n,e.position[1]+=e.velocity[1],e.position[1]>.3&&(e.inside=!1)):!e.inside&&e.position[1]>-.4&&(e.position[1]-=.003*n,e.position[1]<-.4&&(e.inside=!0)))}),"synapse"===y.current&&N.current.forEach((e,t)=>{if(!e.released&&E.current>.2*t){e.released=!0;for(let t=0;t<5;t++)M.current.push({id:M.current.length,position:[e.position[0],e.position[1],e.position[2]],type:"neurotransmitter",active:!0,velocity:[.015*n,(Math.random()-.5)*.01,(Math.random()-.5)*.015],inside:!1})}}),M.current.forEach(e=>{e.position[0]<9.8&&(e.position[0]+=e.velocity[0],e.position[1]+=e.velocity[1],e.position[2]+=e.velocity[2])}),g.current%8==0){let t={voltage:Math.round(b.current),phase:{resting:"1. Resting (-70mV)",stimulus:"2. Stimulus Arrived",depolarization:"3. Depolarization (Na+ IN)",repolarization:"4. Repolarization (K+ OUT)",hyperpolarization:"5. Hyperpolarization",synapse:"6. Synapse (Neurotransmitters)"}[y.current],naStatus:"depolarization"===y.current?"OPEN (rushing IN →)":"Closed",kStatus:"repolarization"===y.current?"OPEN (rushing OUT ←)":"Closed",speed:m?120:30,description:{resting:"Neuron at resting potential. Voltage-gated Na+ and K+ channels are CLOSED.",stimulus:"Stimulus arrives at dendrites. Slight depolarization begins. Voltage starts rising.",depolarization:"Voltage-gated Na+ channels OPEN! Na+ ions RUSH IN down their concentration gradient. Voltage shoots to +40mV.",repolarization:"Na+ channels close. K+ channels OPEN! K+ ions RUSH OUT. Voltage drops back down.",hyperpolarization:"K+ channels close slowly. Voltage briefly drops below resting potential (-70mV).",synapse:"Action potential reaches axon terminals. Ca2+ channels open, vesicles release NEUROTRANSMITTERS into synaptic cleft."}[y.current]};A(t),e?.(t)}});let L=(0,i.useMemo)(()=>{let e=[];for(let t=0;t<=100;t++){let i=t/100,r=-6+10*i,n=((i<.2?-70:i<.3?-70+(i-.2)*100:i<.45?-60+(i-.3)*666:i<.65?40-(i-.45)*400:i<.75?-40-(i-.65)*300:-70)+80)/40;e.push([r,n,-6])}return e},[]),_=(0,i.useMemo)(()=>[-6+10*({resting:0,stimulus:.25,depolarization:.35,repolarization:.55,hyperpolarization:.7,synapse:.9})[y.current],(z.voltage+80)/40,-6],[z.voltage,y.current]),U=(0,i.useCallback)(()=>{let e=b.current;return e>0?"#22d3ee":e>-60?"#06b6d4":e<-70?"#a78bfa":"#ec4899"},[]);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("ambientLight",{intensity:.4}),(0,t.jsx)("directionalLight",{position:[10,15,10],intensity:.8,castShadow:!0}),(0,t.jsx)("pointLight",{position:[0,5,0],intensity:.3,color:"#ec4899"}),(0,t.jsx)(c.OrbitControls,{enableDamping:!0,dampingFactor:.05}),(0,t.jsxs)("group",{ref:v,children:[(0,t.jsxs)("mesh",{position:[-13.5,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[1.4,32,32]}),(0,t.jsx)("meshStandardMaterial",{color:"#ec4899",emissive:"#ec4899",emissiveIntensity:.2,roughness:.3,metalness:.4})]}),(0,t.jsxs)("mesh",{position:[-13.5,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[.6,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#be185d",roughness:.5})]}),C.map((e,i)=>(0,t.jsx)(u.Line,{points:[e.start,e.end],color:"#f472b6",lineWidth:0===e.level?3:1.5,opacity:.8,transparent:!0},i)),(0,t.jsxs)("mesh",{position:[-2,0,0],rotation:[0,0,Math.PI/2],children:[(0,t.jsx)("cylinderGeometry",{args:[.35,.35,23,24]}),(0,t.jsx)("meshStandardMaterial",{color:"#f9a8d4",transparent:!0,opacity:.5,roughness:.3})]}),m&&P.map((e,i)=>(0,t.jsxs)("group",{children:[(0,t.jsxs)("mesh",{position:[(e.start+e.end)/2,0,0],rotation:[0,0,Math.PI/2],children:[(0,t.jsx)("cylinderGeometry",{args:[.55,.55,e.end-e.start,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#fde047",roughness:.3,metalness:.4})]}),(0,t.jsxs)("mesh",{position:[(e.start+e.end)/2,0,0],rotation:[0,0,Math.PI/2],children:[(0,t.jsx)("cylinderGeometry",{args:[.57,.57,e.end-e.start-.1,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#facc15",transparent:!0,opacity:.4})]})]},i)),m&&[-6.75,-3.25,.25,3.75].map((e,i)=>(0,t.jsxs)("mesh",{position:[e,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[.38,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#f472b6",emissive:"#f472b6",emissiveIntensity:.4})]},i)),f&&Array.from({length:18}).map((e,i)=>(0,t.jsxs)("group",{position:[-10+1.2*i,.35,.15*Math.sin(.5*i)],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("boxGeometry",{args:[.12,.12,.12]}),(0,t.jsx)("meshStandardMaterial",{color:"#06b6d4",emissive:"#06b6d4",emissiveIntensity:.5})]}),(0,t.jsxs)("mesh",{position:[0,-.1,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.04,.04,.1,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#1e3a5f"})]})]},i)),w.current.map(e=>(0,t.jsxs)("mesh",{position:e.position,children:[(0,t.jsx)("sphereGeometry",{args:["Na"===e.type?.07:.055,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:"Na"===e.type?"#ef4444":"#3b82f6",emissive:"Na"===e.type?"#ef4444":"#3b82f6",emissiveIntensity:e.active?1:.3,transparent:!0,opacity:e.active?1:.5})]},e.id)),(0,t.jsxs)("mesh",{position:[j.current,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[.7,16,16]}),(0,t.jsx)("meshBasicMaterial",{color:U(),transparent:!0,opacity:.5,blending:p.AdditiveBlending})]}),(0,t.jsx)("pointLight",{position:[j.current,0,0],intensity:1.2,color:U(),distance:3.5}),(0,t.jsx)("group",{position:[8,0,0],children:Array.from({length:8}).map((e,i)=>{let r=i/8*Math.PI*2,n=N.current[i];return(0,t.jsxs)("group",{position:[.8,.35*Math.sin(r),.35*Math.cos(r)],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.3,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#8b5cf6"})]}),!n?.released&&(0,t.jsxs)("mesh",{position:[-.15,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[.08,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#fbbf24",emissive:"#fbbf24",emissiveIntensity:.6})]})]},i)})}),M.current.map(e=>(0,t.jsxs)("mesh",{position:e.position,children:[(0,t.jsx)("sphereGeometry",{args:[.055,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#a78bfa",emissive:"#a78bfa",emissiveIntensity:.7})]},e.id)),(0,t.jsxs)("mesh",{position:[10.5,0,0],rotation:[0,0,Math.PI/2],children:[(0,t.jsx)("cylinderGeometry",{args:[.25,.25,2,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#8b5cf6",opacity:.7,transparent:!0})]}),Array.from({length:6}).map((e,i)=>{let r=i/6*Math.PI*2;return(0,t.jsxs)("mesh",{position:[10,.25*Math.sin(r),.25*Math.cos(r)],children:[(0,t.jsx)("sphereGeometry",{args:[.06,6,6]}),(0,t.jsx)("meshStandardMaterial",{color:"#a78bfa",emissive:"#a78bfa",emissiveIntensity:.5})]},i)}),(0,t.jsxs)("group",{position:[0,5,-6],rotation:[Math.PI/4,0,0],children:[(0,t.jsxs)("mesh",{position:[-1,1,0],children:[(0,t.jsx)("boxGeometry",{args:[11,3.5,.1]}),(0,t.jsx)("meshStandardMaterial",{color:"#1f2937",transparent:!0,opacity:.95})]}),(0,t.jsx)(u.Line,{points:L,color:"#22d3ee",lineWidth:3}),(0,t.jsxs)("mesh",{position:_,children:[(0,t.jsx)("sphereGeometry",{args:[.15,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#fbbf24",emissive:"#fbbf24",emissiveIntensity:.9})]}),(0,t.jsx)(d.Html,{position:[-6.5,4,0],distanceFactor:15,children:(0,t.jsx)("div",{className:"text-cyan-400 text-xs font-bold",children:"+40mV"})}),(0,t.jsx)(d.Html,{position:[-6.5,.5,0],distanceFactor:15,children:(0,t.jsx)("div",{className:"text-gray-400 text-xs",children:"-70mV"})}),(0,t.jsx)(d.Html,{position:[-1,4.5,0],distanceFactor:15,children:(0,t.jsx)("div",{className:"text-white text-xs font-bold",children:"Action Potential"})})]}),(0,t.jsx)(d.Html,{position:[0,7,0],distanceFactor:15,children:(0,t.jsxs)("div",{className:"bg-gray-900/95 text-white px-4 py-3 rounded-lg shadow-lg max-w-md",children:[(0,t.jsx)("div",{className:"text-lg font-bold text-pink-400 mb-2",children:z.phase}),(0,t.jsx)("div",{className:"text-sm mb-2",children:z.description}),(0,t.jsxs)("div",{className:"flex items-center gap-4 text-xs",children:[(0,t.jsxs)("div",{children:["Voltage: ",(0,t.jsxs)("span",{className:`font-bold px-2 py-0.5 rounded ${z.voltage>0?"bg-cyan-500/30 text-cyan-400":z.voltage<-70?"bg-purple-500/30 text-purple-400":"bg-blue-500/30 text-blue-400"}`,children:[z.voltage," mV"]})]}),(0,t.jsxs)("div",{children:["Speed: ",(0,t.jsxs)("span",{className:"font-bold text-amber-400",children:[z.speed," m/s"]})]})]})]})}),(0,t.jsx)(d.Html,{position:[-8,4,3],distanceFactor:15,children:(0,t.jsxs)("div",{className:"bg-gray-900/90 text-white px-3 py-2 rounded text-xs",children:[(0,t.jsx)("div",{className:"font-bold mb-2",children:"Voltage-Gated Ion Channels"}),(0,t.jsxs)("div",{className:"flex items-center gap-2 mb-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-red-500"}),(0,t.jsx)("span",{children:"Na+ (Sodium): "}),(0,t.jsx)("span",{className:z.naStatus.includes("OPEN")?"text-red-400 font-bold bg-red-500/20 px-2 py-0.5 rounded":"text-gray-400",children:z.naStatus})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-blue-500"}),(0,t.jsx)("span",{children:"K+ (Potassium): "}),(0,t.jsx)("span",{className:z.kStatus.includes("OPEN")?"text-blue-400 font-bold bg-blue-500/20 px-2 py-0.5 rounded":"text-gray-400",children:z.kStatus})]})]})}),z.naStatus.includes("OPEN")&&(0,t.jsx)(d.Html,{position:[-2,2,2],distanceFactor:12,children:(0,t.jsx)("div",{className:"text-red-400 text-xs font-bold animate-pulse",children:"Na+ RUSHING IN ↓"})}),z.kStatus.includes("OPEN")&&(0,t.jsx)(d.Html,{position:[2,2,2],distanceFactor:12,children:(0,t.jsx)("div",{className:"text-blue-400 text-xs font-bold animate-pulse",children:"K+ RUSHING OUT ↑"})}),(0,t.jsx)(d.Html,{position:[-13.5,2.2,0],distanceFactor:12,children:(0,t.jsx)("div",{className:"bg-pink-500/90 text-white px-3 py-1 rounded text-xs font-bold",children:"Cell Body (Soma)"})}),(0,t.jsx)(d.Html,{position:[-2,1.5,0],distanceFactor:12,children:(0,t.jsx)("div",{className:"bg-pink-500/90 text-white px-3 py-1 rounded text-xs font-bold",children:"Axon"})}),m&&(0,t.jsx)(d.Html,{position:[0,-1.5,0],distanceFactor:12,children:(0,t.jsx)("div",{className:"bg-amber-500/90 text-white px-2 py-1 rounded text-xs",children:"Myelin Sheath (Insulation)"})}),(0,t.jsx)(d.Html,{position:[8,1.8,0],distanceFactor:12,children:(0,t.jsx)("div",{className:"bg-purple-500/90 text-white px-3 py-1 rounded text-xs font-bold",children:"Axon Terminals"})}),(0,t.jsx)(d.Html,{position:[9.5,1.5,0],distanceFactor:12,children:(0,t.jsx)("div",{className:"bg-indigo-500/90 text-white px-2 py-1 rounded text-xs",children:"Synaptic Cleft"})}),(0,t.jsx)(d.Html,{position:[6,4,3],distanceFactor:15,children:(0,t.jsxs)("div",{className:"bg-gray-900/90 text-white px-3 py-2 rounded text-xs",children:[(0,t.jsx)("div",{className:"font-bold mb-2",children:"Legend"}),(0,t.jsxs)("div",{className:"flex items-center gap-2 mb-1",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-pink-500"}),(0,t.jsx)("span",{children:"Neuron Membrane"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2 mb-1",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-amber-400"}),(0,t.jsx)("span",{children:"Myelin Sheath"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2 mb-1",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-cyan-400"}),(0,t.jsx)("span",{children:"Action Potential"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-purple-400"}),(0,t.jsx)("span",{children:"Neurotransmitters"})]})]})}),(0,t.jsx)(d.Html,{position:[9,-2,0],distanceFactor:12,children:(0,t.jsxs)("div",{className:"bg-purple-900/90 text-white px-3 py-2 rounded text-xs max-w-[180px]",children:[(0,t.jsx)("div",{className:"font-bold text-purple-300 mb-1",children:"Synapse"}),(0,t.jsx)("div",{className:"text-gray-300",children:"Neurotransmitters cross the synaptic cleft and bind to receptors on the next neuron."})]})})]})]})}e.s(["default",0,function(){let[e,l]=(0,i.useState)(!0),[c,d]=(0,i.useState)(1),[u,p]=(0,i.useState)(0),[f,m]=(0,i.useState)(!0),[x,v]=(0,i.useState)(!1),[g,y]=(0,i.useState)(!1),[b,S]=(0,i.useState)(0),[w,j]=(0,i.useState)(1),[M,E]=(0,i.useState)(!0),[N,z]=(0,i.useState)(!0),[A,C]=(0,i.useState)({voltage:-70,phase:"Resting",naStatus:"Closed",kStatus:"Closed",speed:120,description:"Neuron at resting potential (-70mV)"}),P=(0,i.useCallback)(()=>{l(e=>!e)},[]),L=(0,i.useCallback)(()=>{p(e=>e+1),S(0)},[]),_=(0,i.useCallback)(e=>{d(e)},[]),U=(0,i.useCallback)(e=>{C(e)},[]),O=(0,i.useMemo)(()=>(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(o.ControlGroup,{title:"Neuron Controls",children:[(0,t.jsx)(o.ControlSlider,{label:"Speed",value:w,min:.5,max:3,step:.1,onChange:j,color:"#ec4899",decimals:1}),(0,t.jsxs)("label",{className:"flex items-center gap-2 text-sm mt-3",children:[(0,t.jsx)("input",{type:"checkbox",checked:g,onChange:e=>{y(e.target.checked),e.target.checked||S(0)},className:"w-4 h-4 accent-[#ec4899]"}),(0,t.jsx)("span",{className:"text-gray-300",children:"Step Mode"})]}),g&&(0,t.jsxs)("div",{className:"mt-2 space-y-1",children:[(0,t.jsx)("div",{className:"text-xs text-gray-400 mb-1",children:"Step through phases:"}),["Resting","Stimulus","Depolarization","Repolarization","Hyperpolarization","Synapse"].map((e,i)=>(0,t.jsxs)("button",{onClick:()=>S(i),className:`w-full text-left px-2 py-1 text-xs rounded transition-colors ${b===i?"bg-pink-500/30 text-pink-400 border border-pink-500/50":"bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"}`,children:[i+1,". ",e]},e))]}),(0,t.jsxs)("label",{className:"flex items-center gap-2 text-sm mt-3",children:[(0,t.jsx)("input",{type:"checkbox",checked:M,onChange:e=>E(e.target.checked),className:"w-4 h-4 accent-[#06b6d4]"}),(0,t.jsx)("span",{className:"text-gray-300",children:"Show Ion Channels"})]}),(0,t.jsxs)("label",{className:"flex items-center gap-2 text-sm",children:[(0,t.jsx)("input",{type:"checkbox",checked:N,onChange:e=>z(e.target.checked),className:"w-4 h-4 accent-[#fde047]"}),(0,t.jsx)("span",{className:"text-gray-300",children:"Show Myelin Sheath"})]})]}),(0,t.jsxs)("div",{className:"bg-pink-50/50 rounded-lg p-3 border border-pink-200/50",children:[(0,t.jsx)("div",{className:"text-xs text-gray-600 mb-2 font-medium",children:"Action Potential Phases"}),(0,t.jsxs)("div",{className:"text-xs text-gray-500 space-y-1",children:[(0,t.jsxs)("div",{children:["1. ",(0,t.jsx)("strong",{children:"Resting:"})," -70mV, channels closed"]}),(0,t.jsxs)("div",{children:["2. ",(0,t.jsx)("strong",{children:"Stimulus:"})," Signal arrives at dendrites"]}),(0,t.jsxs)("div",{children:["3. ",(0,t.jsx)("strong",{children:"Depolarization:"})," Na+ rushes IN (+40mV)"]}),(0,t.jsxs)("div",{children:["4. ",(0,t.jsx)("strong",{children:"Repolarization:"})," K+ rushes OUT"]}),(0,t.jsxs)("div",{children:["5. ",(0,t.jsx)("strong",{children:"Hyperpolarization:"})," Below -70mV"]}),(0,t.jsxs)("div",{children:["6. ",(0,t.jsx)("strong",{children:"Synapse:"})," Neurotransmitters released"]})]})]}),(0,t.jsx)("button",{onClick:L,className:"w-full mt-4 px-4 py-2 bg-[#ec4899]/20 hover:bg-[#ec4899]/30 text-[#ec4899] rounded-lg border border-[#ec4899]/50 transition-colors text-sm font-medium",children:"Reset Simulation"})]}),[g,b,w,M,N,L]),R=(0,i.useMemo)(()=>(0,t.jsx)(o.DataGrid,{data:{voltage:{value:A.voltage,unit:"mV",color:A.voltage>0?"#22d3ee":"#ec4899",decimals:0},na:{value:+!!A.naStatus.includes("OPEN"),unit:A.naStatus,color:"#ef4444",decimals:0},k:{value:+!!A.kStatus.includes("OPEN"),unit:A.kStatus,color:"#3b82f6",decimals:0},speed:{value:A.speed,unit:"m/s",color:"#fbbf24",decimals:0}},columns:1}),[A]),I=(0,i.useMemo)(()=>(0,t.jsx)(a.DataPanel,{isVisible:x,onToggle:()=>v(e=>!e),children:R}),[x,R]);return(0,t.jsxs)("div",{className:"w-full h-screen relative",children:[(0,t.jsx)(r.ExperimentContainer,{title:"Neuron & Synapse",description:"Visualize action potential propagation and synaptic transmission step-by-step",cameraPosition:[0,6,20],backgroundColor:"#0a0a0f",controls:null,dataPanel:I,children:(0,t.jsx)(h,{onDataChange:U,isPlaying:e,simulationSpeed:c,resetTrigger:u,stepMode:g,speed:w,showIonChannels:M,showMyelin:N,step:b})}),(0,t.jsx)(n.SimulationController,{isPlaying:e,onPlayPause:P,onReset:L,speed:c,onSpeedChange:_,timeElapsed:0}),f&&(0,t.jsx)(s.FloatingControlPanel,{initialPosition:{x:window.innerWidth-340,y:80},children:O}),!f&&(0,t.jsx)("button",{onClick:()=>m(!0),className:"fixed top-20 right-4 z-20 px-4 py-2 bg-[#ec4899]/20 hover:bg-[#ec4899]/30 text-[#ec4899] rounded-lg border border-[#ec4899]/50 transition-colors text-sm font-medium",children:"Show Controls"})]})}],5873)}]);
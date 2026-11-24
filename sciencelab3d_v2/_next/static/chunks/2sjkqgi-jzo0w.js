(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,i;var r=e.i(31067),n=e.i(71645),s=e.i(90072),a=e.i(48546),o=s,l=s;let d=new l.Box3,c=new l.Vector3;class u extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(i,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let r=new l.InstancedInterleavedBuffer(i,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(r,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(r,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),d.setFromBufferAttribute(t),this.boundingBox.union(d))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let r=0;for(let n=0,s=e.count;n<s;n++)c.fromBufferAttribute(e,n),r=Math.max(r,i.distanceToSquared(c)),c.fromBufferAttribute(t,n),r=Math.max(r,i.distanceToSquared(c));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var f=s,p=e.i(8560),h=e.i(31497);class m extends f.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:f.UniformsUtils.clone(f.UniformsUtils.merge([p.UniformsLib.common,p.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new f.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
					#include <${h.version>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let x=h.version>=125?"uv1":"uv2",v=new o.Vector4,y=new o.Vector3,g=new o.Vector3,S=new o.Vector4,w=new o.Vector4,b=new o.Vector4,j=new o.Vector3,M=new o.Matrix4,E=new o.Line3,A=new o.Vector3,_=new o.Box3,L=new o.Sphere,C=new o.Vector4;function U(e,t,r){return C.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),C.multiplyScalar(1/C.w),C.x=i/r.width,C.y=i/r.height,C.applyMatrix4(e.projectionMatrixInverse),C.multiplyScalar(1/C.w),Math.abs(Math.max(C.x,C.y))}class z extends o.Mesh{constructor(e=new u,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,n=0,s=t.count;e<s;e++,n+=2)y.fromBufferAttribute(t,e),g.fromBufferAttribute(i,e),r[n]=0===n?0:r[n-1],r[n+1]=r[n]+y.distanceTo(g);let n=new o.InstancedInterleavedBuffer(r,2,1);return e.setAttribute("instanceDistanceStart",new o.InterleavedBufferAttribute(n,1,0)),e.setAttribute("instanceDistanceEnd",new o.InterleavedBufferAttribute(n,1,1)),this}raycast(e,r){let n,s,a=this.material.worldUnits,l=e.camera;null!==l||a||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let d=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let c=this.matrixWorld,u=this.geometry,f=this.material;if(i=f.linewidth+d,null===u.boundingSphere&&u.computeBoundingSphere(),L.copy(u.boundingSphere).applyMatrix4(c),a)n=.5*i;else{let e=Math.max(l.near,L.distanceToPoint(t.origin));n=U(l,e,f.resolution)}if(L.radius+=n,!1!==t.intersectsSphere(L)){if(null===u.boundingBox&&u.computeBoundingBox(),_.copy(u.boundingBox).applyMatrix4(c),a)s=.5*i;else{let e=Math.max(l.near,_.distanceToPoint(t.origin));s=U(l,e,f.resolution)}_.expandByScalar(s),!1!==t.intersectsBox(_)&&(a?function(e,r){let n=e.matrixWorld,s=e.geometry,a=s.attributes.instanceStart,l=s.attributes.instanceEnd,d=Math.min(s.instanceCount,a.count);for(let s=0;s<d;s++){E.start.fromBufferAttribute(a,s),E.end.fromBufferAttribute(l,s),E.applyMatrix4(n);let d=new o.Vector3,c=new o.Vector3;t.distanceSqToSegment(E.start,E.end,c,d),c.distanceTo(d)<.5*i&&r.push({point:c,pointOnLine:d,distance:t.origin.distanceTo(c),object:e,face:null,faceIndex:s,uv:null,[x]:null})}}(this,r):function(e,r,n){let s=r.projectionMatrix,a=e.material.resolution,l=e.matrixWorld,d=e.geometry,c=d.attributes.instanceStart,u=d.attributes.instanceEnd,f=Math.min(d.instanceCount,c.count),p=-r.near;t.at(1,b),b.w=1,b.applyMatrix4(r.matrixWorldInverse),b.applyMatrix4(s),b.multiplyScalar(1/b.w),b.x*=a.x/2,b.y*=a.y/2,b.z=0,j.copy(b),M.multiplyMatrices(r.matrixWorldInverse,l);for(let r=0;r<f;r++){if(S.fromBufferAttribute(c,r),w.fromBufferAttribute(u,r),S.w=1,w.w=1,S.applyMatrix4(M),w.applyMatrix4(M),S.z>p&&w.z>p)continue;if(S.z>p){let e=S.z-w.z,t=(S.z-p)/e;S.lerp(w,t)}else if(w.z>p){let e=w.z-S.z,t=(w.z-p)/e;w.lerp(S,t)}S.applyMatrix4(s),w.applyMatrix4(s),S.multiplyScalar(1/S.w),w.multiplyScalar(1/w.w),S.x*=a.x/2,S.y*=a.y/2,w.x*=a.x/2,w.y*=a.y/2,E.start.copy(S),E.start.z=0,E.end.copy(w),E.end.z=0;let d=E.closestPointToPointParameter(j,!0);E.at(d,A);let f=o.MathUtils.lerp(S.z,w.z,d),h=f>=-1&&f<=1,m=j.distanceTo(A)<.5*i;if(h&&m){E.start.fromBufferAttribute(c,r),E.end.fromBufferAttribute(u,r),E.start.applyMatrix4(l),E.end.applyMatrix4(l);let i=new o.Vector3,s=new o.Vector3;t.distanceSqToSegment(E.start,E.end,s,i),n.push({point:s,pointOnLine:i,distance:t.origin.distanceTo(s),object:e,face:null,faceIndex:r,uv:null,[x]:null})}}}(this,l,r))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(v),this.material.uniforms.resolution.value.set(v.z,v.w))}}class B extends u{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let r=0;r<t;r+=3)i[2*r]=e[r],i[2*r+1]=e[r+1],i[2*r+2]=e[r+2],i[2*r+3]=e[r+3],i[2*r+4]=e[r+4],i[2*r+5]=e[r+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,r=new Float32Array(2*i);if(3===t)for(let n=0;n<i;n+=t)r[2*n]=e[n],r[2*n+1]=e[n+1],r[2*n+2]=e[n+2],r[2*n+3]=e[n+3],r[2*n+4]=e[n+4],r[2*n+5]=e[n+5];else for(let n=0;n<i;n+=t)r[2*n]=e[n],r[2*n+1]=e[n+1],r[2*n+2]=e[n+2],r[2*n+3]=e[n+3],r[2*n+4]=e[n+4],r[2*n+5]=e[n+5],r[2*n+6]=e[n+6],r[2*n+7]=e[n+7];return super.setColors(r,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class P extends z{constructor(e=new B,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let O=n.forwardRef(function({points:e,color:t=0xffffff,vertexColors:i,linewidth:o,lineWidth:l,segments:d,dashed:c,...f},p){var h,x;let v=(0,a.useThree)(e=>e.size),y=n.useMemo(()=>d?new z:new P,[d]),[g]=n.useState(()=>new m),S=(null==i||null==(h=i[0])?void 0:h.length)===4?4:3,w=n.useMemo(()=>{let r=d?new u:new B,n=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Vector3||e instanceof s.Vector4?[e.x,e.y,e.z]:e instanceof s.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(r.setPositions(n.flat()),i){t=0xffffff;let e=i.map(e=>e instanceof s.Color?e.toArray():e);r.setColors(e.flat(),S)}return r},[e,d,i,S]);return n.useLayoutEffect(()=>{y.computeLineDistances()},[e,y]),n.useLayoutEffect(()=>{c?g.defines.USE_DASH="":delete g.defines.USE_DASH,g.needsUpdate=!0},[c,g]),n.useEffect(()=>()=>{w.dispose(),g.dispose()},[w]),n.createElement("primitive",(0,r.default)({object:y,ref:p},f),n.createElement("primitive",{object:w,attach:"geometry"}),n.createElement("primitive",(0,r.default)({object:g,attach:"material",color:t,vertexColors:!!i,resolution:[v.width,v.height],linewidth:null!=(x=null!=o?o:l)?x:1,dashed:c,transparent:4===S},f)))});e.s(["Line",0,O],43216)},56420,e=>{"use strict";var t=e.i(71645);let i=(...e)=>e.filter((e,t,i)=>!!e&&""!==e.trim()&&i.indexOf(e)===t).join(" ").trim(),r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,i)=>i?i.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var n={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,t.createContext)({}),a=(0,t.forwardRef)(({color:e,size:r,strokeWidth:a,absoluteStrokeWidth:o,className:l="",children:d,iconNode:c,...u},f)=>{let{size:p=24,strokeWidth:h=2,absoluteStrokeWidth:m=!1,color:x="currentColor",className:v=""}=(0,t.useContext)(s)??{},y=o??m?24*Number(a??h)/Number(r??p):a??h;return(0,t.createElement)("svg",{ref:f,...n,width:r??p??n.width,height:r??p??n.height,stroke:e??x,strokeWidth:y,className:i("lucide",v,l),...!d&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...c.map(([e,i])=>(0,t.createElement)(e,i)),...Array.isArray(d)?d:[d]])});e.s(["default",0,(e,n)=>{let s=(0,t.forwardRef)(({className:s,...o},l)=>(0,t.createElement)(a,{ref:l,iconNode:n,className:i(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...o}));return s.displayName=r(e),s}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,i)=>{t.exports=e.r(76562)},45313,e=>{"use strict";var t=e.i(43476),i=e.i(71645),r=e.i(92989),n=e.i(94800),s=e.i(90072),a=e.i(43216);function o({onDataChange:e,temperature:r=300,volume:l=4,numParticles:d=100}){let c=(0,i.useRef)(null),u=(0,i.useRef)(null),f=(0,i.useRef)({particles:[],frameCount:0,totalSpeed:0,pressure:0,avgSpeed:0,avgKE:0,rmsSpeed:0});(0,i.useEffect)(()=>{let e=[];for(let t=0;t<200;t++)e.push({position:new s.Vector3((Math.random()-.5)*6,(Math.random()-.5)*6,(Math.random()-.5)*6),velocity:new s.Vector3((Math.random()-.5)*2,(Math.random()-.5)*2,(Math.random()-.5)*2)});f.current.particles=e},[]);let p=(0,i.useMemo)(()=>new s.Object3D,[]),[h,m]=(0,i.useState)({pressure:0,avgSpeed:0,avgKE:0,rmsSpeed:0,pvValue:0,nrtValue:0}),x=Math.sqrt(r/300),v=2*l,y=(e,t)=>{let i=Math.min(e/(1.5*t),1);return new s.Color().lerpColors(new s.Color(.2,.4,1),new s.Color(1,.3,.2),i)};(0,n.useFrame)((t,i)=>{if(!c.current)return;let n=Math.min(i,.02)*x,s=f.current,a=0,o=0,h=3*x,g=new Float32Array(3*d);for(let e=0;e<d;e++){let t=s.particles[e];t.position.add(t.velocity.clone().multiplyScalar(5*n));let i=v/2;t.position.x>i&&(t.position.x=i,t.velocity.x*=-1),t.position.x<-i&&(t.position.x=-i,t.velocity.x*=-1),t.position.y>i&&(t.position.y=i,t.velocity.y*=-1),t.position.y<-i&&(t.position.y=-i,t.velocity.y*=-1),t.position.z>i&&(t.position.z=i,t.velocity.z*=-1),t.position.z<-i&&(t.position.z=-i,t.velocity.z*=-1);let r=t.velocity.length();a+=r,o=Math.max(o,r),p.position.copy(t.position),p.scale.set(.15,.15,.15),p.updateMatrix(),c.current.setMatrixAt(e,p.matrix);let l=y(r,h);g[3*e]=l.r,g[3*e+1]=l.g,g[3*e+2]=l.b}for(let e=d;e<200;e++)p.position.set(0,-100,0),p.scale.set(0,0,0),p.updateMatrix(),c.current.setMatrixAt(e,p.matrix);c.current.instanceMatrix.needsUpdate=!0;let S=c.current.geometry.attributes.color;S&&(S.array=g,S.needsUpdate=!0),u.current&&(u.current.position.y=v/2+.3);let w=d/1e3,b=function(e,t=8.314,i,r){return e*t*i/r}(w,8.314,r,l),j=function(e,t=1381e-26){return 1.5*t*e}(r),M=function(e,t=8.314){return Math.sqrt(3*t*e/.029)}(r),E=a/d;if(s.totalSpeed=a,s.pressure=b,s.avgSpeed=E,s.avgKE=j,s.rmsSpeed=M,s.frameCount++,s.frameCount%8==0){let t={pressure:b,avgSpeed:E,avgKE:j,rmsSpeed:M,pvValue:b*l,nrtValue:8.314*w*r};m(t),e?.(t)}});let g=(0,i.useMemo)(()=>{let e=[],t=d/1e3;for(let i=1;i<=10;i+=.5){let n=8.314*t*r/i;e.push(new s.Vector3(.3*i-1.5,n/5e3*2-1,0))}return e},[r,d]),S=(0,i.useMemo)(()=>{let e=d/1e3*8.314*r/l;return new s.Vector3(.3*l-1.5,e/5e3*2-1,0)},[r,l,d]);return(0,t.jsxs)("group",{children:[(0,t.jsxs)("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-v/2-.3,0],receiveShadow:!0,children:[(0,t.jsx)("planeGeometry",{args:[50,50]}),(0,t.jsx)("meshStandardMaterial",{color:"#0a0a15",roughness:.95})]}),(0,t.jsx)("gridHelper",{args:[50,50,"#1a1a3e","#0a0a1e"],position:[0,-v/2-.29,0]}),(0,t.jsxs)("mesh",{position:[0,0,0],children:[(0,t.jsx)("boxGeometry",{args:[v+.4,v+.4,v+.4]}),(0,t.jsx)("meshStandardMaterial",{color:"#4a90d9",transparent:!0,opacity:.15,metalness:.1,roughness:.05,side:s.BackSide})]}),[-1,1].map(e=>(0,t.jsx)("group",{position:[e*(v/2+.2),0,0],children:(0,t.jsxs)("mesh",{castShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[.4,v+.4,v+.4]}),(0,t.jsx)("meshStandardMaterial",{color:"#2a2a3a",metalness:.7,roughness:.3})]})},e)),[-1,1].map(e=>(0,t.jsx)("group",{position:[0,0,e*(v/2+.2)],children:(0,t.jsxs)("mesh",{castShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[v+.4,v+.4,.4]}),(0,t.jsx)("meshStandardMaterial",{color:"#2a2a3a",metalness:.7,roughness:.3})]})},`z${e}`)),(0,t.jsxs)("mesh",{ref:u,position:[0,v/2+.2,0],castShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[v-.2,.5,v-.2]}),(0,t.jsx)("meshStandardMaterial",{color:"#5a6a7a",metalness:.8,roughness:.2,transparent:!0,opacity:.85})]}),[0,1,2].map(e=>(0,t.jsxs)("mesh",{position:[0,v/2+.5+.1*e,0],castShadow:!0,children:[(0,t.jsx)("torusGeometry",{args:[v/2-.1,.02,8,32]}),(0,t.jsx)("meshStandardMaterial",{color:"#4a4a5a",metalness:.9,roughness:.1})]},e)),(0,t.jsxs)("mesh",{position:[0,v/2+1.2,0],castShadow:!0,children:[(0,t.jsx)("cylinderGeometry",{args:[.2,.2,2,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#666",metalness:.8,roughness:.2})]}),(0,t.jsxs)("mesh",{position:[0,v/2+2.3,0],castShadow:!0,children:[(0,t.jsx)("cylinderGeometry",{args:[.3,.3,.5,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#4a4a5a",metalness:.8,roughness:.3})]}),(0,t.jsxs)("mesh",{position:[0,v/2+2.6,0],castShadow:!0,children:[(0,t.jsx)("sphereGeometry",{args:[.25,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#5a5a6a",metalness:.8,roughness:.2})]}),(0,t.jsxs)("instancedMesh",{ref:c,args:[void 0,void 0,200],castShadow:!0,children:[(0,t.jsx)("sphereGeometry",{args:[1,16,16]}),(0,t.jsx)("meshStandardMaterial",{vertexColors:!0,metalness:.3,roughness:.7})]}),(0,t.jsxs)("group",{position:[v/2+3,3,0],children:[(0,t.jsxs)("mesh",{castShadow:!0,children:[(0,t.jsx)("cylinderGeometry",{args:[2,2,.5,32]}),(0,t.jsx)("meshStandardMaterial",{color:"#333",metalness:.8,roughness:.2})]}),(0,t.jsxs)("mesh",{position:[0,.3,0],children:[(0,t.jsx)("cylinderGeometry",{args:[1.7,1.7,.1,32]}),(0,t.jsx)("meshStandardMaterial",{color:"#f5f5f5",metalness:.1,roughness:.5})]}),Array.from({length:9}).map((e,i)=>{let r=i/8*Math.PI;return(0,t.jsxs)("mesh",{position:[1.3*Math.cos(r),.35,1.3*Math.sin(r)],rotation:[0,r,0],children:[(0,t.jsx)("boxGeometry",{args:[.4,.08,.02]}),(0,t.jsx)("meshBasicMaterial",{color:"#666"})]},i)}),(0,t.jsxs)("mesh",{position:[0,.35,0],rotation:[0,0,Math.PI/2+Math.min(h.pressure/1e4*Math.PI,Math.PI-.1)],children:[(0,t.jsx)("boxGeometry",{args:[1.4,.06,.03]}),(0,t.jsx)("meshStandardMaterial",{color:"#ef4444",emissive:"#ef4444",emissiveIntensity:.5})]}),(0,t.jsxs)("mesh",{position:[0,.4,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.15,.15,.15,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#666",metalness:.8,roughness:.2})]})]}),(0,t.jsxs)("group",{position:[-v/2-3,0,0],children:[(0,t.jsxs)("mesh",{castShadow:!0,children:[(0,t.jsx)("cylinderGeometry",{args:[.4,.4,v+4,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#333",metalness:.6,roughness:.4})]}),(0,t.jsxs)("mesh",{position:[0,r/800*(v/2)-v/2,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.25,.25,r/800*(v+3),16]}),(0,t.jsx)("meshStandardMaterial",{color:r>500?"#ef4444":r>300?"#f59e0b":"#3b82f6",emissive:r>500?"#ef4444":r>300?"#f59e0b":"#3b82f6",emissiveIntensity:.6})]}),(0,t.jsxs)("mesh",{position:[0,-v/2-.6,0],castShadow:!0,children:[(0,t.jsx)("sphereGeometry",{args:[.5,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:r>500?"#ef4444":r>300?"#f59e0b":"#3b82f6",emissive:r>500?"#ef4444":r>300?"#f59e0b":"#3b82f6",emissiveIntensity:.6,metalness:.7,roughness:.3})]}),Array.from({length:6}).map((e,i)=>{let r=100+120*i;return(0,t.jsxs)("mesh",{position:[.3,r/800*(v/2)-v/2,0],children:[(0,t.jsx)("boxGeometry",{args:[.3,.08,.08]}),(0,t.jsx)("meshBasicMaterial",{color:"#666"})]},i)})]}),(0,t.jsxs)("group",{position:[0,-v/2-2,v/2+2],children:[(0,t.jsxs)("mesh",{position:[0,1,0],children:[(0,t.jsx)("planeGeometry",{args:[4,2.5]}),(0,t.jsx)("meshStandardMaterial",{color:"#0a0a1a",transparent:!0,opacity:.9})]}),(0,t.jsxs)("mesh",{position:[0,0,.01],children:[(0,t.jsx)("boxGeometry",{args:[3.8,.02,.02]}),(0,t.jsx)("meshStandardMaterial",{color:"#666"})]}),(0,t.jsxs)("mesh",{position:[-1.8,0,.01],children:[(0,t.jsx)("boxGeometry",{args:[.02,2,.02]}),(0,t.jsx)("meshStandardMaterial",{color:"#666"})]}),(0,t.jsx)(a.Line,{points:g,color:"#06d6a0",lineWidth:2}),(0,t.jsxs)("mesh",{position:[S.x,S.y,.02],children:[(0,t.jsx)("sphereGeometry",{args:[.08,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#ef4444",emissive:"#ef4444",emissiveIntensity:.8})]}),(0,t.jsxs)("mesh",{position:[1.5,-.3,.01],children:[(0,t.jsx)("sphereGeometry",{args:[.05,8,8]}),(0,t.jsx)("meshBasicMaterial",{color:"#06d6a0"})]})]}),(0,t.jsxs)("mesh",{position:[0,-v/2-.5,0],receiveShadow:!0,children:[(0,t.jsx)("cylinderGeometry",{args:[v/2+1,v/2+1.5,.3,32]}),(0,t.jsx)("meshStandardMaterial",{color:"#1a1a2a",metalness:.4,roughness:.6})]})]})}e.i(81413);var l=e.i(48205),d=e.i(68647),c=e.i(82192),u=e.i(14228),f=e.i(4685);e.s(["default",0,function(){let e=(0,r.useRouter)(),[n,s]=(0,i.useState)(null),[a,p]=(0,i.useState)(!0),[h,m]=(0,i.useState)(!0),[x,v]=(0,i.useState)(1),[y,g]=(0,i.useState)(0),[S,w]=(0,i.useState)(0),[b,j]=(0,i.useState)(300),[M,E]=(0,i.useState)(5),[A,_]=(0,i.useState)(100),L=(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)(d.ControlGroup,{title:"Gas Law Parameters",children:[(0,t.jsx)(d.ControlSlider,{label:"Temperature (T)",value:b,unit:"K",min:100,max:800,step:10,color:"#06d6a0",onChange:j,decimals:0}),(0,t.jsx)(d.ControlSlider,{label:"Volume (V)",value:M,unit:"L",min:1,max:10,step:.5,color:"#a855f7",onChange:E,decimals:1}),(0,t.jsx)(d.ControlSlider,{label:"Particles (n)",value:A,unit:"",min:20,max:200,step:10,color:"#22c55e",onChange:_,decimals:0})]}),(0,t.jsx)("button",{onClick:()=>e.push("/experiments/gas-laws/details"),className:"w-full py-2.5 bg-gradient-to-r from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 text-emerald-700 font-medium text-sm rounded-lg transition-all border border-emerald-300/50 flex items-center justify-center gap-2",children:"📖 View Experiment Details"})]}),C=n?(0,t.jsx)(d.DataGrid,{data:{temperature:{value:b,unit:"K",color:"#06d6a0",decimals:0},volume:{value:M,unit:"L",color:"#a855f7",decimals:1},pressure:{value:n.pressure/1e3,unit:"kPa",color:"#ec4899",decimals:1},avgSpeed:{value:n.avgSpeed,unit:"m/s",color:"#f59e0b",decimals:2}},columns:2}):(0,t.jsx)("div",{className:"text-center text-gray-500 text-sm py-8",children:"Waiting for simulation data..."});return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(l.ExperimentContainer,{title:"Gas Laws (Ideal Gas)",description:"Explore PV = nRT with interactive particle simulation",cameraPosition:[30,22,30],backgroundColor:"#050510",controls:null,dataPanel:null,children:(0,t.jsx)(o,{onDataChange:s,temperature:b,volume:M,numParticles:A})}),(0,t.jsx)(u.SimulationController,{isPlaying:h,onPlayPause:()=>m(e=>!e),onReset:()=>{g(e=>e+1),m(!0),v(1),w(0)},speed:x,onSpeedChange:v,timeElapsed:S}),(0,t.jsx)(c.FloatingControlPanel,{title:"⚙️ Gas Law Parameters",initialPosition:{x:20,y:80},children:L}),(0,t.jsx)(f.DataPanel,{isVisible:a,onToggle:()=>p(!a),children:C})]})}],45313)}]);
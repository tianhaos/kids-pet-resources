(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,i;var r=e.i(31067),n=e.i(71645),s=e.i(90072),a=e.i(48546),o=s,l=s;let c=new l.Box3,d=new l.Vector3;class u extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(i,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let r=new l.InstancedInterleavedBuffer(i,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(r,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(r,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),c.setFromBufferAttribute(t),this.boundingBox.union(c))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let r=0;for(let n=0,s=e.count;n<s;n++)d.fromBufferAttribute(e,n),r=Math.max(r,i.distanceToSquared(d)),d.fromBufferAttribute(t,n),r=Math.max(r,i.distanceToSquared(d));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var f=s,h=e.i(8560),p=e.i(31497);class m extends f.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:f.UniformsUtils.clone(f.UniformsUtils.merge([h.UniformsLib.common,h.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new f.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let x=p.version>=125?"uv1":"uv2",v=new o.Vector4,y=new o.Vector3,g=new o.Vector3,b=new o.Vector4,S=new o.Vector4,w=new o.Vector4,j=new o.Vector3,E=new o.Matrix4,A=new o.Line3,_=new o.Vector3,M=new o.Box3,L=new o.Sphere,C=new o.Vector4;function U(e,t,r){return C.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),C.multiplyScalar(1/C.w),C.x=i/r.width,C.y=i/r.height,C.applyMatrix4(e.projectionMatrixInverse),C.multiplyScalar(1/C.w),Math.abs(Math.max(C.x,C.y))}class z extends o.Mesh{constructor(e=new u,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,n=0,s=t.count;e<s;e++,n+=2)y.fromBufferAttribute(t,e),g.fromBufferAttribute(i,e),r[n]=0===n?0:r[n-1],r[n+1]=r[n]+y.distanceTo(g);let n=new o.InstancedInterleavedBuffer(r,2,1);return e.setAttribute("instanceDistanceStart",new o.InterleavedBufferAttribute(n,1,0)),e.setAttribute("instanceDistanceEnd",new o.InterleavedBufferAttribute(n,1,1)),this}raycast(e,r){let n,s,a=this.material.worldUnits,l=e.camera;null!==l||a||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let d=this.matrixWorld,u=this.geometry,f=this.material;if(i=f.linewidth+c,null===u.boundingSphere&&u.computeBoundingSphere(),L.copy(u.boundingSphere).applyMatrix4(d),a)n=.5*i;else{let e=Math.max(l.near,L.distanceToPoint(t.origin));n=U(l,e,f.resolution)}if(L.radius+=n,!1!==t.intersectsSphere(L)){if(null===u.boundingBox&&u.computeBoundingBox(),M.copy(u.boundingBox).applyMatrix4(d),a)s=.5*i;else{let e=Math.max(l.near,M.distanceToPoint(t.origin));s=U(l,e,f.resolution)}M.expandByScalar(s),!1!==t.intersectsBox(M)&&(a?function(e,r){let n=e.matrixWorld,s=e.geometry,a=s.attributes.instanceStart,l=s.attributes.instanceEnd,c=Math.min(s.instanceCount,a.count);for(let s=0;s<c;s++){A.start.fromBufferAttribute(a,s),A.end.fromBufferAttribute(l,s),A.applyMatrix4(n);let c=new o.Vector3,d=new o.Vector3;t.distanceSqToSegment(A.start,A.end,d,c),d.distanceTo(c)<.5*i&&r.push({point:d,pointOnLine:c,distance:t.origin.distanceTo(d),object:e,face:null,faceIndex:s,uv:null,[x]:null})}}(this,r):function(e,r,n){let s=r.projectionMatrix,a=e.material.resolution,l=e.matrixWorld,c=e.geometry,d=c.attributes.instanceStart,u=c.attributes.instanceEnd,f=Math.min(c.instanceCount,d.count),h=-r.near;t.at(1,w),w.w=1,w.applyMatrix4(r.matrixWorldInverse),w.applyMatrix4(s),w.multiplyScalar(1/w.w),w.x*=a.x/2,w.y*=a.y/2,w.z=0,j.copy(w),E.multiplyMatrices(r.matrixWorldInverse,l);for(let r=0;r<f;r++){if(b.fromBufferAttribute(d,r),S.fromBufferAttribute(u,r),b.w=1,S.w=1,b.applyMatrix4(E),S.applyMatrix4(E),b.z>h&&S.z>h)continue;if(b.z>h){let e=b.z-S.z,t=(b.z-h)/e;b.lerp(S,t)}else if(S.z>h){let e=S.z-b.z,t=(S.z-h)/e;S.lerp(b,t)}b.applyMatrix4(s),S.applyMatrix4(s),b.multiplyScalar(1/b.w),S.multiplyScalar(1/S.w),b.x*=a.x/2,b.y*=a.y/2,S.x*=a.x/2,S.y*=a.y/2,A.start.copy(b),A.start.z=0,A.end.copy(S),A.end.z=0;let c=A.closestPointToPointParameter(j,!0);A.at(c,_);let f=o.MathUtils.lerp(b.z,S.z,c),p=f>=-1&&f<=1,m=j.distanceTo(_)<.5*i;if(p&&m){A.start.fromBufferAttribute(d,r),A.end.fromBufferAttribute(u,r),A.start.applyMatrix4(l),A.end.applyMatrix4(l);let i=new o.Vector3,s=new o.Vector3;t.distanceSqToSegment(A.start,A.end,s,i),n.push({point:s,pointOnLine:i,distance:t.origin.distanceTo(s),object:e,face:null,faceIndex:r,uv:null,[x]:null})}}}(this,l,r))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(v),this.material.uniforms.resolution.value.set(v.z,v.w))}}class B extends u{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let r=0;r<t;r+=3)i[2*r]=e[r],i[2*r+1]=e[r+1],i[2*r+2]=e[r+2],i[2*r+3]=e[r+3],i[2*r+4]=e[r+4],i[2*r+5]=e[r+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,r=new Float32Array(2*i);if(3===t)for(let n=0;n<i;n+=t)r[2*n]=e[n],r[2*n+1]=e[n+1],r[2*n+2]=e[n+2],r[2*n+3]=e[n+3],r[2*n+4]=e[n+4],r[2*n+5]=e[n+5];else for(let n=0;n<i;n+=t)r[2*n]=e[n],r[2*n+1]=e[n+1],r[2*n+2]=e[n+2],r[2*n+3]=e[n+3],r[2*n+4]=e[n+4],r[2*n+5]=e[n+5],r[2*n+6]=e[n+6],r[2*n+7]=e[n+7];return super.setColors(r,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class O extends z{constructor(e=new B,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let P=n.forwardRef(function({points:e,color:t=0xffffff,vertexColors:i,linewidth:o,lineWidth:l,segments:c,dashed:d,...f},h){var p,x;let v=(0,a.useThree)(e=>e.size),y=n.useMemo(()=>c?new z:new O,[c]),[g]=n.useState(()=>new m),b=(null==i||null==(p=i[0])?void 0:p.length)===4?4:3,S=n.useMemo(()=>{let r=c?new u:new B,n=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Vector3||e instanceof s.Vector4?[e.x,e.y,e.z]:e instanceof s.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(r.setPositions(n.flat()),i){t=0xffffff;let e=i.map(e=>e instanceof s.Color?e.toArray():e);r.setColors(e.flat(),b)}return r},[e,c,i,b]);return n.useLayoutEffect(()=>{y.computeLineDistances()},[e,y]),n.useLayoutEffect(()=>{d?g.defines.USE_DASH="":delete g.defines.USE_DASH,g.needsUpdate=!0},[d,g]),n.useEffect(()=>()=>{S.dispose(),g.dispose()},[S]),n.createElement("primitive",(0,r.default)({object:y,ref:h},f),n.createElement("primitive",{object:S,attach:"geometry"}),n.createElement("primitive",(0,r.default)({object:g,attach:"material",color:t,vertexColors:!!i,resolution:[v.width,v.height],linewidth:null!=(x=null!=o?o:l)?x:1,dashed:d,transparent:4===b},f)))});e.s(["Line",0,P],43216)},56420,e=>{"use strict";var t=e.i(71645);let i=(...e)=>e.filter((e,t,i)=>!!e&&""!==e.trim()&&i.indexOf(e)===t).join(" ").trim(),r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,i)=>i?i.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var n={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,t.createContext)({}),a=(0,t.forwardRef)(({color:e,size:r,strokeWidth:a,absoluteStrokeWidth:o,className:l="",children:c,iconNode:d,...u},f)=>{let{size:h=24,strokeWidth:p=2,absoluteStrokeWidth:m=!1,color:x="currentColor",className:v=""}=(0,t.useContext)(s)??{},y=o??m?24*Number(a??p)/Number(r??h):a??p;return(0,t.createElement)("svg",{ref:f,...n,width:r??h??n.width,height:r??h??n.height,stroke:e??x,strokeWidth:y,className:i("lucide",v,l),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,i])=>(0,t.createElement)(e,i)),...Array.isArray(c)?c:[c]])});e.s(["default",0,(e,n)=>{let s=(0,t.forwardRef)(({className:s,...o},l)=>(0,t.createElement)(a,{ref:l,iconNode:n,className:i(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...o}));return s.displayName=r(e),s}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,i)=>{t.exports=e.r(76562)},39671,e=>{"use strict";var t=e.i(43476),i=e.i(71645),r=e.i(92989),n=e.i(94800),s=e.i(43216),a=e.i(90072);function o({onDataChange:e,sourceFrequency:r=2,sourceVelocity:l=5,sourceDirection:c=0,autoOscillate:d=!0,observerPosition:u=15,waveSpeed:f=10,showWavefronts:h=!0,resetTrigger:p}){let m=(0,i.useRef)(0),x=(0,i.useRef)(0),v=(0,i.useRef)(0),y=(0,i.useRef)(0),g=(0,i.useRef)([]),[b,S]=(0,i.useState)({sourceFrequency:r,observedFrequency:r,dopplerShiftRatio:1,machNumber:0,waveSpeed:f,shiftType:"none"});return(0,i.useEffect)(()=>{void 0!==p&&(m.current=0,x.current=0,v.current=0,y.current=0,g.current=[])},[p]),(0,n.useFrame)((t,i)=>{m.current+=i,x.current++,d?(v.current=10*Math.sin(.5*m.current),y.current=10*Math.cos(.5*m.current)*.5):(y.current=c*l,v.current+=y.current*i,v.current>18&&(v.current=18),v.current<-18&&(v.current=-18));let n=1/r,s=g.current[g.current.length-1];if((!s||m.current-s.emissionTime>=n)&&(g.current.push({emissionX:v.current,emissionTime:m.current}),g.current.length>25&&g.current.shift()),x.current%8==0){let t,i,n=v.current,s=y.current,a=u-n>0?s:-s;.1>Math.abs(s)?(t=r,i="none"):a>0?(t=f/(f-a)*r,i="blueshift"):(t=f/(f+Math.abs(a))*r,i="redshift");let o=t/r,l={sourceFrequency:r,observedFrequency:Math.max(0,t),dopplerShiftRatio:o,machNumber:Math.abs(s)/f,waveSpeed:f,shiftType:i};S(l),e?.(l)}}),(0,t.jsxs)("group",{children:[(0,t.jsxs)("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-2,0],receiveShadow:!0,children:[(0,t.jsx)("planeGeometry",{args:[80,50]}),(0,t.jsx)("meshStandardMaterial",{color:"#050510",roughness:.98})]}),(0,t.jsx)("gridHelper",{args:[80,80,"#1a1a3e","#0a0a1e"],position:[0,-1.99,0]}),(0,t.jsxs)("group",{position:[u,0,0],children:[(0,t.jsxs)("mesh",{position:[0,-1,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.8,1,.5,32]}),(0,t.jsx)("meshStandardMaterial",{color:"#4a5568",metalness:.5,roughness:.5})]}),(0,t.jsxs)("mesh",{position:[0,.3,0],children:[(0,t.jsx)("sphereGeometry",{args:[.6,32,32]}),(0,t.jsx)("meshStandardMaterial",{color:"#8b5cf6",emissive:"#8b5cf6",emissiveIntensity:.6,metalness:.3,roughness:.4})]}),(0,t.jsxs)("mesh",{position:[.4,.4,0],children:[(0,t.jsx)("sphereGeometry",{args:[.2,16,16]}),(0,t.jsx)("meshBasicMaterial",{color:"#c4b5fd"})]}),(0,t.jsxs)("mesh",{position:[0,.3,0],children:[(0,t.jsx)("sphereGeometry",{args:[.9,32,32]}),(0,t.jsx)("meshBasicMaterial",{color:"#8b5cf6",transparent:!0,opacity:.15})]}),(0,t.jsxs)("mesh",{position:[0,1.5,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.05,.05,1.2,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#666"})]}),(0,t.jsxs)("mesh",{position:[0,2.2,0],rotation:[0,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[.25,16,16]}),(0,t.jsx)("meshBasicMaterial",{color:"#8b5cf6"})]})]}),(0,t.jsxs)("group",{position:[v.current,0,0],children:[(0,t.jsxs)("mesh",{castShadow:!0,children:[(0,t.jsx)("sphereGeometry",{args:[1,32,32]}),(0,t.jsx)("meshStandardMaterial",{color:"#f59e0b",emissive:"#f59e0b",emissiveIntensity:.8,metalness:.4,roughness:.3})]}),(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[1.3,32,32]}),(0,t.jsx)("meshBasicMaterial",{color:"#f59e0b",transparent:!0,opacity:.2})]}),Math.abs(y.current)>.1&&(0,t.jsx)("group",{rotation:[0,0,y.current>0?-Math.PI/2:Math.PI/2],children:(0,t.jsxs)("mesh",{position:[1.8,0,0],children:[(0,t.jsx)("coneGeometry",{args:[.4,.8,8]}),(0,t.jsx)("meshBasicMaterial",{color:"#f59e0b"})]})})]}),h&&(0,t.jsx)("group",{children:g.current.map((e,i)=>{let r=m.current-e.emissionTime,n=r*f;if(n>35||n<.1)return null;let s=Math.max(0,.7-r/6),o=(e=>{let t=v.current,i=y.current;if(.1>Math.abs(i))return"#22c55e";let r=e-t;return(i>0?r<0:r>0)?"#ef4444":"#3b82f6"})(e.emissionX);return(0,t.jsx)("group",{position:[e.emissionX,0,0],children:(0,t.jsxs)("mesh",{rotation:[Math.PI/2,0,0],children:[(0,t.jsx)("ringGeometry",{args:[n-.1,n+.1,64]}),(0,t.jsx)("meshBasicMaterial",{color:o,transparent:!0,opacity:s,side:a.DoubleSide})]})},i)})}),(0,t.jsx)(s.Line,{points:[[-35,0,0],[35,0,0]],color:"#333355",lineWidth:2,opacity:.6,transparent:!0}),(0,t.jsx)(s.Line,{points:[[-25,-1.95,5],[-20,-1.95,5]],color:"#4a5568",lineWidth:3,dashed:!0,dashSize:.5,gapSize:.3}),(0,t.jsxs)("mesh",{position:[-26,-1.9,5],rotation:[0,0,Math.PI],children:[(0,t.jsx)("coneGeometry",{args:[.3,.6,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#4a5568"})]}),(0,t.jsxs)("mesh",{position:[-19,-1.9,5],rotation:[0,0,0],children:[(0,t.jsx)("coneGeometry",{args:[.3,.6,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#4a5568"})]}),b.machNumber>=1&&(0,t.jsx)("group",{position:[v.current,0,0],children:(0,t.jsxs)("mesh",{rotation:[0,y.current>0?0:Math.PI,0],children:[(0,t.jsx)("coneGeometry",{args:[20,40,2]}),(0,t.jsx)("meshBasicMaterial",{color:"#ff00ff",transparent:!0,opacity:.08,side:a.DoubleSide})]})})]})}e.i(81413);var l=e.i(48205),c=e.i(68647),d=e.i(82192),u=e.i(14228),f=e.i(4685);e.s(["default",0,function(){let e=(0,r.useRouter)(),[n,s]=(0,i.useState)(null),[a,h]=(0,i.useState)(!0),[p,m]=(0,i.useState)(!0),[x,v]=(0,i.useState)(1),[y,g]=(0,i.useState)(0),[b,S]=(0,i.useState)(0),[w,j]=(0,i.useState)(2),[E,A]=(0,i.useState)(5),[_,M]=(0,i.useState)(10),[L,C]=(0,i.useState)(!0),[U,z]=(0,i.useState)(!0),[B,O]=(0,i.useState)(0),[P,N]=(0,i.useState)(15),D=(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)(c.ControlGroup,{title:"Wave Parameters",children:[(0,t.jsx)(c.ControlSlider,{label:"Source Frequency (f₀)",value:w,unit:"Hz",min:.5,max:5,step:.1,color:"#f59e0b",onChange:j,decimals:1}),(0,t.jsx)(c.ControlSlider,{label:"Source Speed (vₛ)",value:E,unit:"m/s",min:0,max:15,step:.5,color:"#3b82f6",onChange:A,decimals:1}),(0,t.jsx)(c.ControlSlider,{label:"Wave Speed (v)",value:_,unit:"m/s",min:5,max:20,step:1,color:"#22c55e",onChange:M,decimals:0})]}),(0,t.jsxs)(c.ControlGroup,{title:"Source Motion",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between mb-3",children:[(0,t.jsx)("span",{className:"text-sm font-medium text-gray-700",children:"Mode"}),(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)("button",{onClick:()=>z(!0),className:`px-3 py-1 text-xs font-medium rounded transition-all ${U?"bg-orange-500 text-white":"bg-gray-200 text-gray-600 hover:bg-gray-300"}`,children:"Auto"}),(0,t.jsx)("button",{onClick:()=>z(!1),className:`px-3 py-1 text-xs font-medium rounded transition-all ${!U?"bg-orange-500 text-white":"bg-gray-200 text-gray-600 hover:bg-gray-300"}`,children:"Manual"})]})]}),!U&&(0,t.jsxs)("div",{className:"mb-3 p-3 bg-gray-100/50 rounded-lg border border-gray-300/50",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between mb-2",children:[(0,t.jsx)("span",{className:"text-xs text-gray-600",children:"Direction"}),(0,t.jsx)("span",{className:"text-xs font-mono text-gray-800",children:B>.1?"→ Right":B<-.1?"← Left":"● Stop"})]}),(0,t.jsx)(c.ControlSlider,{label:"",value:B,unit:"",min:-1,max:1,step:.1,color:"#f59e0b",onChange:O,decimals:1})]}),(0,t.jsx)(c.ControlSlider,{label:"Observer Position",value:P,unit:"m",min:-20,max:20,step:1,color:"#8b5cf6",onChange:N,decimals:0})]}),(0,t.jsx)(c.ControlGroup,{title:"Display Options",children:(0,t.jsxs)("label",{className:"flex items-center justify-between text-sm text-gray-700 cursor-pointer py-2 px-3 bg-gray-100/50 rounded-lg border border-gray-300/50",children:[(0,t.jsx)("span",{children:"Show Wavefronts"}),(0,t.jsx)("input",{type:"checkbox",checked:L,onChange:e=>C(e.target.checked),className:"w-4 h-4 rounded accent-orange-500"})]})}),(0,t.jsx)("button",{onClick:()=>e.push("/experiments/doppler/details"),className:"w-full py-2.5 bg-gradient-to-r from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300 text-orange-700 font-medium text-sm rounded-lg transition-all border border-orange-300/50 flex items-center justify-center gap-2",children:"📖 View Experiment Details"})]}),R=n?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(c.DataGrid,{data:{sourceFrequency:{value:n.sourceFrequency,unit:"Hz",color:"#f59e0b",decimals:1},observedFrequency:{value:n.observedFrequency,unit:"Hz",color:"blueshift"===n.shiftType?"#3b82f6":"redshift"===n.shiftType?"#ef4444":"#22c55e",decimals:1},dopplerShiftRatio:{value:n.dopplerShiftRatio,unit:"×",color:"#ec4899",decimals:2},machNumber:{value:n.machNumber,unit:"",color:"#a855f7",decimals:2},waveSpeed:{value:n.waveSpeed,unit:"m/s",color:"#22c55e",decimals:0}},columns:1}),(0,t.jsxs)("div",{className:"mt-3 p-3 bg-gray-800/50 rounded-lg",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)("span",{className:"text-gray-400 text-sm",children:"Shift Type:"}),(0,t.jsx)("span",{className:`font-bold ${"blueshift"===n.shiftType?"text-blue-400":"redshift"===n.shiftType?"text-red-400":"text-green-400"}`,children:"blueshift"===n.shiftType?"🔵 Blueshift (Approaching)":"redshift"===n.shiftType?"🔴 Redshift (Receding)":"🟢 None (Stationary)"})]}),n.machNumber>=1&&(0,t.jsxs)("div",{className:"mt-2 text-xs text-purple-400 font-medium",children:["⚠️ SUPERSONIC! Mach ",n.machNumber.toFixed(2)]}),1!==n.dopplerShiftRatio&&(0,t.jsx)("div",{className:"mt-2 text-xs text-gray-400",children:n.dopplerShiftRatio>1?`Frequency increased by ${((n.dopplerShiftRatio-1)*100).toFixed(0)}%`:`Frequency decreased by ${((1-n.dopplerShiftRatio)*100).toFixed(0)}%`})]})]}):(0,t.jsx)("div",{className:"text-center text-gray-500 text-sm py-8",children:"Waiting for simulation data..."});return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(l.ExperimentContainer,{title:"Doppler Effect",description:"Observe frequency shift from moving sound sources",cameraPosition:[0,30,40],backgroundColor:"#050510",controls:null,dataPanel:null,children:(0,t.jsx)(o,{onDataChange:s,sourceFrequency:w,sourceVelocity:E,waveSpeed:_,autoOscillate:U,sourceDirection:B,observerPosition:P,showWavefronts:L,resetTrigger:y})}),(0,t.jsx)(u.SimulationController,{isPlaying:p,onPlayPause:()=>m(e=>!e),onReset:()=>{g(e=>e+1),m(!0),v(1),S(0)},speed:x,onSpeedChange:v,timeElapsed:b}),(0,t.jsx)(d.FloatingControlPanel,{title:"⚙️ Doppler Parameters",initialPosition:{x:20,y:80},children:D}),(0,t.jsx)(f.DataPanel,{isVisible:a,onToggle:()=>h(!a),children:R})]})}],39671)}]);
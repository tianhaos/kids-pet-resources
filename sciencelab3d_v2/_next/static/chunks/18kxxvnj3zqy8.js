(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,s;var r=e.i(31067),i=e.i(71645),n=e.i(90072),a=e.i(48546),o=n,l=n;let c=new l.Box3,d=new l.Vector3;class u extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,s=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),s.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let s=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(s,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(s,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let s;e instanceof Float32Array?s=e:Array.isArray(e)&&(s=new Float32Array(e));let r=new l.InstancedInterleavedBuffer(s,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(r,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(r,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),c.setFromBufferAttribute(t),this.boundingBox.union(c))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let s=this.boundingSphere.center;this.boundingBox.getCenter(s);let r=0;for(let i=0,n=e.count;i<n;i++)d.fromBufferAttribute(e,i),r=Math.max(r,s.distanceToSquared(d)),d.fromBufferAttribute(t,i),r=Math.max(r,s.distanceToSquared(d));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var h=n,p=e.i(8560),m=e.i(31497);class f extends h.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:h.UniformsUtils.clone(h.UniformsUtils.merge([p.UniformsLib.common,p.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new h.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let x=m.version>=125?"uv1":"uv2",g=new o.Vector4,y=new o.Vector3,v=new o.Vector3,b=new o.Vector4,w=new o.Vector4,S=new o.Vector4,j=new o.Vector3,M=new o.Matrix4,C=new o.Line3,E=new o.Vector3,P=new o.Box3,A=new o.Sphere,I=new o.Vector4;function L(e,t,r){return I.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),I.multiplyScalar(1/I.w),I.x=s/r.width,I.y=s/r.height,I.applyMatrix4(e.projectionMatrixInverse),I.multiplyScalar(1/I.w),Math.abs(Math.max(I.x,I.y))}class _ extends o.Mesh{constructor(e=new u,t=new f({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,s=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,i=0,n=t.count;e<n;e++,i+=2)y.fromBufferAttribute(t,e),v.fromBufferAttribute(s,e),r[i]=0===i?0:r[i-1],r[i+1]=r[i]+y.distanceTo(v);let i=new o.InstancedInterleavedBuffer(r,2,1);return e.setAttribute("instanceDistanceStart",new o.InterleavedBufferAttribute(i,1,0)),e.setAttribute("instanceDistanceEnd",new o.InterleavedBufferAttribute(i,1,1)),this}raycast(e,r){let i,n,a=this.material.worldUnits,l=e.camera;null!==l||a||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let d=this.matrixWorld,u=this.geometry,h=this.material;if(s=h.linewidth+c,null===u.boundingSphere&&u.computeBoundingSphere(),A.copy(u.boundingSphere).applyMatrix4(d),a)i=.5*s;else{let e=Math.max(l.near,A.distanceToPoint(t.origin));i=L(l,e,h.resolution)}if(A.radius+=i,!1!==t.intersectsSphere(A)){if(null===u.boundingBox&&u.computeBoundingBox(),P.copy(u.boundingBox).applyMatrix4(d),a)n=.5*s;else{let e=Math.max(l.near,P.distanceToPoint(t.origin));n=L(l,e,h.resolution)}P.expandByScalar(n),!1!==t.intersectsBox(P)&&(a?function(e,r){let i=e.matrixWorld,n=e.geometry,a=n.attributes.instanceStart,l=n.attributes.instanceEnd,c=Math.min(n.instanceCount,a.count);for(let n=0;n<c;n++){C.start.fromBufferAttribute(a,n),C.end.fromBufferAttribute(l,n),C.applyMatrix4(i);let c=new o.Vector3,d=new o.Vector3;t.distanceSqToSegment(C.start,C.end,d,c),d.distanceTo(c)<.5*s&&r.push({point:d,pointOnLine:c,distance:t.origin.distanceTo(d),object:e,face:null,faceIndex:n,uv:null,[x]:null})}}(this,r):function(e,r,i){let n=r.projectionMatrix,a=e.material.resolution,l=e.matrixWorld,c=e.geometry,d=c.attributes.instanceStart,u=c.attributes.instanceEnd,h=Math.min(c.instanceCount,d.count),p=-r.near;t.at(1,S),S.w=1,S.applyMatrix4(r.matrixWorldInverse),S.applyMatrix4(n),S.multiplyScalar(1/S.w),S.x*=a.x/2,S.y*=a.y/2,S.z=0,j.copy(S),M.multiplyMatrices(r.matrixWorldInverse,l);for(let r=0;r<h;r++){if(b.fromBufferAttribute(d,r),w.fromBufferAttribute(u,r),b.w=1,w.w=1,b.applyMatrix4(M),w.applyMatrix4(M),b.z>p&&w.z>p)continue;if(b.z>p){let e=b.z-w.z,t=(b.z-p)/e;b.lerp(w,t)}else if(w.z>p){let e=w.z-b.z,t=(w.z-p)/e;w.lerp(b,t)}b.applyMatrix4(n),w.applyMatrix4(n),b.multiplyScalar(1/b.w),w.multiplyScalar(1/w.w),b.x*=a.x/2,b.y*=a.y/2,w.x*=a.x/2,w.y*=a.y/2,C.start.copy(b),C.start.z=0,C.end.copy(w),C.end.z=0;let c=C.closestPointToPointParameter(j,!0);C.at(c,E);let h=o.MathUtils.lerp(b.z,w.z,c),m=h>=-1&&h<=1,f=j.distanceTo(E)<.5*s;if(m&&f){C.start.fromBufferAttribute(d,r),C.end.fromBufferAttribute(u,r),C.start.applyMatrix4(l),C.end.applyMatrix4(l);let s=new o.Vector3,n=new o.Vector3;t.distanceSqToSegment(C.start,C.end,n,s),i.push({point:n,pointOnLine:s,distance:t.origin.distanceTo(n),object:e,face:null,faceIndex:r,uv:null,[x]:null})}}}(this,l,r))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(g),this.material.uniforms.resolution.value.set(g.z,g.w))}}class N extends u{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,s=new Float32Array(2*t);for(let r=0;r<t;r+=3)s[2*r]=e[r],s[2*r+1]=e[r+1],s[2*r+2]=e[r+2],s[2*r+3]=e[r+3],s[2*r+4]=e[r+4],s[2*r+5]=e[r+5];return super.setPositions(s),this}setColors(e,t=3){let s=e.length-t,r=new Float32Array(2*s);if(3===t)for(let i=0;i<s;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5];else for(let i=0;i<s;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5],r[2*i+6]=e[i+6],r[2*i+7]=e[i+7];return super.setColors(r,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class O extends _{constructor(e=new N,t=new f({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let z=i.forwardRef(function({points:e,color:t=0xffffff,vertexColors:s,linewidth:o,lineWidth:l,segments:c,dashed:d,...h},p){var m,x;let g=(0,a.useThree)(e=>e.size),y=i.useMemo(()=>c?new _:new O,[c]),[v]=i.useState(()=>new f),b=(null==s||null==(m=s[0])?void 0:m.length)===4?4:3,w=i.useMemo(()=>{let r=c?new u:new N,i=e.map(e=>{let t=Array.isArray(e);return e instanceof n.Vector3||e instanceof n.Vector4?[e.x,e.y,e.z]:e instanceof n.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(r.setPositions(i.flat()),s){t=0xffffff;let e=s.map(e=>e instanceof n.Color?e.toArray():e);r.setColors(e.flat(),b)}return r},[e,c,s,b]);return i.useLayoutEffect(()=>{y.computeLineDistances()},[e,y]),i.useLayoutEffect(()=>{d?v.defines.USE_DASH="":delete v.defines.USE_DASH,v.needsUpdate=!0},[d,v]),i.useEffect(()=>()=>{w.dispose(),v.dispose()},[w]),i.createElement("primitive",(0,r.default)({object:y,ref:p},h),i.createElement("primitive",{object:w,attach:"geometry"}),i.createElement("primitive",(0,r.default)({object:v,attach:"material",color:t,vertexColors:!!s,resolution:[g.width,g.height],linewidth:null!=(x=null!=o?o:l)?x:1,dashed:d,transparent:4===b},h)))});e.s(["Line",0,z],43216)},60099,e=>{"use strict";let t,s;var r=e.i(31067),i=e.i(71645),n=e.i(88014),a=e.i(90072),o=e.i(48546),l=e.i(94800);let c=new a.Vector3,d=new a.Vector3,u=new a.Vector3,h=new a.Vector2;function p(e,t,s){let r=c.setFromMatrixPosition(e.matrixWorld);r.project(t);let i=s.width/2,n=s.height/2;return[r.x*i+i,-(r.y*n)+n]}let m=e=>1e-10>Math.abs(e)?0:e;function f(e,t,s=""){let r="matrix3d(";for(let s=0;16!==s;s++)r+=m(t[s]*e.elements[s])+(15!==s?",":")");return s+r}let x=(t=[1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1],e=>f(e,t)),g=(s=e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1],(e,t)=>f(e,s(t),"translate(-50%,-50%)")),y=i.forwardRef(({children:e,eps:t=.001,style:s,className:f,prepend:y,center:v,fullscreen:b,portal:w,distanceFactor:S,sprite:j=!1,transform:M=!1,occlude:C,onOcclude:E,castShadow:P,receiveShadow:A,material:I,geometry:L,zIndexRange:_=[0x1000037,0],calculatePosition:N=p,as:O="div",wrapperClass:z,pointerEvents:U="auto",...B},T)=>{let{gl:D,camera:V,scene:R,size:W,raycaster:k,events:G,viewport:F}=(0,o.useThree)(),[H]=i.useState(()=>document.createElement(O)),$=i.useRef(null),q=i.useRef(null),K=i.useRef(0),Z=i.useRef([0,0]),X=i.useRef(null),J=i.useRef(null),Y=(null==w?void 0:w.current)||G.connected||D.domElement.parentNode,Q=i.useRef(null),ee=i.useRef(!1),et=i.useMemo(()=>{var e;return C&&"blending"!==C||Array.isArray(C)&&C.length&&(e=C[0])&&"object"==typeof e&&"current"in e},[C]);i.useLayoutEffect(()=>{let e=D.domElement;C&&"blending"===C?(e.style.zIndex=`${Math.floor(_[0]/2)}`,e.style.position="absolute",e.style.pointerEvents="none"):(e.style.zIndex=null,e.style.position=null,e.style.pointerEvents=null)},[C]),i.useLayoutEffect(()=>{if(q.current){let e=$.current=n.createRoot(H);if(R.updateMatrixWorld(),M)H.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";else{let e=N(q.current,V,W);H.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${e[0]}px,${e[1]}px,0);transform-origin:0 0;`}return Y&&(y?Y.prepend(H):Y.appendChild(H)),()=>{Y&&Y.removeChild(H),e.unmount()}}},[Y,M]),i.useLayoutEffect(()=>{z&&(H.className=z)},[z]);let es=i.useMemo(()=>M?{position:"absolute",top:0,left:0,width:W.width,height:W.height,transformStyle:"preserve-3d",pointerEvents:"none"}:{position:"absolute",transform:v?"translate3d(-50%,-50%,0)":"none",...b&&{top:-W.height/2,left:-W.width/2,width:W.width,height:W.height},...s},[s,v,b,W,M]),er=i.useMemo(()=>({position:"absolute",pointerEvents:U}),[U]);i.useLayoutEffect(()=>{var t,r;ee.current=!1,M?null==(t=$.current)||t.render(i.createElement("div",{ref:X,style:es},i.createElement("div",{ref:J,style:er},i.createElement("div",{ref:T,className:f,style:s,children:e})))):null==(r=$.current)||r.render(i.createElement("div",{ref:T,style:es,className:f,children:e}))});let ei=i.useRef(!0);(0,l.useFrame)(e=>{if(q.current){V.updateMatrixWorld(),q.current.updateWorldMatrix(!0,!1);let e=M?Z.current:N(q.current,V,W);if(M||Math.abs(K.current-V.zoom)>t||Math.abs(Z.current[0]-e[0])>t||Math.abs(Z.current[1]-e[1])>t){var s;let t,r,i,n,o=(s=q.current,t=c.setFromMatrixPosition(s.matrixWorld),r=d.setFromMatrixPosition(V.matrixWorld),i=t.sub(r),n=V.getWorldDirection(u),i.angleTo(n)>Math.PI/2),l=!1;et&&(Array.isArray(C)?l=C.map(e=>e.current):"blending"!==C&&(l=[R]));let p=ei.current;l?ei.current=function(e,t,s,r){let i=c.setFromMatrixPosition(e.matrixWorld),n=i.clone();n.project(t),h.set(n.x,n.y),s.setFromCamera(h,t);let a=s.intersectObjects(r,!0);if(a.length){let e=a[0].distance;return i.distanceTo(s.ray.origin)<e}return!0}(q.current,V,k,l)&&!o:ei.current=!o,p!==ei.current&&(E?E(!ei.current):H.style.display=ei.current?"block":"none");let f=Math.floor(_[0]/2),y=C?et?[_[0],f]:[f-1,0]:_;if(H.style.zIndex=`${function(e,t,s){if(t instanceof a.PerspectiveCamera||t instanceof a.OrthographicCamera){let r=c.setFromMatrixPosition(e.matrixWorld),i=d.setFromMatrixPosition(t.matrixWorld),n=r.distanceTo(i),a=(s[1]-s[0])/(t.far-t.near),o=s[1]-a*t.far;return Math.round(a*n+o)}}(q.current,V,y)}`,M){let[e,t]=[W.width/2,W.height/2],s=V.projectionMatrix.elements[5]*t,{isOrthographicCamera:r,top:i,left:n,bottom:a,right:o}=V,l=x(V.matrixWorldInverse),c=r?`scale(${s})translate(${m(-(o+n)/2)}px,${m((i+a)/2)}px)`:`translateZ(${s}px)`,d=q.current.matrixWorld;j&&((d=V.matrixWorldInverse.clone().transpose().copyPosition(d).scale(q.current.scale)).elements[3]=d.elements[7]=d.elements[11]=0,d.elements[15]=1),H.style.width=W.width+"px",H.style.height=W.height+"px",H.style.perspective=r?"":`${s}px`,X.current&&J.current&&(X.current.style.transform=`${c}${l}translate(${e}px,${t}px)`,J.current.style.transform=g(d,1/((S||10)/400)))}else{let t=void 0===S?1:function(e,t){if(t instanceof a.OrthographicCamera)return t.zoom;if(!(t instanceof a.PerspectiveCamera))return 1;{let s=c.setFromMatrixPosition(e.matrixWorld),r=d.setFromMatrixPosition(t.matrixWorld);return 1/(2*Math.tan(t.fov*Math.PI/180/2)*s.distanceTo(r))}}(q.current,V)*S;H.style.transform=`translate3d(${e[0]}px,${e[1]}px,0) scale(${t})`}Z.current=e,K.current=V.zoom}}if(!et&&Q.current&&!ee.current)if(M){if(X.current){let e=X.current.children[0];if(null!=e&&e.clientWidth&&null!=e&&e.clientHeight){let{isOrthographicCamera:t}=V;if(t||L)B.scale&&(Array.isArray(B.scale)?B.scale instanceof a.Vector3?Q.current.scale.copy(B.scale.clone().divideScalar(1)):Q.current.scale.set(1/B.scale[0],1/B.scale[1],1/B.scale[2]):Q.current.scale.setScalar(1/B.scale));else{let t=(S||10)/400,s=e.clientWidth*t,r=e.clientHeight*t;Q.current.scale.set(s,r,1)}ee.current=!0}}}else{let t=H.children[0];if(null!=t&&t.clientWidth&&null!=t&&t.clientHeight){let e=1/F.factor,s=t.clientWidth*e,r=t.clientHeight*e;Q.current.scale.set(s,r,1),ee.current=!0}Q.current.lookAt(e.camera.position)}});let en=i.useMemo(()=>({vertexShader:M?void 0:`
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
      `}),[M]);return i.createElement("group",(0,r.default)({},B,{ref:q}),C&&!et&&i.createElement("mesh",{castShadow:P,receiveShadow:A,ref:Q},L||i.createElement("planeGeometry",null),I||i.createElement("shaderMaterial",{side:a.DoubleSide,vertexShader:en.vertexShader,fragmentShader:en.fragmentShader})))});e.s(["Html",0,y])},56420,e=>{"use strict";var t=e.i(71645);let s=(...e)=>e.filter((e,t,s)=>!!e&&""!==e.trim()&&s.indexOf(e)===t).join(" ").trim(),r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,s)=>s?s.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var i={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let n=(0,t.createContext)({}),a=(0,t.forwardRef)(({color:e,size:r,strokeWidth:a,absoluteStrokeWidth:o,className:l="",children:c,iconNode:d,...u},h)=>{let{size:p=24,strokeWidth:m=2,absoluteStrokeWidth:f=!1,color:x="currentColor",className:g=""}=(0,t.useContext)(n)??{},y=o??f?24*Number(a??m)/Number(r??p):a??m;return(0,t.createElement)("svg",{ref:h,...i,width:r??p??i.width,height:r??p??i.height,stroke:e??x,strokeWidth:y,className:s("lucide",g,l),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,s])=>(0,t.createElement)(e,s)),...Array.isArray(c)?c:[c]])});e.s(["default",0,(e,i)=>{let n=(0,t.forwardRef)(({className:n,...o},l)=>(0,t.createElement)(a,{ref:l,iconNode:i,className:s(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,n),...o}));return n.displayName=r(e),n}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,s)=>{t.exports=e.r(76562)},42618,e=>{"use strict";var t=e.i(43476),s=e.i(71645);e.i(81413);var r=e.i(48205),i=e.i(14228),n=e.i(82192),a=e.i(4685),o=e.i(68647),l=e.i(94800),c=e.i(43216),d=e.i(60099),u=e.i(90072);let h=[{maternal:"#3b82f6",paternal:"#ef4444"},{maternal:"#60a5fa",paternal:"#f87171"},{maternal:"#93c5fd",paternal:"#fca5a5"},{maternal:"#2563eb",paternal:"#dc2626"}],p=["Interphase","Prophase","Metaphase","Anaphase","Telophase","Cytokinesis"],m=["Prophase I","Metaphase I","Anaphase I","Telophase I","Prophase II","Metaphase II","Anaphase II","Telophase II"];function f({onDataChange:e,isPlaying:r=!0,simulationSpeed:i=1,resetTrigger:n=0,stage:a=0,mode:o="mitosis",showLabels:x=!0}){let g=(0,s.useRef)({chromosomes:[],progress:0,nucleusOpacity:1,cellPinch:0,spindleOpacity:0}),y=(0,s.useRef)({chromosomes:[],progress:0,nucleusOpacity:1,cellPinch:0,spindleOpacity:0}),v=(0,s.useRef)(0),b=(0,s.useRef)(0),[w,S]=(0,s.useState)({phase:"Interphase",chromosomesCount:46,daughterCells:1,description:"Cell prepares for division. DNA replicates."}),j=(0,s.useCallback)(()=>{let e=[];for(let t=0;t<4;t++){let s=t/4*Math.PI*2;e.push({id:2*t,pairId:t,color:h[t].maternal,homologousColor:h[t].paternal,position:new u.Vector3(1.5*Math.cos(s),(Math.random()-.5)*.5,1.5*Math.sin(s)),targetPosition:new u.Vector3,angle:s,condensed:!1,separated:!1,isMaternal:!0,crossedOver:!1,chromatidOffset:0}),e.push({id:2*t+1,pairId:t,color:h[t].paternal,homologousColor:h[t].maternal,position:new u.Vector3(1.5*Math.cos(s+Math.PI),(Math.random()-.5)*.5,1.5*Math.sin(s+Math.PI)),targetPosition:new u.Vector3,angle:s+Math.PI,condensed:!1,separated:!1,isMaternal:!1,crossedOver:!1,chromatidOffset:0})}return e},[]);(0,s.useEffect)(()=>{v.current=0,b.current=0,g.current={chromosomes:j(),progress:0,nucleusOpacity:1,cellPinch:0,spindleOpacity:0},y.current={chromosomes:j(),progress:0,nucleusOpacity:1,cellPinch:0,spindleOpacity:0}},[n,j]);let M=(0,s.memo)(({chr:e,isSeparated:s})=>{let r=e.condensed?.5:.7,i=e.crossedOver?e.homologousColor:e.color;return(0,t.jsxs)("group",{position:e.position,children:[(0,t.jsxs)("mesh",{rotation:[0,0,Math.PI/2],children:[(0,t.jsx)("cylinderGeometry",{args:[.08,.08,Math.max(.01,r),8]}),(0,t.jsx)("meshStandardMaterial",{color:i,roughness:.4,metalness:.1})]}),(0,t.jsxs)("mesh",{position:[0,r/2,0],children:[(0,t.jsx)("sphereGeometry",{args:[.12,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:e.color,roughness:.3})]}),s?(0,t.jsxs)("mesh",{position:[.4,0,0],rotation:[0,0,Math.PI/2],children:[(0,t.jsx)("cylinderGeometry",{args:[.08,.08,Math.max(.01,r),8]}),(0,t.jsx)("meshStandardMaterial",{color:e.color,roughness:.4,metalness:.1})]}):(0,t.jsxs)("mesh",{position:[.15,0,0],rotation:[0,0,Math.PI/2],children:[(0,t.jsx)("cylinderGeometry",{args:[.08,.08,Math.max(.01,r),8]}),(0,t.jsx)("meshStandardMaterial",{color:e.color,roughness:.4,metalness:.1,opacity:.8,transparent:!0})]})]})}),C=(0,s.memo)(({position:e,state:r,isMitosis:i,currentStage:n})=>{let a=i?"#f59e0b":"#ec4899",o=(0,s.useMemo)(()=>{let e=[];for(let t=0;t<12;t++){let s=t/12*Math.PI*2,r=.3*Math.cos(s),i=.3*Math.sin(s);e.push([[r,0,i],[3.5*Math.cos(s),0,3.5*Math.sin(s)]])}return e},[]);return(0,t.jsxs)("group",{position:e,children:[(0,t.jsxs)("mesh",{scale:[1-.3*r.cellPinch,1,1],children:[(0,t.jsx)("sphereGeometry",{args:[3.5,32,32]}),(0,t.jsx)("meshPhysicalMaterial",{color:a,transparent:!0,opacity:.15,roughness:.2,metalness:.1,side:u.DoubleSide})]}),r.nucleusOpacity>.01&&(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[2,32,32]}),(0,t.jsx)("meshPhysicalMaterial",{color:"#7c3aed",transparent:!0,opacity:.2*r.nucleusOpacity,roughness:.3,side:u.DoubleSide})]}),n>=1&&n<=3&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("mesh",{position:[3.8,0,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.15,.15,.4,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#fcd34d",emissive:"#fcd34d",emissiveIntensity:.5})]}),(0,t.jsxs)("mesh",{position:[-3.8,0,0],rotation:[0,0,Math.PI/2],children:[(0,t.jsx)("cylinderGeometry",{args:[.15,.15,.4,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#fcd34d",emissive:"#fcd34d",emissiveIntensity:.5})]})]}),r.spindleOpacity>.01&&n>=1&&n<=3&&(0,t.jsx)(t.Fragment,{children:o.map((e,s)=>(0,t.jsx)(c.Line,{points:e,color:"#fcd34d",lineWidth:1,opacity:.4*r.spindleOpacity,transparent:!0,dashed:!0,dashSize:.1,gapSize:.05},s))}),2===n&&(0,t.jsx)(c.Line,{points:Array.from({length:30},(e,t)=>[(t-15)*.15,0,-.2]),color:"#ffffff",lineWidth:2,opacity:.3,transparent:!0,dashed:!0}),!i&&0===n&&r.progress>40&&(0,t.jsx)(t.Fragment,{children:h.map((e,s)=>(0,t.jsxs)("group",{position:[(s-1.5)*.8,.3,0],children:[(0,t.jsx)(c.Line,{points:[[-.1,0,-.1],[.1,0,.1],[.1,0,-.1],[-.1,0,.1]],color:"#f472b6",lineWidth:2,opacity:.8}),(0,t.jsxs)("mesh",{position:[0,.1,0],children:[(0,t.jsx)("sphereGeometry",{args:[.05,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#ec4899",emissive:"#ec4899",emissiveIntensity:.6+.3*Math.sin(5*v.current)})]})]},s))}),r.chromosomes.map(e=>{let s=r.progress>50&&(3===n||6===n);return(0,t.jsx)(M,{chr:e,isSeparated:s},e.id)}),(4===n||5===n||7===n)&&(0,t.jsx)(c.Line,{points:[[0,-3,0],[0,3,0]],color:a,lineWidth:3,opacity:.5,transparent:!0}),n>=4&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("mesh",{position:[3.5,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[2,24,24]}),(0,t.jsx)("meshPhysicalMaterial",{color:a,transparent:!0,opacity:.15,roughness:.2})]}),(0,t.jsxs)("mesh",{position:[-3.5,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[2,24,24]}),(0,t.jsx)("meshPhysicalMaterial",{color:a,transparent:!0,opacity:.15,roughness:.2})]}),(4===n||5===n||7===n)&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("mesh",{position:[3.5,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[.9,20,20]}),(0,t.jsx)("meshPhysicalMaterial",{color:"#7c3aed",transparent:!0,opacity:.2,roughness:.3})]}),(0,t.jsxs)("mesh",{position:[-3.5,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[.9,20,20]}),(0,t.jsx)("meshPhysicalMaterial",{color:"#7c3aed",transparent:!0,opacity:.2,roughness:.3})]})]})]}),!i&&n>=7&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("mesh",{position:[3,2.2,0],children:[(0,t.jsx)("sphereGeometry",{args:[1.3,20,20]}),(0,t.jsx)("meshPhysicalMaterial",{color:"#f472b6",transparent:!0,opacity:.12,roughness:.2})]}),(0,t.jsxs)("mesh",{position:[3,-2.2,0],children:[(0,t.jsx)("sphereGeometry",{args:[1.3,20,20]}),(0,t.jsx)("meshPhysicalMaterial",{color:"#f472b6",transparent:!0,opacity:.12,roughness:.2})]}),(0,t.jsxs)("mesh",{position:[-3,2.2,0],children:[(0,t.jsx)("sphereGeometry",{args:[1.3,20,20]}),(0,t.jsx)("meshPhysicalMaterial",{color:"#f472b6",transparent:!0,opacity:.12,roughness:.2})]}),(0,t.jsxs)("mesh",{position:[-3,-2.2,0],children:[(0,t.jsx)("sphereGeometry",{args:[1.3,20,20]}),(0,t.jsx)("meshPhysicalMaterial",{color:"#f472b6",transparent:!0,opacity:.12,roughness:.2})]})]})]})});(0,l.useFrame)((t,s)=>{if(!r)return;v.current+=s*i,b.current++;let n="mitosis"===o?a:Math.min(a,p.length-1);g.current.progress=Math.min(100,g.current.progress+15*s*i),g.current.chromosomes.forEach(e=>{let t=((e,t,s)=>{let r=Math.min(s/100,1);switch(t){case 0:let i=1.8-.3*r;return new u.Vector3(Math.cos(e.angle)*i,.3*Math.sin(2*e.angle),Math.sin(e.angle)*i);case 1:let n=1.5-.8*r;return new u.Vector3(Math.cos(e.angle)*n,(e.pairId-1.5)*.3*(1-.5*r),Math.sin(e.angle)*n);case 2:let a=(e.pairId-1.5)*.5;return new u.Vector3(a,0,e.isMaternal?-.1:.1);case 3:let o=e.isMaternal?1:-1;return new u.Vector3(3.5*r*o,(e.pairId-1.5)*.4,0);case 4:return new u.Vector3(e.isMaternal?4:-4,(e.pairId-1.5)*.5,0);case 5:return new u.Vector3(e.isMaternal?5:-5,(e.pairId-1.5)*.5,0);default:return e.position.clone()}})(e,n,g.current.progress);e.position.lerp(t,.05*i),e.condensed=n>=1});let l="meiosis"===o?a:Math.min(a,m.length-1);y.current.progress=Math.min(100,y.current.progress+15*s*i),y.current.chromosomes.forEach(e=>{let t=((e,t,s)=>{let r=Math.min(s/100,1);switch(t){case 0:if(!(r<.5))return new u.Vector3((e.pairId-1.5)*.8,0,e.isMaternal?-.15:.15);{let t=e.pairId*Math.PI*.5;return new u.Vector3(Math.cos(t)*(1.5-r),(e.pairId-1.5)*.5,Math.sin(t)*(1.5-r))}case 1:return new u.Vector3((e.pairId-1.5)*.7,0,e.isMaternal?-.1:.1);case 2:let i=e.isMaternal?1:-1;return new u.Vector3(3*r*i,(e.pairId-1.5)*.3,0);case 3:return new u.Vector3(e.isMaternal?3.5:-3.5,(e.pairId-1.5)*.4,0);case 4:let n=e.isMaternal?1:-1;return new u.Vector3(2.5*n,(e.pairId-1.5)*.3,0);case 5:let a=e.isMaternal?1:-1;return new u.Vector3(1.5*a,(e.pairId-1.5)*.3,0);case 6:let o=e.isMaternal?1:-1;return new u.Vector3(o*(1.5+1.8*r),(e.pairId-1.5)*.35,0);case 7:let l=e.isMaternal?1:-1,c=(e.pairId%2==0?1:-1)*1.5;return new u.Vector3(3*l,c,0);default:return e.position.clone()}})(e,l,y.current.progress);e.position.lerp(t,.05*i),e.condensed=l>=1,e.crossedOver=0===l&&y.current.progress>50});let c=e=>0===e?1:1===e?Math.max(0,1-g.current.progress/100):e>=4?Math.min(.3,g.current.progress/100*.3):0;if(g.current.nucleusOpacity=c(n),y.current.nucleusOpacity=c(l),g.current.spindleOpacity=+(n>=1&&n<=3),y.current.spindleOpacity=+(l>=1&&l<=6),g.current.cellPinch=5===n?g.current.progress/100:0,y.current.cellPinch=7===l?y.current.progress/100:0,b.current%8==0){let t="mitosis"===o?p[a]:m[a],s=46,r=1;"mitosis"===o?r=a>=5?2:1:a<4?(r=a>=3?2:1,s=a>=2?23:46):(r=a>=7?4:2,s=23);let i="mitosis"===o?["Cell grows, DNA replicates. Chromosomes are invisible as chromatin.","Chromosomes condense into visible X shapes. Nuclear envelope dissolves. Spindle fibers form.","Chromosomes align at metaphase plate. Spindle fibers attach to centromeres.","Sister chromatids separate and move to opposite poles.","Chromosomes reach poles, new nuclear envelopes form.","Cell divides through cleavage furrow. 2 identical daughter cells result."]:["Homologous chromosomes pair up (synapsis). Crossing over creates genetic diversity.","Homologous pairs align at metaphase plate (not individual chromosomes).","Homologous chromosomes separate. Sister chromatids remain attached.","Two haploid cells form. Each chromosome still has two sister chromatids.","Chromosomes condense again in both daughter cells.","Chromosomes align at the center of each cell.","Sister chromatids finally separate and move to opposite poles.","Four genetically unique haploid gametes form."],n={phase:t,chromosomesCount:s,daughterCells:r,description:i[Math.min(a,i.length-1)]};S(n),e?.(n)}});let E=Math.min(a,p.length-1),P=Math.min(a,m.length-1);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("ambientLight",{intensity:.6}),(0,t.jsx)("directionalLight",{position:[10,15,10],intensity:.8,castShadow:!0}),(0,t.jsx)("pointLight",{position:[0,5,0],intensity:.3,color:"#ffffff"}),(0,t.jsx)("pointLight",{position:[-6,0,5],intensity:.2,color:"#f59e0b"}),(0,t.jsx)("pointLight",{position:[6,0,5],intensity:.2,color:"#ec4899"}),(0,t.jsxs)("group",{children:[x&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(d.Html,{position:[-6,5.5,0],distanceFactor:12,children:(0,t.jsx)("div",{className:"bg-amber-500/95 text-white px-4 py-2 rounded-lg text-lg font-bold shadow-lg border-2 border-white/30",children:"🧬 MITOSIS"})}),(0,t.jsx)(d.Html,{position:[6,5.5,0],distanceFactor:12,children:(0,t.jsx)("div",{className:"bg-pink-500/95 text-white px-4 py-2 rounded-lg text-lg font-bold shadow-lg border-2 border-white/30",children:"🧬 MEIOSIS"})})]}),(0,t.jsx)(C,{position:[-6,0,0],state:g.current,isMitosis:!0,currentStage:E}),(0,t.jsx)(C,{position:[6,0,0],state:y.current,isMitosis:!1,currentStage:P}),x&&(0,t.jsx)(d.Html,{position:[0,-6,0],distanceFactor:12,children:(0,t.jsxs)("div",{className:`${"mitosis"===o?"bg-amber-600":"bg-pink-600"}/95 text-white px-4 py-2 rounded-lg text-base font-bold shadow-lg`,children:["mitosis"===o?"Mitosis":"Meiosis"," - ","mitosis"===o?p[a]:m[a]]})}),x&&(0,t.jsx)(d.Html,{position:[0,4,0],distanceFactor:10,children:(0,t.jsxs)("div",{className:"bg-gray-900/95 text-white px-4 py-3 rounded-lg text-sm max-w-xs shadow-lg border border-gray-700",children:[(0,t.jsx)("div",{className:"font-bold mb-2 text-lg",children:w.phase}),(0,t.jsxs)("div",{className:"space-y-1 text-xs",children:[(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-gray-400",children:"Daughter cells:"}),(0,t.jsx)("span",{className:"font-bold",children:w.daughterCells})]}),(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-gray-400",children:"Chromosomes:"}),(0,t.jsx)("span",{className:"font-bold",children:w.chromosomesCount})]}),(0,t.jsx)("div",{className:"mt-2 pt-2 border-t border-gray-700 text-gray-300",children:w.description})]})]})}),x&&(0,t.jsx)(d.Html,{position:[-10,3,0],distanceFactor:10,children:(0,t.jsxs)("div",{className:"bg-gray-900/95 text-white px-3 py-2 rounded-lg text-xs shadow-lg border border-gray-700",children:[(0,t.jsx)("div",{className:"font-bold mb-2",children:"Chromosome Colors"}),(0,t.jsxs)("div",{className:"space-y-1",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full",style:{background:h[0].maternal}}),(0,t.jsx)("span",{children:"Maternal (blue)"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full",style:{background:h[0].paternal}}),(0,t.jsx)("span",{children:"Paternal (red)"})]})]})]})})]}),(0,t.jsx)("gridHelper",{args:[24,48,"#1a1a3e","#1a1a3e"],position:[0,-7,0]})]})}e.s(["default",0,function(){let[e,l]=(0,s.useState)(!0),[c,d]=(0,s.useState)(1),[u,h]=(0,s.useState)(0),[p,m]=(0,s.useState)(!0),[x,g]=(0,s.useState)(!1),[y,v]=(0,s.useState)("mitosis"),[b,w]=(0,s.useState)(0),[S,j]=(0,s.useState)(!0),[M,C]=(0,s.useState)({phase:"Prophase",chromosomesCount:46,daughterCells:1,description:"Chromosomes condense and nuclear envelope dissolves."}),E=(0,s.useCallback)(()=>{l(e=>!e)},[]),P=(0,s.useCallback)(()=>{h(e=>e+1),w(0)},[]),A=(0,s.useCallback)(e=>{d(e)},[]),I=(0,s.useCallback)(e=>{C(e)},[]),L=(0,s.useCallback)(e=>{v(e),w(0)},[]),_=["Prophase","Metaphase","Anaphase","Telophase","Cytokinesis"],N=["Prophase I","Metaphase I","Anaphase I","Telophase I","Prophase II","Metaphase II","Anaphase II","Telophase II"],O=(0,s.useMemo)(()=>(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(o.ControlGroup,{title:"Division Mode",children:(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)("button",{onClick:()=>L("mitosis"),className:`flex-1 px-3 py-2 rounded text-sm transition-colors font-medium ${"mitosis"===y?"bg-[#f59e0b] text-white shadow-lg":"bg-gray-800 text-gray-300 hover:bg-gray-700"}`,children:"Mitosis"}),(0,t.jsx)("button",{onClick:()=>L("meiosis"),className:`flex-1 px-3 py-2 rounded text-sm transition-colors font-medium ${"meiosis"===y?"bg-[#ec4899] text-white shadow-lg":"bg-gray-800 text-gray-300 hover:bg-gray-700"}`,children:"Meiosis"})]})}),(0,t.jsx)(o.ControlGroup,{title:"Phases",children:(0,t.jsx)("div",{className:"max-h-48 overflow-y-auto space-y-1 pr-1",children:("mitosis"===y?_:N).map((e,s)=>(0,t.jsxs)("button",{onClick:()=>w(s),className:`w-full px-2 py-1.5 rounded text-xs transition-colors text-left ${b===s?"mitosis"===y?"bg-[#f59e0b] text-white font-bold":"bg-[#ec4899] text-white font-bold":"bg-gray-800 text-gray-300 hover:bg-gray-700"}`,children:[s+1,". ",e]},e))})}),(0,t.jsx)(o.ControlGroup,{title:"Display",children:(0,t.jsxs)("label",{className:"flex items-center gap-2 text-gray-300 text-sm cursor-pointer",children:[(0,t.jsx)("input",{type:"checkbox",checked:S,onChange:e=>j(e.target.checked),className:"w-4 h-4 rounded",style:{accentColor:"mitosis"===y?"#f59e0b":"#ec4899"}}),"Show Labels"]})}),(0,t.jsx)(o.ControlGroup,{title:"Key Info",children:(0,t.jsx)("div",{className:`text-xs ${"mitosis"===y?"bg-amber-900/30":"bg-pink-900/30"} rounded-lg p-3 space-y-2`,children:"mitosis"===y?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{className:"flex justify-between text-gray-300",children:[(0,t.jsx)("span",{children:"Starting cells:"}),(0,t.jsx)("span",{className:"text-amber-400",children:"1"})]}),(0,t.jsxs)("div",{className:"flex justify-between text-gray-300",children:[(0,t.jsx)("span",{children:"Ending cells:"}),(0,t.jsx)("span",{className:"text-amber-400",children:"2"})]}),(0,t.jsxs)("div",{className:"flex justify-between text-gray-300",children:[(0,t.jsx)("span",{children:"Chromosomes:"}),(0,t.jsx)("span",{className:"text-amber-400",children:"46 (diploid)"})]}),(0,t.jsxs)("div",{className:"flex justify-between text-gray-300",children:[(0,t.jsx)("span",{children:"Purpose:"}),(0,t.jsx)("span",{className:"text-amber-400",children:"Growth/Repair"})]}),(0,t.jsxs)("div",{className:"flex justify-between text-gray-300",children:[(0,t.jsx)("span",{children:"Genetic variation:"}),(0,t.jsx)("span",{className:"text-amber-400",children:"None"})]})]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{className:"flex justify-between text-gray-300",children:[(0,t.jsx)("span",{children:"Starting cells:"}),(0,t.jsx)("span",{className:"text-pink-400",children:"1"})]}),(0,t.jsxs)("div",{className:"flex justify-between text-gray-300",children:[(0,t.jsx)("span",{children:"Ending cells:"}),(0,t.jsx)("span",{className:"text-pink-400",children:"4"})]}),(0,t.jsxs)("div",{className:"flex justify-between text-gray-300",children:[(0,t.jsx)("span",{children:"Chromosomes:"}),(0,t.jsx)("span",{className:"text-pink-400",children:"23 (haploid)"})]}),(0,t.jsxs)("div",{className:"flex justify-between text-gray-300",children:[(0,t.jsx)("span",{children:"Purpose:"}),(0,t.jsx)("span",{className:"text-pink-400",children:"Gametes"})]}),(0,t.jsxs)("div",{className:"flex justify-between text-gray-300",children:[(0,t.jsx)("span",{children:"Genetic variation:"}),(0,t.jsx)("span",{className:"text-pink-400",children:"Yes (crossing over)"})]})]})})})]}),[y,b,S,L]),z=(0,s.useMemo)(()=>(0,t.jsx)(o.DataGrid,{data:{phase:{value:0,unit:M.phase,color:"mitosis"===y?"#f59e0b":"#ec4899",decimals:0},chromosomes:{value:M.chromosomesCount,unit:"chromosomes",color:"mitosis"===y?"#fbbf24":"#f472b6",decimals:0},daughterCells:{value:M.daughterCells,unit:"cells",color:"mitosis"===y?"#fcd34d":"#fb7185",decimals:0},mode:{value:0,unit:"mitosis"===y?"Mitosis":"Meiosis",color:"mitosis"===y?"#f59e0b":"#ec4899",decimals:0},status:{value:+!!e,unit:e?"Active":"Paused",color:"#22c55e",decimals:0}},columns:2}),[M,y,e]),U=(0,s.useMemo)(()=>(0,t.jsx)(a.DataPanel,{isVisible:x,onToggle:()=>g(e=>!e),children:z}),[x,z]),B="mitosis"===y?"#f59e0b":"#ec4899";return(0,t.jsxs)("div",{className:"w-full h-screen relative",children:[(0,t.jsx)(r.ExperimentContainer,{title:"Mitosis & Meiosis",description:"mitosis"===y?"Cell division for growth and repair - produces identical cells":"Gamete formation with crossing over - produces genetic diversity",cameraPosition:[0,0,14],backgroundColor:"#050510",controls:null,dataPanel:U,children:(0,t.jsx)(f,{onDataChange:I,isPlaying:e,simulationSpeed:c,resetTrigger:u,stage:b,mode:y,showLabels:S})}),(0,t.jsx)(i.SimulationController,{isPlaying:e,onPlayPause:E,onReset:P,speed:c,onSpeedChange:A,timeElapsed:0}),p&&(0,t.jsx)(n.FloatingControlPanel,{initialPosition:{x:window.innerWidth-340,y:80},children:O}),!p&&(0,t.jsx)("button",{onClick:()=>m(!0),className:"fixed top-20 right-4 z-20 px-4 py-2 rounded-lg border transition-colors text-sm font-medium",style:{backgroundColor:`${B}20`,color:B,borderColor:`${B}50`},children:"Show Controls"})]})}],42618)}]);
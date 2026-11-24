(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,i;var r=e.i(31067),n=e.i(71645),s=e.i(90072),a=e.i(48546),o=s,l=s;let d=new l.Box3,c=new l.Vector3;class u extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(i,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let r=new l.InstancedInterleavedBuffer(i,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(r,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(r,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),d.setFromBufferAttribute(t),this.boundingBox.union(d))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let r=0;for(let n=0,s=e.count;n<s;n++)c.fromBufferAttribute(e,n),r=Math.max(r,i.distanceToSquared(c)),c.fromBufferAttribute(t,n),r=Math.max(r,i.distanceToSquared(c));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var f=s,h=e.i(8560),m=e.i(31497);class p extends f.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:f.UniformsUtils.clone(f.UniformsUtils.merge([h.UniformsLib.common,h.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new f.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let x=m.version>=125?"uv1":"uv2",g=new o.Vector4,v=new o.Vector3,y=new o.Vector3,b=new o.Vector4,S=new o.Vector4,j=new o.Vector4,w=new o.Vector3,C=new o.Matrix4,M=new o.Line3,A=new o.Vector3,E=new o.Box3,L=new o.Sphere,_=new o.Vector4;function N(e,t,r){return _.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),_.multiplyScalar(1/_.w),_.x=i/r.width,_.y=i/r.height,_.applyMatrix4(e.projectionMatrixInverse),_.multiplyScalar(1/_.w),Math.abs(Math.max(_.x,_.y))}class P extends o.Mesh{constructor(e=new u,t=new p({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,n=0,s=t.count;e<s;e++,n+=2)v.fromBufferAttribute(t,e),y.fromBufferAttribute(i,e),r[n]=0===n?0:r[n-1],r[n+1]=r[n]+v.distanceTo(y);let n=new o.InstancedInterleavedBuffer(r,2,1);return e.setAttribute("instanceDistanceStart",new o.InterleavedBufferAttribute(n,1,0)),e.setAttribute("instanceDistanceEnd",new o.InterleavedBufferAttribute(n,1,1)),this}raycast(e,r){let n,s,a=this.material.worldUnits,l=e.camera;null!==l||a||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let d=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let c=this.matrixWorld,u=this.geometry,f=this.material;if(i=f.linewidth+d,null===u.boundingSphere&&u.computeBoundingSphere(),L.copy(u.boundingSphere).applyMatrix4(c),a)n=.5*i;else{let e=Math.max(l.near,L.distanceToPoint(t.origin));n=N(l,e,f.resolution)}if(L.radius+=n,!1!==t.intersectsSphere(L)){if(null===u.boundingBox&&u.computeBoundingBox(),E.copy(u.boundingBox).applyMatrix4(c),a)s=.5*i;else{let e=Math.max(l.near,E.distanceToPoint(t.origin));s=N(l,e,f.resolution)}E.expandByScalar(s),!1!==t.intersectsBox(E)&&(a?function(e,r){let n=e.matrixWorld,s=e.geometry,a=s.attributes.instanceStart,l=s.attributes.instanceEnd,d=Math.min(s.instanceCount,a.count);for(let s=0;s<d;s++){M.start.fromBufferAttribute(a,s),M.end.fromBufferAttribute(l,s),M.applyMatrix4(n);let d=new o.Vector3,c=new o.Vector3;t.distanceSqToSegment(M.start,M.end,c,d),c.distanceTo(d)<.5*i&&r.push({point:c,pointOnLine:d,distance:t.origin.distanceTo(c),object:e,face:null,faceIndex:s,uv:null,[x]:null})}}(this,r):function(e,r,n){let s=r.projectionMatrix,a=e.material.resolution,l=e.matrixWorld,d=e.geometry,c=d.attributes.instanceStart,u=d.attributes.instanceEnd,f=Math.min(d.instanceCount,c.count),h=-r.near;t.at(1,j),j.w=1,j.applyMatrix4(r.matrixWorldInverse),j.applyMatrix4(s),j.multiplyScalar(1/j.w),j.x*=a.x/2,j.y*=a.y/2,j.z=0,w.copy(j),C.multiplyMatrices(r.matrixWorldInverse,l);for(let r=0;r<f;r++){if(b.fromBufferAttribute(c,r),S.fromBufferAttribute(u,r),b.w=1,S.w=1,b.applyMatrix4(C),S.applyMatrix4(C),b.z>h&&S.z>h)continue;if(b.z>h){let e=b.z-S.z,t=(b.z-h)/e;b.lerp(S,t)}else if(S.z>h){let e=S.z-b.z,t=(S.z-h)/e;S.lerp(b,t)}b.applyMatrix4(s),S.applyMatrix4(s),b.multiplyScalar(1/b.w),S.multiplyScalar(1/S.w),b.x*=a.x/2,b.y*=a.y/2,S.x*=a.x/2,S.y*=a.y/2,M.start.copy(b),M.start.z=0,M.end.copy(S),M.end.z=0;let d=M.closestPointToPointParameter(w,!0);M.at(d,A);let f=o.MathUtils.lerp(b.z,S.z,d),m=f>=-1&&f<=1,p=w.distanceTo(A)<.5*i;if(m&&p){M.start.fromBufferAttribute(c,r),M.end.fromBufferAttribute(u,r),M.start.applyMatrix4(l),M.end.applyMatrix4(l);let i=new o.Vector3,s=new o.Vector3;t.distanceSqToSegment(M.start,M.end,s,i),n.push({point:s,pointOnLine:i,distance:t.origin.distanceTo(s),object:e,face:null,faceIndex:r,uv:null,[x]:null})}}}(this,l,r))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(g),this.material.uniforms.resolution.value.set(g.z,g.w))}}class H extends u{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let r=0;r<t;r+=3)i[2*r]=e[r],i[2*r+1]=e[r+1],i[2*r+2]=e[r+2],i[2*r+3]=e[r+3],i[2*r+4]=e[r+4],i[2*r+5]=e[r+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,r=new Float32Array(2*i);if(3===t)for(let n=0;n<i;n+=t)r[2*n]=e[n],r[2*n+1]=e[n+1],r[2*n+2]=e[n+2],r[2*n+3]=e[n+3],r[2*n+4]=e[n+4],r[2*n+5]=e[n+5];else for(let n=0;n<i;n+=t)r[2*n]=e[n],r[2*n+1]=e[n+1],r[2*n+2]=e[n+2],r[2*n+3]=e[n+3],r[2*n+4]=e[n+4],r[2*n+5]=e[n+5],r[2*n+6]=e[n+6],r[2*n+7]=e[n+7];return super.setColors(r,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class U extends P{constructor(e=new H,t=new p({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let B=n.forwardRef(function({points:e,color:t=0xffffff,vertexColors:i,linewidth:o,lineWidth:l,segments:d,dashed:c,...f},h){var m,x;let g=(0,a.useThree)(e=>e.size),v=n.useMemo(()=>d?new P:new U,[d]),[y]=n.useState(()=>new p),b=(null==i||null==(m=i[0])?void 0:m.length)===4?4:3,S=n.useMemo(()=>{let r=d?new u:new H,n=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Vector3||e instanceof s.Vector4?[e.x,e.y,e.z]:e instanceof s.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(r.setPositions(n.flat()),i){t=0xffffff;let e=i.map(e=>e instanceof s.Color?e.toArray():e);r.setColors(e.flat(),b)}return r},[e,d,i,b]);return n.useLayoutEffect(()=>{v.computeLineDistances()},[e,v]),n.useLayoutEffect(()=>{c?y.defines.USE_DASH="":delete y.defines.USE_DASH,y.needsUpdate=!0},[c,y]),n.useEffect(()=>()=>{S.dispose(),y.dispose()},[S]),n.createElement("primitive",(0,r.default)({object:v,ref:h},f),n.createElement("primitive",{object:S,attach:"geometry"}),n.createElement("primitive",(0,r.default)({object:y,attach:"material",color:t,vertexColors:!!i,resolution:[g.width,g.height],linewidth:null!=(x=null!=o?o:l)?x:1,dashed:c,transparent:4===b},f)))});e.s(["Line",0,B],43216)},56420,e=>{"use strict";var t=e.i(71645);let i=(...e)=>e.filter((e,t,i)=>!!e&&""!==e.trim()&&i.indexOf(e)===t).join(" ").trim(),r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,i)=>i?i.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var n={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,t.createContext)({}),a=(0,t.forwardRef)(({color:e,size:r,strokeWidth:a,absoluteStrokeWidth:o,className:l="",children:d,iconNode:c,...u},f)=>{let{size:h=24,strokeWidth:m=2,absoluteStrokeWidth:p=!1,color:x="currentColor",className:g=""}=(0,t.useContext)(s)??{},v=o??p?24*Number(a??m)/Number(r??h):a??m;return(0,t.createElement)("svg",{ref:f,...n,width:r??h??n.width,height:r??h??n.height,stroke:e??x,strokeWidth:v,className:i("lucide",g,l),...!d&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...c.map(([e,i])=>(0,t.createElement)(e,i)),...Array.isArray(d)?d:[d]])});e.s(["default",0,(e,n)=>{let s=(0,t.forwardRef)(({className:s,...o},l)=>(0,t.createElement)(a,{ref:l,iconNode:n,className:i(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...o}));return s.displayName=r(e),s}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,i)=>{t.exports=e.r(76562)},16443,e=>{"use strict";var t=e.i(43476),i=e.i(71645),r=e.i(92989),n=e.i(94800),s=e.i(90072),a=e.i(43216);let o={HCl:{Ka:1e7,pKa:-7,strength:"Strong Acid"},CH3COOH:{Ka:18e-6,pKa:4.76,strength:"Weak Acid"}},l={NaOH:{strength:"Strong Base"},KOH:{strength:"Strong Base"}};function d(e,t,i,r,n){let s=o[n],a=t*i/1e3,l=e*r/1e3,d=t+e;if("HCl"===n)if(l<a)return-Math.log10(Math.max((a-l)/d*1e3,1e-14));else return 1e-5>Math.abs(l-a)?7:14- -Math.log10(Math.max((l-a)/d*1e3,1e-14));return 0===l?-Math.log10(Math.max(Math.sqrt(s.Ka*i),1e-14)):l<a?s.pKa+Math.log10(Math.max(l/(a-l),.001)):1e-5>Math.abs(l-a)?14- -Math.log10(Math.max(Math.sqrt(1e-14/s.Ka*(a/d*1e3)),1e-14)):14- -Math.log10(Math.max((l-a)/d*1e3,1e-14))}function c({acidConcentration:e,baseConcentration:r,acidType:u,baseType:f,indicatorType:h,dripSpeed:m,isDripping:p,manualDripTrigger:x,onDataChange:g}){let v=(0,i.useRef)(null),y=(0,i.useRef)(null),b=(0,i.useRef)(null),S=(0,i.useRef)(null),j=(0,i.useRef)({dropsAdded:0,volumeAdded:0,lastDripTime:0,lastManualTrigger:0,frameCount:0,drops:[],curveData:[]}),[w,C]=(0,i.useState)({dropsAdded:0,volumeAdded:0,currentPH:1,acidConcentration:e,baseConcentration:r,acidType:u,baseType:f,indicatorType:h,equivalencePointVolume:0,acidStrength:o[u].strength,baseStrength:l[f].strength,isNearEquivalence:!1,isPastEquivalence:!1,titrationCurve:[]}),M=(0,i.useMemo)(()=>25*e/r,[e,r]),A=(0,i.useMemo)(()=>(function(e,t,i,r){let n=[];for(let s=0;s<=r;s+=.5)n.push({volume:s,ph:d(s,25,e,t,i)});return n})(e,r,u,1.5*M),[e,r,u,M]);(0,i.useEffect)(()=>{j.current.curveData=A},[A]),(0,i.useEffect)(()=>{x>j.current.lastManualTrigger&&(j.current.dropsAdded++,j.current.volumeAdded+=.05,j.current.lastManualTrigger=x)},[x]),(0,n.useFrame)((t,i)=>{let n=Math.min(i,.05),s=t.clock.elapsedTime,a=j.current;if(p&&s-a.lastDripTime>(1.1-m)*.5){a.dropsAdded++,a.volumeAdded+=.05,a.lastDripTime=s;let e=a.drops.findIndex(e=>!e.active);-1===e?a.drops.push({time:1e3*s,active:!0,y:2}):a.drops[e]={time:1e3*s,active:!0,y:2}}for(let e of a.drops)e.active&&(e.y-=4*n,e.y<.6&&(e.active=!1));let c=d(a.volumeAdded,25,e,r,u),x=2>Math.abs(a.volumeAdded-M),v=a.volumeAdded>M;if(a.frameCount++,a.frameCount%8==0){let t={dropsAdded:a.dropsAdded,volumeAdded:a.volumeAdded,currentPH:c,acidConcentration:e,baseConcentration:r,acidType:u,baseType:f,indicatorType:h,equivalencePointVolume:M,acidStrength:o[u].strength,baseStrength:l[f].strength,isNearEquivalence:x,isPastEquivalence:v,titrationCurve:a.curveData};C(t),g?.(t)}if(b.current){let e=b.current.geometry.attributes.position;for(let t=0;t<e.count;t++){let i=e.array[3*t],r=e.array[3*t+1],n=x?.04:.015;e.array[3*t+2]=Math.sin(3*i+2.5*s)*n+Math.cos(3*r+2*s)*n}e.needsUpdate=!0}S.current&&p&&(S.current.rotation.z=.1*Math.sin(10*s))});let E=function(e,t){switch(t){case"universal":default:return e<3?new s.Color(.9,.1,.1):e<5?new s.Color(1,.5,0):e<6?new s.Color(1,.9,.1):e<7.5?new s.Color(.2,.8,.3):e<10?new s.Color(.2,.4,1):new s.Color(.6,.2,.8);case"phenolphthalein":if(e<8.2)return new s.Color(.95,.97,1);if(e<10)return new s.Color(1,.4,.7);return new s.Color(1,.2,.5);case"methyl-orange":if(e<3.1)return new s.Color(1,.15,.1);if(e<4.4)return new s.Color(1,.5,.1);return new s.Color(1,.9,.2);case"bromothymol":if(e<6)return new s.Color(1,.85,.2);if(e<7.6)return new s.Color(.4,.75,.3);return new s.Color(.2,.4,1)}}(w.currentPH,h),L=.4+w.volumeAdded/100*1.2,_=(0,i.useMemo)(()=>A.map(e=>new s.Vector3((e.volume/(1.5*M)-.5)*2.4,(e.ph-7)/7*1.8,0)),[A,M]),N=(0,i.useMemo)(()=>{let e=(w.volumeAdded/(1.5*M)-.5)*2.4,t=(w.currentPH-7)/7*1.8;return new s.Vector3(Math.max(-1.2,Math.min(1.2,e)),Math.max(-.9,Math.min(.9,t)),0)},[w.volumeAdded,w.currentPH,M]),P=j.current.drops.filter(e=>e.active).slice(-8);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("ambientLight",{intensity:.4}),(0,t.jsx)("directionalLight",{position:[5,10,5],intensity:.8,castShadow:!0}),(0,t.jsx)("pointLight",{position:[0,3,2],intensity:.3}),(0,t.jsxs)("group",{position:[0,0,0],children:[(0,t.jsxs)("mesh",{position:[0,-.1,0],receiveShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[1.2,.1,1.2]}),(0,t.jsx)("meshStandardMaterial",{color:"#2a2a2a",metalness:.7,roughness:.3})]}),(0,t.jsxs)("mesh",{position:[.4,2.5,0],castShadow:!0,children:[(0,t.jsx)("cylinderGeometry",{args:[.04,.04,5,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#3a3a3a",metalness:.8,roughness:.2})]}),(0,t.jsxs)("mesh",{position:[.2,4.2,0],castShadow:!0,rotation:[0,0,Math.PI/2],children:[(0,t.jsx)("cylinderGeometry",{args:[.035,.035,.5,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#3a3a3a",metalness:.8,roughness:.2})]}),(0,t.jsxs)("mesh",{position:[0,4.2,0],castShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[.25,.08,.08]}),(0,t.jsx)("meshStandardMaterial",{color:"#4a4a4a",metalness:.7,roughness:.3})]})]}),(0,t.jsxs)("group",{position:[0,3.2,0],children:[(0,t.jsxs)("mesh",{ref:v,castShadow:!0,children:[(0,t.jsx)("cylinderGeometry",{args:[.12,.12,2.8,24,1,!0]}),(0,t.jsx)("meshStandardMaterial",{color:"#ffffff",transparent:!0,opacity:.15,side:s.DoubleSide,metalness:.1,roughness:.1})]}),(0,t.jsxs)("mesh",{position:[0,.3,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.105,.105,2.2,24,1,!0]}),(0,t.jsx)("meshStandardMaterial",{color:"#e0e0ff",transparent:!0,opacity:.35})]}),Array.from({length:11}).map((e,i)=>(0,t.jsx)("group",{children:(0,t.jsxs)("mesh",{position:[.125,-.9+.18*i,0],children:[(0,t.jsx)("boxGeometry",{args:[.015,i%5==0?.06:.035,.015]}),(0,t.jsx)("meshStandardMaterial",{color:"#ffffff",emissive:"#ffffff",emissiveIntensity:.3})]})},`mark-${i}`)),[0,5,10].map(e=>(0,t.jsxs)("mesh",{position:[.16,-.9+.18*e,0],children:[(0,t.jsx)("sphereGeometry",{args:[.02,8,8]}),(0,t.jsx)("meshBasicMaterial",{color:"#ffffff"})]},`num-${e}`)),(0,t.jsxs)("mesh",{position:[0,-1.45,0],castShadow:!0,children:[(0,t.jsx)("cylinderGeometry",{args:[.08,.08,.15,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#c9a227",metalness:.9,roughness:.15})]}),(0,t.jsxs)("mesh",{ref:S,position:[.08,-1.45,0],castShadow:!0,rotation:[0,0,.1*!!p],children:[(0,t.jsx)("boxGeometry",{args:[.2,.04,.06]}),(0,t.jsx)("meshStandardMaterial",{color:"#1a1a4a",metalness:.3,roughness:.5})]}),(0,t.jsxs)("mesh",{position:[0,-1.65,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.025,.015,.2,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#ffffff",transparent:!0,opacity:.2,side:s.DoubleSide})]})]}),(0,t.jsxs)("group",{position:[0,.2,0],children:[(0,t.jsxs)("mesh",{ref:y,position:[0,.4,0],castShadow:!0,children:[(0,t.jsx)("cylinderGeometry",{args:[.35,.7,1.1,32,1,!0]}),(0,t.jsx)("meshStandardMaterial",{color:"#ffffff",transparent:!0,opacity:.12,side:s.DoubleSide,metalness:.05,roughness:.05})]}),(0,t.jsxs)("mesh",{position:[0,.1,0],castShadow:!0,children:[(0,t.jsx)("sphereGeometry",{args:[.7,32,8,0,2*Math.PI,0,Math.PI/2]}),(0,t.jsx)("meshStandardMaterial",{color:"#ffffff",transparent:!0,opacity:.12,side:s.DoubleSide})]}),(0,t.jsxs)("mesh",{position:[0,1,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.12,.14,.5,20,1,!0]}),(0,t.jsx)("meshStandardMaterial",{color:"#ffffff",transparent:!0,opacity:.12,side:s.DoubleSide})]}),(0,t.jsxs)("mesh",{position:[0,1.3,0],children:[(0,t.jsx)("torusGeometry",{args:[.13,.015,8,24]}),(0,t.jsx)("meshStandardMaterial",{color:"#dddddd",metalness:.3,roughness:.4})]}),(0,t.jsxs)("mesh",{ref:b,position:[0,.3+L/2,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.32,.65,L,32,12]}),(0,t.jsx)("meshStandardMaterial",{color:E,transparent:!0,opacity:.8,emissive:E,emissiveIntensity:w.isNearEquivalence?.5:.25})]}),(0,t.jsxs)("mesh",{position:[0,.3+L,0],children:[(0,t.jsx)("torusGeometry",{args:[.3,.02,8,24]}),(0,t.jsx)("meshStandardMaterial",{color:E,transparent:!0,opacity:.6,emissive:E,emissiveIntensity:.3})]}),w.isNearEquivalence&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("pointLight",{position:[0,.5,.5],color:E,intensity:2.5,distance:2}),(0,t.jsx)("pointLight",{position:[0,.5,-.5],color:E,intensity:1.5,distance:1.5})]})]}),(0,t.jsx)("group",{children:P.map((e,i)=>(0,t.jsxs)("mesh",{position:[0,e.y,0],children:[(0,t.jsx)("sphereGeometry",{args:[.025,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#e0e0ff",emissive:"#ffffff",emissiveIntensity:.6,transparent:!0,opacity:.9})]},`drop-${e.time}-${i}`))}),(0,t.jsxs)("group",{position:[-1.8,1.5,0],children:[(0,t.jsxs)("mesh",{position:[0,0,-.02],children:[(0,t.jsx)("planeGeometry",{args:[2.8,2.4]}),(0,t.jsx)("meshStandardMaterial",{color:"#0a0a18",transparent:!0,opacity:.92})]}),[1,7,13].map((e,i)=>(0,t.jsxs)("mesh",{position:[0,(e-7)/7*1.05,0],children:[(0,t.jsx)("boxGeometry",{args:[2.7,.015,.01]}),(0,t.jsx)("meshStandardMaterial",{color:7===e?"#22c55e":"#333344",transparent:!0,opacity:7===e?.5:.3})]},`grid-h-${e}`)),(0,t.jsxs)("mesh",{position:[0,0,.01],children:[(0,t.jsx)("boxGeometry",{args:[.015,2.3,.01]}),(0,t.jsx)("meshStandardMaterial",{color:"#f59e0b",emissive:"#f59e0b",emissiveIntensity:.6,transparent:!0,opacity:.8})]}),(0,t.jsx)(a.Line,{points:_,color:"#8b5cf6",lineWidth:2.5}),(0,t.jsx)(a.Line,{points:_.slice(0,Math.max(2,Math.floor(w.volumeAdded/(1.5*M)*_.length))),color:"#06d6a0",lineWidth:3}),(0,t.jsxs)("mesh",{position:[N.x,N.y,.05],children:[(0,t.jsx)("sphereGeometry",{args:[.05,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:w.currentPH>7?"#3b82f6":w.currentPH<7?"#ef4444":"#22c55e",emissive:w.currentPH>7?"#3b82f6":w.currentPH<7?"#ef4444":"#22c55e",emissiveIntensity:1})]}),(0,t.jsxs)("mesh",{position:[0,0,.03],children:[(0,t.jsx)("ringGeometry",{args:[.08,.1,24]}),(0,t.jsx)("meshBasicMaterial",{color:"#f59e0b",side:s.DoubleSide,transparent:!0,opacity:w.isNearEquivalence?1:.6})]}),[0,1,7,13,14].map((e,i)=>{let r=(e-7)/7*1.05;return r<-1.1||r>1.1?null:(0,t.jsxs)("mesh",{position:[-1.35,r,.02],children:[(0,t.jsx)("sphereGeometry",{args:[.025,8,8]}),(0,t.jsx)("meshBasicMaterial",{color:7===e?"#22c55e":0===e?"#ef4444":14===e?"#3b82f6":"#888"})]},`ph-${e}`)})]}),(0,t.jsxs)("group",{position:[1.8,2,0],children:[(0,t.jsxs)("mesh",{position:[0,0,0],castShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[.7,.4,.08]}),(0,t.jsx)("meshStandardMaterial",{color:"#1a1a2e",metalness:.5,roughness:.3})]}),(0,t.jsxs)("mesh",{position:[0,0,.05],children:[(0,t.jsx)("planeGeometry",{args:[.6,.3]}),(0,t.jsx)("meshStandardMaterial",{color:"#0a0a1e"})]}),(0,t.jsxs)("mesh",{position:[0,0,.07],children:[(0,t.jsx)("circleGeometry",{args:[.1,24]}),(0,t.jsx)("meshStandardMaterial",{color:w.currentPH>7?"#3b82f6":w.currentPH<7?"#ef4444":"#22c55e",emissive:w.currentPH>7?"#3b82f6":w.currentPH<7?"#ef4444":"#22c55e",emissiveIntensity:.9})]})]}),(0,t.jsx)("group",{position:[1.8,1.2,0],children:"universal"===h&&(0,t.jsx)(t.Fragment,{children:(0,t.jsx)("group",{position:[-.15,0,0],children:[{ph:1,color:"#e53e3e"},{ph:4,color:"#f97316"},{ph:5.5,color:"#facc15"},{ph:7,color:"#22c55e"},{ph:9,color:"#3b82f6"},{ph:12,color:"#9333ea"}].map((e,i)=>(0,t.jsxs)("mesh",{position:[.06*i,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[.025,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:e.color,emissive:e.color,emissiveIntensity:.3})]},i))})})}),w.isNearEquivalence&&(0,t.jsxs)("group",{position:[0,1,0],children:[(0,t.jsxs)("mesh",{rotation:[Math.PI/2,0,0],children:[(0,t.jsx)("ringGeometry",{args:[.85,.92,48]}),(0,t.jsx)("meshBasicMaterial",{color:"#f59e0b",side:s.DoubleSide,transparent:!0,opacity:.7})]}),(0,t.jsx)("pointLight",{position:[0,.5,0],color:"#f59e0b",intensity:3,distance:4})]}),(0,t.jsx)("gridHelper",{args:[10,20,"#1a1a3e","#12122a"],position:[0,-.2,0]})]})}e.i(81413);var u=e.i(48205),f=e.i(82192),h=e.i(68647),m=e.i(14228),p=e.i(4685);e.s(["default",0,function(){let e=(0,r.useRouter)(),[n,s]=(0,i.useState)(null),[a,o]=(0,i.useState)(!0),[l,d]=(0,i.useState)(!1),[x,g]=(0,i.useState)(.5),[v,y]=(0,i.useState)(0),[b,S]=(0,i.useState)(.1),[j,w]=(0,i.useState)(.1),[C,M]=(0,i.useState)("HCl"),[A,E]=(0,i.useState)("NaOH"),[L,_]=(0,i.useState)("universal"),[N,P]=(0,i.useState)(.5),[H,U]=(0,i.useState)(0);(0,i.useEffect)(()=>{v>0&&s(null)},[v]);let B=(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)(h.ControlGroup,{title:"Acid Parameters",children:[(0,t.jsxs)("div",{className:"mb-3",children:[(0,t.jsx)("label",{className:"text-xs text-gray-400 mb-2 block",children:"Acid Type"}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-2",children:[(0,t.jsx)("button",{onClick:()=>M("HCl"),className:`py-2 px-3 rounded-lg text-xs font-medium transition-all ${"HCl"===C?"bg-violet-600 text-white":"bg-gray-200/50 text-gray-700 hover:bg-gray-300/50"}`,children:"HCl (Strong)"}),(0,t.jsx)("button",{onClick:()=>M("CH3COOH"),className:`py-2 px-3 rounded-lg text-xs font-medium transition-all ${"CH3COOH"===C?"bg-violet-600 text-white":"bg-gray-200/50 text-gray-700 hover:bg-gray-300/50"}`,children:"CH₃COOH (Weak)"})]})]}),(0,t.jsx)(h.ControlSlider,{label:"Acid Concentration",value:b,unit:"M",min:.01,max:.5,step:.01,color:"#ef4444",onChange:S,decimals:2})]}),(0,t.jsxs)(h.ControlGroup,{title:"Base Parameters",children:[(0,t.jsxs)("div",{className:"mb-3",children:[(0,t.jsx)("label",{className:"text-xs text-gray-400 mb-2 block",children:"Base Type"}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-2",children:[(0,t.jsx)("button",{onClick:()=>E("NaOH"),className:`py-2 px-3 rounded-lg text-xs font-medium transition-all ${"NaOH"===A?"bg-violet-600 text-white":"bg-gray-200/50 text-gray-700 hover:bg-gray-300/50"}`,children:"NaOH"}),(0,t.jsx)("button",{onClick:()=>E("KOH"),className:`py-2 px-3 rounded-lg text-xs font-medium transition-all ${"KOH"===A?"bg-violet-600 text-white":"bg-gray-200/50 text-gray-700 hover:bg-gray-300/50"}`,children:"KOH"})]})]}),(0,t.jsx)(h.ControlSlider,{label:"Base Concentration",value:j,unit:"M",min:.01,max:.5,step:.01,color:"#3b82f6",onChange:w,decimals:2})]}),(0,t.jsx)(h.ControlGroup,{title:"Indicator Type",children:(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-2",children:[(0,t.jsx)("button",{onClick:()=>_("universal"),className:`py-2 px-2 rounded-lg text-xs font-medium transition-all ${"universal"===L?"bg-violet-600 text-white":"bg-gray-200/50 text-gray-700 hover:bg-gray-300/50"}`,children:"🌈 Universal"}),(0,t.jsx)("button",{onClick:()=>_("phenolphthalein"),className:`py-2 px-2 rounded-lg text-xs font-medium transition-all ${"phenolphthalein"===L?"bg-violet-600 text-white":"bg-gray-200/50 text-gray-700 hover:bg-gray-300/50"}`,children:"🌸 Phenolphthalein"}),(0,t.jsx)("button",{onClick:()=>_("methyl-orange"),className:`py-2 px-2 rounded-lg text-xs font-medium transition-all ${"methyl-orange"===L?"bg-violet-600 text-white":"bg-gray-200/50 text-gray-700 hover:bg-gray-300/50"}`,children:"🍊 Methyl Orange"}),(0,t.jsx)("button",{onClick:()=>_("bromothymol"),className:`py-2 px-2 rounded-lg text-xs font-medium transition-all ${"bromothymol"===L?"bg-violet-600 text-white":"bg-gray-200/50 text-gray-700 hover:bg-gray-300/50"}`,children:"💛 Bromothymol"})]})}),(0,t.jsxs)(h.ControlGroup,{title:"Drip Control",children:[(0,t.jsx)(h.ControlSlider,{label:"Drip Speed",value:N,unit:"",min:.1,max:1,step:.1,color:"#8b5cf6",onChange:P,decimals:1}),(0,t.jsx)("button",{onClick:()=>U(e=>e+1),disabled:l,className:`w-full py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${l?"bg-gray-300 text-gray-500 cursor-not-allowed":"bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white"}`,children:"💧 Add One Drop"})]}),(0,t.jsx)("button",{onClick:()=>e.push("/experiments/titration/details"),className:"w-full py-2.5 bg-gradient-to-r from-violet-100 to-violet-200 hover:from-violet-200 hover:to-violet-300 text-violet-700 font-medium text-sm rounded-lg transition-all border border-violet-300/50 flex items-center justify-center gap-2",children:"📖 View Experiment Details"})]}),O=n?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(h.DataGrid,{data:{ph:{value:n.currentPH,unit:"pH",color:n.currentPH>7?"#3b82f6":n.currentPH<7?"#ef4444":"#22c55e",decimals:2},volume:{value:n.volumeAdded,unit:"mL",color:"#8b5cf6",decimals:2},drops:{value:n.dropsAdded,unit:"drops",color:"#06d6a0",decimals:0},equivPoint:{value:n.equivalencePointVolume,unit:"mL",color:"#f59e0b",decimals:1},acidConc:{value:n.acidConcentration,unit:"M",color:"#ef4444",decimals:2},baseConc:{value:n.baseConcentration,unit:"M",color:"#3b82f6",decimals:2}},columns:2}),(0,t.jsxs)("div",{className:"mt-3 grid grid-cols-2 gap-2",children:[(0,t.jsxs)("div",{className:"p-2 bg-gray-800/50 rounded-lg",children:[(0,t.jsx)("div",{className:"text-xs text-gray-400",children:"Acid"}),(0,t.jsx)("div",{className:"text-xs font-bold text-red-400",children:n.acidType}),(0,t.jsx)("div",{className:"text-xs text-gray-500",children:n.acidStrength})]}),(0,t.jsxs)("div",{className:"p-2 bg-gray-800/50 rounded-lg",children:[(0,t.jsx)("div",{className:"text-xs text-gray-400",children:"Base"}),(0,t.jsx)("div",{className:"text-xs font-bold text-blue-400",children:n.baseType}),(0,t.jsx)("div",{className:"text-xs text-gray-500",children:n.baseStrength})]})]}),(0,t.jsxs)("div",{className:"mt-3 p-3 bg-gray-800/50 rounded-lg",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)("span",{className:"text-gray-400 text-sm",children:"Solution:"}),(0,t.jsx)("span",{className:`font-bold text-sm ${n.isNearEquivalence?"text-amber-400 animate-pulse":n.currentPH>7?"text-blue-400":n.currentPH<7?"text-red-400":"text-green-400"}`,children:n.isNearEquivalence?"⚡ Near Equivalence!":n.currentPH>7?"🔵 Basic":n.currentPH<7?"🔴 Acidic":"🟢 Neutral"})]}),(0,t.jsxs)("div",{className:"mt-2",children:[(0,t.jsxs)("div",{className:"flex justify-between text-xs text-gray-500 mb-1",children:[(0,t.jsx)("span",{children:"Progress"}),(0,t.jsxs)("span",{children:[Math.min(100,n.volumeAdded/n.equivalencePointVolume*100).toFixed(0),"%"]})]}),(0,t.jsx)("div",{className:"w-full bg-gray-700 rounded-full h-2",children:(0,t.jsx)("div",{className:"h-2 rounded-full transition-all duration-300",style:{width:`${Math.min(100,n.volumeAdded/n.equivalencePointVolume*100)}%`,backgroundColor:n.isNearEquivalence?"#f59e0b":n.currentPH>7?"#3b82f6":"#ef4444"}})})]}),n.isPastEquivalence&&!n.isNearEquivalence&&(0,t.jsxs)("div",{className:"mt-2 text-xs text-amber-400 font-medium text-center",children:["✓ Equivalence point reached at ",n.equivalencePointVolume.toFixed(1)," mL"]})]}),(0,t.jsxs)("div",{className:"mt-2 p-2 bg-gray-800/30 rounded-lg",children:[(0,t.jsxs)("div",{className:"text-xs text-gray-400",children:["Indicator: ",n.indicatorType]}),"universal"===n.indicatorType&&(0,t.jsx)("div",{className:"text-xs text-gray-500 mt-1",children:"Shows full pH spectrum"}),"phenolphthalein"===n.indicatorType&&(0,t.jsx)("div",{className:"text-xs text-gray-500 mt-1",children:"Colorless → Pink (pH 8.2)"}),"methyl-orange"===n.indicatorType&&(0,t.jsx)("div",{className:"text-xs text-gray-500 mt-1",children:"Red → Yellow (pH 3.1-4.4)"}),"bromothymol"===n.indicatorType&&(0,t.jsx)("div",{className:"text-xs text-gray-500 mt-1",children:"Yellow → Blue (pH 6.0-7.6)"})]})]}):(0,t.jsxs)("div",{className:"text-center text-gray-500 text-sm py-8",children:[(0,t.jsx)("div",{className:"animate-pulse",children:"Initializing titration..."}),(0,t.jsx)("div",{className:"text-xs mt-2",children:"Add drops to begin"})]});return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(u.ExperimentContainer,{title:"Acid-Base Titration",description:"Determine unknown concentrations through acid-base titration",cameraPosition:[8,6,8],backgroundColor:"#050510",controls:null,dataPanel:null,children:(0,t.jsx)(c,{acidConcentration:b,baseConcentration:j,acidType:C,baseType:A,indicatorType:L,dripSpeed:N,isDripping:l,manualDripTrigger:H,onDataChange:s},`titration-${v}`)}),(0,t.jsx)(m.SimulationController,{isPlaying:l,onPlayPause:()=>d(e=>!e),onReset:()=>{y(e=>e+1),d(!1),g(.5),U(0)},speed:x,onSpeedChange:g}),(0,t.jsx)(f.FloatingControlPanel,{title:"⚗️ Titration Controls",initialPosition:{x:20,y:80},children:B}),(0,t.jsx)(p.DataPanel,{isVisible:a,onToggle:()=>o(!a),children:O})]})}],16443)}]);
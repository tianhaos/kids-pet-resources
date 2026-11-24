(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,i;var r=e.i(31067),a=e.i(71645),s=e.i(90072),n=e.i(48546),o=s,l=s;let c=new l.Box3,d=new l.Vector3;class u extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(i,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let r=new l.InstancedInterleavedBuffer(i,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(r,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(r,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),c.setFromBufferAttribute(t),this.boundingBox.union(c))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let r=0;for(let a=0,s=e.count;a<s;a++)d.fromBufferAttribute(e,a),r=Math.max(r,i.distanceToSquared(d)),d.fromBufferAttribute(t,a),r=Math.max(r,i.distanceToSquared(d));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var h=s,f=e.i(8560),m=e.i(31497);class p extends h.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:h.UniformsUtils.clone(h.UniformsUtils.merge([f.UniformsLib.common,f.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new h.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let x=m.version>=125?"uv1":"uv2",g=new o.Vector4,y=new o.Vector3,v=new o.Vector3,b=new o.Vector4,w=new o.Vector4,S=new o.Vector4,j=new o.Vector3,M=new o.Matrix4,E=new o.Line3,A=new o.Vector3,C=new o.Box3,L=new o.Sphere,_=new o.Vector4;function U(e,t,r){return _.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),_.multiplyScalar(1/_.w),_.x=i/r.width,_.y=i/r.height,_.applyMatrix4(e.projectionMatrixInverse),_.multiplyScalar(1/_.w),Math.abs(Math.max(_.x,_.y))}class z extends o.Mesh{constructor(e=new u,t=new p({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,a=0,s=t.count;e<s;e++,a+=2)y.fromBufferAttribute(t,e),v.fromBufferAttribute(i,e),r[a]=0===a?0:r[a-1],r[a+1]=r[a]+y.distanceTo(v);let a=new o.InstancedInterleavedBuffer(r,2,1);return e.setAttribute("instanceDistanceStart",new o.InterleavedBufferAttribute(a,1,0)),e.setAttribute("instanceDistanceEnd",new o.InterleavedBufferAttribute(a,1,1)),this}raycast(e,r){let a,s,n=this.material.worldUnits,l=e.camera;null!==l||n||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let d=this.matrixWorld,u=this.geometry,h=this.material;if(i=h.linewidth+c,null===u.boundingSphere&&u.computeBoundingSphere(),L.copy(u.boundingSphere).applyMatrix4(d),n)a=.5*i;else{let e=Math.max(l.near,L.distanceToPoint(t.origin));a=U(l,e,h.resolution)}if(L.radius+=a,!1!==t.intersectsSphere(L)){if(null===u.boundingBox&&u.computeBoundingBox(),C.copy(u.boundingBox).applyMatrix4(d),n)s=.5*i;else{let e=Math.max(l.near,C.distanceToPoint(t.origin));s=U(l,e,h.resolution)}C.expandByScalar(s),!1!==t.intersectsBox(C)&&(n?function(e,r){let a=e.matrixWorld,s=e.geometry,n=s.attributes.instanceStart,l=s.attributes.instanceEnd,c=Math.min(s.instanceCount,n.count);for(let s=0;s<c;s++){E.start.fromBufferAttribute(n,s),E.end.fromBufferAttribute(l,s),E.applyMatrix4(a);let c=new o.Vector3,d=new o.Vector3;t.distanceSqToSegment(E.start,E.end,d,c),d.distanceTo(c)<.5*i&&r.push({point:d,pointOnLine:c,distance:t.origin.distanceTo(d),object:e,face:null,faceIndex:s,uv:null,[x]:null})}}(this,r):function(e,r,a){let s=r.projectionMatrix,n=e.material.resolution,l=e.matrixWorld,c=e.geometry,d=c.attributes.instanceStart,u=c.attributes.instanceEnd,h=Math.min(c.instanceCount,d.count),f=-r.near;t.at(1,S),S.w=1,S.applyMatrix4(r.matrixWorldInverse),S.applyMatrix4(s),S.multiplyScalar(1/S.w),S.x*=n.x/2,S.y*=n.y/2,S.z=0,j.copy(S),M.multiplyMatrices(r.matrixWorldInverse,l);for(let r=0;r<h;r++){if(b.fromBufferAttribute(d,r),w.fromBufferAttribute(u,r),b.w=1,w.w=1,b.applyMatrix4(M),w.applyMatrix4(M),b.z>f&&w.z>f)continue;if(b.z>f){let e=b.z-w.z,t=(b.z-f)/e;b.lerp(w,t)}else if(w.z>f){let e=w.z-b.z,t=(w.z-f)/e;w.lerp(b,t)}b.applyMatrix4(s),w.applyMatrix4(s),b.multiplyScalar(1/b.w),w.multiplyScalar(1/w.w),b.x*=n.x/2,b.y*=n.y/2,w.x*=n.x/2,w.y*=n.y/2,E.start.copy(b),E.start.z=0,E.end.copy(w),E.end.z=0;let c=E.closestPointToPointParameter(j,!0);E.at(c,A);let h=o.MathUtils.lerp(b.z,w.z,c),m=h>=-1&&h<=1,p=j.distanceTo(A)<.5*i;if(m&&p){E.start.fromBufferAttribute(d,r),E.end.fromBufferAttribute(u,r),E.start.applyMatrix4(l),E.end.applyMatrix4(l);let i=new o.Vector3,s=new o.Vector3;t.distanceSqToSegment(E.start,E.end,s,i),a.push({point:s,pointOnLine:i,distance:t.origin.distanceTo(s),object:e,face:null,faceIndex:r,uv:null,[x]:null})}}}(this,l,r))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(g),this.material.uniforms.resolution.value.set(g.z,g.w))}}class P extends u{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let r=0;r<t;r+=3)i[2*r]=e[r],i[2*r+1]=e[r+1],i[2*r+2]=e[r+2],i[2*r+3]=e[r+3],i[2*r+4]=e[r+4],i[2*r+5]=e[r+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,r=new Float32Array(2*i);if(3===t)for(let a=0;a<i;a+=t)r[2*a]=e[a],r[2*a+1]=e[a+1],r[2*a+2]=e[a+2],r[2*a+3]=e[a+3],r[2*a+4]=e[a+4],r[2*a+5]=e[a+5];else for(let a=0;a<i;a+=t)r[2*a]=e[a],r[2*a+1]=e[a+1],r[2*a+2]=e[a+2],r[2*a+3]=e[a+3],r[2*a+4]=e[a+4],r[2*a+5]=e[a+5],r[2*a+6]=e[a+6],r[2*a+7]=e[a+7];return super.setColors(r,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class B extends z{constructor(e=new P,t=new p({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let D=a.forwardRef(function({points:e,color:t=0xffffff,vertexColors:i,linewidth:o,lineWidth:l,segments:c,dashed:d,...h},f){var m,x;let g=(0,n.useThree)(e=>e.size),y=a.useMemo(()=>c?new z:new B,[c]),[v]=a.useState(()=>new p),b=(null==i||null==(m=i[0])?void 0:m.length)===4?4:3,w=a.useMemo(()=>{let r=c?new u:new P,a=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Vector3||e instanceof s.Vector4?[e.x,e.y,e.z]:e instanceof s.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(r.setPositions(a.flat()),i){t=0xffffff;let e=i.map(e=>e instanceof s.Color?e.toArray():e);r.setColors(e.flat(),b)}return r},[e,c,i,b]);return a.useLayoutEffect(()=>{y.computeLineDistances()},[e,y]),a.useLayoutEffect(()=>{d?v.defines.USE_DASH="":delete v.defines.USE_DASH,v.needsUpdate=!0},[d,v]),a.useEffect(()=>()=>{w.dispose(),v.dispose()},[w]),a.createElement("primitive",(0,r.default)({object:y,ref:f},h),a.createElement("primitive",{object:w,attach:"geometry"}),a.createElement("primitive",(0,r.default)({object:v,attach:"material",color:t,vertexColors:!!i,resolution:[g.width,g.height],linewidth:null!=(x=null!=o?o:l)?x:1,dashed:d,transparent:4===b},h)))});e.s(["Line",0,D],43216)},56420,e=>{"use strict";var t=e.i(71645);let i=(...e)=>e.filter((e,t,i)=>!!e&&""!==e.trim()&&i.indexOf(e)===t).join(" ").trim(),r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,i)=>i?i.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var a={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,t.createContext)({}),n=(0,t.forwardRef)(({color:e,size:r,strokeWidth:n,absoluteStrokeWidth:o,className:l="",children:c,iconNode:d,...u},h)=>{let{size:f=24,strokeWidth:m=2,absoluteStrokeWidth:p=!1,color:x="currentColor",className:g=""}=(0,t.useContext)(s)??{},y=o??p?24*Number(n??m)/Number(r??f):n??m;return(0,t.createElement)("svg",{ref:h,...a,width:r??f??a.width,height:r??f??a.height,stroke:e??x,strokeWidth:y,className:i("lucide",g,l),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,i])=>(0,t.createElement)(e,i)),...Array.isArray(c)?c:[c]])});e.s(["default",0,(e,a)=>{let s=(0,t.forwardRef)(({className:s,...o},l)=>(0,t.createElement)(n,{ref:l,iconNode:a,className:i(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...o}));return s.displayName=r(e),s}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,i)=>{t.exports=e.r(76562)},83161,e=>{"use strict";var t=e.i(43476),i=e.i(71645),r=e.i(92989),a=e.i(94800),s=e.i(43216),n=e.i(16196),o=e.i(90072);function l(e,t,i,r,a){let s=e=>{let a=Math.sqrt(e.vx*e.vx+e.vy*e.vy),s=i>0?i/r*a:0;return{x:e.vx,y:e.vy,vx:-s*e.vx,vy:-t-s*e.vy}},n=s(e),o=s({x:e.x+n.x*a*.5,y:e.y+n.y*a*.5,vx:e.vx+n.vx*a*.5,vy:e.vy+n.vy*a*.5}),l=s({x:e.x+o.x*a*.5,y:e.y+o.y*a*.5,vx:e.vx+o.vx*a*.5,vy:e.vy+o.vy*a*.5}),c=s({x:e.x+l.x*a,y:e.y+l.y*a,vx:e.vx+l.vx*a,vy:e.vy+l.vy*a});return{x:e.x+a/6*(n.x+2*o.x+2*l.x+c.x),y:e.y+a/6*(n.y+2*o.y+2*l.y+c.y),vx:e.vx+a/6*(n.vx+2*o.vx+2*l.vx+c.vx),vy:e.vy+a/6*(n.vy+2*o.vy+2*l.vy+c.vy)}}function c({onDataChange:e,velocity:r=30,angle:h=45,gravity:f=9.81,mass:m=1,airResistance:p=!1,dragCoefficient:x=.02,targetDistance:g=50,showTrail:y=!0,showPrediction:v=!0,showVelocityVector:b=!0,showGhostMarkers:w=!0,showDistanceMarkers:S=!0,resetTrigger:j,isPlaying:M=!0,simulationSpeed:E=1}){let A=(0,i.useRef)(null),C=(0,i.useRef)(null),L=(0,i.useRef)(null),_=(0,i.useRef)(null),U=(0,i.useRef)([]),z=(0,i.useRef)({launched:!1,state:{x:0,y:0,vx:0,vy:0},time:0,maxHeight:0,ghostTimer:0,ghostCount:0,lastDataUpdate:0}),[P,B]=(0,i.useState)(!1),D=h*Math.PI/180,N=(0,i.useMemo)(()=>{if(!v)return[];let e=[],t=2*r*Math.sin(D)/f;for(let i=0;i<=100;i++){let a=i/100*t,s=r*Math.cos(D)*a,n=r*Math.sin(D)*a-.5*f*a*a;e.push([s,Math.max(n,0)+.5,0])}return e},[r,D,f,v]),T=r*r*Math.sin(2*D)/f,O=r*r*Math.sin(D)*Math.sin(D)/(2*f),R=2*r*Math.sin(D)/f,G=(0,i.useMemo)(()=>{let e=[];for(let t=0;t<=20;t++){let i=t/20*D;e.push([3*Math.cos(Math.PI/2-i),3*Math.sin(Math.PI/2-i)+.5,0])}return e},[D]);return(0,i.useEffect)(()=>{if(void 0!==j&&j>0){let e=h*Math.PI/180;if(z.current={launched:!0,state:{x:0,y:0,vx:r*Math.cos(e),vy:r*Math.sin(e)},time:0,maxHeight:0,ghostTimer:0,ghostCount:0,lastDataUpdate:0},U.current=[],B(!1),A.current&&A.current.position.set(0,.5,0),_.current){let e=new o.Object3D;e.position.set(0,-1e3,0);for(let t=0;t<30;t++)e.updateMatrix(),_.current.setMatrixAt(t,e.matrix);_.current.instanceMatrix.needsUpdate=!0}}},[j,h,r]),(0,a.useFrame)((t,i)=>{let a=Math.min(i,.02),s=a*E,n=z.current;if(L.current){let e=L.current.children[2];e&&(e.rotation.z=D)}if(n.launched&&M&&s>0){if(n.time+=s,p){let e=Math.max(1,Math.ceil(s/.004)),t=s/e;for(let i=0;i<e;i++)n.state=l(n.state,f,x,m,t)}else{let e=n.time;n.state.x=r*Math.cos(D)*e,n.state.y=r*Math.sin(D)*e-.5*f*e*e,n.state.vx=r*Math.cos(D),n.state.vy=r*Math.sin(D)-f*e}let t=n.state.x,i=Math.max(0,n.state.y);if(n.maxHeight=Math.max(n.maxHeight,i),A.current&&(A.current.position.set(t,i+.5,0),Math.sqrt(n.state.vx*n.state.vx+n.state.vy*n.state.vy)>.1&&(A.current.rotation.z=-Math.atan2(n.state.vy,n.state.vx))),y&&(U.current.push([t,i+.5,0]),U.current.length>500&&U.current.shift()),w&&(n.ghostTimer+=s,n.ghostTimer>=.5&&(n.ghostTimer-=.5,n.ghostCount<30&&n.ghostCount++)),_.current&&w){let e=new o.Object3D;for(let t=0;t<n.ghostCount;t++){let i,a,s=(t+1)*.5;if(p){let e={x:0,y:0,vx:r*Math.cos(D),vy:r*Math.sin(D)},t=Math.max(1,Math.ceil(s/.004)),n=s/t;for(let i=0;i<t;i++)e=l(e,f,x,m,n);i=e.x,a=Math.max(0,e.y)}else i=r*Math.cos(D)*s,a=Math.max(0,r*Math.sin(D)*s-.5*f*s*s);e.position.set(i,a+.5,0),e.updateMatrix(),_.current.setMatrixAt(t,e.matrix)}for(let t=n.ghostCount;t<30;t++)e.position.set(0,-1e3,0),e.updateMatrix(),_.current.setMatrixAt(t,e.matrix);_.current.instanceMatrix.needsUpdate=!0}if(C.current&&b){C.current.position.set(t,i+.5,0);let e=Math.atan2(n.state.vy,n.state.vx),r=Math.sqrt(n.state.vx*n.state.vx+n.state.vy*n.state.vy);C.current.rotation.z=e-Math.PI/2,C.current.scale.set(1,Math.max(.15*r,.1),1),C.current.visible=r>.5}if(!P&&2>Math.abs(t-g)&&i<2&&B(!0),n.state.y<=0&&n.time>.1&&(n.launched=!1),n.lastDataUpdate+=a,n.lastDataUpdate>=.166){n.lastDataUpdate=0;let r=Math.sqrt(n.state.vx*n.state.vx+n.state.vy*n.state.vy),a=.5*m*r*r,s=m*f*i,o=n.state.y<=0?r:0,l=n.state.y<=0?Math.abs(180*Math.atan2(n.state.vy,n.state.vx)/Math.PI):0;e?.({currentX:t,currentY:i,velocityX:n.state.vx,velocityY:n.state.vy,speed:r,flightTime:n.time,maxHeight:n.maxHeight,range:t,predictedRange:T,predictedMaxHeight:O,predictedTimeOfFlight:R,kineticEnergy:a,potentialEnergy:s,hasLanded:!n.launched,impactVelocity:o,impactAngle:l})}}}),(0,t.jsxs)("group",{children:[(0,t.jsx)("ambientLight",{intensity:.5}),(0,t.jsx)("directionalLight",{position:[30,40,20],intensity:1,castShadow:!0,"shadow-mapSize":[2048,2048],"shadow-camera-far":200,"shadow-camera-left":-100,"shadow-camera-right":100,"shadow-camera-top":50,"shadow-camera-bottom":-10}),(0,t.jsx)("hemisphereLight",{args:["#87ceeb","#3d2b1f",.3]}),(0,t.jsxs)("mesh",{rotation:[-Math.PI/2,0,0],position:[60,-.01,0],receiveShadow:!0,children:[(0,t.jsx)("planeGeometry",{args:[300,150]}),(0,t.jsx)("meshStandardMaterial",{color:"#1a2a1a",roughness:.95})]}),(0,t.jsx)("gridHelper",{args:[300,150,"#2a4a2a","#1a3a1a"],position:[60,.01,0]}),(0,t.jsxs)("mesh",{position:[60,-10,0],children:[(0,t.jsx)("sphereGeometry",{args:[400,32,32]}),(0,t.jsx)("meshBasicMaterial",{color:"#0a0a2e",side:o.BackSide})]}),[30,60,100,150].map((e,i)=>(0,t.jsxs)("mesh",{position:[e,-2,-20-5*i],children:[(0,t.jsx)("coneGeometry",{args:[15+5*i,8+3*i,6]}),(0,t.jsx)("meshStandardMaterial",{color:`rgb(${20+5*i}, ${40+8*i}, ${20+5*i})`})]},i)),S&&Array.from({length:15}).map((e,i)=>{let r=(i+1)*10;return(0,t.jsxs)("group",{position:[r,0,-4],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("boxGeometry",{args:[.08,.5,.5]}),(0,t.jsx)("meshStandardMaterial",{color:"#3a3a5a"})]}),(0,t.jsx)(n.Text,{position:[0,.8,0],fontSize:.5,color:"#6a6a8a",anchorX:"center",anchorY:"middle",children:`${r}m`})]},i)}),Array.from({length:8}).map((e,i)=>{let r=(i+1)*5;return(0,t.jsxs)("group",{position:[-2,r,0],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("boxGeometry",{args:[1,.06,.06]}),(0,t.jsx)("meshStandardMaterial",{color:"#2a2a4a"})]}),(0,t.jsx)(n.Text,{position:[-.8,0,0],fontSize:.35,color:"#4a4a6a",anchorX:"center",children:`${r}m`})]},i)}),(0,t.jsxs)("group",{ref:L,position:[0,0,0],children:[(0,t.jsxs)("mesh",{position:[0,.15,0],castShadow:!0,receiveShadow:!0,children:[(0,t.jsx)("cylinderGeometry",{args:[1.8,2.2,.3,32]}),(0,t.jsx)("meshStandardMaterial",{color:"#2a2a3a",metalness:.7,roughness:.3})]}),(0,t.jsxs)("mesh",{position:[0,.32,0],children:[(0,t.jsx)("torusGeometry",{args:[1.5,.08,8,32]}),(0,t.jsx)("meshStandardMaterial",{color:"#3a3a4a",metalness:.8,roughness:.2})]}),(0,t.jsxs)("group",{rotation:[0,0,D],children:[(0,t.jsxs)("mesh",{position:[1,0,0],castShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[2,.35,.5]}),(0,t.jsx)("meshStandardMaterial",{color:"#3a3a4a",metalness:.6,roughness:.4})]}),(0,t.jsxs)("mesh",{position:[2,0,0],rotation:[0,0,Math.PI/2],castShadow:!0,children:[(0,t.jsx)("cylinderGeometry",{args:[.12,.15,1.8,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#4a4a5a",metalness:.85,roughness:.15})]}),(0,t.jsxs)("mesh",{position:[3,0,0],rotation:[0,0,Math.PI/2],children:[(0,t.jsx)("cylinderGeometry",{args:[.1,.12,.4,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#5a5a6a",metalness:.9,roughness:.1})]}),(0,t.jsxs)("mesh",{position:[3.3,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[.12,8,8]}),(0,t.jsx)("meshBasicMaterial",{color:"#22c55e"})]})]}),(0,t.jsxs)("mesh",{position:[-1.2,.5,0],castShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[.5,.4,.35]}),(0,t.jsx)("meshStandardMaterial",{color:"#2a2a3a",metalness:.5,roughness:.5})]}),(0,t.jsxs)("mesh",{position:[-1.2,.75,0],children:[(0,t.jsx)("sphereGeometry",{args:[.06,8,8]}),(0,t.jsx)("meshBasicMaterial",{color:"#22c55e"})]})]}),v&&G.length>0&&(0,t.jsx)(s.Line,{points:G,color:"#f59e0b",lineWidth:2,opacity:.7}),(0,t.jsxs)("mesh",{ref:A,position:[0,.5,0],castShadow:!0,children:[(0,t.jsx)("sphereGeometry",{args:[.35,32,32]}),(0,t.jsx)("meshStandardMaterial",{color:"#ef4444",metalness:.85,roughness:.15,emissive:"#ef4444",emissiveIntensity:.2})]}),b&&(0,t.jsx)("group",{ref:C,children:(0,t.jsx)(d,{color:"#22c55e",label:"v"})}),v&&N.length>0&&(0,t.jsx)(s.Line,{points:N,color:"#4ade80",lineWidth:2,dashed:!0,dashSize:.5,gapSize:.3,opacity:.5}),y&&U.current.length>1&&(0,t.jsx)(s.Line,{points:U.current,color:"#60a5fa",lineWidth:3,opacity:.8}),w&&(0,t.jsx)("instancedMesh",{ref:_,args:[new o.SphereGeometry(.2,8,8),new o.MeshBasicMaterial({color:"#ffffff",transparent:!0,opacity:.4}),30],position:[0,0,0]}),(0,t.jsx)(u,{position:[g,0,0],isHit:P})]})}function d({color:e,label:i}){return(0,t.jsxs)("group",{children:[(0,t.jsxs)("mesh",{position:[0,-1,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.05,.05,2,8]}),(0,t.jsx)("meshStandardMaterial",{color:e,emissive:e,emissiveIntensity:.5})]}),(0,t.jsxs)("mesh",{position:[0,0,0],children:[(0,t.jsx)("coneGeometry",{args:[.12,.35,8]}),(0,t.jsx)("meshStandardMaterial",{color:e,emissive:e,emissiveIntensity:.5})]})]})}function u({position:e,isHit:i}){return(0,t.jsxs)("group",{position:e,children:[(0,t.jsxs)("mesh",{position:[0,.1,0],receiveShadow:!0,children:[(0,t.jsx)("cylinderGeometry",{args:[1.2,1.8,.2,32]}),(0,t.jsx)("meshStandardMaterial",{color:"#2a2a3a",metalness:.5,roughness:.5})]}),(0,t.jsxs)("mesh",{position:[0,3,0],castShadow:!0,children:[(0,t.jsx)("cylinderGeometry",{args:[.12,.12,6,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#3a3a4a",metalness:.6,roughness:.4})]}),(0,t.jsxs)("group",{position:[0,6.2,0],children:[[1.5,1.2,.9,.6,.3].map((e,i)=>(0,t.jsxs)("mesh",{rotation:[-Math.PI/2,0,0],children:[(0,t.jsx)("ringGeometry",{args:[e-.15,e,32]}),(0,t.jsx)("meshBasicMaterial",{color:["#ffffff","#ff0000","#ffffff","#ff0000","#ffcc00"][i]})]},i)),i&&(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.5,16,16]}),(0,t.jsx)("meshBasicMaterial",{color:"#22c55e",transparent:!0,opacity:.6,blending:o.AdditiveBlending})]})]}),(0,t.jsx)(n.Text,{position:[0,7.5,0],fontSize:.5,color:"#6a6a8a",anchorX:"center",children:`${e[0]}m`})]})}e.i(81413);var h=e.i(48205),f=e.i(82192),m=e.i(14228),p=e.i(4685),x=e.i(68647);let g=[{label:"Earth",value:9.81,emoji:"🌍"},{label:"Moon",value:1.62,emoji:"🌙"},{label:"Mars",value:3.72,emoji:"🔴"},{label:"Jupiter",value:24.79,emoji:"🟠"}];e.s(["default",0,function(){let e=(0,r.useRouter)(),[a,s]=(0,i.useState)(null),[n,o]=(0,i.useState)(!0),[l,d]=(0,i.useState)({velocity:30,angle:45,gravity:9.81,mass:1,airResistance:!1,dragCoefficient:.02,targetDistance:50,showTrail:!0,showPrediction:!0,showVelocityVector:!0,showGhostMarkers:!0,showDistanceMarkers:!0}),[u,y]=(0,i.useState)(0),[v,b]=(0,i.useState)(!0),[w,S]=(0,i.useState)(1),[j,M]=(0,i.useState)(!1),[E,A]=(0,i.useState)(0),C=()=>{M(!1),y(e=>e+1),b(!0),S(1),s(null),A(0)},L=(e,t)=>{d(i=>({...i,[e]:t}))},_=(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsx)(x.ControlGroup,{title:"Launch Controls",children:(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)("button",{onClick:()=>{M(!0),y(e=>e+1),b(!0),A(0)},disabled:j,className:"flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold rounded-lg transition-all shadow-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed",children:"🚀 Launch"}),(0,t.jsx)("button",{onClick:C,className:"flex-1 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-lg transition-all shadow-lg text-sm",children:"🔄 Reset"})]})}),(0,t.jsxs)(x.ControlGroup,{title:"Physics Parameters",children:[(0,t.jsx)(x.ControlSlider,{label:"Velocity (v₀)",value:l.velocity,unit:"m/s",min:5,max:80,step:1,color:"#a855f7",onChange:e=>L("velocity",e),disabled:j}),(0,t.jsx)(x.ControlSlider,{label:"Angle (θ)",value:l.angle,unit:"°",min:5,max:85,step:1,color:"#ec4899",onChange:e=>L("angle",e),decimals:0,disabled:j}),(0,t.jsx)(x.ControlSlider,{label:"Mass (m)",value:l.mass,unit:"kg",min:.1,max:10,step:.1,color:"#3b82f6",onChange:e=>L("mass",e)}),(0,t.jsxs)("div",{className:"mt-2 space-y-2",children:[(0,t.jsxs)("div",{className:"flex justify-between text-sm",children:[(0,t.jsx)("span",{className:"text-gray-700",children:"Gravity (g)"}),(0,t.jsxs)("span",{className:"font-mono text-green-600",children:[l.gravity.toFixed(2)," m/s²"]})]}),(0,t.jsx)("input",{type:"range",min:"0.5",max:"26",step:"0.01",value:l.gravity,onChange:e=>L("gravity",parseFloat(e.target.value)),className:"w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer touch-none",style:{accentColor:"#22c55e"}}),(0,t.jsx)("div",{className:"flex flex-wrap gap-1.5 mt-1",children:g.map(e=>(0,t.jsxs)("button",{onClick:()=>L("gravity",e.value),className:`px-2 py-1 text-xs rounded-md border transition-all ${.05>Math.abs(l.gravity-e.value)?"bg-green-600/30 border-green-500 text-green-700":"bg-gray-200/50 border-gray-300 text-gray-600 hover:border-gray-400"}`,children:[e.emoji," ",e.label]},e.label))})]})]}),(0,t.jsxs)(x.ControlGroup,{title:"Environment",children:[(0,t.jsxs)("label",{className:"flex items-center justify-between text-sm text-gray-700 cursor-pointer py-2 px-3 bg-gray-100/50 rounded-lg border border-gray-300/50",children:[(0,t.jsx)("span",{children:"Air Resistance (F ∝ v²)"}),(0,t.jsx)("input",{type:"checkbox",checked:l.airResistance,onChange:e=>L("airResistance",e.target.checked),className:"w-4 h-4 rounded accent-purple-500",disabled:j})]}),l.airResistance&&(0,t.jsx)(x.ControlSlider,{label:"Drag Coefficient",value:l.dragCoefficient,unit:"",min:.001,max:.15,step:.001,color:"#f59e0b",onChange:e=>L("dragCoefficient",e),decimals:3,disabled:j}),(0,t.jsx)(x.ControlSlider,{label:"Target Distance",value:l.targetDistance,unit:"m",min:10,max:150,step:5,color:"#f97316",onChange:e=>L("targetDistance",e),decimals:0})]}),(0,t.jsx)(x.ControlGroup,{title:"Display Options",children:[{label:"Trajectory Trail",key:"showTrail"},{label:"Predicted Path",key:"showPrediction"},{label:"Velocity Vector",key:"showVelocityVector"},{label:"Ghost Markers (0.5s)",key:"showGhostMarkers"},{label:"Distance Markers",key:"showDistanceMarkers"}].map(e=>(0,t.jsxs)("label",{className:"flex items-center justify-between text-sm text-gray-700 cursor-pointer py-2 px-3 bg-gray-100/50 rounded-lg border border-gray-300/50",children:[(0,t.jsx)("span",{children:e.label}),(0,t.jsx)("input",{type:"checkbox",checked:l[e.key],onChange:t=>L(e.key,t.target.checked),className:"w-4 h-4 rounded accent-purple-500"})]},e.key))}),(0,t.jsx)("button",{onClick:()=>e.push("/experiments/projectile-motion/details"),className:"w-full py-2.5 bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 text-green-700 font-medium text-sm rounded-lg transition-all border border-green-300/50 flex items-center justify-center gap-2",children:"📖 View Experiment Details"})]}),U=a?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(x.DataGrid,{data:{posX:{value:a.currentX,unit:"m",color:"#a855f7"},posY:{value:a.currentY,unit:"m",color:"#ec4899"},speed:{value:a.speed,unit:"m/s",color:"#22c55e"},time:{value:a.flightTime,unit:"s",color:"#06d6a0"},maxH:{value:a.maxHeight,unit:"m",color:"#f59e0b"},range:{value:a.range,unit:"m",color:"#818cf8"}},columns:2}),(0,t.jsxs)("div",{className:"mt-3 pt-3 border-t border-gray-300 grid grid-cols-2 gap-2 text-xs",children:[(0,t.jsxs)("div",{className:"p-2 bg-gray-100/50 rounded",children:[(0,t.jsx)("span",{className:"text-gray-600",children:"Kinetic Energy"}),(0,t.jsxs)("div",{className:"font-mono text-orange-600",children:[a.kineticEnergy.toFixed(1)," J"]})]}),(0,t.jsxs)("div",{className:"p-2 bg-gray-100/50 rounded",children:[(0,t.jsx)("span",{className:"text-gray-600",children:"Potential Energy"}),(0,t.jsxs)("div",{className:"font-mono text-blue-600",children:[a.potentialEnergy.toFixed(1)," J"]})]})]}),a.hasLanded&&(0,t.jsxs)("div",{className:"mt-2 p-2 bg-green-900/30 border border-green-500/30 rounded-lg text-xs space-y-1",children:[(0,t.jsx)("div",{className:"text-green-400 font-semibold",children:"✅ Landed!"}),(0,t.jsxs)("div",{className:"flex justify-between text-gray-400",children:[(0,t.jsx)("span",{children:"Range:"}),(0,t.jsxs)("span",{className:"font-mono text-purple-300",children:[a.range.toFixed(1)," m"]})]}),(0,t.jsxs)("div",{className:"flex justify-between text-gray-400",children:[(0,t.jsx)("span",{children:"Predicted:"}),(0,t.jsxs)("span",{className:"font-mono text-pink-300",children:[a.predictedRange.toFixed(1)," m"]})]}),a.impactVelocity>0&&(0,t.jsxs)("div",{className:"flex justify-between text-gray-400",children:[(0,t.jsx)("span",{children:"Impact speed:"}),(0,t.jsxs)("span",{className:"font-mono text-red-300",children:[a.impactVelocity.toFixed(1)," m/s @ ",a.impactAngle.toFixed(0),"°"]})]})]})]}):(0,t.jsx)("div",{className:"text-center text-gray-500 text-sm py-8",children:j?"Waiting for simulation data...":"Press Launch to begin"});return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(h.ExperimentContainer,{title:"Projectile Motion",description:"Study parabolic trajectories under gravity with realistic air resistance and target practice",cameraPosition:[70,40,70],backgroundColor:"#050510",controls:null,dataPanel:null,children:(0,t.jsx)(c,{onDataChange:s,velocity:l.velocity,angle:l.angle,gravity:l.gravity,mass:l.mass,airResistance:l.airResistance,dragCoefficient:l.dragCoefficient,targetDistance:l.targetDistance,showTrail:l.showTrail,showPrediction:l.showPrediction,showVelocityVector:l.showVelocityVector,showGhostMarkers:l.showGhostMarkers,showDistanceMarkers:l.showDistanceMarkers,resetTrigger:u,isPlaying:v,simulationSpeed:w})}),(0,t.jsx)(m.SimulationController,{isPlaying:v,onPlayPause:()=>b(e=>!e),onReset:C,speed:w,onSpeedChange:S,timeElapsed:E}),(0,t.jsx)(f.FloatingControlPanel,{title:"🎯 Projectile Parameters",initialPosition:{x:20,y:80},children:_}),(0,t.jsx)(p.DataPanel,{isVisible:n,onToggle:()=>o(!n),children:U})]})}],83161)}]);
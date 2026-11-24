(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,i;var n=e.i(31067),r=e.i(71645),s=e.i(90072),a=e.i(48546),o=s,l=s;let c=new l.Box3,d=new l.Vector3;class f extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(i,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let n=new l.InstancedInterleavedBuffer(i,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(n,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),c.setFromBufferAttribute(t),this.boundingBox.union(c))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let r=0,s=e.count;r<s;r++)d.fromBufferAttribute(e,r),n=Math.max(n,i.distanceToSquared(d)),d.fromBufferAttribute(t,r),n=Math.max(n,i.distanceToSquared(d));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var u=s,h=e.i(8560),p=e.i(31497);class m extends u.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:u.UniformsUtils.clone(u.UniformsUtils.merge([h.UniformsLib.common,h.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new u.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let x=p.version>=125?"uv1":"uv2",g=new o.Vector4,v=new o.Vector3,y=new o.Vector3,b=new o.Vector4,S=new o.Vector4,w=new o.Vector4,A=new o.Vector3,j=new o.Matrix4,E=new o.Line3,L=new o.Vector3,M=new o.Box3,_=new o.Sphere,C=new o.Vector4;function U(e,t,n){return C.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),C.multiplyScalar(1/C.w),C.x=i/n.width,C.y=i/n.height,C.applyMatrix4(e.projectionMatrixInverse),C.multiplyScalar(1/C.w),Math.abs(Math.max(C.x,C.y))}class z extends o.Mesh{constructor(e=new f,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let e=0,r=0,s=t.count;e<s;e++,r+=2)v.fromBufferAttribute(t,e),y.fromBufferAttribute(i,e),n[r]=0===r?0:n[r-1],n[r+1]=n[r]+v.distanceTo(y);let r=new o.InstancedInterleavedBuffer(n,2,1);return e.setAttribute("instanceDistanceStart",new o.InterleavedBufferAttribute(r,1,0)),e.setAttribute("instanceDistanceEnd",new o.InterleavedBufferAttribute(r,1,1)),this}raycast(e,n){let r,s,a=this.material.worldUnits,l=e.camera;null!==l||a||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let d=this.matrixWorld,f=this.geometry,u=this.material;if(i=u.linewidth+c,null===f.boundingSphere&&f.computeBoundingSphere(),_.copy(f.boundingSphere).applyMatrix4(d),a)r=.5*i;else{let e=Math.max(l.near,_.distanceToPoint(t.origin));r=U(l,e,u.resolution)}if(_.radius+=r,!1!==t.intersectsSphere(_)){if(null===f.boundingBox&&f.computeBoundingBox(),M.copy(f.boundingBox).applyMatrix4(d),a)s=.5*i;else{let e=Math.max(l.near,M.distanceToPoint(t.origin));s=U(l,e,u.resolution)}M.expandByScalar(s),!1!==t.intersectsBox(M)&&(a?function(e,n){let r=e.matrixWorld,s=e.geometry,a=s.attributes.instanceStart,l=s.attributes.instanceEnd,c=Math.min(s.instanceCount,a.count);for(let s=0;s<c;s++){E.start.fromBufferAttribute(a,s),E.end.fromBufferAttribute(l,s),E.applyMatrix4(r);let c=new o.Vector3,d=new o.Vector3;t.distanceSqToSegment(E.start,E.end,d,c),d.distanceTo(c)<.5*i&&n.push({point:d,pointOnLine:c,distance:t.origin.distanceTo(d),object:e,face:null,faceIndex:s,uv:null,[x]:null})}}(this,n):function(e,n,r){let s=n.projectionMatrix,a=e.material.resolution,l=e.matrixWorld,c=e.geometry,d=c.attributes.instanceStart,f=c.attributes.instanceEnd,u=Math.min(c.instanceCount,d.count),h=-n.near;t.at(1,w),w.w=1,w.applyMatrix4(n.matrixWorldInverse),w.applyMatrix4(s),w.multiplyScalar(1/w.w),w.x*=a.x/2,w.y*=a.y/2,w.z=0,A.copy(w),j.multiplyMatrices(n.matrixWorldInverse,l);for(let n=0;n<u;n++){if(b.fromBufferAttribute(d,n),S.fromBufferAttribute(f,n),b.w=1,S.w=1,b.applyMatrix4(j),S.applyMatrix4(j),b.z>h&&S.z>h)continue;if(b.z>h){let e=b.z-S.z,t=(b.z-h)/e;b.lerp(S,t)}else if(S.z>h){let e=S.z-b.z,t=(S.z-h)/e;S.lerp(b,t)}b.applyMatrix4(s),S.applyMatrix4(s),b.multiplyScalar(1/b.w),S.multiplyScalar(1/S.w),b.x*=a.x/2,b.y*=a.y/2,S.x*=a.x/2,S.y*=a.y/2,E.start.copy(b),E.start.z=0,E.end.copy(S),E.end.z=0;let c=E.closestPointToPointParameter(A,!0);E.at(c,L);let u=o.MathUtils.lerp(b.z,S.z,c),p=u>=-1&&u<=1,m=A.distanceTo(L)<.5*i;if(p&&m){E.start.fromBufferAttribute(d,n),E.end.fromBufferAttribute(f,n),E.start.applyMatrix4(l),E.end.applyMatrix4(l);let i=new o.Vector3,s=new o.Vector3;t.distanceSqToSegment(E.start,E.end,s,i),r.push({point:s,pointOnLine:i,distance:t.origin.distanceTo(s),object:e,face:null,faceIndex:n,uv:null,[x]:null})}}}(this,l,n))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(g),this.material.uniforms.resolution.value.set(g.z,g.w))}}class B extends f{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,n=new Float32Array(2*i);if(3===t)for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];else for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5],n[2*r+6]=e[r+6],n[2*r+7]=e[r+7];return super.setColors(n,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class P extends z{constructor(e=new B,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let O=r.forwardRef(function({points:e,color:t=0xffffff,vertexColors:i,linewidth:o,lineWidth:l,segments:c,dashed:d,...u},h){var p,x;let g=(0,a.useThree)(e=>e.size),v=r.useMemo(()=>c?new z:new P,[c]),[y]=r.useState(()=>new m),b=(null==i||null==(p=i[0])?void 0:p.length)===4?4:3,S=r.useMemo(()=>{let n=c?new f:new B,r=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Vector3||e instanceof s.Vector4?[e.x,e.y,e.z]:e instanceof s.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(n.setPositions(r.flat()),i){t=0xffffff;let e=i.map(e=>e instanceof s.Color?e.toArray():e);n.setColors(e.flat(),b)}return n},[e,c,i,b]);return r.useLayoutEffect(()=>{v.computeLineDistances()},[e,v]),r.useLayoutEffect(()=>{d?y.defines.USE_DASH="":delete y.defines.USE_DASH,y.needsUpdate=!0},[d,y]),r.useEffect(()=>()=>{S.dispose(),y.dispose()},[S]),r.createElement("primitive",(0,n.default)({object:v,ref:h},u),r.createElement("primitive",{object:S,attach:"geometry"}),r.createElement("primitive",(0,n.default)({object:y,attach:"material",color:t,vertexColors:!!i,resolution:[g.width,g.height],linewidth:null!=(x=null!=o?o:l)?x:1,dashed:d,transparent:4===b},u)))});e.s(["Line",0,O],43216)},56420,e=>{"use strict";var t=e.i(71645);let i=(...e)=>e.filter((e,t,i)=>!!e&&""!==e.trim()&&i.indexOf(e)===t).join(" ").trim(),n=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,i)=>i?i.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,t.createContext)({}),a=(0,t.forwardRef)(({color:e,size:n,strokeWidth:a,absoluteStrokeWidth:o,className:l="",children:c,iconNode:d,...f},u)=>{let{size:h=24,strokeWidth:p=2,absoluteStrokeWidth:m=!1,color:x="currentColor",className:g=""}=(0,t.useContext)(s)??{},v=o??m?24*Number(a??p)/Number(n??h):a??p;return(0,t.createElement)("svg",{ref:u,...r,width:n??h??r.width,height:n??h??r.height,stroke:e??x,strokeWidth:v,className:i("lucide",g,l),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(f)&&{"aria-hidden":"true"},...f},[...d.map(([e,i])=>(0,t.createElement)(e,i)),...Array.isArray(c)?c:[c]])});e.s(["default",0,(e,r)=>{let s=(0,t.forwardRef)(({className:s,...o},l)=>(0,t.createElement)(a,{ref:l,iconNode:r,className:i(`lucide-${n(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...o}));return s.displayName=n(e),s}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,i)=>{t.exports=e.r(76562)},31587,e=>{"use strict";var t=e.i(43476),i=e.i(71645),n=e.i(92989),r=e.i(94800),s=e.i(43216),a=e.i(90072),o=e.i(16196);function l({onDataChange:e,incidentAngle:n=45,n2:c=1.5,showNormal:d=!0,showAngles:f=!0,resetTrigger:u}){let h=(0,i.useRef)(0),p=(0,i.useRef)(n),m=(0,i.useRef)(c);(0,i.useEffect)(()=>{p.current=n},[n]),(0,i.useEffect)(()=>{m.current=c},[c]),(0,i.useEffect)(()=>{void 0!==u&&(h.current=0)},[u]);let[x,g]=(0,i.useState)({incidentAngle:n,reflectedAngle:n,refractedAngle:0,n1:1,n2:c,criticalAngle:0,isTIR:!1});(0,r.useFrame)(()=>{if(h.current++,h.current%8==0){let t=p.current*Math.PI/180,i=m.current,n=1/i*Math.sin(t),r=null,s=!1;Math.abs(n)>1?(s=!0,r=null):r=Math.asin(n);let a=null;1>i&&(a=Math.asin(i/1));let o={incidentAngle:p.current,reflectedAngle:p.current,refractedAngle:null!==r?180*r/Math.PI:0,n1:1,n2:i,criticalAngle:null!==a?180*a/Math.PI:90,isTIR:s};g(o),e?.(o)}});let v=p.current*Math.PI/180,y=m.current,b=1/y*Math.sin(v),S=null,w=!1;Math.abs(b)>1?(w=!0,S=null):S=Math.asin(b);let A=null;1>y&&(A=Math.asin(y/1));let j=new a.Vector3(-(12*Math.sin(v)),12*Math.cos(v),0),E=new a.Vector3(0,0,0),L=new a.Vector3(12*Math.sin(v),12*Math.cos(v),0),M=w?new a.Vector3(0,0,0):new a.Vector3(12*Math.sin(S||0),-(12*Math.cos(S||0)),0),_=y<=1.01?"Air":y<=1.35?"Water":y<=1.6?"Glass":y<=1.8?"Oil":"Diamond";return(0,t.jsxs)("group",{children:[(0,t.jsxs)("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-15,-2],receiveShadow:!0,children:[(0,t.jsx)("planeGeometry",{args:[60,40]}),(0,t.jsx)("meshStandardMaterial",{color:"#050510",roughness:.98})]}),(0,t.jsx)("gridHelper",{args:[60,60,"#1a1a3e","#0a0a1e"],position:[0,-14.99,-2]}),(0,t.jsxs)("mesh",{position:[0,8,-1],receiveShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[50,16,2]}),(0,t.jsx)("meshStandardMaterial",{color:"#e0f2fe",transparent:!0,opacity:.08,roughness:.1,metalness:0})]}),(0,t.jsxs)("mesh",{position:[0,-8,-1],receiveShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[50,16,2]}),(0,t.jsx)("meshStandardMaterial",{color:y<1.4?"#0369a1":y<1.7?"#1e40af":"#5b21b6",transparent:!0,opacity:.15,roughness:.1,metalness:.1})]}),(0,t.jsx)(s.Line,{points:[[-25,0,.1],[25,0,.1]],color:"#ffffff",lineWidth:2}),d&&(0,t.jsx)(s.Line,{points:[[0,-12,.1],[0,12,.1]],color:"#888888",lineWidth:1,dashed:!0,dashSize:.5,gapSize:.3,opacity:.6,transparent:!0}),(0,t.jsx)(s.Line,{points:[[j.x,j.y,.2],[E.x,E.y,.2]],color:"#ffffff",lineWidth:4}),(0,t.jsx)(s.Line,{points:[[j.x,j.y,.2],[E.x,E.y,.2]],color:"#ffffff",lineWidth:8,opacity:.3,transparent:!0}),(0,t.jsx)(s.Line,{points:[[E.x,E.y,.2],[L.x,L.y,.2]],color:"#fbbf24",lineWidth:3}),(0,t.jsx)(s.Line,{points:[[E.x,E.y,.2],[L.x,L.y,.2]],color:"#fbbf24",lineWidth:6,opacity:.25,transparent:!0}),!w&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.Line,{points:[[E.x,E.y,.2],[M.x,M.y,.2]],color:"#06b6d4",lineWidth:3}),(0,t.jsx)(s.Line,{points:[[E.x,E.y,.2],[M.x,M.y,.2]],color:"#06b6d4",lineWidth:6,opacity:.25,transparent:!0})]}),f&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("group",{rotation:[0,0,-v],children:(0,t.jsxs)("mesh",{rotation:[0,0,Math.PI/2-v/2],children:[(0,t.jsx)("ringGeometry",{args:[3,3.15,32,1,0,v]}),(0,t.jsx)("meshBasicMaterial",{color:"#ffffff",side:a.DoubleSide})]})}),(0,t.jsx)("group",{rotation:[0,0,v],children:(0,t.jsxs)("mesh",{rotation:[0,0,Math.PI/2-v/2],children:[(0,t.jsx)("ringGeometry",{args:[3,3.15,32,1,0,v]}),(0,t.jsx)("meshBasicMaterial",{color:"#fbbf24",side:a.DoubleSide})]})}),!w&&null!==S&&(0,t.jsx)("group",{rotation:[0,0,Math.PI+S],children:(0,t.jsxs)("mesh",{rotation:[0,0,Math.PI/2-S/2],children:[(0,t.jsx)("ringGeometry",{args:[3,3.15,32,1,0,S]}),(0,t.jsx)("meshBasicMaterial",{color:"#06b6d4",side:a.DoubleSide})]})})]}),(0,t.jsxs)(o.Text,{position:[-18,6,1],fontSize:1.2,color:"#94a3b8",anchorX:"left",anchorY:"middle",children:["Air"," (n₁ = ","1.00",")"]}),(0,t.jsxs)(o.Text,{position:[-18,-6,1],fontSize:1.2,color:y<1.4?"#38bdf8":y<1.7?"#818cf8":"#c084fc",anchorX:"left",anchorY:"middle",children:[_," (n₂ = ",y.toFixed(2),")"]}),w&&(0,t.jsxs)("group",{position:[8,-6,1],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("planeGeometry",{args:[10,2.5]}),(0,t.jsx)("meshBasicMaterial",{color:"#dc2626",transparent:!0,opacity:.9})]}),(0,t.jsx)(o.Text,{position:[0,0,.01],fontSize:.9,color:"#ffffff",anchorX:"center",anchorY:"middle",children:"TOTAL INTERNAL REFLECTION"})]}),null!==A&&!w&&(0,t.jsxs)(o.Text,{position:[12,-6,1],fontSize:.7,color:"#fbbf24",anchorX:"left",anchorY:"middle",children:["Critical angle: ",(180*A/Math.PI).toFixed(1),"°"]}),(0,t.jsxs)("mesh",{position:[j.x,j.y,0],rotation:[0,0,v],children:[(0,t.jsx)("boxGeometry",{args:[2,1,1]}),(0,t.jsx)("meshStandardMaterial",{color:"#374151",metalness:.8,roughness:.2})]}),(0,t.jsxs)("mesh",{position:[j.x,j.y,0],children:[(0,t.jsx)("sphereGeometry",{args:[.3,16,16]}),(0,t.jsx)("meshBasicMaterial",{color:"#ffffff"})]}),f&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(o.Text,{position:[-5,4,.5],fontSize:.7,color:"#ffffff",anchorX:"center",anchorY:"middle",children:["θᵢ = ",p.current.toFixed(1),"°"]}),(0,t.jsxs)(o.Text,{position:[5,4,.5],fontSize:.7,color:"#fbbf24",anchorX:"center",anchorY:"middle",children:["θᵣ = ",p.current.toFixed(1),"°"]}),!w&&null!==S&&(0,t.jsxs)(o.Text,{position:[5,-4,.5],fontSize:.7,color:"#06b6d4",anchorX:"center",anchorY:"middle",children:["θₜ = ",(180*S/Math.PI).toFixed(1),"°"]})]})]})}e.i(81413);var c=e.i(48205),d=e.i(68647),f=e.i(82192),u=e.i(14228),h=e.i(4685);e.s(["default",0,function(){let e=(0,n.useRouter)(),[r,s]=(0,i.useState)(null),[a,o]=(0,i.useState)(!0),[p,m]=(0,i.useState)(!0),[x,g]=(0,i.useState)(1),[v,y]=(0,i.useState)(0),[b,S]=(0,i.useState)(0),[w,A]=(0,i.useState)(45),[j,E]=(0,i.useState)(1.5),[L,M]=(0,i.useState)(!0),[_,C]=(0,i.useState)(!0),U={air:1,water:1.33,glass:1.5,diamond:2.42},z=(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsx)(d.ControlGroup,{title:"Light Source",children:(0,t.jsx)(d.ControlSlider,{label:"Angle of Incidence (θᵢ)",value:w,unit:"°",min:0,max:89,step:1,color:"#ffffff",onChange:A,decimals:0})}),(0,t.jsx)(d.ControlGroup,{title:"Medium 2 (Bottom)",children:(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsx)(d.ControlSlider,{label:"Refractive Index (n₂)",value:j,unit:"",min:1,max:2.5,step:.01,color:"#06b6d4",onChange:E,decimals:2}),(0,t.jsxs)("div",{className:"pt-2",children:[(0,t.jsx)("label",{className:"text-xs text-gray-600 block mb-2",children:"Quick Presets:"}),(0,t.jsx)("div",{className:"grid grid-cols-2 gap-2",children:Object.entries(U).map(([e,i])=>(0,t.jsxs)("button",{onClick:()=>{E(U[e]||1.5)},className:`py-1.5 px-3 text-xs font-medium rounded-lg transition-all ${.01>Math.abs(j-i)?"bg-cyan-500 text-white ring-2 ring-cyan-300":"bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"}`,children:[e.charAt(0).toUpperCase()+e.slice(1)," (",i,")"]},e))})]})]})}),(0,t.jsx)(d.ControlGroup,{title:"Display Options",children:[{label:"Show Normal Line",checked:L,onChange:M},{label:"Show Angle Arcs",checked:_,onChange:C}].map(e=>(0,t.jsxs)("label",{className:"flex items-center justify-between text-sm text-gray-700 cursor-pointer py-2 px-3 bg-gray-100/50 rounded-lg border border-gray-300/50",children:[(0,t.jsx)("span",{children:e.label}),(0,t.jsx)("input",{type:"checkbox",checked:e.checked,onChange:t=>e.onChange(t.target.checked),className:"w-4 h-4 rounded accent-cyan-500"})]},e.label))}),(0,t.jsxs)("div",{className:"p-3 bg-sky-50 border border-sky-200 rounded-lg",children:[(0,t.jsx)("div",{className:"text-sm font-medium text-sky-800",children:"Medium 1 (Top)"}),(0,t.jsx)("div",{className:"text-xs text-sky-600",children:"Always Air (n₁ = 1.00)"})]}),(0,t.jsx)("button",{onClick:()=>e.push("/experiments/refraction/details"),className:"w-full py-2.5 bg-gradient-to-r from-cyan-100 to-cyan-200 hover:from-cyan-200 hover:to-cyan-300 text-cyan-700 font-medium text-sm rounded-lg transition-all border border-cyan-300/50 flex items-center justify-center gap-2",children:"📖 View Experiment Details"})]}),B=r?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(d.DataGrid,{data:{incidentAngle:{value:r.incidentAngle,unit:"°",color:"#ffffff",decimals:1},reflectedAngle:{value:r.reflectedAngle,unit:"°",color:"#fbbf24",decimals:1},refractedAngle:{value:r.refractedAngle,unit:"°",color:"#06b6d4",decimals:1},n1:{value:r.n1,unit:"",color:"#94a3b8",decimals:2},n2:{value:r.n2,unit:"",color:"#06b6d4",decimals:2},criticalAngle:{value:r.criticalAngle,unit:"°",color:"#f59e0b",decimals:1}},columns:2}),r.isTIR&&(0,t.jsxs)("div",{className:"mt-3 p-3 bg-red-900/30 border border-red-500/50 rounded-lg",children:[(0,t.jsx)("div",{className:"text-red-400 text-sm font-semibold flex items-center gap-2",children:"⚠️ Total Internal Reflection"}),(0,t.jsx)("div",{className:"text-red-300 text-xs mt-1",children:"Incident angle exceeds critical angle"})]}),(0,t.jsxs)("div",{className:"mt-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700",children:[(0,t.jsx)("div",{className:"text-gray-400 text-xs mb-1",children:"Snell's Law:"}),(0,t.jsx)("div",{className:"font-mono text-cyan-300 text-sm",children:"n₁ × sin(θᵢ) = n₂ × sin(θₜ)"}),(0,t.jsxs)("div",{className:"text-gray-500 text-xs mt-2",children:[r.n1.toFixed(2)," × sin(",r.incidentAngle.toFixed(1),"°) ="," ",r.n2.toFixed(2)," × sin(",r.refractedAngle.toFixed(1),"°)"]})]}),r.criticalAngle<90&&(0,t.jsxs)("div",{className:"mt-3 p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg",children:[(0,t.jsx)("div",{className:"text-amber-400 text-xs font-medium",children:"Critical Angle:"}),(0,t.jsxs)("div",{className:"text-amber-300 text-sm font-mono",children:["θc = ",r.criticalAngle.toFixed(1),"°"]}),(0,t.jsx)("div",{className:"text-amber-200/70 text-xs mt-1",children:"TIR occurs when θᵢ > θc"})]})]}):(0,t.jsx)("div",{className:"text-center text-gray-500 text-sm py-8",children:"Waiting for simulation data..."});return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(c.ExperimentContainer,{title:"Refraction & Reflection",description:"Explore Snell's law and total internal reflection at an optical interface",cameraPosition:[25,15,35],backgroundColor:"#050510",controls:null,dataPanel:null,children:(0,t.jsx)(l,{onDataChange:s,incidentAngle:w,n2:j,showNormal:L,showAngles:_,resetTrigger:v})}),(0,t.jsx)(u.SimulationController,{isPlaying:p,onPlayPause:()=>m(e=>!e),onReset:()=>{y(e=>e+1),m(!0),g(1),S(0)},speed:x,onSpeedChange:g,timeElapsed:b}),(0,t.jsx)(f.FloatingControlPanel,{title:"⚙️ Refraction Parameters",initialPosition:{x:20,y:80},children:z}),(0,t.jsx)(h.DataPanel,{isVisible:a,onToggle:()=>o(!a),children:B})]})}],31587)}]);
(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,i;var n=e.i(31067),r=e.i(71645),s=e.i(90072),a=e.i(48546),o=s,l=s;let c=new l.Box3,d=new l.Vector3;class u extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(i,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let n=new l.InstancedInterleavedBuffer(i,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(n,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),c.setFromBufferAttribute(t),this.boundingBox.union(c))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let r=0,s=e.count;r<s;r++)d.fromBufferAttribute(e,r),n=Math.max(n,i.distanceToSquared(d)),d.fromBufferAttribute(t,r),n=Math.max(n,i.distanceToSquared(d));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var f=s,p=e.i(8560),m=e.i(31497);class h extends f.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:f.UniformsUtils.clone(f.UniformsUtils.merge([p.UniformsLib.common,p.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new f.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let x=m.version>=125?"uv1":"uv2",y=new o.Vector4,g=new o.Vector3,v=new o.Vector3,b=new o.Vector4,S=new o.Vector4,w=new o.Vector4,j=new o.Vector3,E=new o.Matrix4,M=new o.Line3,A=new o.Vector3,C=new o.Box3,_=new o.Sphere,L=new o.Vector4;function U(e,t,n){return L.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),L.multiplyScalar(1/L.w),L.x=i/n.width,L.y=i/n.height,L.applyMatrix4(e.projectionMatrixInverse),L.multiplyScalar(1/L.w),Math.abs(Math.max(L.x,L.y))}class N extends o.Mesh{constructor(e=new u,t=new h({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let e=0,r=0,s=t.count;e<s;e++,r+=2)g.fromBufferAttribute(t,e),v.fromBufferAttribute(i,e),n[r]=0===r?0:n[r-1],n[r+1]=n[r]+g.distanceTo(v);let r=new o.InstancedInterleavedBuffer(n,2,1);return e.setAttribute("instanceDistanceStart",new o.InterleavedBufferAttribute(r,1,0)),e.setAttribute("instanceDistanceEnd",new o.InterleavedBufferAttribute(r,1,1)),this}raycast(e,n){let r,s,a=this.material.worldUnits,l=e.camera;null!==l||a||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let d=this.matrixWorld,u=this.geometry,f=this.material;if(i=f.linewidth+c,null===u.boundingSphere&&u.computeBoundingSphere(),_.copy(u.boundingSphere).applyMatrix4(d),a)r=.5*i;else{let e=Math.max(l.near,_.distanceToPoint(t.origin));r=U(l,e,f.resolution)}if(_.radius+=r,!1!==t.intersectsSphere(_)){if(null===u.boundingBox&&u.computeBoundingBox(),C.copy(u.boundingBox).applyMatrix4(d),a)s=.5*i;else{let e=Math.max(l.near,C.distanceToPoint(t.origin));s=U(l,e,f.resolution)}C.expandByScalar(s),!1!==t.intersectsBox(C)&&(a?function(e,n){let r=e.matrixWorld,s=e.geometry,a=s.attributes.instanceStart,l=s.attributes.instanceEnd,c=Math.min(s.instanceCount,a.count);for(let s=0;s<c;s++){M.start.fromBufferAttribute(a,s),M.end.fromBufferAttribute(l,s),M.applyMatrix4(r);let c=new o.Vector3,d=new o.Vector3;t.distanceSqToSegment(M.start,M.end,d,c),d.distanceTo(c)<.5*i&&n.push({point:d,pointOnLine:c,distance:t.origin.distanceTo(d),object:e,face:null,faceIndex:s,uv:null,[x]:null})}}(this,n):function(e,n,r){let s=n.projectionMatrix,a=e.material.resolution,l=e.matrixWorld,c=e.geometry,d=c.attributes.instanceStart,u=c.attributes.instanceEnd,f=Math.min(c.instanceCount,d.count),p=-n.near;t.at(1,w),w.w=1,w.applyMatrix4(n.matrixWorldInverse),w.applyMatrix4(s),w.multiplyScalar(1/w.w),w.x*=a.x/2,w.y*=a.y/2,w.z=0,j.copy(w),E.multiplyMatrices(n.matrixWorldInverse,l);for(let n=0;n<f;n++){if(b.fromBufferAttribute(d,n),S.fromBufferAttribute(u,n),b.w=1,S.w=1,b.applyMatrix4(E),S.applyMatrix4(E),b.z>p&&S.z>p)continue;if(b.z>p){let e=b.z-S.z,t=(b.z-p)/e;b.lerp(S,t)}else if(S.z>p){let e=S.z-b.z,t=(S.z-p)/e;S.lerp(b,t)}b.applyMatrix4(s),S.applyMatrix4(s),b.multiplyScalar(1/b.w),S.multiplyScalar(1/S.w),b.x*=a.x/2,b.y*=a.y/2,S.x*=a.x/2,S.y*=a.y/2,M.start.copy(b),M.start.z=0,M.end.copy(S),M.end.z=0;let c=M.closestPointToPointParameter(j,!0);M.at(c,A);let f=o.MathUtils.lerp(b.z,S.z,c),m=f>=-1&&f<=1,h=j.distanceTo(A)<.5*i;if(m&&h){M.start.fromBufferAttribute(d,n),M.end.fromBufferAttribute(u,n),M.start.applyMatrix4(l),M.end.applyMatrix4(l);let i=new o.Vector3,s=new o.Vector3;t.distanceSqToSegment(M.start,M.end,s,i),r.push({point:s,pointOnLine:i,distance:t.origin.distanceTo(s),object:e,face:null,faceIndex:n,uv:null,[x]:null})}}}(this,l,n))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(y),this.material.uniforms.resolution.value.set(y.z,y.w))}}class z extends u{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,n=new Float32Array(2*i);if(3===t)for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];else for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5],n[2*r+6]=e[r+6],n[2*r+7]=e[r+7];return super.setColors(n,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class P extends N{constructor(e=new z,t=new h({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let O=r.forwardRef(function({points:e,color:t=0xffffff,vertexColors:i,linewidth:o,lineWidth:l,segments:c,dashed:d,...f},p){var m,x;let y=(0,a.useThree)(e=>e.size),g=r.useMemo(()=>c?new N:new P,[c]),[v]=r.useState(()=>new h),b=(null==i||null==(m=i[0])?void 0:m.length)===4?4:3,S=r.useMemo(()=>{let n=c?new u:new z,r=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Vector3||e instanceof s.Vector4?[e.x,e.y,e.z]:e instanceof s.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(n.setPositions(r.flat()),i){t=0xffffff;let e=i.map(e=>e instanceof s.Color?e.toArray():e);n.setColors(e.flat(),b)}return n},[e,c,i,b]);return r.useLayoutEffect(()=>{g.computeLineDistances()},[e,g]),r.useLayoutEffect(()=>{d?v.defines.USE_DASH="":delete v.defines.USE_DASH,v.needsUpdate=!0},[d,v]),r.useEffect(()=>()=>{S.dispose(),v.dispose()},[S]),r.createElement("primitive",(0,n.default)({object:g,ref:p},f),r.createElement("primitive",{object:S,attach:"geometry"}),r.createElement("primitive",(0,n.default)({object:v,attach:"material",color:t,vertexColors:!!i,resolution:[y.width,y.height],linewidth:null!=(x=null!=o?o:l)?x:1,dashed:d,transparent:4===b},f)))});e.s(["Line",0,O],43216)},56420,e=>{"use strict";var t=e.i(71645);let i=(...e)=>e.filter((e,t,i)=>!!e&&""!==e.trim()&&i.indexOf(e)===t).join(" ").trim(),n=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,i)=>i?i.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,t.createContext)({}),a=(0,t.forwardRef)(({color:e,size:n,strokeWidth:a,absoluteStrokeWidth:o,className:l="",children:c,iconNode:d,...u},f)=>{let{size:p=24,strokeWidth:m=2,absoluteStrokeWidth:h=!1,color:x="currentColor",className:y=""}=(0,t.useContext)(s)??{},g=o??h?24*Number(a??m)/Number(n??p):a??m;return(0,t.createElement)("svg",{ref:f,...r,width:n??p??r.width,height:n??p??r.height,stroke:e??x,strokeWidth:g,className:i("lucide",y,l),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,i])=>(0,t.createElement)(e,i)),...Array.isArray(c)?c:[c]])});e.s(["default",0,(e,r)=>{let s=(0,t.forwardRef)(({className:s,...o},l)=>(0,t.createElement)(a,{ref:l,iconNode:r,className:i(`lucide-${n(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...o}));return s.displayName=n(e),s}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,i)=>{t.exports=e.r(76562)},23542,e=>{"use strict";var t=e.i(43476),i=e.i(71645),n=e.i(92989),r=e.i(94800),s=e.i(43216),a=e.i(90072);function o({onDataChange:e,starMass:n=1e3,planetMass:l=1,secondPlanetMass:c=.5,initialDistance:d=15,initialVelocity:u=6,showTrail:f=!0,showVectors:p=!0,showSecondPlanet:m=!1,resetTrigger:h}){let x=(0,i.useRef)(null),y=(0,i.useRef)(null),g=(0,i.useRef)(null),v=(0,i.useRef)(null),b=(0,i.useRef)(null),S=(0,i.useRef)(null),w=(0,i.useRef)({position:new a.Vector3(d,0,0),velocity:new a.Vector3(0,0,u),acceleration:new a.Vector3,trail:[],position2:new a.Vector3(1.5*d,0,0),velocity2:new a.Vector3(0,0,.8*u),acceleration2:new a.Vector3,trail2:[]}),[j,E]=(0,i.useState)([]),[M,A]=(0,i.useState)([]),[C,_]=(0,i.useState)({period:0,velocity:0,escapeVelocity:0,gravitationalForce:0,totalEnergy:0,angularMomentum:0,distance:0,eccentricity:0,semiMajorAxis:0,orbitType:"Circular"}),L=(0,i.useRef)(0),U=e=>{let t=e.length();return e.clone().normalize().negate().multiplyScalar(n/(t*t))},N=e=>e<.01?"Circular":e<1?"Elliptical":.01>Math.abs(e-1)?"Parabolic":"Hyperbolic";(0,i.useEffect)(()=>{if(void 0!==h){let e=w.current;e.position.set(d,0,0),e.velocity.set(0,0,u),e.acceleration.set(0,0,0),e.trail=[],e.position2.set(1.5*d,0,0),e.velocity2.set(0,0,.8*u),e.acceleration2.set(0,0,0),e.trail2=[],E([]),A([])}},[h,d,u]),(0,r.useFrame)((t,i)=>{let r,s=Math.min(i,.016),o=w.current;0===o.acceleration.length()&&o.acceleration.copy(U(o.position));let d=o.velocity.clone().add(o.acceleration.clone().multiplyScalar(.5*s));o.position.add(d.clone().multiplyScalar(s));let u=U(o.position);if(o.velocity.add(o.acceleration.clone().add(u).multiplyScalar(.5*s)),o.acceleration.copy(u),x.current&&x.current.position.copy(o.position),f&&(o.trail.push(o.position.clone()),o.trail.length>800&&o.trail.shift(),L.current%3==0&&E(o.trail.map(e=>[e.x,e.y,e.z]))),m){0===o.acceleration2.length()&&o.acceleration2.copy(U(o.position2));let e=o.velocity2.clone().add(o.acceleration2.clone().multiplyScalar(.5*s));o.position2.add(e.clone().multiplyScalar(s));let t=U(o.position2);o.velocity2.add(o.acceleration2.clone().add(t).multiplyScalar(.5*s)),o.acceleration2.copy(t),y.current&&y.current.position.copy(o.position2),f&&(o.trail2.push(o.position2.clone()),o.trail2.length>800&&o.trail2.shift(),L.current%3==0&&A(o.trail2.map(e=>[e.x,e.y,e.z])))}let h=o.position.length(),j=o.velocity.length(),M=+n,C=j*j/2-M/h,z=0!==C?-M/(2*C):1/0,P=new a.Vector3().crossVectors(o.position,o.velocity).length(),O=C<0?Math.sqrt(1+2*C*P*P/(M*M)):1,B=n*l/(h*h),V=N(O),D=z>0?2*Math.PI*Math.sqrt(z**3/M):1/0,I=Math.sqrt(2*M/h);if(m){let e=o.position2.length(),t=o.velocity2.length(),i=t*t/2-M/e,n=new a.Vector3().crossVectors(o.position2,o.velocity2).length();r={distance:e,velocity:t,orbitType:N(i<0?Math.sqrt(1+2*i*n*n/(M*M)):1)}}if(L.current++,L.current%8==0){let t={period:D,velocity:j,escapeVelocity:I,gravitationalForce:B,totalEnergy:C*l,angularMomentum:P*l,distance:h,eccentricity:O,semiMajorAxis:z||0,orbitType:V,secondPlanetData:r};_(t),e?.(t)}if(p&&g.current){let e=o.velocity.clone().normalize();g.current.position.copy(o.position),g.current.scale.set(1,1,.5*j),g.current.quaternion.setFromUnitVectors(new a.Vector3(0,1,0),e)}if(p&&v.current){let e=o.position.clone().normalize().negate();v.current.position.copy(o.position),v.current.scale.set(1,1,2*B),v.current.quaternion.setFromUnitVectors(new a.Vector3(0,1,0),e)}if(m&&p){if(b.current){let e=o.velocity2.clone().normalize();b.current.position.copy(o.position2),b.current.scale.set(1,1,.5*o.velocity2.length()),b.current.quaternion.setFromUnitVectors(new a.Vector3(0,1,0),e)}if(S.current){let e=o.position2.clone().normalize().negate();S.current.position.copy(o.position2);let t=n*c/o.position2.length()**2;S.current.scale.set(1,1,2*t),S.current.quaternion.setFromUnitVectors(new a.Vector3(0,1,0),e)}}});let z=(0,i.useMemo)(()=>Array.from({length:64},(e,t)=>{let i=t/64*Math.PI*2;return[Math.cos(i)*d,0,Math.sin(i)*d]}),[d]);return(0,t.jsxs)("group",{children:[(0,t.jsxs)("mesh",{position:[0,0,0],castShadow:!0,children:[(0,t.jsx)("sphereGeometry",{args:[3,64,64]}),(0,t.jsx)("meshStandardMaterial",{color:"#ffcc00",emissive:"#ff6600",emissiveIntensity:2.5,metalness:0,roughness:1})]}),(0,t.jsxs)("mesh",{position:[0,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[3.3,32,32]}),(0,t.jsx)("meshBasicMaterial",{color:"#ffaa00",transparent:!0,opacity:.4})]}),(0,t.jsxs)("mesh",{position:[0,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[3.8,32,32]}),(0,t.jsx)("meshBasicMaterial",{color:"#ff8800",transparent:!0,opacity:.2})]}),(0,t.jsx)("pointLight",{position:[0,0,0],intensity:8,color:"#ffcc00",castShadow:!0}),(0,t.jsx)("pointLight",{position:[0,0,0],intensity:3,color:"#ff8800",distance:150}),(0,t.jsx)("pointLight",{position:[0,0,0],intensity:1,color:"#ff6600",distance:200}),(0,t.jsx)(s.Line,{points:z,color:"#334455",lineWidth:1,opacity:.4,transparent:!0,dashed:!0}),(0,t.jsxs)("mesh",{ref:x,position:[d,0,0],castShadow:!0,children:[(0,t.jsx)("sphereGeometry",{args:[.8,32,32]}),(0,t.jsx)("meshStandardMaterial",{color:"#4a90d9",metalness:.3,roughness:.7,emissive:"#4a90d9",emissiveIntensity:.2})]}),f&&j.length>1&&(0,t.jsx)(s.Line,{points:j,color:"#4a90d9",lineWidth:2,opacity:.7,transparent:!0}),p&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("group",{ref:g,children:[(0,t.jsxs)("mesh",{position:[0,1,0],rotation:[Math.PI,0,0],children:[(0,t.jsx)("coneGeometry",{args:[.15,.4,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#22c55e",emissive:"#22c55e",emissiveIntensity:.5})]}),(0,t.jsxs)("mesh",{position:[0,.5,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.05,.05,1]}),(0,t.jsx)("meshStandardMaterial",{color:"#22c55e",emissive:"#22c55e",emissiveIntensity:.5})]})]}),(0,t.jsxs)("group",{ref:v,children:[(0,t.jsxs)("mesh",{position:[0,1,0],rotation:[Math.PI,0,0],children:[(0,t.jsx)("coneGeometry",{args:[.15,.4,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#ef4444",emissive:"#ef4444",emissiveIntensity:.5})]}),(0,t.jsxs)("mesh",{position:[0,.5,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.05,.05,1]}),(0,t.jsx)("meshStandardMaterial",{color:"#ef4444",emissive:"#ef4444",emissiveIntensity:.5})]})]})]}),m&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("mesh",{ref:y,position:[1.5*d,0,0],castShadow:!0,children:[(0,t.jsx)("sphereGeometry",{args:[.6,32,32]}),(0,t.jsx)("meshStandardMaterial",{color:"#ff6b9d",metalness:.3,roughness:.7,emissive:"#ff6b9d",emissiveIntensity:.2})]}),f&&M.length>1&&(0,t.jsx)(s.Line,{points:M,color:"#ff6b9d",lineWidth:2,opacity:.7,transparent:!0}),p&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("group",{ref:b,children:[(0,t.jsxs)("mesh",{position:[0,1,0],rotation:[Math.PI,0,0],children:[(0,t.jsx)("coneGeometry",{args:[.12,.3,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#22c55e",emissive:"#22c55e",emissiveIntensity:.5})]}),(0,t.jsxs)("mesh",{position:[0,.5,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.04,.04,1]}),(0,t.jsx)("meshStandardMaterial",{color:"#22c55e",emissive:"#22c55e",emissiveIntensity:.5})]})]}),(0,t.jsxs)("group",{ref:S,children:[(0,t.jsxs)("mesh",{position:[0,1,0],rotation:[Math.PI,0,0],children:[(0,t.jsx)("coneGeometry",{args:[.12,.3,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#ef4444",emissive:"#ef4444",emissiveIntensity:.5})]}),(0,t.jsxs)("mesh",{position:[0,.5,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.04,.04,1]}),(0,t.jsx)("meshStandardMaterial",{color:"#ef4444",emissive:"#ef4444",emissiveIntensity:.5})]})]})]})]}),(0,t.jsxs)("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-20,0],receiveShadow:!0,children:[(0,t.jsx)("planeGeometry",{args:[200,200]}),(0,t.jsx)("meshStandardMaterial",{color:"#030308",roughness:.98})]}),(0,t.jsx)("gridHelper",{args:[200,100,"#1a1a3e","#0a0a1e"],position:[0,-19.99,0]}),Array.from({length:6},(e,i)=>{let n=5+5*i;return(0,t.jsxs)("group",{children:[(0,t.jsxs)("mesh",{position:[n,-19.5,0],children:[(0,t.jsx)("boxGeometry",{args:[.1,.3,.1]}),(0,t.jsx)("meshStandardMaterial",{color:"#555"})]}),i>0&&(0,t.jsxs)("mesh",{position:[-n,-19.5,0],children:[(0,t.jsx)("boxGeometry",{args:[.1,.3,.1]}),(0,t.jsx)("meshStandardMaterial",{color:"#555"})]})]},i)})]})}e.i(81413);var l=e.i(48205),c=e.i(68647),d=e.i(82192),u=e.i(14228),f=e.i(4685);let p={Circular:"#22c55e",Elliptical:"#3b82f6",Parabolic:"#f59e0b",Hyperbolic:"#ef4444"};e.s(["default",0,function(){let e=(0,n.useRouter)(),[r,s]=(0,i.useState)(null),[a,m]=(0,i.useState)(!0),[h,x]=(0,i.useState)(!0),[y,g]=(0,i.useState)(1),[v,b]=(0,i.useState)(0),[S,w]=(0,i.useState)(1e3),[j,E]=(0,i.useState)(1),[M,A]=(0,i.useState)(.5),[C,_]=(0,i.useState)(15),[L,U]=(0,i.useState)(6),[N,z]=(0,i.useState)(!0),[P,O]=(0,i.useState)(!0),[B,V]=(0,i.useState)(!1),D=(0,i.useMemo)(()=>Math.sqrt(S/C),[S,C]),I=(0,i.useMemo)(()=>Math.sqrt(2*S/C),[S,C]),T=[{label:"Circular Orbit",distance:15,velocity:6,action:()=>{_(15),U(D)}},{label:"Elliptical",distance:15,velocity:4,action:()=>{_(15),U(4)}},{label:"Comet-like",distance:25,velocity:3,action:()=>{_(25),U(3)}},{label:"Escape",distance:15,velocity:10,action:()=>{_(15),U(I)}}],k=(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsx)(c.ControlGroup,{title:"Orbit Presets",children:(0,t.jsx)("div",{className:"grid grid-cols-2 gap-2",children:T.map(e=>(0,t.jsx)("button",{onClick:e.action,className:"py-2 px-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium text-xs rounded-lg transition-all shadow-md hover:shadow-lg",children:e.label},e.label))})}),(0,t.jsxs)(c.ControlGroup,{title:"Physics Parameters",children:[(0,t.jsx)(c.ControlSlider,{label:"Star Mass (M)",value:S,unit:"M☉",min:100,max:2e3,step:100,color:"#f59e0b",onChange:w,decimals:0}),(0,t.jsx)(c.ControlSlider,{label:"Planet Mass (m)",value:j,unit:"M⊕",min:.1,max:10,step:.1,color:"#3b82f6",onChange:E,decimals:1}),(0,t.jsx)(c.ControlSlider,{label:"Initial Distance (r₀)",value:C,unit:"AU",min:8,max:40,step:1,color:"#22c55e",onChange:_,decimals:0}),(0,t.jsx)(c.ControlSlider,{label:"Initial Velocity (v₀)",value:L,unit:"km/s",min:1,max:15,step:.5,color:"#ec4899",onChange:U,decimals:1})]}),(0,t.jsxs)(c.ControlGroup,{title:"Second Planet (Optional)",children:[(0,t.jsxs)("label",{className:"flex items-center justify-between text-sm text-gray-700 cursor-pointer py-2 px-3 bg-gray-100/50 rounded-lg border border-gray-300/50",children:[(0,t.jsx)("span",{className:"font-medium",children:"Enable Second Planet"}),(0,t.jsx)("input",{type:"checkbox",checked:B,onChange:e=>V(e.target.checked),className:"w-4 h-4 rounded accent-indigo-500"})]}),B&&(0,t.jsx)(c.ControlSlider,{label:"Second Planet Mass",value:M,unit:"M⊕",min:.1,max:5,step:.1,color:"#ff6b9d",onChange:A,decimals:1})]}),(0,t.jsx)(c.ControlGroup,{title:"Display Options",children:[{label:"Show Orbital Trails",checked:N,onChange:z},{label:"Show Force/Velocity Vectors",checked:P,onChange:O}].map(e=>(0,t.jsxs)("label",{className:"flex items-center justify-between text-sm text-gray-700 cursor-pointer py-2 px-3 bg-gray-100/50 rounded-lg border border-gray-300/50",children:[(0,t.jsx)("span",{children:e.label}),(0,t.jsx)("input",{type:"checkbox",checked:e.checked,onChange:t=>e.onChange(t.target.checked),className:"w-4 h-4 rounded accent-indigo-500"})]},e.label))}),(0,t.jsxs)("div",{className:"p-3 bg-gray-800/80 rounded-lg border border-gray-700",children:[(0,t.jsxs)("div",{className:"text-xs text-gray-400 mb-2",children:["Reference Velocities at r = ",C," AU:"]}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-2 text-xs",children:[(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-gray-500",children:"Circular:"}),(0,t.jsxs)("span",{className:"font-mono text-green-400",children:[D.toFixed(2)," km/s"]})]}),(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-gray-500",children:"Escape:"}),(0,t.jsxs)("span",{className:"font-mono text-red-400",children:[I.toFixed(2)," km/s"]})]})]})]}),(0,t.jsx)("button",{onClick:()=>e.push("/experiments/gravitational-orbits/details"),className:"w-full py-2.5 bg-gradient-to-r from-indigo-100 to-indigo-200 hover:from-indigo-200 hover:to-indigo-300 text-indigo-700 font-medium text-sm rounded-lg transition-all border border-indigo-300/50 flex items-center justify-center gap-2",children:"📖 View Experiment Details"})]}),R=e=>{let i=p[e]||"#888";return(0,t.jsx)("span",{className:"px-2 py-0.5 rounded text-xs font-semibold",style:{backgroundColor:`${i}20`,color:i,border:`1px solid ${i}50`},children:e})},G=r?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{className:"mb-3 p-3 bg-gray-800/80 rounded-lg border border-gray-700",children:[(0,t.jsx)("div",{className:"text-xs text-gray-400 mb-1",children:"Current Orbit Type"}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[R(r.orbitType),"Elliptical"===r.orbitType&&(0,t.jsxs)("span",{className:"text-xs text-gray-500",children:["e = ",r.eccentricity.toFixed(3)]})]})]}),(0,t.jsx)(c.DataGrid,{data:{distance:{value:r.distance,unit:"AU",color:"#3b82f6",decimals:2},velocity:{value:r.velocity,unit:"km/s",color:"#22c55e",decimals:2},escapeVelocity:{value:r.escapeVelocity,unit:"km/s",color:"#ef4444",decimals:2},period:{value:r.period===1/0?0:r.period,unit:"yr",color:"#8b5cf6",decimals:2*(r.period!==1/0)}},columns:2}),r.period===1/0&&(0,t.jsx)("div",{className:"text-xs text-gray-500 italic text-center mt-1",children:"Period: ∞ (unbound orbit)"}),(0,t.jsxs)("div",{className:"mt-3 grid grid-cols-2 gap-2 text-xs",children:[(0,t.jsxs)("div",{className:"p-2 bg-gray-800/50 rounded border border-gray-700/50",children:[(0,t.jsx)("span",{className:"text-gray-500 block text-xs",children:"Eccentricity"}),(0,t.jsx)("div",{className:"font-mono text-cyan-400",children:r.eccentricity.toFixed(3)})]}),(0,t.jsxs)("div",{className:"p-2 bg-gray-800/50 rounded border border-gray-700/50",children:[(0,t.jsx)("span",{className:"text-gray-500 block text-xs",children:"Semi-Major Axis"}),(0,t.jsxs)("div",{className:"font-mono text-lime-400",children:[r.semiMajorAxis.toFixed(2)," AU"]})]}),(0,t.jsxs)("div",{className:"p-2 bg-gray-800/50 rounded border border-gray-700/50",children:[(0,t.jsx)("span",{className:"text-gray-500 block text-xs",children:"Total Energy"}),(0,t.jsxs)("div",{className:"font-mono text-amber-400",children:[r.totalEnergy.toFixed(2)," J"]})]}),(0,t.jsxs)("div",{className:"p-2 bg-gray-800/50 rounded border border-gray-700/50",children:[(0,t.jsx)("span",{className:"text-gray-500 block text-xs",children:"Angular Momentum"}),(0,t.jsxs)("div",{className:"font-mono text-purple-400",children:[r.angularMomentum.toFixed(2)," kg·m²/s"]})]})]}),B&&r.secondPlanetData&&(0,t.jsxs)("div",{className:"mt-3 p-3 bg-pink-900/20 rounded-lg border border-pink-700/30",children:[(0,t.jsx)("div",{className:"text-xs text-pink-400 mb-2 font-medium",children:"Second Planet"}),(0,t.jsxs)("div",{className:"grid grid-cols-3 gap-2 text-xs",children:[(0,t.jsxs)("div",{className:"p-2 bg-gray-800/50 rounded",children:[(0,t.jsx)("span",{className:"text-gray-500 block",children:"Distance"}),(0,t.jsxs)("div",{className:"font-mono text-pink-400",children:[r.secondPlanetData.distance.toFixed(2)," AU"]})]}),(0,t.jsxs)("div",{className:"p-2 bg-gray-800/50 rounded",children:[(0,t.jsx)("span",{className:"text-gray-500 block",children:"Velocity"}),(0,t.jsxs)("div",{className:"font-mono text-pink-400",children:[r.secondPlanetData.velocity.toFixed(2)," km/s"]})]}),(0,t.jsxs)("div",{className:"p-2 bg-gray-800/50 rounded",children:[(0,t.jsx)("span",{className:"text-gray-500 block",children:"Orbit"}),R(r.secondPlanetData.orbitType)]})]})]})]}):(0,t.jsx)("div",{className:"text-center text-gray-500 text-sm py-8",children:"Waiting for simulation data..."});return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(l.ExperimentContainer,{title:"Gravitational Orbits",description:"Explore orbital mechanics and gravitational interactions",cameraPosition:[50,30,50],backgroundColor:"#050510",controls:null,dataPanel:null,children:(0,t.jsx)(o,{onDataChange:s,starMass:S,planetMass:j,secondPlanetMass:M,initialDistance:C,initialVelocity:L,showTrail:N,showVectors:P,showSecondPlanet:B,resetTrigger:v})}),(0,t.jsx)(u.SimulationController,{isPlaying:h,onPlayPause:()=>x(e=>!e),onReset:()=>{b(e=>e+1),x(!0),g(1)},speed:y,onSpeedChange:g,timeElapsed:0}),(0,t.jsx)(d.FloatingControlPanel,{title:"⚙️ Orbital Parameters",initialPosition:{x:20,y:80},children:k}),(0,t.jsx)(f.DataPanel,{isVisible:a,onToggle:()=>m(!a),children:G})]})}],23542)}]);
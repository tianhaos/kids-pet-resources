(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,i;var n=e.i(31067),r=e.i(71645),s=e.i(90072),a=e.i(48546),o=s,l=s;let d=new l.Box3,c=new l.Vector3;class f extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(i,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let n=new l.InstancedInterleavedBuffer(i,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(n,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),d.setFromBufferAttribute(t),this.boundingBox.union(d))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let r=0,s=e.count;r<s;r++)c.fromBufferAttribute(e,r),n=Math.max(n,i.distanceToSquared(c)),c.fromBufferAttribute(t,r),n=Math.max(n,i.distanceToSquared(c));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var u=s,p=e.i(8560),h=e.i(31497);class m extends u.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:u.UniformsUtils.clone(u.UniformsUtils.merge([p.UniformsLib.common,p.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new u.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let v=h.version>=125?"uv1":"uv2",g=new o.Vector4,x=new o.Vector3,y=new o.Vector3,b=new o.Vector4,S=new o.Vector4,w=new o.Vector4,E=new o.Vector3,A=new o.Matrix4,j=new o.Line3,L=new o.Vector3,C=new o.Box3,_=new o.Sphere,M=new o.Vector4;function U(e,t,n){return M.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),M.multiplyScalar(1/M.w),M.x=i/n.width,M.y=i/n.height,M.applyMatrix4(e.projectionMatrixInverse),M.multiplyScalar(1/M.w),Math.abs(Math.max(M.x,M.y))}class z extends o.Mesh{constructor(e=new f,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let e=0,r=0,s=t.count;e<s;e++,r+=2)x.fromBufferAttribute(t,e),y.fromBufferAttribute(i,e),n[r]=0===r?0:n[r-1],n[r+1]=n[r]+x.distanceTo(y);let r=new o.InstancedInterleavedBuffer(n,2,1);return e.setAttribute("instanceDistanceStart",new o.InterleavedBufferAttribute(r,1,0)),e.setAttribute("instanceDistanceEnd",new o.InterleavedBufferAttribute(r,1,1)),this}raycast(e,n){let r,s,a=this.material.worldUnits,l=e.camera;null!==l||a||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let d=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let c=this.matrixWorld,f=this.geometry,u=this.material;if(i=u.linewidth+d,null===f.boundingSphere&&f.computeBoundingSphere(),_.copy(f.boundingSphere).applyMatrix4(c),a)r=.5*i;else{let e=Math.max(l.near,_.distanceToPoint(t.origin));r=U(l,e,u.resolution)}if(_.radius+=r,!1!==t.intersectsSphere(_)){if(null===f.boundingBox&&f.computeBoundingBox(),C.copy(f.boundingBox).applyMatrix4(c),a)s=.5*i;else{let e=Math.max(l.near,C.distanceToPoint(t.origin));s=U(l,e,u.resolution)}C.expandByScalar(s),!1!==t.intersectsBox(C)&&(a?function(e,n){let r=e.matrixWorld,s=e.geometry,a=s.attributes.instanceStart,l=s.attributes.instanceEnd,d=Math.min(s.instanceCount,a.count);for(let s=0;s<d;s++){j.start.fromBufferAttribute(a,s),j.end.fromBufferAttribute(l,s),j.applyMatrix4(r);let d=new o.Vector3,c=new o.Vector3;t.distanceSqToSegment(j.start,j.end,c,d),c.distanceTo(d)<.5*i&&n.push({point:c,pointOnLine:d,distance:t.origin.distanceTo(c),object:e,face:null,faceIndex:s,uv:null,[v]:null})}}(this,n):function(e,n,r){let s=n.projectionMatrix,a=e.material.resolution,l=e.matrixWorld,d=e.geometry,c=d.attributes.instanceStart,f=d.attributes.instanceEnd,u=Math.min(d.instanceCount,c.count),p=-n.near;t.at(1,w),w.w=1,w.applyMatrix4(n.matrixWorldInverse),w.applyMatrix4(s),w.multiplyScalar(1/w.w),w.x*=a.x/2,w.y*=a.y/2,w.z=0,E.copy(w),A.multiplyMatrices(n.matrixWorldInverse,l);for(let n=0;n<u;n++){if(b.fromBufferAttribute(c,n),S.fromBufferAttribute(f,n),b.w=1,S.w=1,b.applyMatrix4(A),S.applyMatrix4(A),b.z>p&&S.z>p)continue;if(b.z>p){let e=b.z-S.z,t=(b.z-p)/e;b.lerp(S,t)}else if(S.z>p){let e=S.z-b.z,t=(S.z-p)/e;S.lerp(b,t)}b.applyMatrix4(s),S.applyMatrix4(s),b.multiplyScalar(1/b.w),S.multiplyScalar(1/S.w),b.x*=a.x/2,b.y*=a.y/2,S.x*=a.x/2,S.y*=a.y/2,j.start.copy(b),j.start.z=0,j.end.copy(S),j.end.z=0;let d=j.closestPointToPointParameter(E,!0);j.at(d,L);let u=o.MathUtils.lerp(b.z,S.z,d),h=u>=-1&&u<=1,m=E.distanceTo(L)<.5*i;if(h&&m){j.start.fromBufferAttribute(c,n),j.end.fromBufferAttribute(f,n),j.start.applyMatrix4(l),j.end.applyMatrix4(l);let i=new o.Vector3,s=new o.Vector3;t.distanceSqToSegment(j.start,j.end,s,i),r.push({point:s,pointOnLine:i,distance:t.origin.distanceTo(s),object:e,face:null,faceIndex:n,uv:null,[v]:null})}}}(this,l,n))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(g),this.material.uniforms.resolution.value.set(g.z,g.w))}}class B extends f{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,n=new Float32Array(2*i);if(3===t)for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];else for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5],n[2*r+6]=e[r+6],n[2*r+7]=e[r+7];return super.setColors(n,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class P extends z{constructor(e=new B,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let O=r.forwardRef(function({points:e,color:t=0xffffff,vertexColors:i,linewidth:o,lineWidth:l,segments:d,dashed:c,...u},p){var h,v;let g=(0,a.useThree)(e=>e.size),x=r.useMemo(()=>d?new z:new P,[d]),[y]=r.useState(()=>new m),b=(null==i||null==(h=i[0])?void 0:h.length)===4?4:3,S=r.useMemo(()=>{let n=d?new f:new B,r=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Vector3||e instanceof s.Vector4?[e.x,e.y,e.z]:e instanceof s.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(n.setPositions(r.flat()),i){t=0xffffff;let e=i.map(e=>e instanceof s.Color?e.toArray():e);n.setColors(e.flat(),b)}return n},[e,d,i,b]);return r.useLayoutEffect(()=>{x.computeLineDistances()},[e,x]),r.useLayoutEffect(()=>{c?y.defines.USE_DASH="":delete y.defines.USE_DASH,y.needsUpdate=!0},[c,y]),r.useEffect(()=>()=>{S.dispose(),y.dispose()},[S]),r.createElement("primitive",(0,n.default)({object:x,ref:p},u),r.createElement("primitive",{object:S,attach:"geometry"}),r.createElement("primitive",(0,n.default)({object:y,attach:"material",color:t,vertexColors:!!i,resolution:[g.width,g.height],linewidth:null!=(v=null!=o?o:l)?v:1,dashed:c,transparent:4===b},u)))});e.s(["Line",0,O],43216)},56420,e=>{"use strict";var t=e.i(71645);let i=(...e)=>e.filter((e,t,i)=>!!e&&""!==e.trim()&&i.indexOf(e)===t).join(" ").trim(),n=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,i)=>i?i.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,t.createContext)({}),a=(0,t.forwardRef)(({color:e,size:n,strokeWidth:a,absoluteStrokeWidth:o,className:l="",children:d,iconNode:c,...f},u)=>{let{size:p=24,strokeWidth:h=2,absoluteStrokeWidth:m=!1,color:v="currentColor",className:g=""}=(0,t.useContext)(s)??{},x=o??m?24*Number(a??h)/Number(n??p):a??h;return(0,t.createElement)("svg",{ref:u,...r,width:n??p??r.width,height:n??p??r.height,stroke:e??v,strokeWidth:x,className:i("lucide",g,l),...!d&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(f)&&{"aria-hidden":"true"},...f},[...c.map(([e,i])=>(0,t.createElement)(e,i)),...Array.isArray(d)?d:[d]])});e.s(["default",0,(e,r)=>{let s=(0,t.forwardRef)(({className:s,...o},l)=>(0,t.createElement)(a,{ref:l,iconNode:r,className:i(`lucide-${n(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...o}));return s.displayName=n(e),s}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,i)=>{t.exports=e.r(76562)},78837,e=>{"use strict";var t=e.i(43476),i=e.i(71645),n=e.i(92989),r=e.i(94800),s=e.i(43216);function a({real:e,imaginary:n,showPlane:o,showPolar:l,showConjugate:d,showSquare:c,rotationSpeed:f,isPlaying:u,onDataChange:p}){let h=(0,i.useRef)(null),m=(0,i.useRef)({frameCount:0,time:0}),[,v]=(0,i.useState)({}),g=Math.sqrt(e*e+n*n),x=180/Math.PI*Math.atan2(n,e),y=-n,b=e*e-n*n,S=2*e*n,w=Math.sqrt(b*b+S*S),E=(0,i.useCallback)(()=>{p?.({real:e,imaginary:n,magnitude:g,argument:x,conjugate:d?{real:e,imaginary:y}:void 0,square:c?{real:b,imaginary:S,magnitude:w}:void 0}),v({})},[e,n,g,x,d,c,e,y,b,S,w,p]);(0,r.useFrame)((e,t)=>{if(!u)return;let i=m.current;i.time+=t,i.frameCount++,h.current&&(h.current.rotation.z=i.time*f*.1),i.frameCount%8==0&&E()});let A=(0,i.useMemo)(()=>{let e=[];for(let t=0;t<=120;t++){let i=t/120*Math.PI*2;e.push([g*Math.cos(i),g*Math.sin(i),0])}return e},[g]),j=(0,i.useMemo)(()=>{let t=[],i=Math.atan2(n,e);for(let e=0;e<=30;e++){let n=e/30*i;t.push([.5*Math.cos(n),.5*Math.sin(n),0])}return t},[e,n]),L=(0,i.useMemo)(()=>{if(!d)return[];let t=(e+e)/2,i=(n+y)/2;return[[t-.3,i,0],[t+.3,i,0]]},[d,e,n,e,y]),C=(0,i.useMemo)(()=>c?[[0,0,0],[e/2,n/2,0]]:[],[c,e,n]);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("ambientLight",{intensity:.5}),(0,t.jsx)("pointLight",{position:[10,10,10],intensity:1}),(0,t.jsx)("pointLight",{position:[-10,-5,-10],intensity:.3,color:"#fbbf24"}),(0,t.jsxs)("group",{ref:h,children:[o&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("gridHelper",{args:[10,20,"#1a1a3e","#1a1a3e"],position:[0,0,0],rotation:[0,0,0]}),(0,t.jsx)(s.Line,{points:[[-5,0,0],[5,0,0]],color:"#3b82f6",lineWidth:3}),(0,t.jsx)(s.Line,{points:[[0,-5,0],[0,5,0]],color:"#ef4444",lineWidth:3})]}),(0,t.jsx)(s.Line,{points:[[0,0,0],[e,n,0]],color:"#fbbf24",lineWidth:4}),(0,t.jsxs)("mesh",{position:[e,n,0],children:[(0,t.jsx)("sphereGeometry",{args:[.12,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#fbbf24",emissive:"#fbbf24",emissiveIntensity:.6})]}),l&&g>.1&&(0,t.jsx)(s.Line,{points:A,color:"#22c55e",lineWidth:2,opacity:.5,transparent:!0}),l&&g>.1&&(0,t.jsx)(s.Line,{points:j,color:"#a855f7",lineWidth:2}),d&&0!==n&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.Line,{points:[[0,0,0],[e,y,0]],color:"#06b6d4",lineWidth:3,opacity:.7}),(0,t.jsxs)("mesh",{position:[e,y,0],children:[(0,t.jsx)("sphereGeometry",{args:[.1,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#06b6d4",emissive:"#06b6d4",emissiveIntensity:.4})]}),(0,t.jsx)(s.Line,{points:L,color:"#94a3b8",lineWidth:1,opacity:.5})]}),c&&g>.1&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.Line,{points:C,color:"#f97316",lineWidth:2,opacity:.5}),(0,t.jsx)(s.Line,{points:[[0,0,0],[b,S,0]],color:"#f97316",lineWidth:3,opacity:.8}),(0,t.jsxs)("mesh",{position:[b,S,0],children:[(0,t.jsx)("sphereGeometry",{args:[.1,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#f97316",emissive:"#f97316",emissiveIntensity:.5})]})]}),(0,t.jsxs)("mesh",{position:[0,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[.08,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#ffffff",emissive:"#ffffff",emissiveIntensity:.5})]})]}),(0,t.jsxs)("mesh",{position:[0,5.5,0],children:[(0,t.jsx)("planeGeometry",{args:[6,.5]}),(0,t.jsx)("meshBasicMaterial",{color:"#fbbf24",transparent:!0,opacity:.8})]}),(0,t.jsxs)("mesh",{position:[5.5,-.3,0],children:[(0,t.jsx)("planeGeometry",{args:[.8,.4]}),(0,t.jsx)("meshBasicMaterial",{color:"#3b82f6"})]}),(0,t.jsxs)("mesh",{position:[-.4,5.5,0],children:[(0,t.jsx)("planeGeometry",{args:[.8,.4]}),(0,t.jsx)("meshBasicMaterial",{color:"#ef4444"})]})]})}e.i(81413);var o=e.i(48205),l=e.i(82192),d=e.i(68647),c=e.i(14228),f=e.i(4685);e.s(["default",0,function(){let e=(0,n.useRouter)(),[r,s]=(0,i.useState)(null),[u,p]=(0,i.useState)(!0),[h,m]=(0,i.useState)(!0),[v,g]=(0,i.useState)(1),[x,y]=(0,i.useState)(0),[b,S]=(0,i.useState)(2),[w,E]=(0,i.useState)(1.5),[A,j]=(0,i.useState)(!0),[L,C]=(0,i.useState)(!0),[_,M]=(0,i.useState)(!0),[U,z]=(0,i.useState)(!0),[B,P]=(0,i.useState)(.5),O=(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)(d.ControlGroup,{title:"Complex Number",children:[(0,t.jsx)(d.ControlSlider,{label:"Real Part",value:b,unit:"",min:-4,max:4,step:.1,color:"#3b82f6",onChange:S,decimals:1}),(0,t.jsx)(d.ControlSlider,{label:"Imaginary Part",value:w,unit:"i",min:-4,max:4,step:.1,color:"#ef4444",onChange:E,decimals:1})]}),(0,t.jsxs)(d.ControlGroup,{title:"Display",children:[[{label:"Show Plane",checked:A,onChange:j},{label:"Polar Form",checked:L,onChange:C},{label:"Conjugate",checked:_,onChange:M},{label:"Square (z²)",checked:U,onChange:z}].map(e=>(0,t.jsxs)("label",{className:"flex items-center justify-between text-sm text-gray-700 cursor-pointer py-2 px-3 bg-gray-100/50 rounded-lg border border-gray-300/50",children:[(0,t.jsx)("span",{children:e.label}),(0,t.jsx)("input",{type:"checkbox",checked:e.checked,onChange:t=>e.onChange(t.target.checked),className:"w-4 h-4 rounded",style:{accentColor:"Conjugate"===e.label?"#06b6d4":"Square (z²)"===e.label?"#f97316":"#f43f5e"}})]},e.label)),(0,t.jsx)(d.ControlSlider,{label:"Rotation Speed",value:B,unit:"",min:0,max:2,step:.1,color:"#fbbf24",onChange:P,decimals:1})]}),(0,t.jsx)("button",{onClick:()=>e.push("/experiments/complex-numbers/details"),className:"w-full py-2.5 bg-gradient-to-r from-rose-100 to-rose-200 hover:from-rose-200 hover:to-rose-300 text-rose-700 font-medium text-sm rounded-lg transition-all border border-rose-300/50 flex items-center justify-center gap-2",children:"📖 View Experiment Details"})]}),D=r?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(d.DataGrid,{data:{real:{value:r.real,unit:"Re",color:"#3b82f6",decimals:2},imaginary:{value:r.imaginary,unit:"Im",color:"#ef4444",decimals:2},magnitude:{value:r.magnitude,unit:"|z|",color:"#fbbf24",decimals:2},argument:{value:r.argument,unit:"°",color:"#a855f7",decimals:1}},columns:2}),(0,t.jsx)("div",{className:"mt-3 p-3 bg-gray-800/50 rounded-lg",children:(0,t.jsxs)("div",{className:"text-center font-mono text-rose-400 text-sm",children:["z = ",r.real.toFixed(2)," + ",r.imaginary.toFixed(2),"i"]})})]}):(0,t.jsx)("div",{className:"text-center text-gray-500 text-sm py-8",children:"Waiting for simulation data..."});return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(o.ExperimentContainer,{title:"Complex Numbers",description:"Explore the Argand plane and complex arithmetic",cameraPosition:[10,8,10],backgroundColor:"#050510",controls:null,dataPanel:null,children:(0,t.jsx)(a,{onDataChange:s,real:b,imaginary:w,showPlane:A,showPolar:L,showConjugate:_,showSquare:U,rotationSpeed:B,isPlaying:h})}),(0,t.jsx)(c.SimulationController,{isPlaying:h,onPlayPause:()=>m(e=>!e),onReset:()=>{y(e=>e+1),m(!0),g(1),S(2),E(1.5)},speed:v,onSpeedChange:g}),(0,t.jsx)(l.FloatingControlPanel,{title:"⚙️ Complex Settings",initialPosition:{x:20,y:80},children:O}),(0,t.jsx)(f.DataPanel,{isVisible:u,onToggle:()=>p(!u),children:D})]})}],78837)}]);
(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,i;var r=e.i(31067),n=e.i(71645),s=e.i(90072),o=e.i(48546),a=s,l=s;let d=new l.Box3,c=new l.Vector3;class u extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(i,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let r=new l.InstancedInterleavedBuffer(i,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(r,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(r,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),d.setFromBufferAttribute(t),this.boundingBox.union(d))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let r=0;for(let n=0,s=e.count;n<s;n++)c.fromBufferAttribute(e,n),r=Math.max(r,i.distanceToSquared(c)),c.fromBufferAttribute(t,n),r=Math.max(r,i.distanceToSquared(c));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var f=s,p=e.i(8560),h=e.i(31497);class m extends f.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:f.UniformsUtils.clone(f.UniformsUtils.merge([p.UniformsLib.common,p.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new f.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let x=h.version>=125?"uv1":"uv2",v=new a.Vector4,y=new a.Vector3,g=new a.Vector3,b=new a.Vector4,S=new a.Vector4,w=new a.Vector4,j=new a.Vector3,M=new a.Matrix4,L=new a.Line3,E=new a.Vector3,C=new a.Box3,P=new a.Sphere,A=new a.Vector4;function _(e,t,r){return A.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),A.multiplyScalar(1/A.w),A.x=i/r.width,A.y=i/r.height,A.applyMatrix4(e.projectionMatrixInverse),A.multiplyScalar(1/A.w),Math.abs(Math.max(A.x,A.y))}class z extends a.Mesh{constructor(e=new u,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,n=0,s=t.count;e<s;e++,n+=2)y.fromBufferAttribute(t,e),g.fromBufferAttribute(i,e),r[n]=0===n?0:r[n-1],r[n+1]=r[n]+y.distanceTo(g);let n=new a.InstancedInterleavedBuffer(r,2,1);return e.setAttribute("instanceDistanceStart",new a.InterleavedBufferAttribute(n,1,0)),e.setAttribute("instanceDistanceEnd",new a.InterleavedBufferAttribute(n,1,1)),this}raycast(e,r){let n,s,o=this.material.worldUnits,l=e.camera;null!==l||o||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let d=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let c=this.matrixWorld,u=this.geometry,f=this.material;if(i=f.linewidth+d,null===u.boundingSphere&&u.computeBoundingSphere(),P.copy(u.boundingSphere).applyMatrix4(c),o)n=.5*i;else{let e=Math.max(l.near,P.distanceToPoint(t.origin));n=_(l,e,f.resolution)}if(P.radius+=n,!1!==t.intersectsSphere(P)){if(null===u.boundingBox&&u.computeBoundingBox(),C.copy(u.boundingBox).applyMatrix4(c),o)s=.5*i;else{let e=Math.max(l.near,C.distanceToPoint(t.origin));s=_(l,e,f.resolution)}C.expandByScalar(s),!1!==t.intersectsBox(C)&&(o?function(e,r){let n=e.matrixWorld,s=e.geometry,o=s.attributes.instanceStart,l=s.attributes.instanceEnd,d=Math.min(s.instanceCount,o.count);for(let s=0;s<d;s++){L.start.fromBufferAttribute(o,s),L.end.fromBufferAttribute(l,s),L.applyMatrix4(n);let d=new a.Vector3,c=new a.Vector3;t.distanceSqToSegment(L.start,L.end,c,d),c.distanceTo(d)<.5*i&&r.push({point:c,pointOnLine:d,distance:t.origin.distanceTo(c),object:e,face:null,faceIndex:s,uv:null,[x]:null})}}(this,r):function(e,r,n){let s=r.projectionMatrix,o=e.material.resolution,l=e.matrixWorld,d=e.geometry,c=d.attributes.instanceStart,u=d.attributes.instanceEnd,f=Math.min(d.instanceCount,c.count),p=-r.near;t.at(1,w),w.w=1,w.applyMatrix4(r.matrixWorldInverse),w.applyMatrix4(s),w.multiplyScalar(1/w.w),w.x*=o.x/2,w.y*=o.y/2,w.z=0,j.copy(w),M.multiplyMatrices(r.matrixWorldInverse,l);for(let r=0;r<f;r++){if(b.fromBufferAttribute(c,r),S.fromBufferAttribute(u,r),b.w=1,S.w=1,b.applyMatrix4(M),S.applyMatrix4(M),b.z>p&&S.z>p)continue;if(b.z>p){let e=b.z-S.z,t=(b.z-p)/e;b.lerp(S,t)}else if(S.z>p){let e=S.z-b.z,t=(S.z-p)/e;S.lerp(b,t)}b.applyMatrix4(s),S.applyMatrix4(s),b.multiplyScalar(1/b.w),S.multiplyScalar(1/S.w),b.x*=o.x/2,b.y*=o.y/2,S.x*=o.x/2,S.y*=o.y/2,L.start.copy(b),L.start.z=0,L.end.copy(S),L.end.z=0;let d=L.closestPointToPointParameter(j,!0);L.at(d,E);let f=a.MathUtils.lerp(b.z,S.z,d),h=f>=-1&&f<=1,m=j.distanceTo(E)<.5*i;if(h&&m){L.start.fromBufferAttribute(c,r),L.end.fromBufferAttribute(u,r),L.start.applyMatrix4(l),L.end.applyMatrix4(l);let i=new a.Vector3,s=new a.Vector3;t.distanceSqToSegment(L.start,L.end,s,i),n.push({point:s,pointOnLine:i,distance:t.origin.distanceTo(s),object:e,face:null,faceIndex:r,uv:null,[x]:null})}}}(this,l,r))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(v),this.material.uniforms.resolution.value.set(v.z,v.w))}}class N extends u{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let r=0;r<t;r+=3)i[2*r]=e[r],i[2*r+1]=e[r+1],i[2*r+2]=e[r+2],i[2*r+3]=e[r+3],i[2*r+4]=e[r+4],i[2*r+5]=e[r+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,r=new Float32Array(2*i);if(3===t)for(let n=0;n<i;n+=t)r[2*n]=e[n],r[2*n+1]=e[n+1],r[2*n+2]=e[n+2],r[2*n+3]=e[n+3],r[2*n+4]=e[n+4],r[2*n+5]=e[n+5];else for(let n=0;n<i;n+=t)r[2*n]=e[n],r[2*n+1]=e[n+1],r[2*n+2]=e[n+2],r[2*n+3]=e[n+3],r[2*n+4]=e[n+4],r[2*n+5]=e[n+5],r[2*n+6]=e[n+6],r[2*n+7]=e[n+7];return super.setColors(r,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class U extends z{constructor(e=new N,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let B=n.forwardRef(function({points:e,color:t=0xffffff,vertexColors:i,linewidth:a,lineWidth:l,segments:d,dashed:c,...f},p){var h,x;let v=(0,o.useThree)(e=>e.size),y=n.useMemo(()=>d?new z:new U,[d]),[g]=n.useState(()=>new m),b=(null==i||null==(h=i[0])?void 0:h.length)===4?4:3,S=n.useMemo(()=>{let r=d?new u:new N,n=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Vector3||e instanceof s.Vector4?[e.x,e.y,e.z]:e instanceof s.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(r.setPositions(n.flat()),i){t=0xffffff;let e=i.map(e=>e instanceof s.Color?e.toArray():e);r.setColors(e.flat(),b)}return r},[e,d,i,b]);return n.useLayoutEffect(()=>{y.computeLineDistances()},[e,y]),n.useLayoutEffect(()=>{c?g.defines.USE_DASH="":delete g.defines.USE_DASH,g.needsUpdate=!0},[c,g]),n.useEffect(()=>()=>{S.dispose(),g.dispose()},[S]),n.createElement("primitive",(0,r.default)({object:y,ref:p},f),n.createElement("primitive",{object:S,attach:"geometry"}),n.createElement("primitive",(0,r.default)({object:g,attach:"material",color:t,vertexColors:!!i,resolution:[v.width,v.height],linewidth:null!=(x=null!=a?a:l)?x:1,dashed:c,transparent:4===b},f)))});e.s(["Line",0,B],43216)},60099,e=>{"use strict";let t,i;var r=e.i(31067),n=e.i(71645),s=e.i(88014),o=e.i(90072),a=e.i(48546),l=e.i(94800);let d=new o.Vector3,c=new o.Vector3,u=new o.Vector3,f=new o.Vector2;function p(e,t,i){let r=d.setFromMatrixPosition(e.matrixWorld);r.project(t);let n=i.width/2,s=i.height/2;return[r.x*n+n,-(r.y*s)+s]}let h=e=>1e-10>Math.abs(e)?0:e;function m(e,t,i=""){let r="matrix3d(";for(let i=0;16!==i;i++)r+=h(t[i]*e.elements[i])+(15!==i?",":")");return i+r}let x=(t=[1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1],e=>m(e,t)),v=(i=e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1],(e,t)=>m(e,i(t),"translate(-50%,-50%)")),y=n.forwardRef(({children:e,eps:t=.001,style:i,className:m,prepend:y,center:g,fullscreen:b,portal:S,distanceFactor:w,sprite:j=!1,transform:M=!1,occlude:L,onOcclude:E,castShadow:C,receiveShadow:P,material:A,geometry:_,zIndexRange:z=[0x1000037,0],calculatePosition:N=p,as:U="div",wrapperClass:B,pointerEvents:R="auto",...I},O)=>{let{gl:H,camera:D,scene:T,size:W,raycaster:F,events:V,viewport:G}=(0,a.useThree)(),[k]=n.useState(()=>document.createElement(U)),$=n.useRef(null),q=n.useRef(null),Z=n.useRef(0),K=n.useRef([0,0]),J=n.useRef(null),X=n.useRef(null),Q=(null==S?void 0:S.current)||V.connected||H.domElement.parentNode,Y=n.useRef(null),ee=n.useRef(!1),et=n.useMemo(()=>{var e;return L&&"blending"!==L||Array.isArray(L)&&L.length&&(e=L[0])&&"object"==typeof e&&"current"in e},[L]);n.useLayoutEffect(()=>{let e=H.domElement;L&&"blending"===L?(e.style.zIndex=`${Math.floor(z[0]/2)}`,e.style.position="absolute",e.style.pointerEvents="none"):(e.style.zIndex=null,e.style.position=null,e.style.pointerEvents=null)},[L]),n.useLayoutEffect(()=>{if(q.current){let e=$.current=s.createRoot(k);if(T.updateMatrixWorld(),M)k.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";else{let e=N(q.current,D,W);k.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${e[0]}px,${e[1]}px,0);transform-origin:0 0;`}return Q&&(y?Q.prepend(k):Q.appendChild(k)),()=>{Q&&Q.removeChild(k),e.unmount()}}},[Q,M]),n.useLayoutEffect(()=>{B&&(k.className=B)},[B]);let ei=n.useMemo(()=>M?{position:"absolute",top:0,left:0,width:W.width,height:W.height,transformStyle:"preserve-3d",pointerEvents:"none"}:{position:"absolute",transform:g?"translate3d(-50%,-50%,0)":"none",...b&&{top:-W.height/2,left:-W.width/2,width:W.width,height:W.height},...i},[i,g,b,W,M]),er=n.useMemo(()=>({position:"absolute",pointerEvents:R}),[R]);n.useLayoutEffect(()=>{var t,r;ee.current=!1,M?null==(t=$.current)||t.render(n.createElement("div",{ref:J,style:ei},n.createElement("div",{ref:X,style:er},n.createElement("div",{ref:O,className:m,style:i,children:e})))):null==(r=$.current)||r.render(n.createElement("div",{ref:O,style:ei,className:m,children:e}))});let en=n.useRef(!0);(0,l.useFrame)(e=>{if(q.current){D.updateMatrixWorld(),q.current.updateWorldMatrix(!0,!1);let e=M?K.current:N(q.current,D,W);if(M||Math.abs(Z.current-D.zoom)>t||Math.abs(K.current[0]-e[0])>t||Math.abs(K.current[1]-e[1])>t){var i;let t,r,n,s,a=(i=q.current,t=d.setFromMatrixPosition(i.matrixWorld),r=c.setFromMatrixPosition(D.matrixWorld),n=t.sub(r),s=D.getWorldDirection(u),n.angleTo(s)>Math.PI/2),l=!1;et&&(Array.isArray(L)?l=L.map(e=>e.current):"blending"!==L&&(l=[T]));let p=en.current;l?en.current=function(e,t,i,r){let n=d.setFromMatrixPosition(e.matrixWorld),s=n.clone();s.project(t),f.set(s.x,s.y),i.setFromCamera(f,t);let o=i.intersectObjects(r,!0);if(o.length){let e=o[0].distance;return n.distanceTo(i.ray.origin)<e}return!0}(q.current,D,F,l)&&!a:en.current=!a,p!==en.current&&(E?E(!en.current):k.style.display=en.current?"block":"none");let m=Math.floor(z[0]/2),y=L?et?[z[0],m]:[m-1,0]:z;if(k.style.zIndex=`${function(e,t,i){if(t instanceof o.PerspectiveCamera||t instanceof o.OrthographicCamera){let r=d.setFromMatrixPosition(e.matrixWorld),n=c.setFromMatrixPosition(t.matrixWorld),s=r.distanceTo(n),o=(i[1]-i[0])/(t.far-t.near),a=i[1]-o*t.far;return Math.round(o*s+a)}}(q.current,D,y)}`,M){let[e,t]=[W.width/2,W.height/2],i=D.projectionMatrix.elements[5]*t,{isOrthographicCamera:r,top:n,left:s,bottom:o,right:a}=D,l=x(D.matrixWorldInverse),d=r?`scale(${i})translate(${h(-(a+s)/2)}px,${h((n+o)/2)}px)`:`translateZ(${i}px)`,c=q.current.matrixWorld;j&&((c=D.matrixWorldInverse.clone().transpose().copyPosition(c).scale(q.current.scale)).elements[3]=c.elements[7]=c.elements[11]=0,c.elements[15]=1),k.style.width=W.width+"px",k.style.height=W.height+"px",k.style.perspective=r?"":`${i}px`,J.current&&X.current&&(J.current.style.transform=`${d}${l}translate(${e}px,${t}px)`,X.current.style.transform=v(c,1/((w||10)/400)))}else{let t=void 0===w?1:function(e,t){if(t instanceof o.OrthographicCamera)return t.zoom;if(!(t instanceof o.PerspectiveCamera))return 1;{let i=d.setFromMatrixPosition(e.matrixWorld),r=c.setFromMatrixPosition(t.matrixWorld);return 1/(2*Math.tan(t.fov*Math.PI/180/2)*i.distanceTo(r))}}(q.current,D)*w;k.style.transform=`translate3d(${e[0]}px,${e[1]}px,0) scale(${t})`}K.current=e,Z.current=D.zoom}}if(!et&&Y.current&&!ee.current)if(M){if(J.current){let e=J.current.children[0];if(null!=e&&e.clientWidth&&null!=e&&e.clientHeight){let{isOrthographicCamera:t}=D;if(t||_)I.scale&&(Array.isArray(I.scale)?I.scale instanceof o.Vector3?Y.current.scale.copy(I.scale.clone().divideScalar(1)):Y.current.scale.set(1/I.scale[0],1/I.scale[1],1/I.scale[2]):Y.current.scale.setScalar(1/I.scale));else{let t=(w||10)/400,i=e.clientWidth*t,r=e.clientHeight*t;Y.current.scale.set(i,r,1)}ee.current=!0}}}else{let t=k.children[0];if(null!=t&&t.clientWidth&&null!=t&&t.clientHeight){let e=1/G.factor,i=t.clientWidth*e,r=t.clientHeight*e;Y.current.scale.set(i,r,1),ee.current=!0}Y.current.lookAt(e.camera.position)}});let es=n.useMemo(()=>({vertexShader:M?void 0:`
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
      `}),[M]);return n.createElement("group",(0,r.default)({},I,{ref:q}),L&&!et&&n.createElement("mesh",{castShadow:C,receiveShadow:P,ref:Y},_||n.createElement("planeGeometry",null),A||n.createElement("shaderMaterial",{side:o.DoubleSide,vertexShader:es.vertexShader,fragmentShader:es.fragmentShader})))});e.s(["Html",0,y])},56420,e=>{"use strict";var t=e.i(71645);let i=(...e)=>e.filter((e,t,i)=>!!e&&""!==e.trim()&&i.indexOf(e)===t).join(" ").trim(),r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,i)=>i?i.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var n={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,t.createContext)({}),o=(0,t.forwardRef)(({color:e,size:r,strokeWidth:o,absoluteStrokeWidth:a,className:l="",children:d,iconNode:c,...u},f)=>{let{size:p=24,strokeWidth:h=2,absoluteStrokeWidth:m=!1,color:x="currentColor",className:v=""}=(0,t.useContext)(s)??{},y=a??m?24*Number(o??h)/Number(r??p):o??h;return(0,t.createElement)("svg",{ref:f,...n,width:r??p??n.width,height:r??p??n.height,stroke:e??x,strokeWidth:y,className:i("lucide",v,l),...!d&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...c.map(([e,i])=>(0,t.createElement)(e,i)),...Array.isArray(d)?d:[d]])});e.s(["default",0,(e,n)=>{let s=(0,t.forwardRef)(({className:s,...a},l)=>(0,t.createElement)(o,{ref:l,iconNode:n,className:i(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...a}));return s.displayName=r(e),s}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,i)=>{t.exports=e.r(76562)},13046,e=>{"use strict";var t=e.i(43476),i=e.i(71645);e.i(81413);var r=e.i(48205),n=e.i(14228),s=e.i(82192),o=e.i(4685),a=e.i(68647),l=e.i(94800),d=e.i(30297),c=e.i(60099),u=e.i(43216),f=e.i(90072);let p={0:{name:"Producers",color:"#22c55e",size:.18,speed:0,energyValue:100},1:{name:"Primary Consumers",color:"#3b82f6",size:.3,speed:.018,energyValue:10},2:{name:"Secondary Consumers",color:"#f59e0b",size:.45,speed:.025,energyValue:1},3:{name:"Apex Predators",color:"#ef4444",size:.65,speed:.03,energyValue:.1}};function h({onDataChange:e,isPlaying:r=!0,simulationSpeed:n=1,resetTrigger:s=0,initialProducerPop:o=30,initialPrimaryPop:a=15,initialSecondaryPop:m=6,initialApexPop:x=2,reproductionRate:v=.5,predationRate:y=.3,speed:g=1}){let b=(0,i.useRef)(null),S=(0,i.useRef)(0),w=(0,i.useRef)([]),j=(0,i.useRef)([]),M=(0,i.useRef)(0),L=(0,i.useRef)(0),[E,C]=(0,i.useState)({producerCount:o,primaryCount:a,secondaryCount:m,apexCount:x,totalEnergy:1e3,generation:0,biodiversityIndex:1.5});(0,i.useEffect)(()=>{let e=[],t=0;for(let i=0;i<o;i++)e.push({id:t++,position:[(Math.random()-.5)*14,0,(Math.random()-.5)*14],velocity:[0,0,0],trophicLevel:0,alive:!0,energy:100,age:0});for(let i=0;i<a;i++)e.push({id:t++,position:[(Math.random()-.5)*12,.3,(Math.random()-.5)*12],velocity:[(Math.random()-.5)*.01,0,(Math.random()-.5)*.01],trophicLevel:1,alive:!0,energy:80,age:0});for(let i=0;i<m;i++)e.push({id:t++,position:[(Math.random()-.5)*10,.5,(Math.random()-.5)*10],velocity:[(Math.random()-.5)*.015,0,(Math.random()-.5)*.015],trophicLevel:2,alive:!0,energy:100,age:0});for(let i=0;i<x;i++)e.push({id:t++,position:[(Math.random()-.5)*8,.7,(Math.random()-.5)*8],velocity:[(Math.random()-.5)*.02,0,(Math.random()-.5)*.02],trophicLevel:3,alive:!0,energy:150,age:0});w.current=e,j.current=[],M.current=0,L.current=0},[s,o,a,m,x]),(0,l.useFrame)((t,i)=>{if(!b.current||!r)return;S.current++,M.current+=i*n*g;let s=w.current;if(s.forEach(e=>{if(!e.alive)return;let t=p[e.trophicLevel];if(e.trophicLevel>0){e.velocity[0]+=(Math.random()-.5)*.006*n,e.velocity[2]+=(Math.random()-.5)*.006*n;let r=Math.sqrt(e.velocity[0]**2+e.velocity[2]**2);if(r>t.speed){let i=t.speed/r;e.velocity[0]*=i,e.velocity[2]*=i}if(e.position[0]+=e.velocity[0]*n,e.position[2]+=e.velocity[2]*n,e.position[0]>7&&(e.position[0]=-7),e.position[0]<-7&&(e.position[0]=7),e.position[2]>7&&(e.position[2]=-7),e.position[2]<-7&&(e.position[2]=7),e.energy-=i*(2+e.trophicLevel)*n,e.energy<70){let t=e.trophicLevel-1,i=s.find(i=>i.alive&&i.trophicLevel===t&&1>Math.sqrt((i.position[0]-e.position[0])**2+(i.position[2]-e.position[2])**2));i&&Math.random()<y&&(i.alive=!1,e.energy=Math.min(150,e.energy+50))}e.energy<=0&&(e.alive=!1)}else e.energy=Math.min(100,e.energy+12*i*n);e.age+=i*n}),Math.random()<v*i*n){let e=s.find(e=>e.alive&&e.energy>90&&e.trophicLevel>0&&.12>Math.random());e&&(e.energy-=45,s.push({id:s.length,position:[e.position[0]+(Math.random()-.5)*2,e.position[1],e.position[2]+(Math.random()-.5)*2],velocity:[(Math.random()-.5)*.01,0,(Math.random()-.5)*.01],trophicLevel:e.trophicLevel,alive:!0,energy:45,age:0}))}if(s.filter(e=>e.alive&&0===e.trophicLevel).length<o&&Math.random()<.12*n&&s.push({id:s.length,position:[(Math.random()-.5)*14,0,(Math.random()-.5)*14],velocity:[0,0,0],trophicLevel:0,alive:!0,energy:50,age:0}),Math.floor(M.current)>Math.floor(M.current-i*n)){let e={p:s.filter(e=>e.alive&&0===e.trophicLevel).length,pr:s.filter(e=>e.alive&&1===e.trophicLevel).length,s:s.filter(e=>e.alive&&2===e.trophicLevel).length,a:s.filter(e=>e.alive&&3===e.trophicLevel).length};j.current.push(e),j.current.length>60&&j.current.shift(),L.current++}if(S.current%8==0){let t=s.filter(e=>e.alive),i={producers:t.filter(e=>0===e.trophicLevel).length,primary:t.filter(e=>1===e.trophicLevel).length,secondary:t.filter(e=>2===e.trophicLevel).length,apex:t.filter(e=>3===e.trophicLevel).length},r=t.length,n=-[i.producers/r,i.primary/r,i.secondary/r,i.apex/r].filter(e=>e>0).reduce((e,t)=>e+t*Math.log(t),0),o=100*i.producers+10*i.primary+ +i.secondary+.1*i.apex,a={producerCount:i.producers,primaryCount:i.primary,secondaryCount:i.secondary,apexCount:i.apex,totalEnergy:Math.round(o),generation:L.current,biodiversityIndex:Math.round(100*n)/100};C(a),e?.(a)}});let P=(0,i.useMemo)(()=>{let e=j.current;if(e.length<2)return[[],[],[],[]];let t=Math.max(...e.map(e=>Math.max(e.p,e.pr,e.s,e.a)),1);return[e.map((e,i)=>[-5+.18*i,2,-4+e.p/t*2.5]),e.map((e,i)=>[-5+.18*i,1.2,-4+e.pr/t*2.5]),e.map((e,i)=>[-5+.18*i,.4,-4+e.s/t*2.5]),e.map((e,i)=>[-5+.18*i,-.4,-4+e.a/t*2.5])]},[E]),A=(0,i.useMemo)(()=>w.current.filter(e=>e.alive).map(e=>(0,t.jsxs)("group",{position:e.position,children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[p[e.trophicLevel].size,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:p[e.trophicLevel].color,emissive:p[e.trophicLevel].color,emissiveIntensity:.35,roughness:.5,metalness:.3})]}),e.energy>90&&(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[1.4*p[e.trophicLevel].size,8,8]}),(0,t.jsx)("meshBasicMaterial",{color:p[e.trophicLevel].color,transparent:!0,opacity:.3,blending:f.AdditiveBlending})]}),e.trophicLevel>0&&(0,t.jsxs)("mesh",{rotation:[Math.PI/2,0,0],children:[(0,t.jsx)("torusGeometry",{args:[1.2*p[e.trophicLevel].size,.02,8,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#ffffff",emissive:"#ffffff",emissiveIntensity:.3})]})]},e.id)),[E]);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("ambientLight",{intensity:.5}),(0,t.jsx)("directionalLight",{position:[10,15,10],intensity:.8,castShadow:!0}),(0,t.jsx)("pointLight",{position:[0,8,0],intensity:.3,color:"#22c55e"}),(0,t.jsx)(d.OrbitControls,{enableDamping:!0,dampingFactor:.05,maxPolarAngle:Math.PI/2.5}),(0,t.jsxs)("group",{ref:b,children:[(0,t.jsxs)("mesh",{position:[0,-.1,0],rotation:[-Math.PI/2,0,0],receiveShadow:!0,children:[(0,t.jsx)("planeGeometry",{args:[16,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#15803d",roughness:.95,metalness:.05})]}),Array.from({length:120}).map((e,i)=>(0,t.jsxs)("mesh",{position:[(Math.random()-.5)*15,0,(Math.random()-.5)*15],rotation:[0,Math.random()*Math.PI,0],children:[(0,t.jsx)("coneGeometry",{args:[.018,.12,4]}),(0,t.jsx)("meshStandardMaterial",{color:"#16a34a",roughness:.8})]},i)),A,(0,t.jsxs)("group",{position:[-4,5,4],rotation:[-Math.PI/3.5,0,0],children:[(0,t.jsxs)("mesh",{position:[4,.8,-2],children:[(0,t.jsx)("boxGeometry",{args:[14,3.5,.1]}),(0,t.jsx)("meshStandardMaterial",{color:"#1f2937",transparent:!0,opacity:.92})]}),P[0]&&P[0].length>1&&(0,t.jsx)(u.Line,{points:P[0],color:"#22c55e",lineWidth:2.5}),P[1]&&P[1].length>1&&(0,t.jsx)(u.Line,{points:P[1],color:"#3b82f6",lineWidth:2.5}),P[2]&&P[2].length>1&&(0,t.jsx)(u.Line,{points:P[2],color:"#f59e0b",lineWidth:2.5}),P[3]&&P[3].length>1&&(0,t.jsx)(u.Line,{points:P[3],color:"#ef4444",lineWidth:2.5}),(0,t.jsx)(c.Html,{position:[11,2.5,-2],distanceFactor:15,children:(0,t.jsx)("div",{className:"bg-gray-900/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap",children:"Population Dynamics (Lotka-Volterra)"})})]}),(0,t.jsxs)("group",{position:[5,2.5,0],children:[(0,t.jsx)(c.Html,{position:[0,5,0],distanceFactor:12,children:(0,t.jsx)("div",{className:"bg-amber-600/90 text-white px-3 py-1 rounded text-sm font-bold",children:"Energy Pyramid (10% Rule)"})}),(0,t.jsxs)("mesh",{position:[0,.4,0],children:[(0,t.jsx)("boxGeometry",{args:[3,.3,3]}),(0,t.jsx)("meshStandardMaterial",{color:"#22c55e",transparent:!0,opacity:.8})]}),(0,t.jsxs)("mesh",{position:[0,1.2,0],children:[(0,t.jsx)("boxGeometry",{args:[2,.3,2]}),(0,t.jsx)("meshStandardMaterial",{color:"#3b82f6",transparent:!0,opacity:.8})]}),(0,t.jsxs)("mesh",{position:[0,1.9,0],children:[(0,t.jsx)("boxGeometry",{args:[1.2,.3,1.2]}),(0,t.jsx)("meshStandardMaterial",{color:"#f59e0b",transparent:!0,opacity:.8})]}),(0,t.jsxs)("mesh",{position:[0,2.5,0],children:[(0,t.jsx)("boxGeometry",{args:[.6,.3,.6]}),(0,t.jsx)("meshStandardMaterial",{color:"#ef4444",transparent:!0,opacity:.8})]}),(0,t.jsx)(c.Html,{position:[2,.4,0],distanceFactor:10,children:(0,t.jsxs)("div",{className:"text-green-400 text-xs",children:["Producers",(0,t.jsx)("br",{}),"100%"]})}),(0,t.jsx)(c.Html,{position:[1.3,1.2,0],distanceFactor:10,children:(0,t.jsxs)("div",{className:"text-blue-400 text-xs",children:["Primary",(0,t.jsx)("br",{}),"10%"]})}),(0,t.jsx)(c.Html,{position:[.8,1.9,0],distanceFactor:10,children:(0,t.jsxs)("div",{className:"text-amber-400 text-xs",children:["Secondary",(0,t.jsx)("br",{}),"1%"]})}),(0,t.jsx)(c.Html,{position:[.5,2.5,0],distanceFactor:10,children:(0,t.jsxs)("div",{className:"text-red-400 text-xs",children:["Apex",(0,t.jsx)("br",{}),"0.1%"]})})]}),(0,t.jsxs)("group",{position:[6,.5,-4],children:[(0,t.jsx)(c.Html,{position:[0,3,0],distanceFactor:12,children:(0,t.jsx)("div",{className:"bg-gray-900/90 text-white px-2 py-1 rounded text-xs",children:"Energy Flow →"})}),(0,t.jsx)(u.Line,{points:[[0,2.5,0],[0,1.8,0]],color:"#22c55e",lineWidth:3}),(0,t.jsx)(c.Html,{position:[.5,2.1,0],distanceFactor:10,children:(0,t.jsx)("div",{className:"text-green-400 text-xs font-bold",children:"100%"})}),(0,t.jsx)(u.Line,{points:[[0,1.5,0],[0,.8,0]],color:"#3b82f6",lineWidth:2}),(0,t.jsx)(c.Html,{position:[.5,1.1,0],distanceFactor:10,children:(0,t.jsx)("div",{className:"text-blue-400 text-xs font-bold",children:"10%"})}),(0,t.jsx)(u.Line,{points:[[0,.5,0],[0,-.2,0]],color:"#f59e0b",lineWidth:1.5}),(0,t.jsx)(c.Html,{position:[.5,.1,0],distanceFactor:10,children:(0,t.jsx)("div",{className:"text-amber-400 text-xs font-bold",children:"1%"})}),(0,t.jsx)(u.Line,{points:[[0,-.5,0],[0,-1.2,0]],color:"#ef4444",lineWidth:1}),(0,t.jsx)(c.Html,{position:[.5,-.9,0],distanceFactor:10,children:(0,t.jsx)("div",{className:"text-red-400 text-xs font-bold",children:"0.1%"})})]}),(0,t.jsx)(c.Html,{position:[-6,4.5,0],distanceFactor:12,children:(0,t.jsxs)("div",{className:"bg-gray-900/95 text-white px-3 py-2 rounded text-xs",children:[(0,t.jsx)("div",{className:"font-bold mb-2 text-teal-400",children:"Trophic Levels"}),(0,t.jsxs)("div",{className:"space-y-1",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-green-500"}),(0,t.jsx)("span",{children:"Level 1: Producers (Plants)"})]}),(0,t.jsx)("div",{className:"ml-4 text-gray-500",children:"↓ sunlight energy"}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-blue-500"}),(0,t.jsx)("span",{children:"Level 2: Primary (Herbivores)"})]}),(0,t.jsx)("div",{className:"ml-4 text-gray-500",children:"↓ 10% energy transfer"}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-amber-500"}),(0,t.jsx)("span",{children:"Level 3: Secondary (Predators)"})]}),(0,t.jsx)("div",{className:"ml-4 text-gray-500",children:"↓ 1% energy remaining"}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-red-500"}),(0,t.jsx)("span",{children:"Level 4: Apex (Top Predators)"})]})]})]})}),(0,t.jsx)(c.Html,{position:[0,4,0],distanceFactor:12,children:(0,t.jsxs)("div",{className:"bg-teal-600/90 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg",children:["Generation: ",E.generation," | Total Energy: ",E.totalEnergy," units"]})}),(0,t.jsx)(c.Html,{position:[5,4.5,-4],distanceFactor:12,children:(0,t.jsxs)("div",{className:"bg-gray-900/90 text-white px-3 py-2 rounded text-xs space-y-1",children:[(0,t.jsx)("div",{className:"font-bold mb-2",children:"Current Population"}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-green-500"}),(0,t.jsxs)("span",{children:["Producers: ",E.producerCount]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-blue-500"}),(0,t.jsxs)("span",{children:["Herbivores: ",E.primaryCount]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-amber-500"}),(0,t.jsxs)("span",{children:["Predators: ",E.secondaryCount]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-red-500"}),(0,t.jsxs)("span",{children:["Apex: ",E.apexCount]})]})]})}),(0,t.jsx)(c.Html,{position:[-5,3,-5],distanceFactor:12,children:(0,t.jsxs)("div",{className:"bg-gray-900/90 text-white px-3 py-2 rounded text-xs",children:[(0,t.jsx)("div",{className:"font-bold text-purple-400",children:"Biodiversity Index"}),(0,t.jsx)("div",{className:"text-lg font-bold",children:E.biodiversityIndex}),(0,t.jsx)("div",{className:"text-xs text-gray-400",children:E.biodiversityIndex>1.3?"✓ Stable":E.biodiversityIndex>.8?"⚠ Moderate":"⚠ Low Diversity"})]})}),(0,t.jsx)(c.Html,{position:[5,3,4],distanceFactor:12,children:(0,t.jsxs)("div",{className:"bg-gray-900/90 text-white px-3 py-2 rounded text-xs max-w-[180px]",children:[(0,t.jsx)("div",{className:"font-bold text-cyan-400 mb-1",children:"Population Cycles"}),(0,t.jsxs)("div",{className:"text-gray-300 leading-relaxed",children:["Prey ↑ → Predator ↑",(0,t.jsx)("br",{}),"Prey ↓ → Predator ↓",(0,t.jsx)("br",{}),"Cycle repeats naturally"]}),(0,t.jsx)("div",{className:"mt-2 text-amber-400",children:"More species = stable ecosystem"})]})})]})]})}e.s(["default",0,function(){let[e,l]=(0,i.useState)(!0),[d,c]=(0,i.useState)(1),[u,f]=(0,i.useState)(0),[p,m]=(0,i.useState)(!0),[x,v]=(0,i.useState)(!1),[y,g]=(0,i.useState)(30),[b,S]=(0,i.useState)(15),[w,j]=(0,i.useState)(6),[M,L]=(0,i.useState)(2),[E,C]=(0,i.useState)(.5),[P,A]=(0,i.useState)(.3),[_,z]=(0,i.useState)(1),[N,U]=(0,i.useState)({producerCount:30,primaryCount:15,secondaryCount:6,apexCount:2,totalEnergy:1e3,generation:0,biodiversityIndex:1.5}),B=(0,i.useCallback)(()=>{l(e=>!e)},[]),R=(0,i.useCallback)(()=>{f(e=>e+1)},[]),I=(0,i.useCallback)(e=>{c(e)},[]),O=(0,i.useCallback)(e=>{U(e)},[]),H=(0,i.useMemo)(()=>(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(a.ControlGroup,{title:"Initial Populations",children:[(0,t.jsx)(a.ControlSlider,{label:"Producers",value:y,min:10,max:60,step:5,onChange:g,color:"#22c55e",decimals:0}),(0,t.jsx)(a.ControlSlider,{label:"Primary (Herbivores)",value:b,min:5,max:30,step:2,onChange:S,color:"#3b82f6",decimals:0}),(0,t.jsx)(a.ControlSlider,{label:"Secondary (Predators)",value:w,min:2,max:15,step:1,onChange:j,color:"#f59e0b",decimals:0}),(0,t.jsx)(a.ControlSlider,{label:"Apex Predators",value:M,min:1,max:5,step:1,onChange:L,color:"#ef4444",decimals:0})]}),(0,t.jsxs)(a.ControlGroup,{title:"Dynamics",children:[(0,t.jsx)(a.ControlSlider,{label:"Reproduction Rate",value:E,min:.1,max:1,step:.1,onChange:C,color:"#14b8a6",decimals:1}),(0,t.jsx)(a.ControlSlider,{label:"Predation Rate",value:P,min:.1,max:.8,step:.05,onChange:A,color:"#f97316",decimals:2}),(0,t.jsx)(a.ControlSlider,{label:"Speed",value:_,min:.5,max:3,step:.1,onChange:z,color:"#a855f7",decimals:1})]}),(0,t.jsxs)("div",{className:"bg-teal-50/50 rounded-lg p-3 border border-teal-200/50",children:[(0,t.jsx)("div",{className:"text-xs text-gray-600 mb-2 font-medium",children:"Ecosystem Dynamics"}),(0,t.jsxs)("div",{className:"text-xs text-gray-500 space-y-1",children:[(0,t.jsx)("div",{children:"• ~90% energy lost at each level"}),(0,t.jsx)("div",{children:"• Lotka-Volterra cycles emerge"}),(0,t.jsx)("div",{children:"• Balance of predator/prey"}),(0,t.jsx)("div",{children:"• Biodiversity indicates stability"})]})]}),(0,t.jsx)("button",{onClick:R,className:"w-full mt-4 px-4 py-2 bg-[#14b8a6]/20 hover:bg-[#14b8a6]/30 text-[#14b8a6] rounded-lg border border-[#14b8a6]/50 transition-colors text-sm font-medium",children:"Reset Simulation"})]}),[y,b,w,M,E,P,_,R]),D=(0,i.useMemo)(()=>(0,t.jsx)(a.DataGrid,{data:{producers:{value:N.producerCount,unit:"plants",color:"#22c55e",decimals:0},primary:{value:N.primaryCount,unit:"herbivores",color:"#3b82f6",decimals:0},secondary:{value:N.secondaryCount,unit:"predators",color:"#f59e0b",decimals:0},apex:{value:N.apexCount,unit:"apex",color:"#ef4444",decimals:0},energy:{value:N.totalEnergy,unit:"units",color:"#fbbf24",decimals:0},biodiversity:{value:N.biodiversityIndex,unit:"index",color:"#a855f7",decimals:2}},columns:2}),[N]),T=(0,i.useMemo)(()=>(0,t.jsx)(o.DataPanel,{isVisible:x,onToggle:()=>v(e=>!e),children:D}),[x,D]);return(0,t.jsxs)("div",{className:"w-full h-screen relative",children:[(0,t.jsx)(r.ExperimentContainer,{title:"Ecosystem Food Web",description:"Explore trophic levels, energy flow (10% rule), and Lotka-Volterra population dynamics",cameraPosition:[0,8,12],backgroundColor:"#050510",controls:null,dataPanel:T,children:(0,t.jsx)(h,{onDataChange:O,isPlaying:e,simulationSpeed:d,resetTrigger:u,initialProducerPop:y,initialPrimaryPop:b,initialSecondaryPop:w,initialApexPop:M,reproductionRate:E,predationRate:P,speed:_})}),(0,t.jsx)(n.SimulationController,{isPlaying:e,onPlayPause:B,onReset:R,speed:d,onSpeedChange:I,timeElapsed:0}),p&&(0,t.jsx)(s.FloatingControlPanel,{initialPosition:{x:window.innerWidth-340,y:80},children:H}),!p&&(0,t.jsx)("button",{onClick:()=>m(!0),className:"fixed top-20 right-4 z-20 px-4 py-2 bg-[#14b8a6]/20 hover:bg-[#14b8a6]/30 text-[#14b8a6] rounded-lg border border-[#14b8a6]/50 transition-colors text-sm font-medium",children:"Show Controls"})]})}],13046)}]);
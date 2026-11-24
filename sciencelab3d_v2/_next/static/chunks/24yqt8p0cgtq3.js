(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,i;var r=e.i(31067),n=e.i(71645),s=e.i(90072),a=e.i(48546),o=s,l=s;let c=new l.Box3,d=new l.Vector3;class u extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(i,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let r=new l.InstancedInterleavedBuffer(i,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(r,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(r,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),c.setFromBufferAttribute(t),this.boundingBox.union(c))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let r=0;for(let n=0,s=e.count;n<s;n++)d.fromBufferAttribute(e,n),r=Math.max(r,i.distanceToSquared(d)),d.fromBufferAttribute(t,n),r=Math.max(r,i.distanceToSquared(d));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var f=s,m=e.i(8560),h=e.i(31497);class p extends f.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:f.UniformsUtils.clone(f.UniformsUtils.merge([m.UniformsLib.common,m.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new f.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let x=h.version>=125?"uv1":"uv2",g=new o.Vector4,v=new o.Vector3,y=new o.Vector3,b=new o.Vector4,w=new o.Vector4,S=new o.Vector4,j=new o.Vector3,A=new o.Matrix4,E=new o.Line3,M=new o.Vector3,C=new o.Box3,L=new o.Sphere,N=new o.Vector4;function P(e,t,r){return N.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),N.multiplyScalar(1/N.w),N.x=i/r.width,N.y=i/r.height,N.applyMatrix4(e.projectionMatrixInverse),N.multiplyScalar(1/N.w),Math.abs(Math.max(N.x,N.y))}class _ extends o.Mesh{constructor(e=new u,t=new p({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,n=0,s=t.count;e<s;e++,n+=2)v.fromBufferAttribute(t,e),y.fromBufferAttribute(i,e),r[n]=0===n?0:r[n-1],r[n+1]=r[n]+v.distanceTo(y);let n=new o.InstancedInterleavedBuffer(r,2,1);return e.setAttribute("instanceDistanceStart",new o.InterleavedBufferAttribute(n,1,0)),e.setAttribute("instanceDistanceEnd",new o.InterleavedBufferAttribute(n,1,1)),this}raycast(e,r){let n,s,a=this.material.worldUnits,l=e.camera;null!==l||a||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let d=this.matrixWorld,u=this.geometry,f=this.material;if(i=f.linewidth+c,null===u.boundingSphere&&u.computeBoundingSphere(),L.copy(u.boundingSphere).applyMatrix4(d),a)n=.5*i;else{let e=Math.max(l.near,L.distanceToPoint(t.origin));n=P(l,e,f.resolution)}if(L.radius+=n,!1!==t.intersectsSphere(L)){if(null===u.boundingBox&&u.computeBoundingBox(),C.copy(u.boundingBox).applyMatrix4(d),a)s=.5*i;else{let e=Math.max(l.near,C.distanceToPoint(t.origin));s=P(l,e,f.resolution)}C.expandByScalar(s),!1!==t.intersectsBox(C)&&(a?function(e,r){let n=e.matrixWorld,s=e.geometry,a=s.attributes.instanceStart,l=s.attributes.instanceEnd,c=Math.min(s.instanceCount,a.count);for(let s=0;s<c;s++){E.start.fromBufferAttribute(a,s),E.end.fromBufferAttribute(l,s),E.applyMatrix4(n);let c=new o.Vector3,d=new o.Vector3;t.distanceSqToSegment(E.start,E.end,d,c),d.distanceTo(c)<.5*i&&r.push({point:d,pointOnLine:c,distance:t.origin.distanceTo(d),object:e,face:null,faceIndex:s,uv:null,[x]:null})}}(this,r):function(e,r,n){let s=r.projectionMatrix,a=e.material.resolution,l=e.matrixWorld,c=e.geometry,d=c.attributes.instanceStart,u=c.attributes.instanceEnd,f=Math.min(c.instanceCount,d.count),m=-r.near;t.at(1,S),S.w=1,S.applyMatrix4(r.matrixWorldInverse),S.applyMatrix4(s),S.multiplyScalar(1/S.w),S.x*=a.x/2,S.y*=a.y/2,S.z=0,j.copy(S),A.multiplyMatrices(r.matrixWorldInverse,l);for(let r=0;r<f;r++){if(b.fromBufferAttribute(d,r),w.fromBufferAttribute(u,r),b.w=1,w.w=1,b.applyMatrix4(A),w.applyMatrix4(A),b.z>m&&w.z>m)continue;if(b.z>m){let e=b.z-w.z,t=(b.z-m)/e;b.lerp(w,t)}else if(w.z>m){let e=w.z-b.z,t=(w.z-m)/e;w.lerp(b,t)}b.applyMatrix4(s),w.applyMatrix4(s),b.multiplyScalar(1/b.w),w.multiplyScalar(1/w.w),b.x*=a.x/2,b.y*=a.y/2,w.x*=a.x/2,w.y*=a.y/2,E.start.copy(b),E.start.z=0,E.end.copy(w),E.end.z=0;let c=E.closestPointToPointParameter(j,!0);E.at(c,M);let f=o.MathUtils.lerp(b.z,w.z,c),h=f>=-1&&f<=1,p=j.distanceTo(M)<.5*i;if(h&&p){E.start.fromBufferAttribute(d,r),E.end.fromBufferAttribute(u,r),E.start.applyMatrix4(l),E.end.applyMatrix4(l);let i=new o.Vector3,s=new o.Vector3;t.distanceSqToSegment(E.start,E.end,s,i),n.push({point:s,pointOnLine:i,distance:t.origin.distanceTo(s),object:e,face:null,faceIndex:r,uv:null,[x]:null})}}}(this,l,r))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(g),this.material.uniforms.resolution.value.set(g.z,g.w))}}class z extends u{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let r=0;r<t;r+=3)i[2*r]=e[r],i[2*r+1]=e[r+1],i[2*r+2]=e[r+2],i[2*r+3]=e[r+3],i[2*r+4]=e[r+4],i[2*r+5]=e[r+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,r=new Float32Array(2*i);if(3===t)for(let n=0;n<i;n+=t)r[2*n]=e[n],r[2*n+1]=e[n+1],r[2*n+2]=e[n+2],r[2*n+3]=e[n+3],r[2*n+4]=e[n+4],r[2*n+5]=e[n+5];else for(let n=0;n<i;n+=t)r[2*n]=e[n],r[2*n+1]=e[n+1],r[2*n+2]=e[n+2],r[2*n+3]=e[n+3],r[2*n+4]=e[n+4],r[2*n+5]=e[n+5],r[2*n+6]=e[n+6],r[2*n+7]=e[n+7];return super.setColors(r,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class U extends _{constructor(e=new z,t=new p({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let D=n.forwardRef(function({points:e,color:t=0xffffff,vertexColors:i,linewidth:o,lineWidth:l,segments:c,dashed:d,...f},m){var h,x;let g=(0,a.useThree)(e=>e.size),v=n.useMemo(()=>c?new _:new U,[c]),[y]=n.useState(()=>new p),b=(null==i||null==(h=i[0])?void 0:h.length)===4?4:3,w=n.useMemo(()=>{let r=c?new u:new z,n=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Vector3||e instanceof s.Vector4?[e.x,e.y,e.z]:e instanceof s.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(r.setPositions(n.flat()),i){t=0xffffff;let e=i.map(e=>e instanceof s.Color?e.toArray():e);r.setColors(e.flat(),b)}return r},[e,c,i,b]);return n.useLayoutEffect(()=>{v.computeLineDistances()},[e,v]),n.useLayoutEffect(()=>{d?y.defines.USE_DASH="":delete y.defines.USE_DASH,y.needsUpdate=!0},[d,y]),n.useEffect(()=>()=>{w.dispose(),y.dispose()},[w]),n.createElement("primitive",(0,r.default)({object:v,ref:m},f),n.createElement("primitive",{object:w,attach:"geometry"}),n.createElement("primitive",(0,r.default)({object:y,attach:"material",color:t,vertexColors:!!i,resolution:[g.width,g.height],linewidth:null!=(x=null!=o?o:l)?x:1,dashed:d,transparent:4===b},f)))});e.s(["Line",0,D],43216)},60099,e=>{"use strict";let t,i;var r=e.i(31067),n=e.i(71645),s=e.i(88014),a=e.i(90072),o=e.i(48546),l=e.i(94800);let c=new a.Vector3,d=new a.Vector3,u=new a.Vector3,f=new a.Vector2;function m(e,t,i){let r=c.setFromMatrixPosition(e.matrixWorld);r.project(t);let n=i.width/2,s=i.height/2;return[r.x*n+n,-(r.y*s)+s]}let h=e=>1e-10>Math.abs(e)?0:e;function p(e,t,i=""){let r="matrix3d(";for(let i=0;16!==i;i++)r+=h(t[i]*e.elements[i])+(15!==i?",":")");return i+r}let x=(t=[1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1],e=>p(e,t)),g=(i=e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1],(e,t)=>p(e,i(t),"translate(-50%,-50%)")),v=n.forwardRef(({children:e,eps:t=.001,style:i,className:p,prepend:v,center:y,fullscreen:b,portal:w,distanceFactor:S,sprite:j=!1,transform:A=!1,occlude:E,onOcclude:M,castShadow:C,receiveShadow:L,material:N,geometry:P,zIndexRange:_=[0x1000037,0],calculatePosition:z=m,as:U="div",wrapperClass:D,pointerEvents:I="auto",...O},T)=>{let{gl:B,camera:R,scene:H,size:k,raycaster:W,events:F,viewport:G}=(0,o.useThree)(),[V]=n.useState(()=>document.createElement(U)),$=n.useRef(null),q=n.useRef(null),Z=n.useRef(0),K=n.useRef([0,0]),J=n.useRef(null),X=n.useRef(null),Q=(null==w?void 0:w.current)||F.connected||B.domElement.parentNode,Y=n.useRef(null),ee=n.useRef(!1),et=n.useMemo(()=>{var e;return E&&"blending"!==E||Array.isArray(E)&&E.length&&(e=E[0])&&"object"==typeof e&&"current"in e},[E]);n.useLayoutEffect(()=>{let e=B.domElement;E&&"blending"===E?(e.style.zIndex=`${Math.floor(_[0]/2)}`,e.style.position="absolute",e.style.pointerEvents="none"):(e.style.zIndex=null,e.style.position=null,e.style.pointerEvents=null)},[E]),n.useLayoutEffect(()=>{if(q.current){let e=$.current=s.createRoot(V);if(H.updateMatrixWorld(),A)V.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";else{let e=z(q.current,R,k);V.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${e[0]}px,${e[1]}px,0);transform-origin:0 0;`}return Q&&(v?Q.prepend(V):Q.appendChild(V)),()=>{Q&&Q.removeChild(V),e.unmount()}}},[Q,A]),n.useLayoutEffect(()=>{D&&(V.className=D)},[D]);let ei=n.useMemo(()=>A?{position:"absolute",top:0,left:0,width:k.width,height:k.height,transformStyle:"preserve-3d",pointerEvents:"none"}:{position:"absolute",transform:y?"translate3d(-50%,-50%,0)":"none",...b&&{top:-k.height/2,left:-k.width/2,width:k.width,height:k.height},...i},[i,y,b,k,A]),er=n.useMemo(()=>({position:"absolute",pointerEvents:I}),[I]);n.useLayoutEffect(()=>{var t,r;ee.current=!1,A?null==(t=$.current)||t.render(n.createElement("div",{ref:J,style:ei},n.createElement("div",{ref:X,style:er},n.createElement("div",{ref:T,className:p,style:i,children:e})))):null==(r=$.current)||r.render(n.createElement("div",{ref:T,style:ei,className:p,children:e}))});let en=n.useRef(!0);(0,l.useFrame)(e=>{if(q.current){R.updateMatrixWorld(),q.current.updateWorldMatrix(!0,!1);let e=A?K.current:z(q.current,R,k);if(A||Math.abs(Z.current-R.zoom)>t||Math.abs(K.current[0]-e[0])>t||Math.abs(K.current[1]-e[1])>t){var i;let t,r,n,s,o=(i=q.current,t=c.setFromMatrixPosition(i.matrixWorld),r=d.setFromMatrixPosition(R.matrixWorld),n=t.sub(r),s=R.getWorldDirection(u),n.angleTo(s)>Math.PI/2),l=!1;et&&(Array.isArray(E)?l=E.map(e=>e.current):"blending"!==E&&(l=[H]));let m=en.current;l?en.current=function(e,t,i,r){let n=c.setFromMatrixPosition(e.matrixWorld),s=n.clone();s.project(t),f.set(s.x,s.y),i.setFromCamera(f,t);let a=i.intersectObjects(r,!0);if(a.length){let e=a[0].distance;return n.distanceTo(i.ray.origin)<e}return!0}(q.current,R,W,l)&&!o:en.current=!o,m!==en.current&&(M?M(!en.current):V.style.display=en.current?"block":"none");let p=Math.floor(_[0]/2),v=E?et?[_[0],p]:[p-1,0]:_;if(V.style.zIndex=`${function(e,t,i){if(t instanceof a.PerspectiveCamera||t instanceof a.OrthographicCamera){let r=c.setFromMatrixPosition(e.matrixWorld),n=d.setFromMatrixPosition(t.matrixWorld),s=r.distanceTo(n),a=(i[1]-i[0])/(t.far-t.near),o=i[1]-a*t.far;return Math.round(a*s+o)}}(q.current,R,v)}`,A){let[e,t]=[k.width/2,k.height/2],i=R.projectionMatrix.elements[5]*t,{isOrthographicCamera:r,top:n,left:s,bottom:a,right:o}=R,l=x(R.matrixWorldInverse),c=r?`scale(${i})translate(${h(-(o+s)/2)}px,${h((n+a)/2)}px)`:`translateZ(${i}px)`,d=q.current.matrixWorld;j&&((d=R.matrixWorldInverse.clone().transpose().copyPosition(d).scale(q.current.scale)).elements[3]=d.elements[7]=d.elements[11]=0,d.elements[15]=1),V.style.width=k.width+"px",V.style.height=k.height+"px",V.style.perspective=r?"":`${i}px`,J.current&&X.current&&(J.current.style.transform=`${c}${l}translate(${e}px,${t}px)`,X.current.style.transform=g(d,1/((S||10)/400)))}else{let t=void 0===S?1:function(e,t){if(t instanceof a.OrthographicCamera)return t.zoom;if(!(t instanceof a.PerspectiveCamera))return 1;{let i=c.setFromMatrixPosition(e.matrixWorld),r=d.setFromMatrixPosition(t.matrixWorld);return 1/(2*Math.tan(t.fov*Math.PI/180/2)*i.distanceTo(r))}}(q.current,R)*S;V.style.transform=`translate3d(${e[0]}px,${e[1]}px,0) scale(${t})`}K.current=e,Z.current=R.zoom}}if(!et&&Y.current&&!ee.current)if(A){if(J.current){let e=J.current.children[0];if(null!=e&&e.clientWidth&&null!=e&&e.clientHeight){let{isOrthographicCamera:t}=R;if(t||P)O.scale&&(Array.isArray(O.scale)?O.scale instanceof a.Vector3?Y.current.scale.copy(O.scale.clone().divideScalar(1)):Y.current.scale.set(1/O.scale[0],1/O.scale[1],1/O.scale[2]):Y.current.scale.setScalar(1/O.scale));else{let t=(S||10)/400,i=e.clientWidth*t,r=e.clientHeight*t;Y.current.scale.set(i,r,1)}ee.current=!0}}}else{let t=V.children[0];if(null!=t&&t.clientWidth&&null!=t&&t.clientHeight){let e=1/G.factor,i=t.clientWidth*e,r=t.clientHeight*e;Y.current.scale.set(i,r,1),ee.current=!0}Y.current.lookAt(e.camera.position)}});let es=n.useMemo(()=>({vertexShader:A?void 0:`
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
      `}),[A]);return n.createElement("group",(0,r.default)({},O,{ref:q}),E&&!et&&n.createElement("mesh",{castShadow:C,receiveShadow:L,ref:Y},P||n.createElement("planeGeometry",null),N||n.createElement("shaderMaterial",{side:a.DoubleSide,vertexShader:es.vertexShader,fragmentShader:es.fragmentShader})))});e.s(["Html",0,v])},56420,e=>{"use strict";var t=e.i(71645);let i=(...e)=>e.filter((e,t,i)=>!!e&&""!==e.trim()&&i.indexOf(e)===t).join(" ").trim(),r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,i)=>i?i.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var n={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,t.createContext)({}),a=(0,t.forwardRef)(({color:e,size:r,strokeWidth:a,absoluteStrokeWidth:o,className:l="",children:c,iconNode:d,...u},f)=>{let{size:m=24,strokeWidth:h=2,absoluteStrokeWidth:p=!1,color:x="currentColor",className:g=""}=(0,t.useContext)(s)??{},v=o??p?24*Number(a??h)/Number(r??m):a??h;return(0,t.createElement)("svg",{ref:f,...n,width:r??m??n.width,height:r??m??n.height,stroke:e??x,strokeWidth:v,className:i("lucide",g,l),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,i])=>(0,t.createElement)(e,i)),...Array.isArray(c)?c:[c]])});e.s(["default",0,(e,n)=>{let s=(0,t.forwardRef)(({className:s,...o},l)=>(0,t.createElement)(a,{ref:l,iconNode:n,className:i(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...o}));return s.displayName=r(e),s}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,i)=>{t.exports=e.r(76562)},29703,e=>{"use strict";var t=e.i(43476),i=e.i(71645),r=e.i(92989);e.i(81413);var n=e.i(48205),s=e.i(14228),a=e.i(82192),o=e.i(4685),l=e.i(68647),c=e.i(94800),d=e.i(30297),u=e.i(60099),f=e.i(43216),m=e.i(90072);let h={A:"#ef4444",T:"#fbbf24",G:"#3b82f6",C:"#06b6d4"},p="#3b82f6",x="#22c55e",g={A:"T",T:"A",G:"C",C:"G"},v="ATGCGATCGATCGATCGATC",y=[{name:"Initiation",stage:"Original DNA",desc:"Double-stranded DNA molecule intact. Helicase enzyme approaches origin of replication."},{name:"Unwinding",stage:"Replication Fork",desc:"Helicase breaks hydrogen bonds between base pairs, creating replication fork. Strands separate."},{name:"Primer Binding",stage:"Primase Activity",desc:"Primase synthesizes short RNA primers. DNA polymerases can now attach and begin synthesis."},{name:"Elongation",stage:"DNA Polymerase",desc:"Leading strand: continuous synthesis 5'→3'. Lagging strand: Okazaki fragments. New strands in green."},{name:"Completion",stage:"Two Daughter DNA",desc:"Semi-conservative replication complete! Each DNA has one original (blue) + one new strand (green)."}];function b({onDataChange:e,isPlaying:r=!0,simulationSpeed:n=1,resetTrigger:s=0,speed:a=1,showLabels:o=!0,step:l=0}){let w=(0,i.useRef)(null),S=(0,i.useRef)(0),j=(0,i.useRef)(0),A=(0,i.useRef)(0),E=(0,i.useRef)(0),M=(0,i.useRef)(0),C=(0,i.useRef)(0),L=(0,i.useRef)(0),[N,P]=(0,i.useState)(0),[_,z]=(0,i.useState)(0),[U,D]=(0,i.useState)(0),I=(0,i.useRef)(0);(0,i.useEffect)(()=>{S.current=0,j.current=0,A.current=0,E.current=0,M.current=0,C.current=0,L.current=0,P(0),z(0),D(0)},[s,l]);let O=(0,i.useMemo)(()=>{let e=[];for(let t=0;t<20;t++){let i=v[t%v.length],r=g[i];e.push({index:t,base1:i,base2:r,color1:h[i],color2:h[r],y:(t-10)*.6,angle:.6*t})}return e},[]),T=(0,i.useCallback)((e,t,i,r=0,n=0)=>{let s=t+j.current+(0===i?0:Math.PI),a=Math.abs(e-10),o=0;n>0&&a<n+2&&(o=Math.max(0,(1-a/(n+2))*r));let l=o*(0===i?-1:1);return new m.Vector3(1.8*Math.cos(s)+l,(e-10)*.6,1.8*Math.sin(s))},[]),B=(0,i.useCallback)((e,t=0,i=0)=>{let r=[];for(let n=0;n<20;n++){let s=O[n];if(s){let a=T(n,s.angle,e,t,i);r.push(a)}}return r},[O,T]);(0,c.useFrame)((t,i)=>{if(I.current++,w.current&&r){S.current+=i*n*a,j.current+=.08*i*n,1===l?(A.current=Math.min(12,A.current+3*i*n*a),L.current=Math.min(3,L.current+2*i*n*a)):2===l?(A.current=10,L.current=3,E.current=Math.min(100,E.current+20*i*n*a)):3===l?(L.current=3,M.current=Math.min(100,M.current+12*i*n*a),C.current=Math.min(100,C.current+8*i*n*a)):4===l&&(L.current=3,M.current=100,C.current=100);let t=Math.floor((M.current+C.current)/100*20),r=Math.floor(M.current/100*20),s=Math.floor(C.current/100*20);I.current%8==0&&(P(t),z(r),D(s),e&&e({step:y[l].name,stage:y[l].stage,nucleotidesAdded:t,description:y[l].desc,leadingStrand:r,laggingStrand:s}))}});let R=l>=1?L.current:0,H=A.current;return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("ambientLight",{intensity:.4}),(0,t.jsx)("directionalLight",{position:[10,10,5],intensity:.8}),(0,t.jsx)("pointLight",{position:[0,0,0],intensity:.6*(1===l),color:"#f59e0b"}),(0,t.jsx)("pointLight",{position:[0,0,0],intensity:.4*(2===l),color:"#8b5cf6"}),(0,t.jsx)("pointLight",{position:[0,0,0],intensity:.5*(3===l),color:"#22c55e"}),(0,t.jsx)(d.OrbitControls,{enableDamping:!0,dampingFactor:.05}),(0,t.jsxs)("group",{ref:w,children:[o&&(0,t.jsx)(u.Html,{position:[0,9,0],distanceFactor:10,children:(0,t.jsxs)("div",{className:"bg-gray-900/95 px-4 py-3 rounded-xl border border-gray-700 shadow-xl",children:[(0,t.jsxs)("div",{className:"text-white text-lg font-bold",children:[l+1,". ",y[l].name]}),(0,t.jsx)("div",{className:"text-gray-300 text-sm mt-1",children:y[l].desc}),3===l&&(0,t.jsxs)("div",{className:"text-gray-400 text-xs mt-2",children:["Leading: ",_,"/20 | Lagging: ",U,"/20"]})]})}),(0,t.jsxs)("group",{children:[(0,t.jsx)(f.Line,{points:B(0,R,H),color:p,lineWidth:4,opacity:.8,transparent:!0}),(0,t.jsx)(f.Line,{points:B(1,R,H),color:p,lineWidth:4,opacity:.8,transparent:!0}),O.map(e=>{let i=T(e.index,e.angle,0,R,H),r=T(e.index,e.angle,1,R,H),n=R>.5,s=1===l?H:12*(l>1),a=l>=3&&e.index<M.current/100*20;return(0,t.jsxs)("group",{children:[(0,t.jsxs)("mesh",{position:i,children:[(0,t.jsx)("sphereGeometry",{args:[.18,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:e.color1,emissive:e.color1,emissiveIntensity:.4})]}),(0,t.jsxs)("mesh",{position:r,children:[(0,t.jsx)("sphereGeometry",{args:[.18,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:e.color2,emissive:e.color2,emissiveIntensity:.4})]}),!n&&e.index<s&&(0,t.jsx)(f.Line,{points:[i,r],color:"#e2e8f0",lineWidth:2,opacity:.4,transparent:!0}),2===l&&e.index%4==0&&e.index<E.current/100*20&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("mesh",{position:i.clone().multiplyScalar(1.08),children:[(0,t.jsx)("sphereGeometry",{args:[.14,10,10]}),(0,t.jsx)("meshStandardMaterial",{color:"#f97316",emissive:"#f97316",emissiveIntensity:.5})]}),(0,t.jsxs)("mesh",{position:r.clone().multiplyScalar(1.08),children:[(0,t.jsx)("sphereGeometry",{args:[.14,10,10]}),(0,t.jsx)("meshStandardMaterial",{color:"#f97316",emissive:"#f97316",emissiveIntensity:.5})]})]}),a&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("mesh",{position:i.clone().multiplyScalar(1.2),children:[(0,t.jsx)("sphereGeometry",{args:[.14,10,10]}),(0,t.jsx)("meshStandardMaterial",{color:x,opacity:.9,transparent:!0,emissive:x,emissiveIntensity:.3})]}),(0,t.jsxs)("mesh",{position:r.clone().multiplyScalar(1.2),children:[(0,t.jsx)("sphereGeometry",{args:[.14,10,10]}),(0,t.jsx)("meshStandardMaterial",{color:x,opacity:.9,transparent:!0,emissive:x,emissiveIntensity:.3})]})]})]},e.index)})]}),1===l&&o&&(0,t.jsxs)("group",{position:[0,0,0],children:[(0,t.jsxs)("mesh",{position:[0,0,2.2],children:[(0,t.jsx)("coneGeometry",{args:[1.2,2,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#f59e0b",emissive:"#f59e0b",emissiveIntensity:.5,roughness:.3})]}),(0,t.jsxs)("mesh",{position:[0,0,1.2],rotation:[Math.PI/2,0,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.8,1,.5,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#fbbf24",emissive:"#fbbf24",emissiveIntensity:.4})]}),(0,t.jsx)(u.Html,{position:[0,0,3.5],distanceFactor:10,children:(0,t.jsx)("div",{className:"bg-amber-500/95 text-white px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap shadow-lg border-2 border-amber-400",children:"🧬 Helicase"})})]}),2===l&&o&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("group",{position:[2,2,0],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.6,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#8b5cf6",emissive:"#8b5cf6",emissiveIntensity:.5})]}),(0,t.jsx)(u.Html,{position:[0,1,0],distanceFactor:10,children:(0,t.jsx)("div",{className:"bg-purple-500/95 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg",children:"Primase"})})]}),(0,t.jsxs)("group",{position:[-2,-2,0],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.6,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#8b5cf6",emissive:"#8b5cf6",emissiveIntensity:.5})]}),(0,t.jsx)(u.Html,{position:[0,-1,0],distanceFactor:10,children:(0,t.jsx)("div",{className:"bg-purple-500/95 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg",children:"Primase"})})]})]}),3===l&&o&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("group",{position:[2.5,3,0],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.8,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#22c55e",emissive:"#22c55e",emissiveIntensity:.5,roughness:.3})]}),(0,t.jsx)(u.Html,{position:[0,1.2,0],distanceFactor:10,children:(0,t.jsx)("div",{className:"bg-green-600/95 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg whitespace-nowrap",children:"DNA Polymerase III"})}),(0,t.jsx)(u.Html,{position:[0,-1.2,0],distanceFactor:10,children:(0,t.jsx)("div",{className:"bg-green-900/90 text-white px-1.5 py-0.5 rounded text-[10px]",children:"Leading strand (5'→3')"})})]}),(0,t.jsxs)("group",{position:[-2.5,-3,0],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.8,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#22c55e",emissive:"#22c55e",emissiveIntensity:.5,roughness:.3})]}),(0,t.jsx)(u.Html,{position:[0,-1.2,0],distanceFactor:10,children:(0,t.jsx)("div",{className:"bg-green-600/95 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg whitespace-nowrap",children:"DNA Polymerase III"})}),(0,t.jsx)(u.Html,{position:[0,1.2,0],distanceFactor:10,children:(0,t.jsx)("div",{className:"bg-green-900/90 text-white px-1.5 py-0.5 rounded text-[10px]",children:"Lagging (Okazaki)"})})]})]}),o&&l>=3&&(0,t.jsx)(u.Html,{position:[6,-5,0],distanceFactor:10,children:(0,t.jsxs)("div",{className:"bg-gray-900/95 px-3 py-2 rounded-lg border border-gray-700 text-xs shadow-lg",children:[(0,t.jsx)("div",{className:"text-white font-bold mb-2",children:"Strand Colors"}),(0,t.jsxs)("div",{className:"space-y-1.5",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-4 h-1 rounded",style:{backgroundColor:p}}),(0,t.jsx)("span",{className:"text-gray-300",children:"Original strand"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-4 h-1 rounded",style:{backgroundColor:x}}),(0,t.jsx)("span",{className:"text-gray-300",children:"New strand"})]})]}),(0,t.jsx)("div",{className:"text-white font-bold mt-3 mb-2",children:"Base Pairs"}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-x-3 gap-y-1",children:[(0,t.jsxs)("div",{className:"flex items-center gap-1",children:[(0,t.jsx)("div",{className:"w-2 h-2 rounded-full",style:{backgroundColor:h.A}}),(0,t.jsx)("span",{className:"text-gray-300 text-[10px]",children:"A"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-1",children:[(0,t.jsx)("div",{className:"w-2 h-2 rounded-full",style:{backgroundColor:h.T}}),(0,t.jsx)("span",{className:"text-gray-300 text-[10px]",children:"T"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-1",children:[(0,t.jsx)("div",{className:"w-2 h-2 rounded-full",style:{backgroundColor:h.G}}),(0,t.jsx)("span",{className:"text-gray-300 text-[10px]",children:"G"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-1",children:[(0,t.jsx)("div",{className:"w-2 h-2 rounded-full",style:{backgroundColor:h.C}}),(0,t.jsx)("span",{className:"text-gray-300 text-[10px]",children:"C"})]})]})]})}),4===l&&o&&(0,t.jsx)(u.Html,{position:[-5,0,0],distanceFactor:10,children:(0,t.jsxs)("div",{className:"bg-gradient-to-br from-green-600 to-blue-600 text-white px-3 py-2 rounded-lg text-sm font-bold shadow-lg border-2 border-white/30",children:["✓ Semi-Conservative",(0,t.jsx)("div",{className:"text-xs font-normal mt-1",children:"Each DNA = 1 old + 1 new strand"})]})})]})]})}e.s(["default",0,function(){let e=(0,r.useRouter)(),[c,d]=(0,i.useState)(!0),[u,f]=(0,i.useState)(1),[m,h]=(0,i.useState)(0),[p,x]=(0,i.useState)(!0),[g,v]=(0,i.useState)(!1),[y,w]=(0,i.useState)(!1),[S,j]=(0,i.useState)(1),[A,E]=(0,i.useState)(!0),[M,C]=(0,i.useState)(0),L=(0,i.useRef)(null),[N,P]=(0,i.useState)({step:"Initiation",stage:"Original DNA",nucleotidesAdded:0,description:"Double-stranded DNA molecule intact.",leadingStrand:0,laggingStrand:0});(0,i.useEffect)(()=>(y&&c&&(L.current=setTimeout(()=>{M<4?C(M+1):w(!1)},6e3/u)),()=>{L.current&&clearTimeout(L.current)}),[y,M,c,u]);let _=(0,i.useCallback)(()=>{d(e=>!e)},[]),z=(0,i.useCallback)(()=>{h(e=>e+1),j(1),E(!0),C(0),w(!1),P({step:"Initiation",stage:"Original DNA",nucleotidesAdded:0,description:"Double-stranded DNA molecule intact.",leadingStrand:0,laggingStrand:0})},[]),U=(0,i.useCallback)(e=>{f(e)},[]),D=(0,i.useCallback)(e=>{P(e)},[]),I=(0,i.useMemo)(()=>(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(l.ControlGroup,{title:"Simulation Control",children:[(0,t.jsx)(l.ControlSlider,{label:"Speed",value:S,min:.1,max:3,step:.1,onChange:j}),(0,t.jsxs)("div",{className:"mt-3 space-y-2",children:[(0,t.jsx)("label",{className:"text-xs text-gray-400 block mb-2",children:"Replication Phase"}),["Initiation","Unwinding","Primer Binding","Elongation","Completion"].map((e,i)=>(0,t.jsxs)("button",{onClick:()=>C(i),className:`w-full px-3 py-2 rounded text-sm transition-colors ${M===i?"bg-[#3b82f6] text-white font-medium":"bg-gray-800 text-gray-300 hover:bg-gray-700"}`,children:[i+1,". ",e]},e))]}),(0,t.jsx)("button",{onClick:()=>w(!y),className:`w-full mt-3 px-3 py-2 rounded text-sm font-medium transition-colors ${y?"bg-green-600 text-white":"bg-gray-700 text-gray-300 hover:bg-gray-600"}`,children:y?"⏸ Auto Playing":"▶ Auto Play Steps"})]}),(0,t.jsx)(l.ControlGroup,{title:"Display Options",children:(0,t.jsx)("div",{className:"space-y-2",children:(0,t.jsxs)("label",{className:"flex items-center gap-2 text-sm",children:[(0,t.jsx)("input",{type:"checkbox",checked:A,onChange:e=>E(e.target.checked),className:"w-4 h-4 accent-[#3b82f6]"}),(0,t.jsx)("span",{className:"text-gray-300",children:"Show Labels"})]})})}),(0,t.jsx)("button",{onClick:()=>e.push("/experiments/dna-replication/details"),className:"w-full mt-4 px-4 py-2 bg-[#3b82f6]/20 hover:bg-[#3b82f6]/30 text-[#3b82f6] rounded-lg border border-[#3b82f6]/50 transition-colors text-sm font-medium",children:"View Details"})]}),[S,M,A,y,e]),O=(0,i.useMemo)(()=>(0,t.jsx)(l.DataGrid,{data:{step:{value:0,unit:N.step,color:"#3b82f6",decimals:0},stage:{value:0,unit:N.stage,color:"#f59e0b",decimals:0},nucleotides:{value:N.nucleotidesAdded,unit:"bases",color:"#22c55e",decimals:0},leading:{value:N.leadingStrand,unit:"leading",color:"#3b82f6",decimals:0},lagging:{value:N.laggingStrand,unit:"lagging",color:"#f59e0b",decimals:0},status:{value:+!!c,unit:c?"Active":"Paused",color:"#22c55e",decimals:0}},columns:2}),[N,c]),T=(0,i.useMemo)(()=>(0,t.jsx)(o.DataPanel,{isVisible:g,onToggle:()=>v(e=>!e),children:O}),[g,O]);return(0,t.jsxs)("div",{className:"w-full h-screen relative",children:[(0,t.jsx)(n.ExperimentContainer,{title:"DNA Replication",description:"Step-by-step visualization of semi-conservative DNA replication",cameraPosition:[0,0,16],backgroundColor:"#050510",controls:null,dataPanel:T,children:(0,t.jsx)(b,{onDataChange:D,isPlaying:c,simulationSpeed:u,resetTrigger:m,speed:S,showLabels:A,step:M})}),(0,t.jsx)(s.SimulationController,{isPlaying:c,onPlayPause:_,onReset:z,speed:u,onSpeedChange:U,timeElapsed:0}),p&&(0,t.jsx)(a.FloatingControlPanel,{initialPosition:{x:window.innerWidth-340,y:80},children:I}),!p&&(0,t.jsx)("button",{onClick:()=>x(!0),className:"fixed top-20 right-4 z-20 px-4 py-2 bg-[#3b82f6]/20 hover:bg-[#3b82f6]/30 text-[#3b82f6] rounded-lg border border-[#3b82f6]/50 transition-colors text-sm font-medium",children:"Show Controls"})]})}],29703)}]);
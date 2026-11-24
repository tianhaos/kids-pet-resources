(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,i;var n=e.i(31067),r=e.i(71645),s=e.i(90072),a=e.i(48546),o=s,l=s;let c=new l.Box3,d=new l.Vector3;class u extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(i,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let n=new l.InstancedInterleavedBuffer(i,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(n,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),c.setFromBufferAttribute(t),this.boundingBox.union(c))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let r=0,s=e.count;r<s;r++)d.fromBufferAttribute(e,r),n=Math.max(n,i.distanceToSquared(d)),d.fromBufferAttribute(t,r),n=Math.max(n,i.distanceToSquared(d));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var h=s,f=e.i(8560),p=e.i(31497);class m extends h.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:h.UniformsUtils.clone(h.UniformsUtils.merge([f.UniformsLib.common,f.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new h.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let x=p.version>=125?"uv1":"uv2",v=new o.Vector4,g=new o.Vector3,y=new o.Vector3,b=new o.Vector4,w=new o.Vector4,S=new o.Vector4,j=new o.Vector3,M=new o.Matrix4,A=new o.Line3,E=new o.Vector3,C=new o.Box3,L=new o.Sphere,N=new o.Vector4;function _(e,t,n){return N.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),N.multiplyScalar(1/N.w),N.x=i/n.width,N.y=i/n.height,N.applyMatrix4(e.projectionMatrixInverse),N.multiplyScalar(1/N.w),Math.abs(Math.max(N.x,N.y))}class P extends o.Mesh{constructor(e=new u,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let e=0,r=0,s=t.count;e<s;e++,r+=2)g.fromBufferAttribute(t,e),y.fromBufferAttribute(i,e),n[r]=0===r?0:n[r-1],n[r+1]=n[r]+g.distanceTo(y);let r=new o.InstancedInterleavedBuffer(n,2,1);return e.setAttribute("instanceDistanceStart",new o.InterleavedBufferAttribute(r,1,0)),e.setAttribute("instanceDistanceEnd",new o.InterleavedBufferAttribute(r,1,1)),this}raycast(e,n){let r,s,a=this.material.worldUnits,l=e.camera;null!==l||a||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let d=this.matrixWorld,u=this.geometry,h=this.material;if(i=h.linewidth+c,null===u.boundingSphere&&u.computeBoundingSphere(),L.copy(u.boundingSphere).applyMatrix4(d),a)r=.5*i;else{let e=Math.max(l.near,L.distanceToPoint(t.origin));r=_(l,e,h.resolution)}if(L.radius+=r,!1!==t.intersectsSphere(L)){if(null===u.boundingBox&&u.computeBoundingBox(),C.copy(u.boundingBox).applyMatrix4(d),a)s=.5*i;else{let e=Math.max(l.near,C.distanceToPoint(t.origin));s=_(l,e,h.resolution)}C.expandByScalar(s),!1!==t.intersectsBox(C)&&(a?function(e,n){let r=e.matrixWorld,s=e.geometry,a=s.attributes.instanceStart,l=s.attributes.instanceEnd,c=Math.min(s.instanceCount,a.count);for(let s=0;s<c;s++){A.start.fromBufferAttribute(a,s),A.end.fromBufferAttribute(l,s),A.applyMatrix4(r);let c=new o.Vector3,d=new o.Vector3;t.distanceSqToSegment(A.start,A.end,d,c),d.distanceTo(c)<.5*i&&n.push({point:d,pointOnLine:c,distance:t.origin.distanceTo(d),object:e,face:null,faceIndex:s,uv:null,[x]:null})}}(this,n):function(e,n,r){let s=n.projectionMatrix,a=e.material.resolution,l=e.matrixWorld,c=e.geometry,d=c.attributes.instanceStart,u=c.attributes.instanceEnd,h=Math.min(c.instanceCount,d.count),f=-n.near;t.at(1,S),S.w=1,S.applyMatrix4(n.matrixWorldInverse),S.applyMatrix4(s),S.multiplyScalar(1/S.w),S.x*=a.x/2,S.y*=a.y/2,S.z=0,j.copy(S),M.multiplyMatrices(n.matrixWorldInverse,l);for(let n=0;n<h;n++){if(b.fromBufferAttribute(d,n),w.fromBufferAttribute(u,n),b.w=1,w.w=1,b.applyMatrix4(M),w.applyMatrix4(M),b.z>f&&w.z>f)continue;if(b.z>f){let e=b.z-w.z,t=(b.z-f)/e;b.lerp(w,t)}else if(w.z>f){let e=w.z-b.z,t=(w.z-f)/e;w.lerp(b,t)}b.applyMatrix4(s),w.applyMatrix4(s),b.multiplyScalar(1/b.w),w.multiplyScalar(1/w.w),b.x*=a.x/2,b.y*=a.y/2,w.x*=a.x/2,w.y*=a.y/2,A.start.copy(b),A.start.z=0,A.end.copy(w),A.end.z=0;let c=A.closestPointToPointParameter(j,!0);A.at(c,E);let h=o.MathUtils.lerp(b.z,w.z,c),p=h>=-1&&h<=1,m=j.distanceTo(E)<.5*i;if(p&&m){A.start.fromBufferAttribute(d,n),A.end.fromBufferAttribute(u,n),A.start.applyMatrix4(l),A.end.applyMatrix4(l);let i=new o.Vector3,s=new o.Vector3;t.distanceSqToSegment(A.start,A.end,s,i),r.push({point:s,pointOnLine:i,distance:t.origin.distanceTo(s),object:e,face:null,faceIndex:n,uv:null,[x]:null})}}}(this,l,n))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(v),this.material.uniforms.resolution.value.set(v.z,v.w))}}class z extends u{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,n=new Float32Array(2*i);if(3===t)for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];else for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5],n[2*r+6]=e[r+6],n[2*r+7]=e[r+7];return super.setColors(n,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class U extends P{constructor(e=new z,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let W=r.forwardRef(function({points:e,color:t=0xffffff,vertexColors:i,linewidth:o,lineWidth:l,segments:c,dashed:d,...h},f){var p,x;let v=(0,a.useThree)(e=>e.size),g=r.useMemo(()=>c?new P:new U,[c]),[y]=r.useState(()=>new m),b=(null==i||null==(p=i[0])?void 0:p.length)===4?4:3,w=r.useMemo(()=>{let n=c?new u:new z,r=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Vector3||e instanceof s.Vector4?[e.x,e.y,e.z]:e instanceof s.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(n.setPositions(r.flat()),i){t=0xffffff;let e=i.map(e=>e instanceof s.Color?e.toArray():e);n.setColors(e.flat(),b)}return n},[e,c,i,b]);return r.useLayoutEffect(()=>{g.computeLineDistances()},[e,g]),r.useLayoutEffect(()=>{d?y.defines.USE_DASH="":delete y.defines.USE_DASH,y.needsUpdate=!0},[d,y]),r.useEffect(()=>()=>{w.dispose(),y.dispose()},[w]),r.createElement("primitive",(0,n.default)({object:g,ref:f},h),r.createElement("primitive",{object:w,attach:"geometry"}),r.createElement("primitive",(0,n.default)({object:y,attach:"material",color:t,vertexColors:!!i,resolution:[v.width,v.height],linewidth:null!=(x=null!=o?o:l)?x:1,dashed:d,transparent:4===b},h)))});e.s(["Line",0,W],43216)},60099,e=>{"use strict";let t,i;var n=e.i(31067),r=e.i(71645),s=e.i(88014),a=e.i(90072),o=e.i(48546),l=e.i(94800);let c=new a.Vector3,d=new a.Vector3,u=new a.Vector3,h=new a.Vector2;function f(e,t,i){let n=c.setFromMatrixPosition(e.matrixWorld);n.project(t);let r=i.width/2,s=i.height/2;return[n.x*r+r,-(n.y*s)+s]}let p=e=>1e-10>Math.abs(e)?0:e;function m(e,t,i=""){let n="matrix3d(";for(let i=0;16!==i;i++)n+=p(t[i]*e.elements[i])+(15!==i?",":")");return i+n}let x=(t=[1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1],e=>m(e,t)),v=(i=e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1],(e,t)=>m(e,i(t),"translate(-50%,-50%)")),g=r.forwardRef(({children:e,eps:t=.001,style:i,className:m,prepend:g,center:y,fullscreen:b,portal:w,distanceFactor:S,sprite:j=!1,transform:M=!1,occlude:A,onOcclude:E,castShadow:C,receiveShadow:L,material:N,geometry:_,zIndexRange:P=[0x1000037,0],calculatePosition:z=f,as:U="div",wrapperClass:W,pointerEvents:I="auto",...T},B)=>{let{gl:O,camera:F,scene:R,size:D,raycaster:V,events:k,viewport:H}=(0,o.useThree)(),[G]=r.useState(()=>document.createElement(U)),$=r.useRef(null),q=r.useRef(null),X=r.useRef(0),Z=r.useRef([0,0]),K=r.useRef(null),Q=r.useRef(null),J=(null==w?void 0:w.current)||k.connected||O.domElement.parentNode,Y=r.useRef(null),ee=r.useRef(!1),et=r.useMemo(()=>{var e;return A&&"blending"!==A||Array.isArray(A)&&A.length&&(e=A[0])&&"object"==typeof e&&"current"in e},[A]);r.useLayoutEffect(()=>{let e=O.domElement;A&&"blending"===A?(e.style.zIndex=`${Math.floor(P[0]/2)}`,e.style.position="absolute",e.style.pointerEvents="none"):(e.style.zIndex=null,e.style.position=null,e.style.pointerEvents=null)},[A]),r.useLayoutEffect(()=>{if(q.current){let e=$.current=s.createRoot(G);if(R.updateMatrixWorld(),M)G.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";else{let e=z(q.current,F,D);G.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${e[0]}px,${e[1]}px,0);transform-origin:0 0;`}return J&&(g?J.prepend(G):J.appendChild(G)),()=>{J&&J.removeChild(G),e.unmount()}}},[J,M]),r.useLayoutEffect(()=>{W&&(G.className=W)},[W]);let ei=r.useMemo(()=>M?{position:"absolute",top:0,left:0,width:D.width,height:D.height,transformStyle:"preserve-3d",pointerEvents:"none"}:{position:"absolute",transform:y?"translate3d(-50%,-50%,0)":"none",...b&&{top:-D.height/2,left:-D.width/2,width:D.width,height:D.height},...i},[i,y,b,D,M]),en=r.useMemo(()=>({position:"absolute",pointerEvents:I}),[I]);r.useLayoutEffect(()=>{var t,n;ee.current=!1,M?null==(t=$.current)||t.render(r.createElement("div",{ref:K,style:ei},r.createElement("div",{ref:Q,style:en},r.createElement("div",{ref:B,className:m,style:i,children:e})))):null==(n=$.current)||n.render(r.createElement("div",{ref:B,style:ei,className:m,children:e}))});let er=r.useRef(!0);(0,l.useFrame)(e=>{if(q.current){F.updateMatrixWorld(),q.current.updateWorldMatrix(!0,!1);let e=M?Z.current:z(q.current,F,D);if(M||Math.abs(X.current-F.zoom)>t||Math.abs(Z.current[0]-e[0])>t||Math.abs(Z.current[1]-e[1])>t){var i;let t,n,r,s,o=(i=q.current,t=c.setFromMatrixPosition(i.matrixWorld),n=d.setFromMatrixPosition(F.matrixWorld),r=t.sub(n),s=F.getWorldDirection(u),r.angleTo(s)>Math.PI/2),l=!1;et&&(Array.isArray(A)?l=A.map(e=>e.current):"blending"!==A&&(l=[R]));let f=er.current;l?er.current=function(e,t,i,n){let r=c.setFromMatrixPosition(e.matrixWorld),s=r.clone();s.project(t),h.set(s.x,s.y),i.setFromCamera(h,t);let a=i.intersectObjects(n,!0);if(a.length){let e=a[0].distance;return r.distanceTo(i.ray.origin)<e}return!0}(q.current,F,V,l)&&!o:er.current=!o,f!==er.current&&(E?E(!er.current):G.style.display=er.current?"block":"none");let m=Math.floor(P[0]/2),g=A?et?[P[0],m]:[m-1,0]:P;if(G.style.zIndex=`${function(e,t,i){if(t instanceof a.PerspectiveCamera||t instanceof a.OrthographicCamera){let n=c.setFromMatrixPosition(e.matrixWorld),r=d.setFromMatrixPosition(t.matrixWorld),s=n.distanceTo(r),a=(i[1]-i[0])/(t.far-t.near),o=i[1]-a*t.far;return Math.round(a*s+o)}}(q.current,F,g)}`,M){let[e,t]=[D.width/2,D.height/2],i=F.projectionMatrix.elements[5]*t,{isOrthographicCamera:n,top:r,left:s,bottom:a,right:o}=F,l=x(F.matrixWorldInverse),c=n?`scale(${i})translate(${p(-(o+s)/2)}px,${p((r+a)/2)}px)`:`translateZ(${i}px)`,d=q.current.matrixWorld;j&&((d=F.matrixWorldInverse.clone().transpose().copyPosition(d).scale(q.current.scale)).elements[3]=d.elements[7]=d.elements[11]=0,d.elements[15]=1),G.style.width=D.width+"px",G.style.height=D.height+"px",G.style.perspective=n?"":`${i}px`,K.current&&Q.current&&(K.current.style.transform=`${c}${l}translate(${e}px,${t}px)`,Q.current.style.transform=v(d,1/((S||10)/400)))}else{let t=void 0===S?1:function(e,t){if(t instanceof a.OrthographicCamera)return t.zoom;if(!(t instanceof a.PerspectiveCamera))return 1;{let i=c.setFromMatrixPosition(e.matrixWorld),n=d.setFromMatrixPosition(t.matrixWorld);return 1/(2*Math.tan(t.fov*Math.PI/180/2)*i.distanceTo(n))}}(q.current,F)*S;G.style.transform=`translate3d(${e[0]}px,${e[1]}px,0) scale(${t})`}Z.current=e,X.current=F.zoom}}if(!et&&Y.current&&!ee.current)if(M){if(K.current){let e=K.current.children[0];if(null!=e&&e.clientWidth&&null!=e&&e.clientHeight){let{isOrthographicCamera:t}=F;if(t||_)T.scale&&(Array.isArray(T.scale)?T.scale instanceof a.Vector3?Y.current.scale.copy(T.scale.clone().divideScalar(1)):Y.current.scale.set(1/T.scale[0],1/T.scale[1],1/T.scale[2]):Y.current.scale.setScalar(1/T.scale));else{let t=(S||10)/400,i=e.clientWidth*t,n=e.clientHeight*t;Y.current.scale.set(i,n,1)}ee.current=!0}}}else{let t=G.children[0];if(null!=t&&t.clientWidth&&null!=t&&t.clientHeight){let e=1/H.factor,i=t.clientWidth*e,n=t.clientHeight*e;Y.current.scale.set(i,n,1),ee.current=!0}Y.current.lookAt(e.camera.position)}});let es=r.useMemo(()=>({vertexShader:M?void 0:`
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
      `}),[M]);return r.createElement("group",(0,n.default)({},T,{ref:q}),A&&!et&&r.createElement("mesh",{castShadow:C,receiveShadow:L,ref:Y},_||r.createElement("planeGeometry",null),N||r.createElement("shaderMaterial",{side:a.DoubleSide,vertexShader:es.vertexShader,fragmentShader:es.fragmentShader})))});e.s(["Html",0,g])},56420,e=>{"use strict";var t=e.i(71645);let i=(...e)=>e.filter((e,t,i)=>!!e&&""!==e.trim()&&i.indexOf(e)===t).join(" ").trim(),n=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,i)=>i?i.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,t.createContext)({}),a=(0,t.forwardRef)(({color:e,size:n,strokeWidth:a,absoluteStrokeWidth:o,className:l="",children:c,iconNode:d,...u},h)=>{let{size:f=24,strokeWidth:p=2,absoluteStrokeWidth:m=!1,color:x="currentColor",className:v=""}=(0,t.useContext)(s)??{},g=o??m?24*Number(a??p)/Number(n??f):a??p;return(0,t.createElement)("svg",{ref:h,...r,width:n??f??r.width,height:n??f??r.height,stroke:e??x,strokeWidth:g,className:i("lucide",v,l),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,i])=>(0,t.createElement)(e,i)),...Array.isArray(c)?c:[c]])});e.s(["default",0,(e,r)=>{let s=(0,t.forwardRef)(({className:s,...o},l)=>(0,t.createElement)(a,{ref:l,iconNode:r,className:i(`lucide-${n(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...o}));return s.displayName=n(e),s}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,i)=>{t.exports=e.r(76562)},85490,e=>{"use strict";var t=e.i(43476),i=e.i(71645),n=e.i(92989),r=e.i(94800),s=e.i(43216),a=e.i(60099),o=e.i(16196);let l={0:{sin:"0",cos:"1",tan:"0"},30:{sin:"1/2",cos:"√3/2",tan:"1/√3"},45:{sin:"√2/2",cos:"√2/2",tan:"1"},60:{sin:"√3/2",cos:"1/2",tan:"√3"},90:{sin:"1",cos:"0",tan:"undefined"},120:{sin:"√3/2",cos:"-1/2",tan:"-√3"},135:{sin:"√2/2",cos:"-√2/2",tan:"-1"},150:{sin:"1/2",cos:"-√3/2",tan:"-1/√3"},180:{sin:"0",cos:"-1",tan:"0"},210:{sin:"-1/2",cos:"-√3/2",tan:"1/√3"},225:{sin:"-√2/2",cos:"-√2/2",tan:"1"},240:{sin:"-√3/2",cos:"-1/2",tan:"√3"},270:{sin:"-1",cos:"0",tan:"undefined"},300:{sin:"-√3/2",cos:"1/2",tan:"-√3"},315:{sin:"-√2/2",cos:"√2/2",tan:"-1"},330:{sin:"-1/2",cos:"√3/2",tan:"-1/√3"},360:{sin:"0",cos:"1",tan:"0"}},c=function({angle:e,useRadians:n,showSin:c,showCos:d,showTan:u,showCot:h,showSec:f,showCsc:p,showGraph:m,animationSpeed:x,isPlaying:v,onDataChange:g}){let y=(0,i.useRef)(null),b=(0,i.useRef)(null),w=(0,i.useRef)({frameCount:0,time:0,currentAngle:e}),[,S]=(0,i.useState)({}),[j,M]=(0,i.useState)(e),A=(0,i.useRef)([]);(0,i.useEffect)(()=>{v||M(e)},[e,v]);let E=(0,i.useMemo)(()=>{let e=[];for(let t=0;t<=144;t++){let i=t/144*Math.PI*2;e.push([Math.cos(i),Math.sin(i),0])}return e},[]),C=(0,i.useMemo)(()=>{let e=[];for(let t=-5;t<=5;t++)0!==t&&e.push({start:[.2*t,-1.2,0],end:[.2*t,1.2,0]});for(let t=-5;t<=5;t++)0!==t&&e.push({start:[-1.2,.2*t,0],end:[1.2,.2*t,0]});return e},[]),L=[0,30,45,60,90,120,135,150,180,210,225,240,270,300,315,330,360];(0,i.useMemo)(()=>!m||A.current.length<2?[]:A.current.map((e,t)=>[-4+t/Math.max(A.current.length-1,1)*8,e.sin,0]),[m,A.current]),(0,r.useFrame)((e,t)=>{if(!v)return;let i=w.current;i.time+=t,i.frameCount++,i.currentAngle=(i.currentAngle+t*x*25)%360,M(i.currentAngle);let n=i.currentAngle*Math.PI/180;A.current.push({angle:i.currentAngle,sin:Math.sin(n),cos:Math.cos(n),tan:Math.tan(n)}),A.current.length>300&&A.current.shift(),y.current&&(y.current.rotation.x=.03*Math.sin(.08*i.time),y.current.rotation.y=.02*Math.sin(.05*i.time)),i.frameCount%8==0&&P()});let N=e=>{let t=(e%360+360)%360;return 0===t||180===t||360===t||90===t||270===t?"On Axis":t<90?"I":t<180?"II":t<270?"III":"IV"},_=(0,i.useCallback)(e=>{let t=L.reduce((t,i)=>Math.abs(i-e)<Math.abs(t-e)?i:t);return 2>Math.abs(t-e)?`${t}\xb0`:""},[]),P=(0,i.useCallback)(()=>{let e=w.current.currentAngle*Math.PI/180,t=Math.sin(e),i=Math.cos(e),n=Math.tan(e),r=L.reduce((e,t)=>Math.abs(t-w.current.currentAngle)<Math.abs(e-w.current.currentAngle)?t:e),s=t.toFixed(4),a=i.toFixed(4),o=Math.abs(n)>100?"undefined":n.toFixed(4);2>Math.abs(r-w.current.currentAngle)&&(s=`${l[r].sin} (${t.toFixed(4)})`,a=`${l[r].cos} (${i.toFixed(4)})`,o=l[r].tan),g?.({angle:w.current.currentAngle,radians:e,sin:t,cos:i,tan:n,cot:i/t,sec:1/i,csc:1/t,exactValue:_(w.current.currentAngle),quadrant:N(w.current.currentAngle),sinValue:s,cosValue:a,tanValue:o}),S({})},[g,_]),z=v?j:e,U=z*Math.PI/180,W=Math.cos(U),I=Math.sin(U),T=Math.tan(U),B=(0,i.useMemo)(()=>{let e=[];for(let t=0;t<=50;t++){let i=t/50*U;e.push([.4*Math.cos(i),.4*Math.sin(i),0])}return e},[U]),O=[[1,0,0]];10>Math.abs(T)&&Math.abs(W)>.01&&O.push([1,T,0]);let F=0!==I?W/I:1/0,R=[[0,1,0]];10>Math.abs(F)&&Math.abs(I)>.01&&R.push([F,1,0]);let D=[[0,0,0]];Math.abs(W)>.01&&D.push([1,T,0]);let V=[[0,0,0]];return Math.abs(I)>.01&&V.push([F,1,0]),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("ambientLight",{intensity:.3}),(0,t.jsx)("pointLight",{position:[10,10,10],intensity:1.2}),(0,t.jsx)("pointLight",{position:[-8,5,5],intensity:.6,color:"#8b5cf6"}),(0,t.jsxs)("group",{ref:y,children:[(0,t.jsxs)("group",{position:[-3.5,0,0],children:[C.map((e,i)=>(0,t.jsx)(s.Line,{points:[e.start,e.end],color:"#1a1a2e",lineWidth:1,opacity:.5},`grid-${i}`)),(0,t.jsx)(s.Line,{points:[[-5,0,0],[5,0,0]],color:"#4a5568",lineWidth:2}),(0,t.jsx)(s.Line,{points:[[0,-4,0],[0,4,0]],color:"#4a5568",lineWidth:2}),(0,t.jsx)(s.Line,{points:E,color:"#a78bfa",lineWidth:3}),(0,t.jsx)(s.Line,{points:E,color:"#8b5cf6",lineWidth:1.5,opacity:.5}),L.map(e=>{let i=e*Math.PI/180,n=[0,90,180,270,360].includes(e);return(0,t.jsx)("group",{position:[1.05*Math.cos(i),1.05*Math.sin(i),0],children:(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[Math.max(.001,n?.04:.02),8,8]}),(0,t.jsx)("meshStandardMaterial",{color:n?"#fff":"#6b7280",emissive:n?"#fff":"#6b7280",emissiveIntensity:.5})]})},e)}),(0,t.jsx)(s.Line,{points:B,color:"#c4b5fd",lineWidth:2.5,opacity:.8}),(0,t.jsx)(s.Line,{points:[[0,0,0],[W,I,0]],color:"#fbbf24",lineWidth:3}),d&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.Line,{points:[[0,0,0],[W,0,0]],color:"#22c55e",lineWidth:3}),(0,t.jsx)(s.Line,{points:[[W,0,0],[W,I,0]],color:"#22c55e",lineWidth:1,opacity:.3,dashed:!0}),(0,t.jsxs)("mesh",{position:[W/2,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[.035,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#22c55e",emissive:"#22c55e",emissiveIntensity:.7})]})]}),c&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.Line,{points:[[W,0,0],[W,I,0]],color:"#3b82f6",lineWidth:3}),(0,t.jsxs)("mesh",{position:[W,I/2,0],children:[(0,t.jsx)("sphereGeometry",{args:[.035,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#3b82f6",emissive:"#3b82f6",emissiveIntensity:.7})]})]}),u&&10>Math.abs(T)&&Math.abs(W)>.01&&(0,t.jsx)(s.Line,{points:O,color:"#ef4444",lineWidth:2.5}),h&&10>Math.abs(F)&&Math.abs(I)>.01&&(0,t.jsx)(s.Line,{points:R,color:"#f97316",lineWidth:2.5}),f&&Math.abs(W)>.01&&10>Math.abs(T)&&(0,t.jsx)(s.Line,{points:D,color:"#a855f7",lineWidth:2,opacity:.7,dashed:!0}),p&&Math.abs(I)>.01&&10>Math.abs(F)&&(0,t.jsx)(s.Line,{points:V,color:"#ec4899",lineWidth:2,opacity:.7,dashed:!0}),(0,t.jsxs)("mesh",{position:[W,I,0],children:[(0,t.jsx)("sphereGeometry",{args:[.12,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#fbbf24",emissive:"#fbbf24",emissiveIntensity:.9})]}),d&&(0,t.jsxs)("mesh",{position:[W,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[.07,10,10]}),(0,t.jsx)("meshStandardMaterial",{color:"#22c55e",emissive:"#22c55e",emissiveIntensity:.8})]}),c&&(0,t.jsxs)("mesh",{position:[0,I,0],children:[(0,t.jsx)("sphereGeometry",{args:[.07,10,10]}),(0,t.jsx)("meshStandardMaterial",{color:"#3b82f6",emissive:"#3b82f6",emissiveIntensity:.8})]}),u&&10>Math.abs(T)&&Math.abs(W)>.01&&(0,t.jsxs)("mesh",{position:[1,T,0],children:[(0,t.jsx)("sphereGeometry",{args:[.06,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#ef4444",emissive:"#ef4444",emissiveIntensity:.7})]}),h&&10>Math.abs(F)&&Math.abs(I)>.01&&(0,t.jsxs)("mesh",{position:[F,1,0],children:[(0,t.jsx)("sphereGeometry",{args:[.06,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#f97316",emissive:"#f97316",emissiveIntensity:.7})]}),(0,t.jsxs)("mesh",{position:[0,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[.05,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#fff",emissive:"#fff",emissiveIntensity:.6})]}),(0,t.jsx)(o.Text,{position:[1.5,-.15,0],fontSize:.15,color:"#22c55e",anchorX:"center",children:"x"}),(0,t.jsx)(o.Text,{position:[-.1,1.5,0],fontSize:.15,color:"#3b82f6",anchorX:"center",children:"y"}),(0,t.jsx)(o.Text,{position:[1.25*W,1.15*I,0],fontSize:.12,color:"#fbbf24",anchorX:"center",children:"P"}),(0,t.jsx)(a.Html,{position:[0,-2.8,0],distanceFactor:12,children:(0,t.jsxs)("div",{className:"bg-gray-900/95 px-3 py-2 rounded-lg border border-purple-500/50 shadow-xl max-w-[280px]",children:[(0,t.jsx)("div",{className:"text-purple-400 font-bold text-xs mb-2 text-center",children:"📐 Special Angles"}),(0,t.jsxs)("div",{className:"grid grid-cols-5 gap-1 text-[9px]",children:[(0,t.jsx)("div",{className:"text-gray-500 font-bold",children:"°"}),(0,t.jsx)("div",{className:"text-blue-400 font-bold",children:"sin"}),(0,t.jsx)("div",{className:"text-green-400 font-bold",children:"cos"}),(0,t.jsx)("div",{className:"text-red-400 font-bold",children:"tan"}),(0,t.jsx)("div",{className:"text-gray-400 font-bold",children:"cot"}),L.filter(e=>e%30==0).map(e=>{let n=3>Math.abs(z-e);return(0,t.jsxs)(i.default.Fragment,{children:[(0,t.jsx)("div",{className:`text-center ${n?"bg-purple-600 rounded":"text-gray-400"}`,children:e}),(0,t.jsx)("div",{className:`text-center ${n?"bg-blue-600/50 rounded":"text-blue-400"}`,children:l[e]?.sin||"-"}),(0,t.jsx)("div",{className:`text-center ${n?"bg-green-600/50 rounded":"text-green-400"}`,children:l[e]?.cos||"-"}),(0,t.jsx)("div",{className:`text-center ${n?"bg-red-600/50 rounded":"text-red-400"}`,children:l[e]?.tan||"-"}),(0,t.jsx)("div",{className:`text-center ${n?"bg-orange-600/50 rounded":"text-orange-400"}`,children:l[e]?.tan==="0"?"∞":l[e]?.tan==="1"?"1":l[e]?.tan==="undefined"?"0":l[e]?.tan==="√3"?"1/√3":l[e]?.tan==="-√3"?"-1/√3":"-"})]},e)})]})]})})]}),m&&(0,t.jsxs)("group",{ref:b,position:[3.5,0,0],children:[(0,t.jsx)(s.Line,{points:[[-5,-2,0],[5,-2,0]],color:"#4a5568",lineWidth:2}),(0,t.jsx)(s.Line,{points:[[-5,2,0],[-5,-2,0]],color:"#4a5568",lineWidth:2}),(0,t.jsx)(s.Line,{points:[[5,2,0],[5,-2,0]],color:"#4a5568",lineWidth:1,opacity:.5}),(0,t.jsx)(s.Line,{points:[[-5,2,0],[5,2,0]],color:"#4a5568",lineWidth:1,opacity:.5}),Array.from({length:9}).map((e,i)=>{let n=-1.5+.375*i;return(0,t.jsx)(s.Line,{points:[[-5,n,0],[5,n,0]],color:"#1a1a2e",lineWidth:1,opacity:.4},`graph-grid-${i}`)}),c&&A.current.length>1&&(0,t.jsx)(s.Line,{points:A.current.map((e,t)=>[-5+t/Math.max(A.current.length-1,1)*10,e.sin,0]),color:"#3b82f6",lineWidth:2.5}),d&&A.current.length>1&&(0,t.jsx)(s.Line,{points:A.current.map((e,t)=>[-5+t/Math.max(A.current.length-1,1)*10,.7*e.cos,0]),color:"#22c55e",lineWidth:1.5,opacity:.6}),c&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("mesh",{position:[0,Math.sin(U),0],children:[(0,t.jsx)("sphereGeometry",{args:[.08,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#3b82f6",emissive:"#3b82f6",emissiveIntensity:1})]}),(0,t.jsx)(s.Line,{points:[[0,-2,0],[0,Math.sin(U),0]],color:"#3b82f6",lineWidth:1,opacity:.5,dashed:!0})]}),(0,t.jsx)(o.Text,{position:[4.5,1.7,0],fontSize:.1,color:"#3b82f6",anchorX:"right",children:"sin(θ)"}),d&&(0,t.jsx)(o.Text,{position:[4.5,1.3,0],fontSize:.08,color:"#22c55e",anchorX:"right",children:"cos(θ)"}),(0,t.jsx)(o.Text,{position:[0,-2.3,0],fontSize:.08,color:"#9ca3af",anchorX:"center",children:"Angle →"}),(0,t.jsx)(a.Html,{position:[0,3,0],distanceFactor:12,children:(0,t.jsxs)("div",{className:"bg-gray-900/95 px-3 py-2 rounded-lg border border-blue-500/50 shadow-xl max-w-[200px]",children:[(0,t.jsx)("div",{className:"text-blue-400 font-bold text-xs mb-2 text-center",children:"📈 Wave Graph"}),(0,t.jsxs)("div",{className:"text-[9px] text-gray-400 space-y-1",children:[(0,t.jsx)("div",{children:"• Amplitude: 1"}),(0,t.jsx)("div",{children:"• Period: 2π (360°)"}),(0,t.jsx)("div",{children:"• Horizontal axis: angle"}),(0,t.jsx)("div",{children:"• Vertical axis: value"})]})]})})]}),(0,t.jsx)(a.Html,{position:[-3.5,3.5,0],distanceFactor:12,children:(0,t.jsxs)("div",{className:"bg-gray-900/95 px-4 py-3 rounded-lg border border-yellow-500/50 shadow-xl",children:[(0,t.jsxs)("div",{className:"text-yellow-400 font-bold text-lg text-center",children:["θ = ",z.toFixed(1),"° = ",U.toFixed(3)," rad"]}),(0,t.jsxs)("div",{className:"text-purple-400 text-xs text-center mt-1",children:["Quadrant: ",N(z)]})]})}),(0,t.jsx)(a.Html,{position:[-7,2,0],distanceFactor:12,children:(0,t.jsxs)("div",{className:"bg-gray-900/95 px-3 py-2 rounded-lg border border-gray-700 shadow-xl space-y-1",children:[c&&(0,t.jsxs)("div",{className:"flex items-center gap-2 text-xs",children:[(0,t.jsx)("span",{className:"text-blue-400 font-bold w-12",children:"sin(θ)"}),(0,t.jsx)("span",{className:"text-white",children:"="}),(0,t.jsx)("span",{className:"text-blue-400",children:Math.sin(U).toFixed(4)})]}),d&&(0,t.jsxs)("div",{className:"flex items-center gap-2 text-xs",children:[(0,t.jsx)("span",{className:"text-green-400 font-bold w-12",children:"cos(θ)"}),(0,t.jsx)("span",{className:"text-white",children:"="}),(0,t.jsx)("span",{className:"text-green-400",children:Math.cos(U).toFixed(4)})]}),u&&10>Math.abs(T)&&(0,t.jsxs)("div",{className:"flex items-center gap-2 text-xs",children:[(0,t.jsx)("span",{className:"text-red-400 font-bold w-12",children:"tan(θ)"}),(0,t.jsx)("span",{className:"text-white",children:"="}),(0,t.jsx)("span",{className:"text-red-400",children:T.toFixed(4)})]}),h&&10>Math.abs(F)&&Math.abs(I)>.01&&(0,t.jsxs)("div",{className:"flex items-center gap-2 text-xs",children:[(0,t.jsx)("span",{className:"text-orange-400 font-bold w-12",children:"cot(θ)"}),(0,t.jsx)("span",{className:"text-white",children:"="}),(0,t.jsx)("span",{className:"text-orange-400",children:F.toFixed(4)})]}),f&&Math.abs(W)>.01&&(0,t.jsxs)("div",{className:"flex items-center gap-2 text-xs",children:[(0,t.jsx)("span",{className:"text-purple-400 font-bold w-12",children:"sec(θ)"}),(0,t.jsx)("span",{className:"text-white",children:"="}),(0,t.jsx)("span",{className:"text-purple-400",children:(1/W).toFixed(4)})]}),p&&Math.abs(I)>.01&&(0,t.jsxs)("div",{className:"flex items-center gap-2 text-xs",children:[(0,t.jsx)("span",{className:"text-pink-400 font-bold w-12",children:"csc(θ)"}),(0,t.jsx)("span",{className:"text-white",children:"="}),(0,t.jsx)("span",{className:"text-pink-400",children:(1/I).toFixed(4)})]})]})}),c&&d&&(0,t.jsx)(a.Html,{position:[3.5,-3.5,0],distanceFactor:12,children:(0,t.jsxs)("div",{className:"bg-gray-900/95 px-3 py-2 rounded-lg border border-yellow-500/50 shadow-xl",children:[(0,t.jsx)("div",{className:"text-yellow-400 font-bold text-xs text-center",children:"sin²(θ) + cos²(θ) = 1"}),(0,t.jsxs)("div",{className:"text-[9px] text-gray-400 text-center mt-1",children:["(",(Math.sin(U)**2).toFixed(3),") + (",(Math.cos(U)**2).toFixed(3),") = ",(Math.sin(U)**2+Math.cos(U)**2).toFixed(3)]})]})})]})]})};e.i(81413);var d=e.i(48205),u=e.i(82192),h=e.i(68647),f=e.i(14228),p=e.i(4685);e.s(["default",0,function(){let e=(0,n.useRouter)(),[r,s]=(0,i.useState)(null),[a,o]=(0,i.useState)(!0),[l,m]=(0,i.useState)(!0),[x,v]=(0,i.useState)(1),[g,y]=(0,i.useState)(0),[b,w]=(0,i.useState)(45),[S,j]=(0,i.useState)(!1),[M,A]=(0,i.useState)(!0),[E,C]=(0,i.useState)(!0),[L,N]=(0,i.useState)(!0),[_,P]=(0,i.useState)(!1),[z,U]=(0,i.useState)(!1),[W,I]=(0,i.useState)(!1),[T,B]=(0,i.useState)(!0),O=(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsx)(h.ControlGroup,{title:"Angle Control",children:(0,t.jsx)(h.ControlSlider,{label:S?"Angle (rad)":"Angle (deg)",value:b,unit:S?"rad":"°",min:0,max:S?6.28:360,step:S?.1:1,color:"#8b5cf6",onChange:w,decimals:2*!!S})}),(0,t.jsxs)(h.ControlGroup,{title:"Display Options",children:[(0,t.jsx)(h.ControlCheckbox,{label:"Use Radians",checked:S,onChange:j,color:"#8b5cf6"}),(0,t.jsx)(h.ControlCheckbox,{label:"Show Sin",checked:M,onChange:A,color:"#3b82f6"}),(0,t.jsx)(h.ControlCheckbox,{label:"Show Cos",checked:E,onChange:C,color:"#22c55e"}),(0,t.jsx)(h.ControlCheckbox,{label:"Show Tan",checked:L,onChange:N,color:"#ef4444"}),(0,t.jsx)(h.ControlCheckbox,{label:"Show Cot",checked:_,onChange:P,color:"#f97316"}),(0,t.jsx)(h.ControlCheckbox,{label:"Show Sec",checked:z,onChange:U,color:"#a855f7"}),(0,t.jsx)(h.ControlCheckbox,{label:"Show Csc",checked:W,onChange:I,color:"#ec4899"}),(0,t.jsx)(h.ControlCheckbox,{label:"Show Graph",checked:T,onChange:B,color:"#06b6d4"})]}),(0,t.jsxs)("div",{className:"bg-violet-50/50 rounded-lg p-3 border border-violet-200/50",children:[(0,t.jsx)("div",{className:"text-xs text-gray-600 mb-2 font-medium",children:"Trigonometric Relationships"}),(0,t.jsxs)("div",{className:"text-xs text-gray-500 space-y-1",children:[(0,t.jsx)("div",{children:"• sin²(θ) + cos²(θ) = 1"}),(0,t.jsx)("div",{children:"• tan(θ) = sin(θ) / cos(θ)"}),(0,t.jsx)("div",{children:"• Click and drag to rotate view"}),(0,t.jsx)("div",{children:"• Animation shows wave tracing"})]})]}),(0,t.jsx)("button",{onClick:()=>e.push("/experiments/trigonometry/details"),className:"w-full py-2.5 bg-gradient-to-r from-violet-100 to-violet-200 hover:from-violet-200 hover:to-violet-300 text-violet-700 font-medium text-sm rounded-lg transition-all border border-violet-300/50 flex items-center justify-center gap-2",children:"📖 View Experiment Details"})]}),F=r?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(h.DataGrid,{data:{angle:{value:S?r.radians:r.angle,unit:S?"rad":"deg",color:"#8b5cf6",decimals:3*!!S},sin:{value:r.sin,unit:"",color:"#22c55e",decimals:4},cos:{value:r.cos,unit:"",color:"#3b82f6",decimals:4},tan:{value:Math.abs(r.tan)>100?0:r.tan,unit:"",color:"#ef4444",decimals:4}},columns:2}),(0,t.jsxs)("div",{className:"mt-3 space-y-2",children:[(0,t.jsxs)("div",{className:"p-2 bg-gray-800/50 rounded-lg",children:[(0,t.jsx)("div",{className:"text-xs text-gray-400",children:"Quadrant"}),(0,t.jsx)("div",{className:"text-sm font-bold text-violet-400",children:r.quadrant})]}),r.exactValue&&(0,t.jsxs)("div",{className:"p-2 bg-gray-800/50 rounded-lg",children:[(0,t.jsx)("div",{className:"text-xs text-gray-400",children:"Special Angle"}),(0,t.jsx)("div",{className:"text-xs font-mono text-green-400",children:r.exactValue}),(0,t.jsxs)("div",{className:"mt-1 text-xs text-gray-400",children:["sin: ",r.sinValue]}),(0,t.jsxs)("div",{className:"text-xs text-gray-400",children:["cos: ",r.cosValue]}),(0,t.jsxs)("div",{className:"text-xs text-gray-400",children:["tan: ",r.tanValue]})]}),(0,t.jsx)("div",{className:"p-2 bg-gray-800/50 rounded-lg",children:(0,t.jsx)("div",{className:"text-center font-mono text-violet-400 text-sm",children:"sin²(θ) + cos²(θ) = 1"})})]})]}):(0,t.jsx)("div",{className:"text-center text-gray-500 text-sm py-8",children:"Waiting for simulation data..."});return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(d.ExperimentContainer,{title:"Trigonometry Explorer",description:"Interactive 3D unit circle with all 6 trig functions, real-time graphing, and special angles reference",cameraPosition:[0,0,10],backgroundColor:"#050510",controls:null,dataPanel:null,children:(0,t.jsx)(c,{onDataChange:s,angle:b,useRadians:S,showSin:M,showCos:E,showTan:L,showCot:_,showSec:z,showCsc:W,showGraph:T,animationSpeed:x,isPlaying:l})}),(0,t.jsx)(f.SimulationController,{isPlaying:l,onPlayPause:()=>m(e=>!e),onReset:()=>{y(e=>e+1),m(!0),v(1),w(45)},speed:x,onSpeedChange:v}),(0,t.jsx)(u.FloatingControlPanel,{title:"📐 Trig Controls",initialPosition:{x:20,y:80},children:O}),(0,t.jsx)(p.DataPanel,{isVisible:a,onToggle:()=>o(!a),children:F})]})}],85490)}]);
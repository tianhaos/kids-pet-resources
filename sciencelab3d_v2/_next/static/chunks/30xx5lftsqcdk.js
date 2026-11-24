(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,r;var i=e.i(31067),n=e.i(71645),s=e.i(90072),a=e.i(48546),o=s,l=s;let c=new l.Box3,d=new l.Vector3;class u extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,r=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),r.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let r=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(r,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(r,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let r;e instanceof Float32Array?r=e:Array.isArray(e)&&(r=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(r,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(i,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(i,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),c.setFromBufferAttribute(t),this.boundingBox.union(c))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let r=this.boundingSphere.center;this.boundingBox.getCenter(r);let i=0;for(let n=0,s=e.count;n<s;n++)d.fromBufferAttribute(e,n),i=Math.max(i,r.distanceToSquared(d)),d.fromBufferAttribute(t,n),i=Math.max(i,r.distanceToSquared(d));this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var h=s,f=e.i(8560),m=e.i(31497);class p extends h.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:h.UniformsUtils.clone(h.UniformsUtils.merge([f.UniformsLib.common,f.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new h.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let x=m.version>=125?"uv1":"uv2",g=new o.Vector4,y=new o.Vector3,v=new o.Vector3,b=new o.Vector4,S=new o.Vector4,w=new o.Vector4,M=new o.Vector3,j=new o.Matrix4,E=new o.Line3,A=new o.Vector3,P=new o.Box3,C=new o.Sphere,z=new o.Vector4;function L(e,t,i){return z.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),z.multiplyScalar(1/z.w),z.x=r/i.width,z.y=r/i.height,z.applyMatrix4(e.projectionMatrixInverse),z.multiplyScalar(1/z.w),Math.abs(Math.max(z.x,z.y))}class _ extends o.Mesh{constructor(e=new u,t=new p({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,r=e.attributes.instanceEnd,i=new Float32Array(2*t.count);for(let e=0,n=0,s=t.count;e<s;e++,n+=2)y.fromBufferAttribute(t,e),v.fromBufferAttribute(r,e),i[n]=0===n?0:i[n-1],i[n+1]=i[n]+y.distanceTo(v);let n=new o.InstancedInterleavedBuffer(i,2,1);return e.setAttribute("instanceDistanceStart",new o.InterleavedBufferAttribute(n,1,0)),e.setAttribute("instanceDistanceEnd",new o.InterleavedBufferAttribute(n,1,1)),this}raycast(e,i){let n,s,a=this.material.worldUnits,l=e.camera;null!==l||a||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let d=this.matrixWorld,u=this.geometry,h=this.material;if(r=h.linewidth+c,null===u.boundingSphere&&u.computeBoundingSphere(),C.copy(u.boundingSphere).applyMatrix4(d),a)n=.5*r;else{let e=Math.max(l.near,C.distanceToPoint(t.origin));n=L(l,e,h.resolution)}if(C.radius+=n,!1!==t.intersectsSphere(C)){if(null===u.boundingBox&&u.computeBoundingBox(),P.copy(u.boundingBox).applyMatrix4(d),a)s=.5*r;else{let e=Math.max(l.near,P.distanceToPoint(t.origin));s=L(l,e,h.resolution)}P.expandByScalar(s),!1!==t.intersectsBox(P)&&(a?function(e,i){let n=e.matrixWorld,s=e.geometry,a=s.attributes.instanceStart,l=s.attributes.instanceEnd,c=Math.min(s.instanceCount,a.count);for(let s=0;s<c;s++){E.start.fromBufferAttribute(a,s),E.end.fromBufferAttribute(l,s),E.applyMatrix4(n);let c=new o.Vector3,d=new o.Vector3;t.distanceSqToSegment(E.start,E.end,d,c),d.distanceTo(c)<.5*r&&i.push({point:d,pointOnLine:c,distance:t.origin.distanceTo(d),object:e,face:null,faceIndex:s,uv:null,[x]:null})}}(this,i):function(e,i,n){let s=i.projectionMatrix,a=e.material.resolution,l=e.matrixWorld,c=e.geometry,d=c.attributes.instanceStart,u=c.attributes.instanceEnd,h=Math.min(c.instanceCount,d.count),f=-i.near;t.at(1,w),w.w=1,w.applyMatrix4(i.matrixWorldInverse),w.applyMatrix4(s),w.multiplyScalar(1/w.w),w.x*=a.x/2,w.y*=a.y/2,w.z=0,M.copy(w),j.multiplyMatrices(i.matrixWorldInverse,l);for(let i=0;i<h;i++){if(b.fromBufferAttribute(d,i),S.fromBufferAttribute(u,i),b.w=1,S.w=1,b.applyMatrix4(j),S.applyMatrix4(j),b.z>f&&S.z>f)continue;if(b.z>f){let e=b.z-S.z,t=(b.z-f)/e;b.lerp(S,t)}else if(S.z>f){let e=S.z-b.z,t=(S.z-f)/e;S.lerp(b,t)}b.applyMatrix4(s),S.applyMatrix4(s),b.multiplyScalar(1/b.w),S.multiplyScalar(1/S.w),b.x*=a.x/2,b.y*=a.y/2,S.x*=a.x/2,S.y*=a.y/2,E.start.copy(b),E.start.z=0,E.end.copy(S),E.end.z=0;let c=E.closestPointToPointParameter(M,!0);E.at(c,A);let h=o.MathUtils.lerp(b.z,S.z,c),m=h>=-1&&h<=1,p=M.distanceTo(A)<.5*r;if(m&&p){E.start.fromBufferAttribute(d,i),E.end.fromBufferAttribute(u,i),E.start.applyMatrix4(l),E.end.applyMatrix4(l);let r=new o.Vector3,s=new o.Vector3;t.distanceSqToSegment(E.start,E.end,s,r),n.push({point:s,pointOnLine:r,distance:t.origin.distanceTo(s),object:e,face:null,faceIndex:i,uv:null,[x]:null})}}}(this,l,i))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(g),this.material.uniforms.resolution.value.set(g.z,g.w))}}class U extends u{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,r=new Float32Array(2*t);for(let i=0;i<t;i+=3)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5];return super.setPositions(r),this}setColors(e,t=3){let r=e.length-t,i=new Float32Array(2*r);if(3===t)for(let n=0;n<r;n+=t)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];else for(let n=0;n<r;n+=t)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5],i[2*n+6]=e[n+6],i[2*n+7]=e[n+7];return super.setColors(i,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class T extends _{constructor(e=new U,t=new p({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let B=n.forwardRef(function({points:e,color:t=0xffffff,vertexColors:r,linewidth:o,lineWidth:l,segments:c,dashed:d,...h},f){var m,x;let g=(0,a.useThree)(e=>e.size),y=n.useMemo(()=>c?new _:new T,[c]),[v]=n.useState(()=>new p),b=(null==r||null==(m=r[0])?void 0:m.length)===4?4:3,S=n.useMemo(()=>{let i=c?new u:new U,n=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Vector3||e instanceof s.Vector4?[e.x,e.y,e.z]:e instanceof s.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(i.setPositions(n.flat()),r){t=0xffffff;let e=r.map(e=>e instanceof s.Color?e.toArray():e);i.setColors(e.flat(),b)}return i},[e,c,r,b]);return n.useLayoutEffect(()=>{y.computeLineDistances()},[e,y]),n.useLayoutEffect(()=>{d?v.defines.USE_DASH="":delete v.defines.USE_DASH,v.needsUpdate=!0},[d,v]),n.useEffect(()=>()=>{S.dispose(),v.dispose()},[S]),n.createElement("primitive",(0,i.default)({object:y,ref:f},h),n.createElement("primitive",{object:S,attach:"geometry"}),n.createElement("primitive",(0,i.default)({object:v,attach:"material",color:t,vertexColors:!!r,resolution:[g.width,g.height],linewidth:null!=(x=null!=o?o:l)?x:1,dashed:d,transparent:4===b},h)))});e.s(["Line",0,B],43216)},60099,e=>{"use strict";let t,r;var i=e.i(31067),n=e.i(71645),s=e.i(88014),a=e.i(90072),o=e.i(48546),l=e.i(94800);let c=new a.Vector3,d=new a.Vector3,u=new a.Vector3,h=new a.Vector2;function f(e,t,r){let i=c.setFromMatrixPosition(e.matrixWorld);i.project(t);let n=r.width/2,s=r.height/2;return[i.x*n+n,-(i.y*s)+s]}let m=e=>1e-10>Math.abs(e)?0:e;function p(e,t,r=""){let i="matrix3d(";for(let r=0;16!==r;r++)i+=m(t[r]*e.elements[r])+(15!==r?",":")");return r+i}let x=(t=[1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1],e=>p(e,t)),g=(r=e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1],(e,t)=>p(e,r(t),"translate(-50%,-50%)")),y=n.forwardRef(({children:e,eps:t=.001,style:r,className:p,prepend:y,center:v,fullscreen:b,portal:S,distanceFactor:w,sprite:M=!1,transform:j=!1,occlude:E,onOcclude:A,castShadow:P,receiveShadow:C,material:z,geometry:L,zIndexRange:_=[0x1000037,0],calculatePosition:U=f,as:T="div",wrapperClass:B,pointerEvents:I="auto",...R},O)=>{let{gl:D,camera:G,scene:W,size:N,raycaster:k,events:V,viewport:F}=(0,o.useThree)(),[H]=n.useState(()=>document.createElement(T)),$=n.useRef(null),q=n.useRef(null),X=n.useRef(0),Y=n.useRef([0,0]),J=n.useRef(null),Z=n.useRef(null),K=(null==S?void 0:S.current)||V.connected||D.domElement.parentNode,Q=n.useRef(null),ee=n.useRef(!1),et=n.useMemo(()=>{var e;return E&&"blending"!==E||Array.isArray(E)&&E.length&&(e=E[0])&&"object"==typeof e&&"current"in e},[E]);n.useLayoutEffect(()=>{let e=D.domElement;E&&"blending"===E?(e.style.zIndex=`${Math.floor(_[0]/2)}`,e.style.position="absolute",e.style.pointerEvents="none"):(e.style.zIndex=null,e.style.position=null,e.style.pointerEvents=null)},[E]),n.useLayoutEffect(()=>{if(q.current){let e=$.current=s.createRoot(H);if(W.updateMatrixWorld(),j)H.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";else{let e=U(q.current,G,N);H.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${e[0]}px,${e[1]}px,0);transform-origin:0 0;`}return K&&(y?K.prepend(H):K.appendChild(H)),()=>{K&&K.removeChild(H),e.unmount()}}},[K,j]),n.useLayoutEffect(()=>{B&&(H.className=B)},[B]);let er=n.useMemo(()=>j?{position:"absolute",top:0,left:0,width:N.width,height:N.height,transformStyle:"preserve-3d",pointerEvents:"none"}:{position:"absolute",transform:v?"translate3d(-50%,-50%,0)":"none",...b&&{top:-N.height/2,left:-N.width/2,width:N.width,height:N.height},...r},[r,v,b,N,j]),ei=n.useMemo(()=>({position:"absolute",pointerEvents:I}),[I]);n.useLayoutEffect(()=>{var t,i;ee.current=!1,j?null==(t=$.current)||t.render(n.createElement("div",{ref:J,style:er},n.createElement("div",{ref:Z,style:ei},n.createElement("div",{ref:O,className:p,style:r,children:e})))):null==(i=$.current)||i.render(n.createElement("div",{ref:O,style:er,className:p,children:e}))});let en=n.useRef(!0);(0,l.useFrame)(e=>{if(q.current){G.updateMatrixWorld(),q.current.updateWorldMatrix(!0,!1);let e=j?Y.current:U(q.current,G,N);if(j||Math.abs(X.current-G.zoom)>t||Math.abs(Y.current[0]-e[0])>t||Math.abs(Y.current[1]-e[1])>t){var r;let t,i,n,s,o=(r=q.current,t=c.setFromMatrixPosition(r.matrixWorld),i=d.setFromMatrixPosition(G.matrixWorld),n=t.sub(i),s=G.getWorldDirection(u),n.angleTo(s)>Math.PI/2),l=!1;et&&(Array.isArray(E)?l=E.map(e=>e.current):"blending"!==E&&(l=[W]));let f=en.current;l?en.current=function(e,t,r,i){let n=c.setFromMatrixPosition(e.matrixWorld),s=n.clone();s.project(t),h.set(s.x,s.y),r.setFromCamera(h,t);let a=r.intersectObjects(i,!0);if(a.length){let e=a[0].distance;return n.distanceTo(r.ray.origin)<e}return!0}(q.current,G,k,l)&&!o:en.current=!o,f!==en.current&&(A?A(!en.current):H.style.display=en.current?"block":"none");let p=Math.floor(_[0]/2),y=E?et?[_[0],p]:[p-1,0]:_;if(H.style.zIndex=`${function(e,t,r){if(t instanceof a.PerspectiveCamera||t instanceof a.OrthographicCamera){let i=c.setFromMatrixPosition(e.matrixWorld),n=d.setFromMatrixPosition(t.matrixWorld),s=i.distanceTo(n),a=(r[1]-r[0])/(t.far-t.near),o=r[1]-a*t.far;return Math.round(a*s+o)}}(q.current,G,y)}`,j){let[e,t]=[N.width/2,N.height/2],r=G.projectionMatrix.elements[5]*t,{isOrthographicCamera:i,top:n,left:s,bottom:a,right:o}=G,l=x(G.matrixWorldInverse),c=i?`scale(${r})translate(${m(-(o+s)/2)}px,${m((n+a)/2)}px)`:`translateZ(${r}px)`,d=q.current.matrixWorld;M&&((d=G.matrixWorldInverse.clone().transpose().copyPosition(d).scale(q.current.scale)).elements[3]=d.elements[7]=d.elements[11]=0,d.elements[15]=1),H.style.width=N.width+"px",H.style.height=N.height+"px",H.style.perspective=i?"":`${r}px`,J.current&&Z.current&&(J.current.style.transform=`${c}${l}translate(${e}px,${t}px)`,Z.current.style.transform=g(d,1/((w||10)/400)))}else{let t=void 0===w?1:function(e,t){if(t instanceof a.OrthographicCamera)return t.zoom;if(!(t instanceof a.PerspectiveCamera))return 1;{let r=c.setFromMatrixPosition(e.matrixWorld),i=d.setFromMatrixPosition(t.matrixWorld);return 1/(2*Math.tan(t.fov*Math.PI/180/2)*r.distanceTo(i))}}(q.current,G)*w;H.style.transform=`translate3d(${e[0]}px,${e[1]}px,0) scale(${t})`}Y.current=e,X.current=G.zoom}}if(!et&&Q.current&&!ee.current)if(j){if(J.current){let e=J.current.children[0];if(null!=e&&e.clientWidth&&null!=e&&e.clientHeight){let{isOrthographicCamera:t}=G;if(t||L)R.scale&&(Array.isArray(R.scale)?R.scale instanceof a.Vector3?Q.current.scale.copy(R.scale.clone().divideScalar(1)):Q.current.scale.set(1/R.scale[0],1/R.scale[1],1/R.scale[2]):Q.current.scale.setScalar(1/R.scale));else{let t=(w||10)/400,r=e.clientWidth*t,i=e.clientHeight*t;Q.current.scale.set(r,i,1)}ee.current=!0}}}else{let t=H.children[0];if(null!=t&&t.clientWidth&&null!=t&&t.clientHeight){let e=1/F.factor,r=t.clientWidth*e,i=t.clientHeight*e;Q.current.scale.set(r,i,1),ee.current=!0}Q.current.lookAt(e.camera.position)}});let es=n.useMemo(()=>({vertexShader:j?void 0:`
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
      `}),[j]);return n.createElement("group",(0,i.default)({},R,{ref:q}),E&&!et&&n.createElement("mesh",{castShadow:P,receiveShadow:C,ref:Q},L||n.createElement("planeGeometry",null),z||n.createElement("shaderMaterial",{side:a.DoubleSide,vertexShader:es.vertexShader,fragmentShader:es.fragmentShader})))});e.s(["Html",0,y])},56420,e=>{"use strict";var t=e.i(71645);let r=(...e)=>e.filter((e,t,r)=>!!e&&""!==e.trim()&&r.indexOf(e)===t).join(" ").trim(),i=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,r)=>r?r.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var n={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,t.createContext)({}),a=(0,t.forwardRef)(({color:e,size:i,strokeWidth:a,absoluteStrokeWidth:o,className:l="",children:c,iconNode:d,...u},h)=>{let{size:f=24,strokeWidth:m=2,absoluteStrokeWidth:p=!1,color:x="currentColor",className:g=""}=(0,t.useContext)(s)??{},y=o??p?24*Number(a??m)/Number(i??f):a??m;return(0,t.createElement)("svg",{ref:h,...n,width:i??f??n.width,height:i??f??n.height,stroke:e??x,strokeWidth:y,className:r("lucide",g,l),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,r])=>(0,t.createElement)(e,r)),...Array.isArray(c)?c:[c]])});e.s(["default",0,(e,n)=>{let s=(0,t.forwardRef)(({className:s,...o},l)=>(0,t.createElement)(a,{ref:l,iconNode:n,className:r(`lucide-${i(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...o}));return s.displayName=i(e),s}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,r)=>{t.exports=e.r(76562)},67581,e=>{"use strict";var t=e.i(43476),r=e.i(71645),i=e.i(92989),n=e.i(94800),s=e.i(43216),a=e.i(60099),o=e.i(16196),l=e.i(90072);function c(e,t,r){return 2*Math.PI*Math.sqrt(e/t)*(1+r*r/16+11*r*r*r*r/3072)}function d({kineticEnergy:e,potentialEnergy:r,totalEnergy:i,position:n=[0,-5,0]}){let s=Math.max(1.2*i,.1),a=n[1],l=e/s*4,c=r/s*4,u=i/s*4,h=n[0],f=n[2];return(0,t.jsxs)("group",{position:[h,a,f],children:[(0,t.jsxs)("mesh",{position:[.6,-.1,0],receiveShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[1.6,.15,.8]}),(0,t.jsx)("meshStandardMaterial",{color:"#1a1a2e",metalness:.7,roughness:.3})]}),(0,t.jsxs)("group",{position:[0,0,0],children:[(0,t.jsxs)("mesh",{position:[0,l/2,0],castShadow:!0,receiveShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[.4,Math.max(l,.05),.4]}),(0,t.jsx)("meshStandardMaterial",{color:"#22c55e",metalness:.6,roughness:.3,emissive:"#22c55e",emissiveIntensity:.3})]}),(0,t.jsx)(o.Text,{position:[0,l+.4,0],fontSize:.25,color:"#22c55e",anchorX:"center",anchorY:"middle",children:"KE"}),(0,t.jsxs)(o.Text,{position:[0,l+.7,0],fontSize:.18,color:"#86efac",anchorX:"center",anchorY:"middle",children:[e.toFixed(1)," J"]})]}),(0,t.jsxs)("group",{position:[.6,0,0],children:[(0,t.jsxs)("mesh",{position:[0,c/2,0],castShadow:!0,receiveShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[.4,Math.max(c,.05),.4]}),(0,t.jsx)("meshStandardMaterial",{color:"#f59e0b",metalness:.6,roughness:.3,emissive:"#f59e0b",emissiveIntensity:.3})]}),(0,t.jsx)(o.Text,{position:[0,c+.4,0],fontSize:.25,color:"#f59e0b",anchorX:"center",anchorY:"middle",children:"PE"}),(0,t.jsxs)(o.Text,{position:[0,c+.7,0],fontSize:.18,color:"#fcd34d",anchorX:"center",anchorY:"middle",children:[r.toFixed(1)," J"]})]}),(0,t.jsxs)("group",{position:[1.2,0,0],children:[(0,t.jsxs)("mesh",{position:[0,u/2,0],castShadow:!0,receiveShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[.4,Math.max(u,.05),.4]}),(0,t.jsx)("meshStandardMaterial",{color:"#a855f7",metalness:.6,roughness:.3,emissive:"#a855f7",emissiveIntensity:.4})]}),(0,t.jsx)(o.Text,{position:[0,u+.4,0],fontSize:.25,color:"#a855f7",anchorX:"center",anchorY:"middle",children:"Total"}),(0,t.jsxs)(o.Text,{position:[0,u+.7,0],fontSize:.18,color:"#d8b4fe",anchorX:"center",anchorY:"middle",children:[i.toFixed(1)," J"]})]}),(0,t.jsx)(o.Text,{position:[.6,-.5,.5],fontSize:.22,color:"#94a3b8",anchorX:"center",anchorY:"middle",children:"Energy (J)"})]})}function u({onDataChange:e,length:i=10,gravity:o=9.81,mass:p=2,damping:x=.005,initialAngle:g=Math.PI/4,showTrail:y=!0,showVectors:v=!0,showAngleArc:b=!0,showProtractor:S=!0,isPlaying:w=!0,simulationSpeed:M=1,resetTrigger:j}){let[E,A]=(0,r.useState)({ke:0,pe:0,total:0}),P=(0,r.useRef)(null),C=(0,r.useRef)(null),z=(0,r.useRef)(null),L=(0,r.useRef)(null),_=(0,r.useRef)(null),U=(0,r.useRef)(null),T=(0,r.useRef)(null),B=(0,r.useRef)(null),I=(0,r.useRef)({theta:g,omega:0,time:0,lastTheta:g,oscillations:0,lastCrossTime:0,measuredPeriod:0}),R=(0,r.useRef)(0),O=(0,r.useRef)({ke:0,pe:0,total:0}),D=(0,r.useMemo)(()=>({positions:new Float32Array(4500),colors:new Float32Array(4500),ages:new Float32Array(1500),idx:0}),[]),G=(0,r.useMemo)(()=>{let e=new l.BufferGeometry;return e.setAttribute("position",new l.BufferAttribute(D.positions,3)),e.setAttribute("color",new l.BufferAttribute(D.colors,3)),e.setAttribute("age",new l.BufferAttribute(D.ages,1)),e},[]),W=.5+.08*p;return(0,r.useEffect)(()=>{void 0!==j&&j>0&&(I.current={theta:g,omega:0,time:0,lastTheta:g,oscillations:0,lastCrossTime:0,measuredPeriod:0},R.current=0,D.idx=0,D.positions.fill(0),D.colors.fill(0),D.ages.fill(0),A({ke:0,pe:p*o*i*(1-Math.cos(g)),total:p*o*i*(1-Math.cos(g))}))},[j,g,p,o,i,D]),(0,r.useEffect)(()=>()=>{G.dispose()},[G]),(0,n.useFrame)((t,r)=>{let n=Math.min(r,.02),s=n*M,a=I.current;if(R.current++,w&&s>0){let e=Math.max(1,Math.ceil(s/.004)),t=s/e;for(let r=0;r<e;r++){let[e,r]=function(e,t,r,i,n,s){let a=(e,t)=>{let s=-(r/i)*Math.sin(e)-n*t;return[t,s]},[o,l]=a(e,t),[c,d]=a(e+o*s*.5,t+l*s*.5),[u,h]=a(e+c*s*.5,t+d*s*.5),[f,m]=a(e+u*s,t+h*s);return[e+s/6*(o+2*c+2*u+f),t+s/6*(l+2*d+2*h+m)]}(a.theta,a.omega,o,i,x,t);a.lastTheta=a.theta,a.theta=e,a.omega=r}a.time+=s,a.lastTheta<0&&a.theta>=0&&(a.oscillations++,a.lastCrossTime>0&&(a.measuredPeriod=a.time-a.lastCrossTime),a.lastCrossTime=a.time)}let l=a.theta,d=a.omega,u=Math.sin(l)*i,h=-Math.cos(l)*i;if(P.current&&P.current.position.set(u,h,0),C.current){let e=.5*u;C.current.position.set(e,.5*h,0);let t=Math.sqrt(u*u+h*h);C.current.scale.set(1,t,1),C.current.rotation.z=Math.atan2(u,-h)}if(y&&w&&z.current){let e=D.idx%1500;D.positions[3*e]=u,D.positions[3*e+1]=h,D.positions[3*e+2]=0,D.ages[e]=1;let t=Math.min(Math.abs(d)/3,1);t<.5?(D.colors[3*e]=.2+.4*t,D.colors[3*e+1]=.5+.4*t,D.colors[3*e+2]=1-.3*t):(D.colors[3*e]=.4+(t-.5)*.6,D.colors[3*e+1]=.7-(t-.5)*.4,D.colors[3*e+2]=.85-(t-.5)*.5),D.idx++;for(let e=0;e<1500;e++)D.ages[e]>0&&(D.ages[e]-=.8*n,D.ages[e]<0&&(D.ages[e]=0));let r=z.current.geometry.attributes.position,i=z.current.geometry.attributes.color,s=z.current.geometry.attributes.age;r.needsUpdate=!0,i.needsUpdate=!0,s.needsUpdate=!0,z.current.geometry.setDrawRange(0,Math.min(D.idx,1500))}if(v){let e=d*i;if(L.current){let t=Math.cos(l)*e*.3,r=Math.sin(l)*e*.3;L.current.position.set(u,h,0),L.current.rotation.z=Math.atan2(r,t)-Math.PI/2;let i=Math.sqrt(t*t+r*r);L.current.scale.set(1,Math.max(i,.01),1),L.current.visible=i>.05}if(_.current&&(_.current.position.set(u,h,0),_.current.rotation.z=0,_.current.scale.set(1,p*o*.05,1)),U.current){let e=p*o*Math.cos(l)+p*i*d*d;U.current.position.set(u,h,0),U.current.rotation.z=Math.atan2(-u,-h)+Math.PI/2,U.current.scale.set(1,Math.max(.05*e,.01),1)}if(T.current){let e=-p*o*Math.sin(l)-x*d*p*i*Math.cos(l),t=-p*o*Math.cos(l)+p*i*d*d-x*d*p*i*Math.sin(l),r=Math.sqrt(e*e+t*t);T.current.position.set(u,h,0),T.current.rotation.z=Math.atan2(t,e)-Math.PI/2,T.current.scale.set(1,Math.max(.05*r,.01),1),T.current.visible=r>.01}}if(b&&B.current){let e=[],t=Math.abs(l),r=Math.min(.3*i,3);for(let i=0;i<=30;i++){let n=i/30*t*Math.sign(l);e.push([Math.sin(n)*r,-Math.cos(n)*r,0])}let n=B.current.geometry.attributes.position;for(let t=0;t<e.length;t++)n.setXYZ(t,e[t][0],e[t][1],e[t][2]);for(let t=e.length;t<n.count;t++)n.setXYZ(t,0,0,0);n.needsUpdate=!0}let f=.5*p*i*i*d*d,m=p*o*i*(1-Math.cos(l)),S=f+m;O.current={ke:f,pe:m,total:S},R.current%8==0&&(A({ke:f,pe:m,total:S}),e?.({period:c(i,o,Math.abs(g)),periodMeasured:a.measuredPeriod,frequency:1/c(i,o,Math.abs(g)),angularFrequency:Math.sqrt(o/i),kineticEnergy:f,potentialEnergy:m,totalEnergy:S,angle:l,angleDeg:180*l/Math.PI,angularVelocity:d,tangentialVelocity:d*i,elapsedTime:a.time,oscillations:a.oscillations,phaseAngle:l,phaseVelocity:d}))}),(0,t.jsxs)("group",{children:[(0,t.jsx)("ambientLight",{intensity:.35}),(0,t.jsx)("directionalLight",{position:[15,25,10],intensity:1.2,castShadow:!0}),(0,t.jsx)("directionalLight",{position:[-8,12,-8],intensity:.3}),(0,t.jsx)("pointLight",{position:[0,5,8],intensity:.4,color:"#8b5cf6"}),(0,t.jsx)(f,{width:1.6*i,height:1.15*i}),S&&(0,t.jsx)(m,{radius:Math.min(.4*i,4),maxAngle:80}),(0,t.jsx)(s.Line,{points:[[0,0,0],[0,-i-2,0]],color:"#ffffff",lineWidth:1,dashed:!0,dashSize:.3,gapSize:.2,opacity:.25}),b&&(0,t.jsx)(s.Line,{ref:B,points:Array.from({length:31},()=>[0,0,0]),color:"#f59e0b",lineWidth:2}),(0,t.jsxs)("group",{ref:C,castShadow:!0,children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("cylinderGeometry",{args:[.05,.05,1,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#8B7355",metalness:.1,roughness:.85})]}),(0,t.jsxs)("mesh",{children:[(0,t.jsx)("cylinderGeometry",{args:[.03,.03,1,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#6B5344",metalness:.05,roughness:.9})]}),(0,t.jsxs)("mesh",{rotation:[0,0,Math.PI/6],children:[(0,t.jsx)("cylinderGeometry",{args:[.015,.015,1,6]}),(0,t.jsx)("meshStandardMaterial",{color:"#A08060",metalness:.15,roughness:.75})]}),(0,t.jsxs)("mesh",{rotation:[0,0,-Math.PI/6],children:[(0,t.jsx)("cylinderGeometry",{args:[.015,.015,1,6]}),(0,t.jsx)("meshStandardMaterial",{color:"#A08060",metalness:.15,roughness:.75})]})]}),y&&(0,t.jsx)("points",{ref:z,geometry:G,children:(0,t.jsx)("pointsMaterial",{size:.1,vertexColors:!0,transparent:!0,opacity:.85,sizeAttenuation:!0,blending:l.AdditiveBlending,depthWrite:!1})}),(0,t.jsxs)("group",{ref:P,children:[(0,t.jsxs)("mesh",{position:[0,W+.15,0],castShadow:!0,children:[(0,t.jsx)("torusGeometry",{args:[.15,.04,8,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#555555",metalness:.9,roughness:.1})]}),(0,t.jsxs)("mesh",{castShadow:!0,receiveShadow:!0,children:[(0,t.jsx)("sphereGeometry",{args:[W,48,48]}),(0,t.jsx)("meshStandardMaterial",{color:"#a855f7",metalness:.85,roughness:.15,envMapIntensity:1.2})]}),(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.55*W,32,32]}),(0,t.jsx)("meshStandardMaterial",{color:"#ec4899",metalness:.7,roughness:.2,emissive:"#ec4899",emissiveIntensity:.15})]}),(0,t.jsxs)("mesh",{position:[.4*W,.4*W,0],children:[(0,t.jsx)("sphereGeometry",{args:[.2*W,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#ffffff",metalness:1,roughness:0,emissive:"#ffffff",emissiveIntensity:.3,transparent:!0,opacity:.6})]}),(0,t.jsxs)("mesh",{position:[0,-i-.1,0],rotation:[-Math.PI/2,0,0],children:[(0,t.jsx)("circleGeometry",{args:[1.5*W,32]}),(0,t.jsx)("meshBasicMaterial",{color:"#000000",transparent:!0,opacity:.3,blending:l.MultiplyBlending,depthWrite:!1})]}),(0,t.jsx)(a.Html,{position:[W+.5,0,0],center:!0,children:(0,t.jsxs)("div",{className:"text-[10px] text-purple-300 bg-black/50 px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none select-none",children:[p.toFixed(1)," kg"]})})]}),v&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("group",{ref:L,children:(0,t.jsx)(h,{color:"#22c55e",label:"v"})}),(0,t.jsx)("group",{ref:_,children:(0,t.jsx)(h,{color:"#3b82f6",label:"mg"})}),(0,t.jsx)("group",{ref:U,children:(0,t.jsx)(h,{color:"#ef4444",label:"T"})}),(0,t.jsx)("group",{ref:T,children:(0,t.jsx)(h,{color:"#eab308",label:"F"})})]}),(0,t.jsx)(d,{kineticEnergy:E.ke,potentialEnergy:E.pe,totalEnergy:E.total,position:[.8*i,-(.6*i),0]})]})}function h({color:e,label:r}){return(0,t.jsxs)("group",{children:[(0,t.jsxs)("mesh",{position:[0,-1,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.06,.06,2,8]}),(0,t.jsx)("meshStandardMaterial",{color:e,emissive:e,emissiveIntensity:.4})]}),(0,t.jsxs)("mesh",{position:[0,0,0],children:[(0,t.jsx)("coneGeometry",{args:[.15,.4,8]}),(0,t.jsx)("meshStandardMaterial",{color:e,emissive:e,emissiveIntensity:.4})]}),(0,t.jsx)(a.Html,{position:[.3,-.5,0],center:!0,children:(0,t.jsx)("div",{className:"text-[9px] font-bold px-1 py-0.5 rounded pointer-events-none select-none",style:{color:e,backgroundColor:"rgba(0,0,0,0.6)"},children:r})})]})}function f({width:e,height:r}){let i={color:"#2a2a3e",metalness:.8,roughness:.25};return(0,t.jsxs)("group",{children:[(0,t.jsxs)("mesh",{position:[0,0,0],castShadow:!0,receiveShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[e,.5,.6000000000000001]}),(0,t.jsx)("meshStandardMaterial",{...i})]}),(0,t.jsxs)("mesh",{position:[0,.175,0],children:[(0,t.jsx)("boxGeometry",{args:[e,.08,.8]}),(0,t.jsx)("meshStandardMaterial",{...i})]}),(0,t.jsxs)("mesh",{position:[0,-.175,0],children:[(0,t.jsx)("boxGeometry",{args:[e,.08,.8]}),(0,t.jsx)("meshStandardMaterial",{...i})]}),(0,t.jsxs)("mesh",{position:[-e/2+.2,-r/2,0],castShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[.4,r,.4]}),(0,t.jsx)("meshStandardMaterial",{...i})]}),(0,t.jsxs)("mesh",{position:[e/2-.2,-r/2,0],castShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[.4,r,.4]}),(0,t.jsx)("meshStandardMaterial",{...i})]}),(0,t.jsxs)("mesh",{position:[0,-r,0],receiveShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[e,.3,.48]}),(0,t.jsx)("meshStandardMaterial",{...i})]}),(0,t.jsxs)("group",{position:[0,-.4,0],children:[(0,t.jsxs)("mesh",{position:[0,.1,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.4,.4,.2,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#333333",metalness:.85,roughness:.2})]}),(0,t.jsxs)("mesh",{children:[(0,t.jsx)("cylinderGeometry",{args:[.3,.3,.35,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#b8860b",metalness:.95,roughness:.15})]}),(0,t.jsxs)("mesh",{rotation:[Math.PI/2,0,0],children:[(0,t.jsx)("torusGeometry",{args:[.12,.04,8,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#888888",metalness:.9,roughness:.1})]}),(0,t.jsxs)("mesh",{position:[0,-.22,0],children:[(0,t.jsx)("sphereGeometry",{args:[.1,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#c0c0c0",metalness:.95,roughness:.05,emissive:"#c0c0c0",emissiveIntensity:.2})]}),[0,Math.PI/2,Math.PI,1.5*Math.PI].map((e,r)=>(0,t.jsxs)("mesh",{position:[.28*Math.cos(e),.1,.28*Math.sin(e)],children:[(0,t.jsx)("cylinderGeometry",{args:[.03,.03,.15,6]}),(0,t.jsx)("meshStandardMaterial",{color:"#555555",metalness:.9,roughness:.15})]},r))]}),[-1,1].map(i=>(0,t.jsxs)("mesh",{position:[i*(e/2-.2),-r-.15,0],receiveShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[.8,.15,.8]}),(0,t.jsx)("meshStandardMaterial",{color:"#1a1a2e",metalness:.7,roughness:.3})]},i))]})}function m({radius:e,maxAngle:i}){let n=(0,r.useMemo)(()=>{let r=[];for(let n=-i;n<=i;n+=5){let i=n*Math.PI/180,a=n%10==0,l=a?.85*e:.92*e;r.push((0,t.jsx)(s.Line,{points:[[Math.sin(i)*l,-Math.cos(i)*l,0],[Math.sin(i)*e,-Math.cos(i)*e,0]],color:a?"#4a4a6a":"#2a2a4a",lineWidth:a?2:1},n)),a&&0!==n&&r.push((0,t.jsx)(o.Text,{position:[Math.sin(i)*(e+.5),-Math.cos(i)*(e+.5),0],fontSize:.35,color:"#6a6a8a",anchorX:"center",anchorY:"middle",children:`${Math.abs(n)}\xb0`},`label-${n}`))}return r},[e,i]);return(0,t.jsxs)("group",{position:[0,0,0],children:[(0,t.jsx)(s.Line,{points:Array.from({length:64},(t,r)=>{let n=Math.PI/180*(r/63*i*2-i);return[Math.sin(n)*e,-Math.cos(n)*e,0]}),color:"#3a3a5a",lineWidth:1,dashed:!0,dashSize:.2,gapSize:.1}),n]})}e.i(81413);var p=e.i(48205),x=e.i(68647),g=e.i(82192),y=e.i(14228),v=e.i(4685);let b=[{label:"Earth",value:9.81,emoji:"🌍"},{label:"Moon",value:1.62,emoji:"🌙"},{label:"Mars",value:3.72,emoji:"🔴"},{label:"Jupiter",value:24.79,emoji:"🟠"},{label:"ISS",value:1e-4,emoji:"🛸"}];e.s(["default",0,function(){let e=(0,i.useRouter)(),[n,s]=(0,r.useState)(null),[a,o]=(0,r.useState)(!0),[l,c]=(0,r.useState)(!0),[d,h]=(0,r.useState)(1),[f,m]=(0,r.useState)(0),[S,w]=(0,r.useState)(0),[M,j]=(0,r.useState)(10),[E,A]=(0,r.useState)(9.81),[P,C]=(0,r.useState)(2),[z,L]=(0,r.useState)(.005),[_,U]=(0,r.useState)(45),[T,B]=(0,r.useState)(!0),[I,R]=(0,r.useState)(!0),[O,D]=(0,r.useState)(!0),[G,W]=(0,r.useState)(!0),N=(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)(x.ControlGroup,{title:"Physics Parameters",children:[(0,t.jsx)(x.ControlSlider,{label:"Length (L)",value:M,unit:"m",min:2,max:20,step:.5,color:"#a855f7",onChange:j,decimals:1}),(0,t.jsx)(x.ControlSlider,{label:"Mass (m)",value:P,unit:"kg",min:.5,max:15,step:.5,color:"#06d6a0",onChange:C,decimals:1}),(0,t.jsx)(x.ControlSlider,{label:"Initial Angle",value:_,unit:"°",min:5,max:170,step:1,color:"#3b82f6",onChange:U,decimals:0}),(0,t.jsx)(x.ControlSlider,{label:"Damping",value:z,unit:"",min:0,max:.1,step:.001,color:"#f59e0b",onChange:L,decimals:3}),(0,t.jsxs)("div",{className:"mt-2 space-y-2",children:[(0,t.jsxs)("div",{className:"flex justify-between text-sm",children:[(0,t.jsx)("span",{className:"text-gray-700",children:"Gravity (g)"}),(0,t.jsxs)("span",{className:"font-mono text-pink-600",children:[E.toFixed(2)," m/s²"]})]}),(0,t.jsx)("input",{type:"range",min:"0",max:"26",step:"0.01",value:E,onChange:e=>A(parseFloat(e.target.value)),className:"w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer touch-none",style:{accentColor:"#ec4899"}}),(0,t.jsx)("div",{className:"flex flex-wrap gap-1.5 mt-1",children:b.map(e=>(0,t.jsxs)("button",{onClick:()=>A(e.value),className:`px-2 py-1 text-xs rounded-md border transition-all ${.05>Math.abs(E-e.value)?"bg-pink-600/30 border-pink-500 text-pink-700":"bg-gray-200/50 border-gray-300 text-gray-600 hover:border-gray-400"}`,children:[e.emoji," ",e.label]},e.label))})]})]}),(0,t.jsx)(x.ControlGroup,{title:"Display Options",children:[{label:"Motion Trail",checked:T,onChange:B},{label:"Force Vectors",checked:I,onChange:R},{label:"Angle Arc",checked:O,onChange:D},{label:"Protractor",checked:G,onChange:W}].map(e=>(0,t.jsxs)("label",{className:"flex items-center justify-between text-sm text-gray-700 cursor-pointer py-2 px-3 bg-gray-100/50 rounded-lg border border-gray-300/50",children:[(0,t.jsx)("span",{children:e.label}),(0,t.jsx)("input",{type:"checkbox",checked:e.checked,onChange:t=>e.onChange(t.target.checked),className:"w-4 h-4 rounded accent-purple-500"})]},e.label))}),(0,t.jsx)("button",{onClick:()=>e.push("/experiments/pendulum/details"),className:"w-full py-2.5 bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-700 font-medium text-sm rounded-lg transition-all border border-purple-300/50 flex items-center justify-center gap-2",children:"📖 View Experiment Details"})]}),k=n?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(x.DataGrid,{data:{period:{value:n.period,unit:"s",color:"#a855f7",decimals:3},measured:{value:n.periodMeasured||n.period,unit:"s",color:"#c084fc",decimals:3},angle:{value:n.angleDeg,unit:"°",color:"#06d6a0",decimals:1},angVel:{value:n.angularVelocity,unit:"rad/s",color:"#f59e0b"},vel:{value:n.tangentialVelocity,unit:"m/s",color:"#22c55e"},osc:{value:n.oscillations,unit:"",color:"#818cf8",decimals:0}},columns:2}),(0,t.jsx)("div",{className:"mt-3 pt-3 border-t border-gray-700",children:(0,t.jsx)(x.EnergyBar,{kinetic:n.kineticEnergy,potential:n.potentialEnergy,total:n.totalEnergy,maxEnergy:1.3*n.totalEnergy||1})})]}):(0,t.jsx)("div",{className:"text-center text-gray-500 text-sm py-8",children:"Waiting for simulation data..."});return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(p.ExperimentContainer,{title:"Simple Pendulum",description:"Explore oscillatory motion, energy conservation, and gravitational effects",cameraPosition:[30,20,30],backgroundColor:"#050510",controls:null,dataPanel:null,children:(0,t.jsx)(u,{onDataChange:s,length:M,gravity:E,mass:P,damping:z,initialAngle:_*Math.PI/180,showTrail:T,showVectors:I,showAngleArc:O,showProtractor:G,isPlaying:l,simulationSpeed:d,resetTrigger:f})}),(0,t.jsx)(y.SimulationController,{isPlaying:l,onPlayPause:()=>c(e=>!e),onReset:()=>{m(e=>e+1),c(!0),h(1),w(0)},speed:d,onSpeedChange:h,timeElapsed:S}),(0,t.jsx)(g.FloatingControlPanel,{title:"⚙️ Pendulum Parameters",initialPosition:{x:20,y:80},children:N}),(0,t.jsx)(v.DataPanel,{isVisible:a,onToggle:()=>o(!a),children:k})]})}],67581)}]);
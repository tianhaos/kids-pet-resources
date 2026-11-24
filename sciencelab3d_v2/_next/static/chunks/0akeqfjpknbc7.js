(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,r;var i=e.i(31067),n=e.i(71645),s=e.i(90072),o=e.i(48546),a=s,l=s;let c=new l.Box3,d=new l.Vector3;class u extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,r=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),r.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let r=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(r,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(r,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let r;e instanceof Float32Array?r=e:Array.isArray(e)&&(r=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(r,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(i,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(i,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),c.setFromBufferAttribute(t),this.boundingBox.union(c))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let r=this.boundingSphere.center;this.boundingBox.getCenter(r);let i=0;for(let n=0,s=e.count;n<s;n++)d.fromBufferAttribute(e,n),i=Math.max(i,r.distanceToSquared(d)),d.fromBufferAttribute(t,n),i=Math.max(i,r.distanceToSquared(d));this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var h=s,p=e.i(8560),m=e.i(31497);class f extends h.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:h.UniformsUtils.clone(h.UniformsUtils.merge([p.UniformsLib.common,p.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new h.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let x=m.version>=125?"uv1":"uv2",y=new a.Vector4,v=new a.Vector3,g=new a.Vector3,b=new a.Vector4,w=new a.Vector4,j=new a.Vector4,M=new a.Vector3,S=new a.Matrix4,P=new a.Line3,A=new a.Vector3,C=new a.Box3,E=new a.Sphere,N=new a.Vector4;function L(e,t,i){return N.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),N.multiplyScalar(1/N.w),N.x=r/i.width,N.y=r/i.height,N.applyMatrix4(e.projectionMatrixInverse),N.multiplyScalar(1/N.w),Math.abs(Math.max(N.x,N.y))}class T extends a.Mesh{constructor(e=new u,t=new f({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,r=e.attributes.instanceEnd,i=new Float32Array(2*t.count);for(let e=0,n=0,s=t.count;e<s;e++,n+=2)v.fromBufferAttribute(t,e),g.fromBufferAttribute(r,e),i[n]=0===n?0:i[n-1],i[n+1]=i[n]+v.distanceTo(g);let n=new a.InstancedInterleavedBuffer(i,2,1);return e.setAttribute("instanceDistanceStart",new a.InterleavedBufferAttribute(n,1,0)),e.setAttribute("instanceDistanceEnd",new a.InterleavedBufferAttribute(n,1,1)),this}raycast(e,i){let n,s,o=this.material.worldUnits,l=e.camera;null!==l||o||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let d=this.matrixWorld,u=this.geometry,h=this.material;if(r=h.linewidth+c,null===u.boundingSphere&&u.computeBoundingSphere(),E.copy(u.boundingSphere).applyMatrix4(d),o)n=.5*r;else{let e=Math.max(l.near,E.distanceToPoint(t.origin));n=L(l,e,h.resolution)}if(E.radius+=n,!1!==t.intersectsSphere(E)){if(null===u.boundingBox&&u.computeBoundingBox(),C.copy(u.boundingBox).applyMatrix4(d),o)s=.5*r;else{let e=Math.max(l.near,C.distanceToPoint(t.origin));s=L(l,e,h.resolution)}C.expandByScalar(s),!1!==t.intersectsBox(C)&&(o?function(e,i){let n=e.matrixWorld,s=e.geometry,o=s.attributes.instanceStart,l=s.attributes.instanceEnd,c=Math.min(s.instanceCount,o.count);for(let s=0;s<c;s++){P.start.fromBufferAttribute(o,s),P.end.fromBufferAttribute(l,s),P.applyMatrix4(n);let c=new a.Vector3,d=new a.Vector3;t.distanceSqToSegment(P.start,P.end,d,c),d.distanceTo(c)<.5*r&&i.push({point:d,pointOnLine:c,distance:t.origin.distanceTo(d),object:e,face:null,faceIndex:s,uv:null,[x]:null})}}(this,i):function(e,i,n){let s=i.projectionMatrix,o=e.material.resolution,l=e.matrixWorld,c=e.geometry,d=c.attributes.instanceStart,u=c.attributes.instanceEnd,h=Math.min(c.instanceCount,d.count),p=-i.near;t.at(1,j),j.w=1,j.applyMatrix4(i.matrixWorldInverse),j.applyMatrix4(s),j.multiplyScalar(1/j.w),j.x*=o.x/2,j.y*=o.y/2,j.z=0,M.copy(j),S.multiplyMatrices(i.matrixWorldInverse,l);for(let i=0;i<h;i++){if(b.fromBufferAttribute(d,i),w.fromBufferAttribute(u,i),b.w=1,w.w=1,b.applyMatrix4(S),w.applyMatrix4(S),b.z>p&&w.z>p)continue;if(b.z>p){let e=b.z-w.z,t=(b.z-p)/e;b.lerp(w,t)}else if(w.z>p){let e=w.z-b.z,t=(w.z-p)/e;w.lerp(b,t)}b.applyMatrix4(s),w.applyMatrix4(s),b.multiplyScalar(1/b.w),w.multiplyScalar(1/w.w),b.x*=o.x/2,b.y*=o.y/2,w.x*=o.x/2,w.y*=o.y/2,P.start.copy(b),P.start.z=0,P.end.copy(w),P.end.z=0;let c=P.closestPointToPointParameter(M,!0);P.at(c,A);let h=a.MathUtils.lerp(b.z,w.z,c),m=h>=-1&&h<=1,f=M.distanceTo(A)<.5*r;if(m&&f){P.start.fromBufferAttribute(d,i),P.end.fromBufferAttribute(u,i),P.start.applyMatrix4(l),P.end.applyMatrix4(l);let r=new a.Vector3,s=new a.Vector3;t.distanceSqToSegment(P.start,P.end,s,r),n.push({point:s,pointOnLine:r,distance:t.origin.distanceTo(s),object:e,face:null,faceIndex:i,uv:null,[x]:null})}}}(this,l,i))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(y),this.material.uniforms.resolution.value.set(y.z,y.w))}}class _ extends u{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,r=new Float32Array(2*t);for(let i=0;i<t;i+=3)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5];return super.setPositions(r),this}setColors(e,t=3){let r=e.length-t,i=new Float32Array(2*r);if(3===t)for(let n=0;n<r;n+=t)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];else for(let n=0;n<r;n+=t)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5],i[2*n+6]=e[n+6],i[2*n+7]=e[n+7];return super.setColors(i,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class I extends T{constructor(e=new _,t=new f({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let z=n.forwardRef(function({points:e,color:t=0xffffff,vertexColors:r,linewidth:a,lineWidth:l,segments:c,dashed:d,...h},p){var m,x;let y=(0,o.useThree)(e=>e.size),v=n.useMemo(()=>c?new T:new I,[c]),[g]=n.useState(()=>new f),b=(null==r||null==(m=r[0])?void 0:m.length)===4?4:3,w=n.useMemo(()=>{let i=c?new u:new _,n=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Vector3||e instanceof s.Vector4?[e.x,e.y,e.z]:e instanceof s.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(i.setPositions(n.flat()),r){t=0xffffff;let e=r.map(e=>e instanceof s.Color?e.toArray():e);i.setColors(e.flat(),b)}return i},[e,c,r,b]);return n.useLayoutEffect(()=>{v.computeLineDistances()},[e,v]),n.useLayoutEffect(()=>{d?g.defines.USE_DASH="":delete g.defines.USE_DASH,g.needsUpdate=!0},[d,g]),n.useEffect(()=>()=>{w.dispose(),g.dispose()},[w]),n.createElement("primitive",(0,i.default)({object:v,ref:p},h),n.createElement("primitive",{object:w,attach:"geometry"}),n.createElement("primitive",(0,i.default)({object:g,attach:"material",color:t,vertexColors:!!r,resolution:[y.width,y.height],linewidth:null!=(x=null!=a?a:l)?x:1,dashed:d,transparent:4===b},h)))});e.s(["Line",0,z],43216)},60099,e=>{"use strict";let t,r;var i=e.i(31067),n=e.i(71645),s=e.i(88014),o=e.i(90072),a=e.i(48546),l=e.i(94800);let c=new o.Vector3,d=new o.Vector3,u=new o.Vector3,h=new o.Vector2;function p(e,t,r){let i=c.setFromMatrixPosition(e.matrixWorld);i.project(t);let n=r.width/2,s=r.height/2;return[i.x*n+n,-(i.y*s)+s]}let m=e=>1e-10>Math.abs(e)?0:e;function f(e,t,r=""){let i="matrix3d(";for(let r=0;16!==r;r++)i+=m(t[r]*e.elements[r])+(15!==r?",":")");return r+i}let x=(t=[1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1],e=>f(e,t)),y=(r=e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1],(e,t)=>f(e,r(t),"translate(-50%,-50%)")),v=n.forwardRef(({children:e,eps:t=.001,style:r,className:f,prepend:v,center:g,fullscreen:b,portal:w,distanceFactor:j,sprite:M=!1,transform:S=!1,occlude:P,onOcclude:A,castShadow:C,receiveShadow:E,material:N,geometry:L,zIndexRange:T=[0x1000037,0],calculatePosition:_=p,as:I="div",wrapperClass:z,pointerEvents:U="auto",...F},D)=>{let{gl:O,camera:R,scene:V,size:G,raycaster:H,events:B,viewport:W}=(0,a.useThree)(),[$]=n.useState(()=>document.createElement(I)),k=n.useRef(null),K=n.useRef(null),q=n.useRef(0),Z=n.useRef([0,0]),J=n.useRef(null),X=n.useRef(null),Q=(null==w?void 0:w.current)||B.connected||O.domElement.parentNode,Y=n.useRef(null),ee=n.useRef(!1),et=n.useMemo(()=>{var e;return P&&"blending"!==P||Array.isArray(P)&&P.length&&(e=P[0])&&"object"==typeof e&&"current"in e},[P]);n.useLayoutEffect(()=>{let e=O.domElement;P&&"blending"===P?(e.style.zIndex=`${Math.floor(T[0]/2)}`,e.style.position="absolute",e.style.pointerEvents="none"):(e.style.zIndex=null,e.style.position=null,e.style.pointerEvents=null)},[P]),n.useLayoutEffect(()=>{if(K.current){let e=k.current=s.createRoot($);if(V.updateMatrixWorld(),S)$.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";else{let e=_(K.current,R,G);$.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${e[0]}px,${e[1]}px,0);transform-origin:0 0;`}return Q&&(v?Q.prepend($):Q.appendChild($)),()=>{Q&&Q.removeChild($),e.unmount()}}},[Q,S]),n.useLayoutEffect(()=>{z&&($.className=z)},[z]);let er=n.useMemo(()=>S?{position:"absolute",top:0,left:0,width:G.width,height:G.height,transformStyle:"preserve-3d",pointerEvents:"none"}:{position:"absolute",transform:g?"translate3d(-50%,-50%,0)":"none",...b&&{top:-G.height/2,left:-G.width/2,width:G.width,height:G.height},...r},[r,g,b,G,S]),ei=n.useMemo(()=>({position:"absolute",pointerEvents:U}),[U]);n.useLayoutEffect(()=>{var t,i;ee.current=!1,S?null==(t=k.current)||t.render(n.createElement("div",{ref:J,style:er},n.createElement("div",{ref:X,style:ei},n.createElement("div",{ref:D,className:f,style:r,children:e})))):null==(i=k.current)||i.render(n.createElement("div",{ref:D,style:er,className:f,children:e}))});let en=n.useRef(!0);(0,l.useFrame)(e=>{if(K.current){R.updateMatrixWorld(),K.current.updateWorldMatrix(!0,!1);let e=S?Z.current:_(K.current,R,G);if(S||Math.abs(q.current-R.zoom)>t||Math.abs(Z.current[0]-e[0])>t||Math.abs(Z.current[1]-e[1])>t){var r;let t,i,n,s,a=(r=K.current,t=c.setFromMatrixPosition(r.matrixWorld),i=d.setFromMatrixPosition(R.matrixWorld),n=t.sub(i),s=R.getWorldDirection(u),n.angleTo(s)>Math.PI/2),l=!1;et&&(Array.isArray(P)?l=P.map(e=>e.current):"blending"!==P&&(l=[V]));let p=en.current;l?en.current=function(e,t,r,i){let n=c.setFromMatrixPosition(e.matrixWorld),s=n.clone();s.project(t),h.set(s.x,s.y),r.setFromCamera(h,t);let o=r.intersectObjects(i,!0);if(o.length){let e=o[0].distance;return n.distanceTo(r.ray.origin)<e}return!0}(K.current,R,H,l)&&!a:en.current=!a,p!==en.current&&(A?A(!en.current):$.style.display=en.current?"block":"none");let f=Math.floor(T[0]/2),v=P?et?[T[0],f]:[f-1,0]:T;if($.style.zIndex=`${function(e,t,r){if(t instanceof o.PerspectiveCamera||t instanceof o.OrthographicCamera){let i=c.setFromMatrixPosition(e.matrixWorld),n=d.setFromMatrixPosition(t.matrixWorld),s=i.distanceTo(n),o=(r[1]-r[0])/(t.far-t.near),a=r[1]-o*t.far;return Math.round(o*s+a)}}(K.current,R,v)}`,S){let[e,t]=[G.width/2,G.height/2],r=R.projectionMatrix.elements[5]*t,{isOrthographicCamera:i,top:n,left:s,bottom:o,right:a}=R,l=x(R.matrixWorldInverse),c=i?`scale(${r})translate(${m(-(a+s)/2)}px,${m((n+o)/2)}px)`:`translateZ(${r}px)`,d=K.current.matrixWorld;M&&((d=R.matrixWorldInverse.clone().transpose().copyPosition(d).scale(K.current.scale)).elements[3]=d.elements[7]=d.elements[11]=0,d.elements[15]=1),$.style.width=G.width+"px",$.style.height=G.height+"px",$.style.perspective=i?"":`${r}px`,J.current&&X.current&&(J.current.style.transform=`${c}${l}translate(${e}px,${t}px)`,X.current.style.transform=y(d,1/((j||10)/400)))}else{let t=void 0===j?1:function(e,t){if(t instanceof o.OrthographicCamera)return t.zoom;if(!(t instanceof o.PerspectiveCamera))return 1;{let r=c.setFromMatrixPosition(e.matrixWorld),i=d.setFromMatrixPosition(t.matrixWorld);return 1/(2*Math.tan(t.fov*Math.PI/180/2)*r.distanceTo(i))}}(K.current,R)*j;$.style.transform=`translate3d(${e[0]}px,${e[1]}px,0) scale(${t})`}Z.current=e,q.current=R.zoom}}if(!et&&Y.current&&!ee.current)if(S){if(J.current){let e=J.current.children[0];if(null!=e&&e.clientWidth&&null!=e&&e.clientHeight){let{isOrthographicCamera:t}=R;if(t||L)F.scale&&(Array.isArray(F.scale)?F.scale instanceof o.Vector3?Y.current.scale.copy(F.scale.clone().divideScalar(1)):Y.current.scale.set(1/F.scale[0],1/F.scale[1],1/F.scale[2]):Y.current.scale.setScalar(1/F.scale));else{let t=(j||10)/400,r=e.clientWidth*t,i=e.clientHeight*t;Y.current.scale.set(r,i,1)}ee.current=!0}}}else{let t=$.children[0];if(null!=t&&t.clientWidth&&null!=t&&t.clientHeight){let e=1/W.factor,r=t.clientWidth*e,i=t.clientHeight*e;Y.current.scale.set(r,i,1),ee.current=!0}Y.current.lookAt(e.camera.position)}});let es=n.useMemo(()=>({vertexShader:S?void 0:`
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
      `}),[S]);return n.createElement("group",(0,i.default)({},F,{ref:K}),P&&!et&&n.createElement("mesh",{castShadow:C,receiveShadow:E,ref:Y},L||n.createElement("planeGeometry",null),N||n.createElement("shaderMaterial",{side:o.DoubleSide,vertexShader:es.vertexShader,fragmentShader:es.fragmentShader})))});e.s(["Html",0,v])},56420,e=>{"use strict";var t=e.i(71645);let r=(...e)=>e.filter((e,t,r)=>!!e&&""!==e.trim()&&r.indexOf(e)===t).join(" ").trim(),i=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,r)=>r?r.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var n={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,t.createContext)({}),o=(0,t.forwardRef)(({color:e,size:i,strokeWidth:o,absoluteStrokeWidth:a,className:l="",children:c,iconNode:d,...u},h)=>{let{size:p=24,strokeWidth:m=2,absoluteStrokeWidth:f=!1,color:x="currentColor",className:y=""}=(0,t.useContext)(s)??{},v=a??f?24*Number(o??m)/Number(i??p):o??m;return(0,t.createElement)("svg",{ref:h,...n,width:i??p??n.width,height:i??p??n.height,stroke:e??x,strokeWidth:v,className:r("lucide",y,l),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,r])=>(0,t.createElement)(e,r)),...Array.isArray(c)?c:[c]])});e.s(["default",0,(e,n)=>{let s=(0,t.forwardRef)(({className:s,...a},l)=>(0,t.createElement)(o,{ref:l,iconNode:n,className:r(`lucide-${i(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...a}));return s.displayName=i(e),s}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,r)=>{t.exports=e.r(76562)},11601,e=>{"use strict";var t=e.i(43476),r=e.i(71645);e.i(81413);var i=e.i(48205),n=e.i(14228),s=e.i(82192),o=e.i(4685),a=e.i(68647),l=e.i(94800),c=e.i(43216),d=e.i(60099),u=e.i(90072);function h({onDataChange:e,isPlaying:i=!0,simulationSpeed:n=1,resetTrigger:s=0,stage:o=0,showLabels:a=!0}){let p=(0,r.useRef)(null),m=(0,r.useRef)(null),f=(0,r.useRef)(null),x=(0,r.useRef)([]),y=(0,r.useRef)(0),v=(0,r.useRef)(0),g=(0,r.useRef)(0),b=(0,r.useRef)(0),w=(0,r.useRef)(0),j=(0,r.useRef)(0),M=(0,r.useRef)(0),S=(0,r.useRef)(0),P=(0,r.useRef)(0),A=(0,r.useRef)(0),[C,E]=(0,r.useState)({stage:"Glycolysis",atpProduced:0,glucoseRemaining:100,co2Produced:0,nadhCount:0,fadh2Count:0,description:"Glucose (6C) splits into 2 pyruvate (3C) in cytoplasm. Net: 2 ATP + 2 NADH.",atpFromGlycolysis:0,atpFromPyruvate:0,atpFromKrebs:0,atpFromETC:0}),N=["Glycolysis","Pyruvate Oxidation","Krebs Cycle","Electron Transport Chain"],L=["Glucose (6C) splits into 2 pyruvate (3C) in cytoplasm. Net: 2 ATP + 2 NADH produced.","Each pyruvate (3C) → Acetyl-CoA (2C) + CO₂. 2 NADH produced for entire glucose.","Acetyl-CoA enters Krebs Cycle. Produces 2 ATP, 6 NADH, 2 FADH₂, and 4 CO₂ per glucose.","Electrons flow through protein complexes. ATP synthase produces ~32-34 ATP. O₂ → H₂O."],T=(0,r.useMemo)(()=>{let e=[];for(let t=0;t<=6;t++){let r=t/6*Math.PI*2;e.push([.2*Math.cos(r),.2*Math.sin(r),0])}return e},[]);(0,r.useMemo)(()=>{let e=new u.Shape;return e.moveTo(0,3.2),e.bezierCurveTo(1.8,3.2,2.6,2.2,2.6,0),e.bezierCurveTo(2.6,-2.2,1.8,-3.2,0,-3.2),e.bezierCurveTo(-1.8,-3.2,-2.6,-2.2,-2.6,0),e.bezierCurveTo(-2.6,2.2,-1.8,3.2,0,3.2),e},[]);let _=(0,r.useMemo)(()=>[{id:"I",pos:new u.Vector3(1.6,2,0),color:"#f59e0b",label:"I",isATPSynthase:!1},{id:"II",pos:new u.Vector3(-1.8,1.2,0),color:"#8b5cf6",label:"II",isATPSynthase:!1},{id:"III",pos:new u.Vector3(1.8,-.4,0),color:"#ef4444",label:"III",isATPSynthase:!1},{id:"IV",pos:new u.Vector3(-1.6,-1.6,0),color:"#06b6d4",label:"IV",isATPSynthase:!1},{id:"ATP",pos:new u.Vector3(0,0,0),color:"#22c55e",label:"ATP Synthase",isATPSynthase:!0}],[]),I=(0,r.useMemo)(()=>{let e=[];for(let t=0;t<=40;t++){let r=t/40*Math.PI*2,i=2.1+.15*Math.sin(.5*t);e.push([Math.cos(r)*i,Math.sin(r)*i*.7,(t%3-1)*.3])}return e},[]);return(0,r.useEffect)(()=>{x.current=[],y.current=0,v.current=0,g.current=0,b.current=0,w.current=0,j.current=0,M.current=0,S.current=0,P.current=0,A.current=0;for(let e=0;e<6;e++)x.current.push({id:`glucose-${e}`,type:"glucose",position:new u.Vector3(-5+2*Math.random(),(Math.random()-.5)*3,(Math.random()-.5)*1.5),velocity:new u.Vector3(.015+.01*Math.random(),(Math.random()-.5)*.008,(Math.random()-.5)*.008),active:!0,animProgress:0});for(let e=0;e<30;e++){let t=Math.random()*Math.PI*2;x.current.push({id:`proton-${e}`,type:"proton",position:new u.Vector3(2.3*Math.cos(t),(Math.random()-.5)*4,(Math.random()-.5)*1),velocity:new u.Vector3(0,0,0),active:!1,animProgress:0})}for(let e=0;e<8;e++)x.current.push({id:`o2-${e}`,type:"o2",position:new u.Vector3(-1.5+3*Math.random(),-2.5+(Math.random()-.5)*1,(Math.random()-.5)*1.5),velocity:new u.Vector3(0,.008,0),active:!1,animProgress:0})},[s]),(0,l.useFrame)((t,r)=>{if(!i)return;P.current+=r*n,A.current++;let s=x.current;if(s.forEach(e=>{if(!e.active){3===o&&"proton"===e.type&&(e.active=!0),3===o&&"o2"===e.type&&(e.active=!0);return}if(e.position.add(e.velocity.clone().multiplyScalar(n)),0===o){if("glucose"===e.type&&(e.animProgress+=.35*r*n,e.animProgress>=1&&.03>Math.random())){if(v.current>=2){e.animProgress=0;return}e.type="pyruvate",e.animProgress=0,v.current=Math.min(2,v.current+.5),y.current=Math.min(38,y.current+.5);let t={id:`atp-${Date.now()}-${Math.random()}`,type:"atp",position:e.position.clone().add(new u.Vector3(0,.5,0)),velocity:new u.Vector3((Math.random()-.5)*.015,.02,(Math.random()-.5)*.01),active:!0,animProgress:0};s.push(t);let r={id:`pyruvate-${Date.now()}-${Math.random()}`,type:"pyruvate",position:e.position.clone().add(new u.Vector3(.4,.2,0)),velocity:e.velocity.clone(),active:!0,animProgress:0};s.push(r)}if("pyruvate"===e.type){let t=new u.Vector3(-1,0,0).sub(e.position).normalize().multiplyScalar(.008);e.velocity.add(t.multiplyScalar(.15))}"atp"===e.type&&e.position.length()>6&&(e.active=!1)}else if(1===o){if("pyruvate"===e.type&&(e.animProgress+=.3*r*n,e.animProgress>.6&&.02>Math.random())){let t={id:`co2-${Date.now()}-${Math.random()}`,type:"co2",position:e.position.clone(),velocity:new u.Vector3((Math.random()-.5)*.03,.025,(Math.random()-.5)*.03),active:!0,animProgress:0};s.push(t),j.current+=1,M.current+=.5,g.current=Math.min(2,g.current+.5);let r={id:`nadh-${Date.now()}-${Math.random()}`,type:"nadh",position:e.position.clone().add(new u.Vector3(.3,.2,0)),velocity:new u.Vector3(.01,.01,0),active:!0,animProgress:0};s.push(r),e.type="acetylCoA"}if("acetylCoA"===e.type){let t=new u.Vector3(0,0,0).sub(e.position).normalize().multiplyScalar(.012);e.velocity.add(t)}"co2"===e.type&&(e.velocity.y=.02,e.position.y>5&&(e.active=!1)),"nadh"===e.type&&e.position.length()>5&&(e.active=!1)}else if(2===o){if("acetylCoA"===e.type&&(e.animProgress+=.25*r*n,e.animProgress>.5&&.015>Math.random())){let t={id:`co2-${Date.now()}-${Math.random()}`,type:"co2",position:e.position.clone(),velocity:new u.Vector3((Math.random()-.5)*.035,.022,(Math.random()-.5)*.035),active:!0,animProgress:0};if(s.push(t),j.current+=1,M.current+=.15,.33>Math.random()){S.current+=.1;let t={id:`fadh2-${Date.now()}-${Math.random()}`,type:"fadh2",position:e.position.clone().add(new u.Vector3(-.2,.2,0)),velocity:new u.Vector3(-.008,.008,0),active:!0,animProgress:0};s.push(t)}b.current<2&&(b.current=Math.min(2,b.current+.25),y.current=Math.min(38,y.current+.25));let r={id:`atp-${Date.now()}-${Math.random()}`,type:"atp",position:e.position.clone().add(new u.Vector3(0,.3,0)),velocity:new u.Vector3((Math.random()-.5)*.012,.015,(Math.random()-.5)*.008),active:!0,animProgress:0};s.push(r),e.animProgress=0}"co2"===e.type&&(e.velocity.y=.018,e.position.y>5&&(e.active=!1)),("nadh"===e.type||"fadh2"===e.type)&&e.position.length()>4.5&&(e.active=!1)}else if(3===o){if("proton"===e.type)if(Math.sqrt(e.position.x**2+(e.position.z/.7)**2)>1.6)e.velocity.y+=(Math.random()-.5)*.003;else{let t=new u.Vector3(0,.95*e.position.y,0).sub(e.position).normalize().multiplyScalar(.015);if(e.velocity.add(t),.3>Math.abs(e.position.x)&&.08>Math.random()){if(y.current>=38||w.current>=34){e.active=!1;return}w.current=Math.min(34,w.current+1.1),y.current=Math.min(38,y.current+1.1);let t={id:`atp-${Date.now()}-${Math.random()}`,type:"atp",position:new u.Vector3(0,e.position.y,.5),velocity:new u.Vector3(.008,.008,.012),active:!0,animProgress:0};s.push(t)}}if(("nadh"===e.type||"fadh2"===e.type)&&.02>Math.random()){let t={id:`electron-${Date.now()}-${Math.random()}`,type:"electron",position:e.position.clone(),velocity:new u.Vector3(-.035-.02*Math.random(),(Math.random()-.5)*.015,0),active:!0,animProgress:0};s.push(t),e.active=!1}"electron"===e.type&&(e.animProgress+=.6*r*n,e.animProgress>=1&&(e.active=!1)),"o2"===e.type&&.015>Math.random()&&(e.type="h2o",e.velocity=new u.Vector3((Math.random()-.5)*.012,.01,(Math.random()-.5)*.012)),("atp"===e.type||"h2o"===e.type)&&e.position.length()>6&&(e.active=!1)}e.position.length()>7&&(e.velocity.multiplyScalar(-.4),e.position.normalize().multiplyScalar(7))}),y.current=Math.min(38,y.current),A.current%8==0){let t={stage:N[o],atpProduced:Math.round(y.current),glucoseRemaining:Math.max(0,100-Math.round(y.current/38*100)),co2Produced:j.current,nadhCount:Math.round(M.current),fadh2Count:Math.round(S.current),description:L[o],atpFromGlycolysis:Math.round(v.current),atpFromPyruvate:Math.round(g.current),atpFromKrebs:Math.round(b.current),atpFromETC:Math.round(w.current)};E(t),e?.(t)}m.current&&2===o&&(m.current.rotation.z+=r*n*.8),f.current&&3===o&&(f.current.rotation.z+=r*n*8)}),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("ambientLight",{intensity:.35}),(0,t.jsx)("directionalLight",{position:[8,10,5],intensity:1.2,castShadow:!0}),(0,t.jsx)("pointLight",{position:[0,0,0],intensity:.4,color:"#ef4444"}),(0,t.jsx)("pointLight",{position:[-4,2,3],intensity:.3,color:"#f59e0b"}),(0,t.jsxs)("group",{ref:p,children:[(0,t.jsx)("gridHelper",{args:[16,32,"#1a1a3e","#1a1a3e"],position:[0,-5.5,0]}),0===o&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("mesh",{position:[-4,0,-.5],children:[(0,t.jsx)("sphereGeometry",{args:[3.5,32,32]}),(0,t.jsx)("meshStandardMaterial",{color:"#1e3a5f",transparent:!0,opacity:.08})]}),a&&(0,t.jsx)(d.Html,{position:[-5.5,3.5,0],distanceFactor:12,children:(0,t.jsx)("div",{className:"bg-blue-600/95 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg border-2 border-blue-400",children:"🫧 Cytoplasm - Glycolysis"})}),Array.from({length:4}).map((e,r)=>(0,t.jsx)("group",{position:[-5+1.5*r,-2,.5],children:(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.15,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#60a5fa",emissive:"#3b82f6",emissiveIntensity:.5+.3*Math.sin(4*P.current+r)})]})},r))]}),o>=1&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("mesh",{position:[0,0,0],rotation:[0,0,Math.PI/6],children:[(0,t.jsx)("capsuleGeometry",{args:[2.4,4.8,16,32]}),(0,t.jsx)("meshPhysicalMaterial",{color:"#b91c1c",transparent:!0,opacity:.15,roughness:.3,metalness:.1,side:u.DoubleSide})]}),(0,t.jsxs)("mesh",{position:[0,0,0],rotation:[0,0,Math.PI/6],children:[(0,t.jsx)("capsuleGeometry",{args:[1.7,3.8,16,32]}),(0,t.jsx)("meshPhysicalMaterial",{color:"#991b1b",transparent:!0,opacity:.2,roughness:.4,metalness:.15,side:u.DoubleSide})]}),Array.from({length:12}).map((e,r)=>{let i=r/12*Math.PI*2+Math.PI/6,n=1.5+.25*Math.sin(.6*r);return(0,t.jsx)("group",{position:[Math.cos(i)*n,(r-6)*.55,Math.sin(i)*n*.6],children:(0,t.jsxs)("mesh",{rotation:[0,0,Math.PI/2],children:[(0,t.jsx)("cylinderGeometry",{args:[.08,.08,.7,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#f87171",transparent:!0,opacity:.6})]})},r)}),a&&(0,t.jsx)(d.Html,{position:[0,0,0],distanceFactor:10,children:(0,t.jsx)("div",{className:"bg-amber-600/90 text-white px-2 py-1 rounded text-xs font-medium",children:"Mitochondrial Matrix"})})]}),1===o&&(0,t.jsxs)(t.Fragment,{children:[a&&(0,t.jsx)(d.Html,{position:[0,4,0],distanceFactor:12,children:(0,t.jsx)("div",{className:"bg-orange-500/95 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg border-2 border-orange-400",children:"Pyruvate Oxidation"})}),(0,t.jsx)(c.Line,{points:[[-2,1.5,0],[-.5,0,0],[0,-.5,0]],color:"#f59e0b",lineWidth:3,opacity:.6,transparent:!0,dashed:!0}),Array.from({length:3}).map((e,r)=>(0,t.jsx)("group",{position:[-1+.5*r,2.5+.3*r,0],children:(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.08,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#9ca3af",transparent:!0,opacity:.5-.12*r,emissive:"#9ca3af",emissiveIntensity:.3})]})},r))]}),2===o&&(0,t.jsxs)(t.Fragment,{children:[a&&(0,t.jsx)(d.Html,{position:[0,4,0],distanceFactor:12,children:(0,t.jsx)("div",{className:"bg-green-600/95 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg border-2 border-green-400",children:"🔄 Krebs Cycle (Citric Acid Cycle)"})}),(0,t.jsxs)("group",{ref:m,position:[0,0,0],children:[(0,t.jsx)(c.Line,{points:Array.from({length:48},(e,t)=>{let r=t/48*Math.PI*2;return[1.1*Math.cos(r),1.1*Math.sin(r),0]}),color:"#22c55e",lineWidth:3,opacity:.7}),Array.from({length:8}).map((e,r)=>{let i=r/8*Math.PI*2;return(0,t.jsx)("group",{position:[1.1*Math.cos(i),1.1*Math.sin(i),0],children:(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.12,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#22c55e",emissive:"#22c55e",emissiveIntensity:.6+.3*Math.sin(5*P.current+r)})]})},r)}),(0,t.jsxs)("mesh",{position:[0,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[.3,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#22c55e",emissive:"#22c55e",emissiveIntensity:.5+.25*Math.sin(3*P.current)})]})]}),a&&(0,t.jsx)(t.Fragment,{children:(0,t.jsx)(d.Html,{position:[2,2,0],distanceFactor:12,children:(0,t.jsxs)("div",{className:"bg-gray-900/90 px-3 py-2 rounded text-xs border border-gray-700",children:[(0,t.jsx)("div",{className:"text-gray-400",children:"Outputs per glucose:"}),(0,t.jsx)("div",{className:"text-green-400",children:"• 2 ATP"}),(0,t.jsx)("div",{className:"text-blue-400",children:"• 6 NADH"}),(0,t.jsx)("div",{className:"text-purple-400",children:"• 2 FADH₂"}),(0,t.jsx)("div",{className:"text-gray-400",children:"• 4 CO₂"})]})})})]}),3===o&&(0,t.jsxs)(t.Fragment,{children:[a&&(0,t.jsx)(d.Html,{position:[0,4.5,0],distanceFactor:12,children:(0,t.jsx)("div",{className:"bg-cyan-600/95 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg border-2 border-cyan-400",children:"⚡ Electron Transport Chain"})}),_.map(e=>(0,t.jsxs)("group",{position:e.pos,children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("boxGeometry",{args:[.4,.5,.3]}),(0,t.jsx)("meshStandardMaterial",{color:e.color,emissive:e.color,emissiveIntensity:.5+.3*Math.sin(6*P.current+e.id.length)})]}),a&&(0,t.jsx)(d.Html,{position:[0,.4,0],distanceFactor:8,children:(0,t.jsx)("div",{className:"bg-gray-900/90 text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap border border-gray-700",children:e.label})}),e.isATPSynthase&&(0,t.jsxs)("group",{ref:f,children:[(0,t.jsxs)("mesh",{position:[0,.4,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.2,.2,.4,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#22c55e",emissive:"#22c55e",emissiveIntensity:.7})]}),(0,t.jsxs)("mesh",{position:[0,.7,0],children:[(0,t.jsx)("sphereGeometry",{args:[.16,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#fbbf24",emissive:"#fbbf24",emissiveIntensity:.6})]}),Array.from({length:3}).map((e,r)=>(0,t.jsxs)("mesh",{position:[.25*Math.cos(r/3*Math.PI*2),.4,.25*Math.sin(r/3*Math.PI*2)],rotation:[0,0,r/3*Math.PI*2],children:[(0,t.jsx)("boxGeometry",{args:[.15,.02,.3]}),(0,t.jsx)("meshStandardMaterial",{color:"#22c55e",emissive:"#22c55e",emissiveIntensity:.5})]},r))]})]},e.id)),(0,t.jsx)(c.Line,{points:I,color:"#fbbf24",lineWidth:1.5,opacity:.4,transparent:!0,dashed:!0}),a&&(0,t.jsx)(d.Html,{position:[2.5,2,0],distanceFactor:12,children:(0,t.jsx)("div",{className:"bg-yellow-600/90 text-white px-2 py-1 rounded text-xs font-bold",children:"H⁺ Gradient"})}),(0,t.jsx)(c.Line,{points:Array.from({length:50},(e,t)=>{let r=t/50;return[1.8*Math.cos(r*Math.PI*2),(r-.5)*4,0]}),color:"#06b6d4",lineWidth:2,opacity:.5,transparent:!0,dashed:!0}),a&&(0,t.jsx)(d.Html,{position:[-2,-3,0],distanceFactor:12,children:(0,t.jsx)("div",{className:"bg-blue-600/90 text-white px-2 py-1 rounded text-xs font-bold",children:"O₂ + e⁻ → H₂O"})})]}),x.current.map(e=>{if(!e.active)return null;let r=.4+.25*Math.sin(4*P.current+e.id.length);switch(e.type){case"glucose":return(0,t.jsxs)("group",{position:e.position,children:[(0,t.jsx)(c.Line,{points:T,color:"#f97316",lineWidth:2.5}),Array.from({length:6}).map((e,i)=>{let n=i/6*Math.PI*2;return(0,t.jsxs)("mesh",{position:[.2*Math.cos(n),.2*Math.sin(n),0],children:[(0,t.jsx)("sphereGeometry",{args:[.055,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#ea580c",emissive:"#f97316",emissiveIntensity:r})]},i)})]},e.id);case"pyruvate":return(0,t.jsx)("group",{position:e.position,children:(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.14,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#f59e0b",emissive:"#f59e0b",emissiveIntensity:r})]})},e.id);case"acetylCoA":return(0,t.jsx)("group",{position:e.position,children:(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.16,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#a855f7",emissive:"#a855f7",emissiveIntensity:r})]})},e.id);case"atp":return(0,t.jsxs)("group",{position:e.position,children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.15,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#22c55e",emissive:"#22c55e",emissiveIntensity:.8,transparent:!0,opacity:.9})]}),Array.from({length:3}).map((e,r)=>(0,t.jsxs)("mesh",{position:[.08*(r+1),.08,0],children:[(0,t.jsx)("sphereGeometry",{args:[.045,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#fbbf24",emissive:"#fbbf24",emissiveIntensity:.6})]},r))]},e.id);case"co2":return(0,t.jsx)("group",{position:e.position,children:(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.1,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#9ca3af",transparent:!0,opacity:.6,emissive:"#9ca3af",emissiveIntensity:.3})]})},e.id);case"nadh":return(0,t.jsxs)("group",{position:e.position,children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.13,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#3b82f6",emissive:"#3b82f6",emissiveIntensity:.7})]}),(0,t.jsxs)("mesh",{position:[.08,0,0],children:[(0,t.jsx)("boxGeometry",{args:[.08,.08,.08]}),(0,t.jsx)("meshStandardMaterial",{color:"#1e40af"})]})]},e.id);case"fadh2":return(0,t.jsx)("group",{position:e.position,children:(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.13,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#a855f7",emissive:"#a855f7",emissiveIntensity:.7})]})},e.id);case"electron":return(0,t.jsx)("group",{position:e.position,children:(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.06,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#06b6d4",emissive:"#06b6d4",emissiveIntensity:.9+.4*Math.sin(15*P.current)})]})},e.id);case"proton":return(0,t.jsx)("group",{position:e.position,children:(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.07,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#fbbf24",emissive:"#fbbf24",emissiveIntensity:.6+.3*Math.sin(8*P.current+e.id.length)})]})},e.id);case"o2":return(0,t.jsxs)("group",{position:e.position,children:[(0,t.jsxs)("mesh",{position:[-.07,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[.1,10,10]}),(0,t.jsx)("meshStandardMaterial",{color:"#06b6d4",emissive:"#06b6d4",emissiveIntensity:.5})]}),(0,t.jsxs)("mesh",{position:[.07,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[.1,10,10]}),(0,t.jsx)("meshStandardMaterial",{color:"#06b6d4",emissive:"#06b6d4",emissiveIntensity:.5})]})]},e.id);case"h2o":return(0,t.jsx)("group",{position:e.position,children:(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.09,10,10]}),(0,t.jsx)("meshStandardMaterial",{color:"#60a5fa",transparent:!0,opacity:.8,emissive:"#3b82f6",emissiveIntensity:.4})]})},e.id);default:return null}}),a&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(d.Html,{position:[0,-5.5,0],distanceFactor:12,children:(0,t.jsxs)("div",{className:"bg-red-600/95 text-white px-5 py-2 rounded-lg text-base font-bold shadow-lg border-2 border-red-400",children:["Stage ",o+1,": ",N[o]]})}),(0,t.jsx)(d.Html,{position:[-5.5,-3.5,0],distanceFactor:12,children:(0,t.jsxs)("div",{className:"bg-gray-900/95 px-4 py-3 rounded-lg shadow-lg border border-gray-700 min-w-[200px]",children:[(0,t.jsx)("div",{className:"text-white font-bold text-sm mb-3",children:"⚡ ATP Production"}),(0,t.jsxs)("div",{className:"space-y-2 text-xs",children:[(0,t.jsxs)("div",{className:"flex justify-between text-gray-400",children:[(0,t.jsx)("span",{children:"Glycolysis:"}),(0,t.jsxs)("span",{className:"text-blue-400 font-bold",children:[C.atpFromGlycolysis," ATP"]})]}),(0,t.jsxs)("div",{className:"flex justify-between text-gray-400",children:[(0,t.jsx)("span",{children:"Pyruvate Ox:"}),(0,t.jsxs)("span",{className:"text-orange-400 font-bold",children:[C.atpFromPyruvate," ATP"]})]}),(0,t.jsxs)("div",{className:"flex justify-between text-gray-400",children:[(0,t.jsx)("span",{children:"Krebs Cycle:"}),(0,t.jsxs)("span",{className:"text-green-400 font-bold",children:[C.atpFromKrebs," ATP"]})]}),(0,t.jsxs)("div",{className:"flex justify-between text-gray-400",children:[(0,t.jsx)("span",{children:"ETC:"}),(0,t.jsxs)("span",{className:"text-cyan-400 font-bold",children:[C.atpFromETC," ATP"]})]}),(0,t.jsxs)("div",{className:"border-t border-gray-700 pt-2 mt-2 flex justify-between text-white font-bold text-sm",children:[(0,t.jsx)("span",{children:"Total:"}),(0,t.jsxs)("span",{className:`${C.atpProduced>=38?"text-yellow-400":"text-green-400"}`,children:[C.atpProduced>=38?"✓ ":"",C.atpProduced,"/38 ATP"]})]}),C.atpProduced>=38&&(0,t.jsx)("div",{className:"mt-2 text-xs text-yellow-400 font-bold text-center animate-pulse",children:"🎉 Cellular Respiration Complete!"})]})]})}),(0,t.jsx)(d.Html,{position:[5,-3.5,0],distanceFactor:12,children:(0,t.jsxs)("div",{className:"bg-gray-900/95 px-4 py-3 rounded-lg shadow-lg border border-gray-700 min-w-[180px]",children:[(0,t.jsx)("div",{className:"text-white font-bold text-sm mb-3",children:"🧪 Molecules"}),(0,t.jsxs)("div",{className:"space-y-2 text-xs",children:[(0,t.jsxs)("div",{className:"flex justify-between text-gray-400",children:[(0,t.jsx)("span",{children:"CO₂ Produced:"}),(0,t.jsx)("span",{className:"text-gray-300 font-bold",children:C.co2Produced})]}),(0,t.jsxs)("div",{className:"flex justify-between text-gray-400",children:[(0,t.jsx)("span",{children:"NADH:"}),(0,t.jsx)("span",{className:"text-blue-400 font-bold",children:C.nadhCount})]}),(0,t.jsxs)("div",{className:"flex justify-between text-gray-400",children:[(0,t.jsx)("span",{children:"FADH₂:"}),(0,t.jsx)("span",{className:"text-purple-400 font-bold",children:C.fadh2Count})]})]})]})}),(0,t.jsx)(d.Html,{position:[0,5.5,0],distanceFactor:12,children:(0,t.jsx)("div",{className:"bg-gray-800/95 text-white px-4 py-2 rounded-lg text-xs max-w-[300px] shadow-lg border border-gray-700 text-center",children:C.description})})]})]})]})}e.s(["default",0,function(){let[e,l]=(0,r.useState)(!0),[c,d]=(0,r.useState)(1),[u,p]=(0,r.useState)(0),[m,f]=(0,r.useState)(!0),[x,y]=(0,r.useState)(!1),[v,g]=(0,r.useState)(0),[b,w]=(0,r.useState)(!0),[j,M]=(0,r.useState)({stage:"Glycolysis",atpProduced:0,glucoseRemaining:100,co2Produced:0,nadhCount:0,fadh2Count:0,description:"Glucose (6C) splits into 2 pyruvate (3C) in cytoplasm. Net: 2 ATP + 2 NADH.",atpFromGlycolysis:0,atpFromPyruvate:0,atpFromKrebs:0,atpFromETC:0}),S=(0,r.useCallback)(()=>{l(e=>!e)},[]),P=(0,r.useCallback)(()=>{p(e=>e+1),g(0)},[]),A=(0,r.useCallback)(e=>{d(e)},[]),C=(0,r.useCallback)(e=>{M(e)},[]),E=(0,r.useMemo)(()=>(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(a.ControlGroup,{title:"Cellular Respiration Stages",children:["Glycolysis","Pyruvate Oxidation","Krebs Cycle","Electron Transport Chain"].map((e,r)=>(0,t.jsxs)("button",{onClick:()=>g(r),className:`w-full px-3 py-2 rounded text-sm transition-colors mb-2 ${v===r?"bg-[#ef4444] text-white font-bold":"bg-gray-800 text-gray-300 hover:bg-gray-700"}`,children:[r+1,". ",e]},e))}),(0,t.jsx)(a.ControlGroup,{title:"ATP Accounting",children:(0,t.jsxs)("div",{className:"bg-gray-800/50 rounded-lg p-3 text-xs space-y-2",children:[(0,t.jsxs)("div",{className:"flex justify-between text-gray-400",children:[(0,t.jsx)("span",{children:"Glycolysis:"}),(0,t.jsxs)("span",{className:"text-blue-400",children:[j.atpFromGlycolysis," ATP"]})]}),(0,t.jsxs)("div",{className:"flex justify-between text-gray-400",children:[(0,t.jsx)("span",{children:"Pyruvate Ox:"}),(0,t.jsxs)("span",{className:"text-orange-400",children:[j.atpFromPyruvate," ATP"]})]}),(0,t.jsxs)("div",{className:"flex justify-between text-gray-400",children:[(0,t.jsx)("span",{children:"Krebs Cycle:"}),(0,t.jsxs)("span",{className:"text-green-400",children:[j.atpFromKrebs," ATP"]})]}),(0,t.jsxs)("div",{className:"flex justify-between text-gray-400",children:[(0,t.jsx)("span",{children:"ETC:"}),(0,t.jsxs)("span",{className:"text-cyan-400",children:[j.atpFromETC," ATP"]})]}),(0,t.jsxs)("div",{className:"border-t border-gray-700 pt-2 mt-2 flex justify-between text-gray-300 font-bold",children:[(0,t.jsx)("span",{children:"Total:"}),(0,t.jsxs)("span",{className:"text-green-400",children:[j.atpProduced,"/38 ATP"]})]})]})}),(0,t.jsx)(a.ControlGroup,{title:"Display",children:(0,t.jsxs)("label",{className:"flex items-center gap-2 text-gray-300 text-sm cursor-pointer",children:[(0,t.jsx)("input",{type:"checkbox",checked:b,onChange:e=>w(e.target.checked),className:"w-4 h-4 rounded accent-[#ef4444]"}),"Show Labels"]})})]}),[v,b,j]),N=(0,r.useMemo)(()=>(0,t.jsx)(a.DataGrid,{data:{stage:{value:0,unit:j.stage,color:"#ef4444",decimals:0},atpProduced:{value:j.atpProduced,unit:"/38",color:"#22c55e",decimals:0},glucose:{value:j.glucoseRemaining,unit:"%",color:"#3b82f6",decimals:0},co2:{value:j.co2Produced,unit:"CO₂",color:"#6b7280",decimals:0},nadh:{value:j.nadhCount,unit:"NADH",color:"#f59e0b",decimals:0},fadh2:{value:j.fadh2Count,unit:"FADH₂",color:"#a855f7",decimals:0},status:{value:+!!e,unit:e?"Active":"Paused",color:"#22c55e",decimals:0}},columns:2}),[j,e]),L=(0,r.useMemo)(()=>(0,t.jsx)(o.DataPanel,{isVisible:x,onToggle:()=>y(e=>!e),children:N}),[x,N]);return(0,t.jsxs)("div",{className:"w-full h-screen relative",children:[(0,t.jsx)(i.ExperimentContainer,{title:"Cellular Respiration",description:"ATP production through 4 stages: ~38 ATP per glucose molecule",cameraPosition:[0,0,13],backgroundColor:"#050510",controls:null,dataPanel:L,children:(0,t.jsx)(h,{onDataChange:C,isPlaying:e,simulationSpeed:c,resetTrigger:u,stage:v,showLabels:b})}),(0,t.jsx)(n.SimulationController,{isPlaying:e,onPlayPause:S,onReset:P,speed:c,onSpeedChange:A,timeElapsed:0}),m&&(0,t.jsx)(s.FloatingControlPanel,{initialPosition:{x:window.innerWidth-340,y:80},children:E}),!m&&(0,t.jsx)("button",{onClick:()=>f(!0),className:"fixed top-20 right-4 z-20 px-4 py-2 bg-[#ef4444]/20 hover:bg-[#ef4444]/30 text-[#ef4444] rounded-lg border border-[#ef4444]/50 transition-colors text-sm font-medium",children:"Show Controls"})]})}],11601)}]);
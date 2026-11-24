(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,r;var i=e.i(31067),n=e.i(71645),s=e.i(90072),o=e.i(48546),a=s,l=s;let c=new l.Box3,d=new l.Vector3;class u extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,r=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),r.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let r=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(r,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(r,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let r;e instanceof Float32Array?r=e:Array.isArray(e)&&(r=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(r,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(i,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(i,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),c.setFromBufferAttribute(t),this.boundingBox.union(c))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let r=this.boundingSphere.center;this.boundingBox.getCenter(r);let i=0;for(let n=0,s=e.count;n<s;n++)d.fromBufferAttribute(e,n),i=Math.max(i,r.distanceToSquared(d)),d.fromBufferAttribute(t,n),i=Math.max(i,r.distanceToSquared(d));this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var f=s,h=e.i(8560),m=e.i(31497);class p extends f.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:f.UniformsUtils.clone(f.UniformsUtils.merge([h.UniformsLib.common,h.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new f.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let x=m.version>=125?"uv1":"uv2",g=new a.Vector4,y=new a.Vector3,v=new a.Vector3,b=new a.Vector4,w=new a.Vector4,S=new a.Vector4,A=new a.Vector3,j=new a.Matrix4,M=new a.Line3,E=new a.Vector3,N=new a.Box3,C=new a.Sphere,L=new a.Vector4;function P(e,t,i){return L.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),L.multiplyScalar(1/L.w),L.x=r/i.width,L.y=r/i.height,L.applyMatrix4(e.projectionMatrixInverse),L.multiplyScalar(1/L.w),Math.abs(Math.max(L.x,L.y))}class U extends a.Mesh{constructor(e=new u,t=new p({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,r=e.attributes.instanceEnd,i=new Float32Array(2*t.count);for(let e=0,n=0,s=t.count;e<s;e++,n+=2)y.fromBufferAttribute(t,e),v.fromBufferAttribute(r,e),i[n]=0===n?0:i[n-1],i[n+1]=i[n]+y.distanceTo(v);let n=new a.InstancedInterleavedBuffer(i,2,1);return e.setAttribute("instanceDistanceStart",new a.InterleavedBufferAttribute(n,1,0)),e.setAttribute("instanceDistanceEnd",new a.InterleavedBufferAttribute(n,1,1)),this}raycast(e,i){let n,s,o=this.material.worldUnits,l=e.camera;null!==l||o||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let d=this.matrixWorld,u=this.geometry,f=this.material;if(r=f.linewidth+c,null===u.boundingSphere&&u.computeBoundingSphere(),C.copy(u.boundingSphere).applyMatrix4(d),o)n=.5*r;else{let e=Math.max(l.near,C.distanceToPoint(t.origin));n=P(l,e,f.resolution)}if(C.radius+=n,!1!==t.intersectsSphere(C)){if(null===u.boundingBox&&u.computeBoundingBox(),N.copy(u.boundingBox).applyMatrix4(d),o)s=.5*r;else{let e=Math.max(l.near,N.distanceToPoint(t.origin));s=P(l,e,f.resolution)}N.expandByScalar(s),!1!==t.intersectsBox(N)&&(o?function(e,i){let n=e.matrixWorld,s=e.geometry,o=s.attributes.instanceStart,l=s.attributes.instanceEnd,c=Math.min(s.instanceCount,o.count);for(let s=0;s<c;s++){M.start.fromBufferAttribute(o,s),M.end.fromBufferAttribute(l,s),M.applyMatrix4(n);let c=new a.Vector3,d=new a.Vector3;t.distanceSqToSegment(M.start,M.end,d,c),d.distanceTo(c)<.5*r&&i.push({point:d,pointOnLine:c,distance:t.origin.distanceTo(d),object:e,face:null,faceIndex:s,uv:null,[x]:null})}}(this,i):function(e,i,n){let s=i.projectionMatrix,o=e.material.resolution,l=e.matrixWorld,c=e.geometry,d=c.attributes.instanceStart,u=c.attributes.instanceEnd,f=Math.min(c.instanceCount,d.count),h=-i.near;t.at(1,S),S.w=1,S.applyMatrix4(i.matrixWorldInverse),S.applyMatrix4(s),S.multiplyScalar(1/S.w),S.x*=o.x/2,S.y*=o.y/2,S.z=0,A.copy(S),j.multiplyMatrices(i.matrixWorldInverse,l);for(let i=0;i<f;i++){if(b.fromBufferAttribute(d,i),w.fromBufferAttribute(u,i),b.w=1,w.w=1,b.applyMatrix4(j),w.applyMatrix4(j),b.z>h&&w.z>h)continue;if(b.z>h){let e=b.z-w.z,t=(b.z-h)/e;b.lerp(w,t)}else if(w.z>h){let e=w.z-b.z,t=(w.z-h)/e;w.lerp(b,t)}b.applyMatrix4(s),w.applyMatrix4(s),b.multiplyScalar(1/b.w),w.multiplyScalar(1/w.w),b.x*=o.x/2,b.y*=o.y/2,w.x*=o.x/2,w.y*=o.y/2,M.start.copy(b),M.start.z=0,M.end.copy(w),M.end.z=0;let c=M.closestPointToPointParameter(A,!0);M.at(c,E);let f=a.MathUtils.lerp(b.z,w.z,c),m=f>=-1&&f<=1,p=A.distanceTo(E)<.5*r;if(m&&p){M.start.fromBufferAttribute(d,i),M.end.fromBufferAttribute(u,i),M.start.applyMatrix4(l),M.end.applyMatrix4(l);let r=new a.Vector3,s=new a.Vector3;t.distanceSqToSegment(M.start,M.end,s,r),n.push({point:s,pointOnLine:r,distance:t.origin.distanceTo(s),object:e,face:null,faceIndex:i,uv:null,[x]:null})}}}(this,l,i))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(g),this.material.uniforms.resolution.value.set(g.z,g.w))}}class _ extends u{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,r=new Float32Array(2*t);for(let i=0;i<t;i+=3)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5];return super.setPositions(r),this}setColors(e,t=3){let r=e.length-t,i=new Float32Array(2*r);if(3===t)for(let n=0;n<r;n+=t)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];else for(let n=0;n<r;n+=t)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5],i[2*n+6]=e[n+6],i[2*n+7]=e[n+7];return super.setColors(i,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class R extends U{constructor(e=new _,t=new p({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let z=n.forwardRef(function({points:e,color:t=0xffffff,vertexColors:r,linewidth:a,lineWidth:l,segments:c,dashed:d,...f},h){var m,x;let g=(0,o.useThree)(e=>e.size),y=n.useMemo(()=>c?new U:new R,[c]),[v]=n.useState(()=>new p),b=(null==r||null==(m=r[0])?void 0:m.length)===4?4:3,w=n.useMemo(()=>{let i=c?new u:new _,n=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Vector3||e instanceof s.Vector4?[e.x,e.y,e.z]:e instanceof s.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(i.setPositions(n.flat()),r){t=0xffffff;let e=r.map(e=>e instanceof s.Color?e.toArray():e);i.setColors(e.flat(),b)}return i},[e,c,r,b]);return n.useLayoutEffect(()=>{y.computeLineDistances()},[e,y]),n.useLayoutEffect(()=>{d?v.defines.USE_DASH="":delete v.defines.USE_DASH,v.needsUpdate=!0},[d,v]),n.useEffect(()=>()=>{w.dispose(),v.dispose()},[w]),n.createElement("primitive",(0,i.default)({object:y,ref:h},f),n.createElement("primitive",{object:w,attach:"geometry"}),n.createElement("primitive",(0,i.default)({object:v,attach:"material",color:t,vertexColors:!!r,resolution:[g.width,g.height],linewidth:null!=(x=null!=a?a:l)?x:1,dashed:d,transparent:4===b},f)))});e.s(["Line",0,z],43216)},60099,e=>{"use strict";let t,r;var i=e.i(31067),n=e.i(71645),s=e.i(88014),o=e.i(90072),a=e.i(48546),l=e.i(94800);let c=new o.Vector3,d=new o.Vector3,u=new o.Vector3,f=new o.Vector2;function h(e,t,r){let i=c.setFromMatrixPosition(e.matrixWorld);i.project(t);let n=r.width/2,s=r.height/2;return[i.x*n+n,-(i.y*s)+s]}let m=e=>1e-10>Math.abs(e)?0:e;function p(e,t,r=""){let i="matrix3d(";for(let r=0;16!==r;r++)i+=m(t[r]*e.elements[r])+(15!==r?",":")");return r+i}let x=(t=[1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1],e=>p(e,t)),g=(r=e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1],(e,t)=>p(e,r(t),"translate(-50%,-50%)")),y=n.forwardRef(({children:e,eps:t=.001,style:r,className:p,prepend:y,center:v,fullscreen:b,portal:w,distanceFactor:S,sprite:A=!1,transform:j=!1,occlude:M,onOcclude:E,castShadow:N,receiveShadow:C,material:L,geometry:P,zIndexRange:U=[0x1000037,0],calculatePosition:_=h,as:R="div",wrapperClass:z,pointerEvents:T="auto",...B},D)=>{let{gl:G,camera:O,scene:I,size:W,raycaster:H,events:V,viewport:F}=(0,a.useThree)(),[k]=n.useState(()=>document.createElement(R)),$=n.useRef(null),q=n.useRef(null),Z=n.useRef(0),K=n.useRef([0,0]),J=n.useRef(null),X=n.useRef(null),Q=(null==w?void 0:w.current)||V.connected||G.domElement.parentNode,Y=n.useRef(null),ee=n.useRef(!1),et=n.useMemo(()=>{var e;return M&&"blending"!==M||Array.isArray(M)&&M.length&&(e=M[0])&&"object"==typeof e&&"current"in e},[M]);n.useLayoutEffect(()=>{let e=G.domElement;M&&"blending"===M?(e.style.zIndex=`${Math.floor(U[0]/2)}`,e.style.position="absolute",e.style.pointerEvents="none"):(e.style.zIndex=null,e.style.position=null,e.style.pointerEvents=null)},[M]),n.useLayoutEffect(()=>{if(q.current){let e=$.current=s.createRoot(k);if(I.updateMatrixWorld(),j)k.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";else{let e=_(q.current,O,W);k.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${e[0]}px,${e[1]}px,0);transform-origin:0 0;`}return Q&&(y?Q.prepend(k):Q.appendChild(k)),()=>{Q&&Q.removeChild(k),e.unmount()}}},[Q,j]),n.useLayoutEffect(()=>{z&&(k.className=z)},[z]);let er=n.useMemo(()=>j?{position:"absolute",top:0,left:0,width:W.width,height:W.height,transformStyle:"preserve-3d",pointerEvents:"none"}:{position:"absolute",transform:v?"translate3d(-50%,-50%,0)":"none",...b&&{top:-W.height/2,left:-W.width/2,width:W.width,height:W.height},...r},[r,v,b,W,j]),ei=n.useMemo(()=>({position:"absolute",pointerEvents:T}),[T]);n.useLayoutEffect(()=>{var t,i;ee.current=!1,j?null==(t=$.current)||t.render(n.createElement("div",{ref:J,style:er},n.createElement("div",{ref:X,style:ei},n.createElement("div",{ref:D,className:p,style:r,children:e})))):null==(i=$.current)||i.render(n.createElement("div",{ref:D,style:er,className:p,children:e}))});let en=n.useRef(!0);(0,l.useFrame)(e=>{if(q.current){O.updateMatrixWorld(),q.current.updateWorldMatrix(!0,!1);let e=j?K.current:_(q.current,O,W);if(j||Math.abs(Z.current-O.zoom)>t||Math.abs(K.current[0]-e[0])>t||Math.abs(K.current[1]-e[1])>t){var r;let t,i,n,s,a=(r=q.current,t=c.setFromMatrixPosition(r.matrixWorld),i=d.setFromMatrixPosition(O.matrixWorld),n=t.sub(i),s=O.getWorldDirection(u),n.angleTo(s)>Math.PI/2),l=!1;et&&(Array.isArray(M)?l=M.map(e=>e.current):"blending"!==M&&(l=[I]));let h=en.current;l?en.current=function(e,t,r,i){let n=c.setFromMatrixPosition(e.matrixWorld),s=n.clone();s.project(t),f.set(s.x,s.y),r.setFromCamera(f,t);let o=r.intersectObjects(i,!0);if(o.length){let e=o[0].distance;return n.distanceTo(r.ray.origin)<e}return!0}(q.current,O,H,l)&&!a:en.current=!a,h!==en.current&&(E?E(!en.current):k.style.display=en.current?"block":"none");let p=Math.floor(U[0]/2),y=M?et?[U[0],p]:[p-1,0]:U;if(k.style.zIndex=`${function(e,t,r){if(t instanceof o.PerspectiveCamera||t instanceof o.OrthographicCamera){let i=c.setFromMatrixPosition(e.matrixWorld),n=d.setFromMatrixPosition(t.matrixWorld),s=i.distanceTo(n),o=(r[1]-r[0])/(t.far-t.near),a=r[1]-o*t.far;return Math.round(o*s+a)}}(q.current,O,y)}`,j){let[e,t]=[W.width/2,W.height/2],r=O.projectionMatrix.elements[5]*t,{isOrthographicCamera:i,top:n,left:s,bottom:o,right:a}=O,l=x(O.matrixWorldInverse),c=i?`scale(${r})translate(${m(-(a+s)/2)}px,${m((n+o)/2)}px)`:`translateZ(${r}px)`,d=q.current.matrixWorld;A&&((d=O.matrixWorldInverse.clone().transpose().copyPosition(d).scale(q.current.scale)).elements[3]=d.elements[7]=d.elements[11]=0,d.elements[15]=1),k.style.width=W.width+"px",k.style.height=W.height+"px",k.style.perspective=i?"":`${r}px`,J.current&&X.current&&(J.current.style.transform=`${c}${l}translate(${e}px,${t}px)`,X.current.style.transform=g(d,1/((S||10)/400)))}else{let t=void 0===S?1:function(e,t){if(t instanceof o.OrthographicCamera)return t.zoom;if(!(t instanceof o.PerspectiveCamera))return 1;{let r=c.setFromMatrixPosition(e.matrixWorld),i=d.setFromMatrixPosition(t.matrixWorld);return 1/(2*Math.tan(t.fov*Math.PI/180/2)*r.distanceTo(i))}}(q.current,O)*S;k.style.transform=`translate3d(${e[0]}px,${e[1]}px,0) scale(${t})`}K.current=e,Z.current=O.zoom}}if(!et&&Y.current&&!ee.current)if(j){if(J.current){let e=J.current.children[0];if(null!=e&&e.clientWidth&&null!=e&&e.clientHeight){let{isOrthographicCamera:t}=O;if(t||P)B.scale&&(Array.isArray(B.scale)?B.scale instanceof o.Vector3?Y.current.scale.copy(B.scale.clone().divideScalar(1)):Y.current.scale.set(1/B.scale[0],1/B.scale[1],1/B.scale[2]):Y.current.scale.setScalar(1/B.scale));else{let t=(S||10)/400,r=e.clientWidth*t,i=e.clientHeight*t;Y.current.scale.set(r,i,1)}ee.current=!0}}}else{let t=k.children[0];if(null!=t&&t.clientWidth&&null!=t&&t.clientHeight){let e=1/F.factor,r=t.clientWidth*e,i=t.clientHeight*e;Y.current.scale.set(r,i,1),ee.current=!0}Y.current.lookAt(e.camera.position)}});let es=n.useMemo(()=>({vertexShader:j?void 0:`
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
      `}),[j]);return n.createElement("group",(0,i.default)({},B,{ref:q}),M&&!et&&n.createElement("mesh",{castShadow:N,receiveShadow:C,ref:Y},P||n.createElement("planeGeometry",null),L||n.createElement("shaderMaterial",{side:o.DoubleSide,vertexShader:es.vertexShader,fragmentShader:es.fragmentShader})))});e.s(["Html",0,y])},56420,e=>{"use strict";var t=e.i(71645);let r=(...e)=>e.filter((e,t,r)=>!!e&&""!==e.trim()&&r.indexOf(e)===t).join(" ").trim(),i=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,r)=>r?r.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var n={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,t.createContext)({}),o=(0,t.forwardRef)(({color:e,size:i,strokeWidth:o,absoluteStrokeWidth:a,className:l="",children:c,iconNode:d,...u},f)=>{let{size:h=24,strokeWidth:m=2,absoluteStrokeWidth:p=!1,color:x="currentColor",className:g=""}=(0,t.useContext)(s)??{},y=a??p?24*Number(o??m)/Number(i??h):o??m;return(0,t.createElement)("svg",{ref:f,...n,width:i??h??n.width,height:i??h??n.height,stroke:e??x,strokeWidth:y,className:r("lucide",g,l),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,r])=>(0,t.createElement)(e,r)),...Array.isArray(c)?c:[c]])});e.s(["default",0,(e,n)=>{let s=(0,t.forwardRef)(({className:s,...a},l)=>(0,t.createElement)(o,{ref:l,iconNode:n,className:r(`lucide-${i(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...a}));return s.displayName=i(e),s}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,r)=>{t.exports=e.r(76562)},56327,e=>{"use strict";var t=e.i(43476),r=e.i(71645),i=e.i(92989);e.i(81413);var n=e.i(48205),s=e.i(14228),o=e.i(82192),a=e.i(4685),l=e.i(68647),c=e.i(94800),d=e.i(30297),u=e.i(60099),f=e.i(43216),h=e.i(90072);let m=[{name:"Met",fullName:"Methionine (Start)",color:"#ef4444"},{name:"Lys",fullName:"Lysine",color:"#3b82f6"},{name:"Arg",fullName:"Arginine",color:"#22c55e"},{name:"Ser",fullName:"Serine",color:"#f59e0b"},{name:"Leu",fullName:"Leucine",color:"#8b5cf6"},{name:"Pro",fullName:"Proline",color:"#ec4899"},{name:"Gly",fullName:"Glycine",color:"#14b8a6"},{name:"Val",fullName:"Valine",color:"#f97316"}],p={A:"#1e40af",T:"#3b82f6",G:"#60a5fa",C:"#93c5fd"},x={A:"#ea580c",U:"#f97316",G:"#fb923c",C:"#fdba74"},g="#22c55e",y="#8b5cf6",v=["A","T","G","C","G","A","T","C","G","A","T","C","G","A","T"],b=[["A","U","G"],["A","A","A"],["C","G","U"],["U","C","U"],["U","U","A"],["C","C","U"],["G","G","U"],["G","U","U"]],w={A:"T",T:"A",G:"C",C:"G"},S={A:"U",U:"A",G:"C",C:"G"},A=[{phase:"Transcription",name:"DNA in Nucleus",desc:"DNA double helix in nucleus. RNA Polymerase binds to promoter region."},{phase:"Transcription",name:"mRNA Synthesis",desc:"RNA Polymerase reads DNA 3'→5', builds mRNA 5'→3'. Uracil pairs with Adenine."},{phase:"Transcription",name:"mRNA Processing & Export",desc:"mRNA detaches, exits nucleus through nuclear pore into cytoplasm."},{phase:"Translation",name:"Translation Initiation",desc:"Ribosome binds mRNA at start codon (AUG). Initiation tRNA brings first amino acid."},{phase:"Translation",name:"Elongation",desc:"tRNAs bring amino acids matching codons. Polypeptide chain grows bond by bond."},{phase:"Translation",name:"Termination & Folding",desc:"Stop codon reached. Polypeptide chain folds into functional protein."}];function j({onDataChange:e,isPlaying:i=!0,simulationSpeed:n=1,resetTrigger:s=0,speed:o=1,showLabels:a=!0,step:l=0}){let M=(0,r.useRef)(null),E=(0,r.useRef)(0),N=(0,r.useRef)(0),C=(0,r.useRef)(0),L=(0,r.useRef)(0),P=(0,r.useRef)(0),U=(0,r.useRef)(0),_=(0,r.useRef)(0),R=(0,r.useRef)(0),z=(0,r.useRef)(0),[T,B]=(0,r.useState)("AUG"),[D,G]=(0,r.useState)("Met"),[O,I]=(0,r.useState)(0),W=(0,r.useRef)(0);(0,r.useEffect)(()=>{E.current=0,N.current=0,C.current=0,L.current=0,P.current=0,U.current=0,_.current=0,R.current=0,z.current=0,B("AUG"),G("Met"),I(0)},[s,l]),(0,c.useFrame)((t,r)=>{if(W.current++,M.current&&i&&(E.current+=r*n*o,N.current+=.06*r*n,1===l?(C.current=Math.min(100,C.current+10*r*n*o),z.current=Math.min(15,z.current+1.5*r*n*o)):2===l?(C.current=100,z.current=15,L.current=Math.min(100,L.current+15*r*n*o)):3===l?P.current=Math.min(100,P.current+25*r*n*o):4===l?(U.current=Math.min(8,U.current+1.2*r*n*o),_.current=Math.min(8,_.current+r*n*o)):5===l&&(_.current=8,R.current=Math.min(100,R.current+20*r*n*o)),W.current%8==0)){let t=Math.floor(U.current);t<8&&t>=0&&(B(b[t].join("")),G(m[t].name)),I(Math.floor(_.current)),e&&e({phase:A[l].phase,step:A[l].name,codonBeingRead:T,aminoAcidAdded:D,proteinLength:Math.floor(_.current),description:A[l].desc,nucleotidesTranscribed:Math.floor(z.current)})}});let H=(0,r.useCallback)((e=0)=>{let t=[];for(let r=0;r<16;r++){let i=.5*r+N.current;t.push(new h.Vector3(1.3*Math.cos(i)-4,.5*r-4+e,1.3*Math.sin(i)))}return t},[N.current]),V=(0,r.useCallback)((e=0)=>{let t=[];for(let r=0;r<9;r++)t.push(new h.Vector3(1.5+e,(r-4)*1.2,0));return t},[]);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("ambientLight",{intensity:.4}),(0,t.jsx)("directionalLight",{position:[10,10,5],intensity:.8}),(0,t.jsx)("pointLight",{position:[-4,0,0],intensity:.4,color:"#3b82f6"}),(0,t.jsx)("pointLight",{position:[2,0,0],intensity:.4*(l>=3),color:"#f97316"}),(0,t.jsx)("pointLight",{position:[4,2,0],intensity:.4*(l>=3),color:"#8b5cf6"}),(0,t.jsx)(d.OrbitControls,{enableDamping:!0,dampingFactor:.05}),(0,t.jsxs)("group",{ref:M,children:[a&&(0,t.jsx)(u.Html,{position:[0,8,0],distanceFactor:10,children:(0,t.jsxs)("div",{className:"bg-gray-900/95 px-4 py-3 rounded-xl border border-gray-700 shadow-xl",children:[(0,t.jsxs)("div",{className:"text-white text-lg font-bold",children:[A[l].phase,": ",A[l].name]}),(0,t.jsx)("div",{className:"text-gray-300 text-sm mt-1",children:A[l].desc}),(4===l||5===l)&&(0,t.jsxs)("div",{className:"text-gray-400 text-xs mt-2",children:["Codon: ",T," | AA: ",D," | Protein: ",O,"/8"]}),1===l&&(0,t.jsxs)("div",{className:"text-gray-400 text-xs mt-2",children:["Nucleotides: ",Math.floor(z.current),"/15"]})]})}),l<=2&&(0,t.jsxs)("group",{children:[(0,t.jsxs)("mesh",{position:[-3,1.5,0],children:[(0,t.jsx)("sphereGeometry",{args:[5.5,32,32]}),(0,t.jsx)("meshStandardMaterial",{color:"#1e3a5f",transparent:!0,opacity:.12,side:h.BackSide})]}),(0,t.jsx)(f.Line,{points:H(),color:"#3b82f6",lineWidth:3,opacity:.7,transparent:!0}),(0,t.jsx)(f.Line,{points:H().map(e=>new h.Vector3(e.x+.4,e.y,e.z+.4)),color:"#60a5fa",lineWidth:3,opacity:.7,transparent:!0}),v.map((e,r)=>(0,t.jsxs)("group",{children:[(0,t.jsxs)("mesh",{position:[1.3*Math.cos(.5*r+N.current)-4,.5*r-4,1.3*Math.sin(.5*r+N.current)],children:[(0,t.jsx)("sphereGeometry",{args:[.14,10,10]}),(0,t.jsx)("meshStandardMaterial",{color:p[e]})]}),(0,t.jsxs)("mesh",{position:[1.3*Math.cos(.5*r+N.current)-4+.4,.5*r-4,1.3*Math.sin(.5*r+N.current)+.4],children:[(0,t.jsx)("sphereGeometry",{args:[.14,10,10]}),(0,t.jsx)("meshStandardMaterial",{color:p[w[e]]})]})]},r)),l>=0&&l<=2&&(0,t.jsxs)("group",{position:[-4,-4+C.current/100*5,1.5],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[1,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#dc2626",emissive:"#dc2626",emissiveIntensity:.4})]}),a&&(0,t.jsx)(u.Html,{position:[1.8,0,0],distanceFactor:10,children:(0,t.jsx)("div",{className:"bg-red-600/95 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg",children:"RNA Polymerase"})})]}),l>=1&&(0,t.jsx)("group",{position:[-2.5,-4+C.current/100*5,0],children:Array.from({length:Math.floor(C.current/100*8)}).map((e,r)=>(0,t.jsxs)("group",{position:[.4*r,0,0],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.1,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:x.A})]}),(0,t.jsxs)("mesh",{position:[.08,.08,0],children:[(0,t.jsx)("sphereGeometry",{args:[.08,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:x[["A","U","G","C"][r%4]]})]})]},r))}),2===l&&(0,t.jsxs)("group",{position:[-2.5+L.current/100*5,0,0],children:[(0,t.jsx)(f.Line,{points:V(),color:"#f97316",lineWidth:2.5,opacity:.8,transparent:!0}),b.map((e,r)=>(0,t.jsx)("group",{position:[1.5,(r-4)*1.2,0],children:e.map((e,r)=>(0,t.jsxs)("mesh",{position:[.3*r,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[.14,10,10]}),(0,t.jsx)("meshStandardMaterial",{color:x[e]})]},r))},r))]}),2===l&&a&&(0,t.jsx)(u.Html,{position:[.5,0,0],distanceFactor:10,children:(0,t.jsx)("div",{className:"bg-blue-500/95 text-white px-2 py-1 rounded-lg text-xs font-bold",children:"Nuclear Pore → Cytoplasm"})})]}),l>=3&&(0,t.jsxs)("group",{children:[(0,t.jsx)(f.Line,{points:V(),color:"#f97316",lineWidth:2.5,opacity:.8,transparent:!0}),b.map((e,r)=>{let i=r<_.current,n=Math.floor(U.current)===r;return(0,t.jsxs)("group",{position:[1.5,(r-4)*1.2,0],children:[e.map((e,r)=>(0,t.jsxs)("mesh",{position:[.32*r,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[.15,10,10]}),(0,t.jsx)("meshStandardMaterial",{color:x[e],emissive:n?x[e]:"#000000",emissiveIntensity:.5*!!n})]},r)),n&&a&&(0,t.jsxs)("group",{position:[1,0,.6],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.35,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:g,emissive:g,emissiveIntensity:.4})]}),e.map((e,r)=>(0,t.jsxs)("mesh",{position:[.2,.16*r-.16,.25],children:[(0,t.jsx)("sphereGeometry",{args:[.09,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:x[S[e]]})]},r)),a&&(0,t.jsx)(u.Html,{position:[0,.7,0],distanceFactor:12,children:(0,t.jsx)("div",{className:"bg-green-500/95 text-white px-2 py-1 rounded text-xs font-bold",children:"tRNA"})})]}),i&&(0,t.jsxs)("mesh",{position:[1.8,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[.38,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:m[r].color,emissive:m[r].color,emissiveIntensity:.35})]}),i&&r%2==0&&a&&(0,t.jsx)(u.Html,{position:[1.8,.7,0],distanceFactor:12,children:(0,t.jsx)("div",{className:"px-2 py-1 rounded text-xs font-bold whitespace-nowrap",style:{backgroundColor:m[r].color,color:"white"},children:m[r].name})})]},r)}),(0,t.jsxs)("group",{position:[3.5,2,0],children:[(0,t.jsxs)("mesh",{position:[0,.5,0],children:[(0,t.jsx)("sphereGeometry",{args:[1.4,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:y,emissive:y,emissiveIntensity:.25,roughness:.4})]}),(0,t.jsxs)("mesh",{position:[0,-.7,0],children:[(0,t.jsx)("sphereGeometry",{args:[1.1,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#a78bfa",roughness:.4})]}),a&&(0,t.jsx)(u.Html,{position:[0,2.2,0],distanceFactor:10,children:(0,t.jsx)("div",{className:"bg-purple-500/95 text-white px-2 py-1 rounded-lg text-xs font-bold",children:"Ribosome"})})]}),_.current>0&&(0,t.jsx)("group",{position:[4.5,0,1],children:Array.from({length:Math.floor(_.current)}).map((e,r)=>(0,t.jsxs)("mesh",{position:[0,(r-Math.floor(_.current)/2)*.55,0],children:[(0,t.jsx)("sphereGeometry",{args:[.32,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:m[r].color,emissive:m[r].color,emissiveIntensity:.25})]},r))}),5===l&&R.current>0&&(0,t.jsxs)("group",{position:[6,-1,0],rotation:[0,.06*R.current,0],children:[Array.from({length:8}).map((e,r)=>{let i=r/8*Math.PI*2,n=.9+.25*Math.sin(2.5*i);return(0,t.jsxs)("mesh",{position:[Math.cos(i)*n,.6*Math.sin(3.5*i),Math.sin(i)*n],children:[(0,t.jsx)("sphereGeometry",{args:[.42,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:m[r].color,emissive:m[r].color,emissiveIntensity:.35})]},r)}),a&&(0,t.jsx)(u.Html,{position:[0,1.8,0],distanceFactor:10,children:(0,t.jsx)("div",{className:"bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-2 rounded-lg text-sm font-bold shadow-lg",children:"✨ Complete Protein!"})})]})]}),a&&l>=2&&(0,t.jsx)("group",{children:(0,t.jsx)(u.Html,{position:[0,-6,0],distanceFactor:10,children:(0,t.jsxs)("div",{className:"bg-gray-800/95 px-4 py-2 rounded-lg border border-gray-600",children:[(0,t.jsxs)("div",{className:"text-white text-sm font-bold text-center",children:["DNA ",(0,t.jsx)("span",{className:"text-gray-400",children:"→"})," mRNA ",(0,t.jsx)("span",{className:"text-gray-400",children:"→"})," Protein"]}),(0,t.jsx)("div",{className:"text-gray-400 text-xs text-center mt-1",children:"Central Dogma of Molecular Biology"})]})})}),a&&(0,t.jsx)(u.Html,{position:[-7,-5,0],distanceFactor:10,children:(0,t.jsxs)("div",{className:"bg-gray-900/95 px-3 py-2 rounded-lg border border-gray-700 text-xs shadow-lg",children:[(0,t.jsx)("div",{className:"text-white font-bold mb-2",children:"Molecules"}),(0,t.jsxs)("div",{className:"space-y-1.5",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-blue-500"}),(0,t.jsx)("span",{className:"text-gray-300",children:"DNA"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-orange-500"}),(0,t.jsx)("span",{className:"text-gray-300",children:"mRNA"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-green-500"}),(0,t.jsx)("span",{className:"text-gray-300",children:"tRNA"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-purple-500"}),(0,t.jsx)("span",{className:"text-gray-300",children:"Ribosome"})]})]})]})})]})]})}e.s(["default",0,function(){let e=(0,i.useRouter)(),[c,d]=(0,r.useState)(!0),[u,f]=(0,r.useState)(1),[h,m]=(0,r.useState)(0),[p,x]=(0,r.useState)(!0),[g,y]=(0,r.useState)(!1),[v,b]=(0,r.useState)(!1),[w,S]=(0,r.useState)(1),[A,M]=(0,r.useState)(!0),[E,N]=(0,r.useState)(0),C=(0,r.useRef)(null),[L,P]=(0,r.useState)({phase:"Transcription",step:"DNA in Nucleus",codonBeingRead:"AUG",aminoAcidAdded:"Met",proteinLength:0,description:"DNA double helix in nucleus with RNA Polymerase",nucleotidesTranscribed:0});(0,r.useEffect)(()=>(v&&c&&(C.current=setTimeout(()=>{E<5?N(E+1):b(!1)},5500/u)),()=>{C.current&&clearTimeout(C.current)}),[v,E,c,u]);let U=(0,r.useCallback)(()=>{d(e=>!e)},[]),_=(0,r.useCallback)(()=>{m(e=>e+1),S(1),M(!0),N(0),b(!1),P({phase:"Transcription",step:"DNA in Nucleus",codonBeingRead:"AUG",aminoAcidAdded:"Met",proteinLength:0,description:"DNA double helix in nucleus with RNA Polymerase",nucleotidesTranscribed:0})},[]),R=(0,r.useCallback)(e=>{f(e)},[]),z=(0,r.useCallback)(e=>{P(e)},[]),T=(0,r.useMemo)(()=>(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(l.ControlGroup,{title:"Simulation Control",children:[(0,t.jsx)(l.ControlSlider,{label:"Speed",value:w,min:.1,max:3,step:.1,onChange:S}),(0,t.jsxs)("div",{className:"mt-3 space-y-2",children:[(0,t.jsx)("label",{className:"text-xs text-gray-400 block mb-2",children:"Protein Synthesis Phase"}),["DNA in Nucleus","mRNA Synthesis","mRNA Processing & Export","Translation Initiation","Elongation","Termination & Folding"].map((e,r)=>(0,t.jsxs)("button",{onClick:()=>N(r),className:`w-full px-3 py-2 rounded text-sm transition-colors ${E===r?"bg-[#8b5cf6] text-white font-medium":"bg-gray-800 text-gray-300 hover:bg-gray-700"}`,children:[r+1,". ",e]},e))]}),(0,t.jsx)("button",{onClick:()=>b(!v),className:`w-full mt-3 px-3 py-2 rounded text-sm font-medium transition-colors ${v?"bg-green-600 text-white":"bg-gray-700 text-gray-300 hover:bg-gray-600"}`,children:v?"⏸ Auto Playing":"▶ Auto Play Steps"})]}),(0,t.jsx)(l.ControlGroup,{title:"Display Options",children:(0,t.jsx)("div",{className:"space-y-2",children:(0,t.jsxs)("label",{className:"flex items-center gap-2 text-sm",children:[(0,t.jsx)("input",{type:"checkbox",checked:A,onChange:e=>M(e.target.checked),className:"w-4 h-4 accent-[#8b5cf6]"}),(0,t.jsx)("span",{className:"text-gray-300",children:"Show Labels"})]})})}),(0,t.jsx)("button",{onClick:()=>e.push("/experiments/protein-synthesis/details"),className:"w-full mt-4 px-4 py-2 bg-[#8b5cf6]/20 hover:bg-[#8b5cf6]/30 text-[#8b5cf6] rounded-lg border border-[#8b5cf6]/50 transition-colors text-sm font-medium",children:"View Details"})]}),[w,E,A,v,e]),B=(0,r.useMemo)(()=>(0,t.jsx)(l.DataGrid,{data:{phase:{value:0,unit:L.phase,color:"#8b5cf6",decimals:0},step:{value:0,unit:L.step,color:"#f59e0b",decimals:0},codon:{value:0,unit:L.codonBeingRead,color:"#f97316",decimals:0},aminoAcid:{value:0,unit:L.aminoAcidAdded,color:"#22c55e",decimals:0},protein:{value:L.proteinLength,unit:"AA",color:"#3b82f6",decimals:0},nucleotides:{value:L.nucleotidesTranscribed,unit:"nt",color:"#06b6d4",decimals:0},status:{value:+!!c,unit:c?"Active":"Paused",color:"#22c55e",decimals:0}},columns:2}),[L,c]),D=(0,r.useMemo)(()=>(0,t.jsx)(a.DataPanel,{isVisible:g,onToggle:()=>y(e=>!e),children:B}),[g,B]);return(0,t.jsxs)("div",{className:"w-full h-screen relative",children:[(0,t.jsx)(n.ExperimentContainer,{title:"Protein Synthesis",description:"Visualize transcription and translation - Central Dogma of Biology",cameraPosition:[0,0,14],backgroundColor:"#050510",controls:null,dataPanel:D,children:(0,t.jsx)(j,{onDataChange:z,isPlaying:c,simulationSpeed:u,resetTrigger:h,speed:w,showLabels:A,step:E})}),(0,t.jsx)(s.SimulationController,{isPlaying:c,onPlayPause:U,onReset:_,speed:u,onSpeedChange:R,timeElapsed:0}),p&&(0,t.jsx)(o.FloatingControlPanel,{initialPosition:{x:window.innerWidth-340,y:80},children:T}),!p&&(0,t.jsx)("button",{onClick:()=>x(!0),className:"fixed top-20 right-4 z-20 px-4 py-2 bg-[#8b5cf6]/20 hover:bg-[#8b5cf6]/30 text-[#8b5cf6] rounded-lg border border-[#8b5cf6]/50 transition-colors text-sm font-medium",children:"Show Controls"})]})}],56327)}]);
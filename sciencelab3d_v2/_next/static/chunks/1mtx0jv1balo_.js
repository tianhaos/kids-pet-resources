(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,i;var n=e.i(31067),r=e.i(71645),a=e.i(90072),o=e.i(48546),s=a,l=a;let c=new l.Box3,d=new l.Vector3;class u extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(i,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let n=new l.InstancedInterleavedBuffer(i,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(n,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),c.setFromBufferAttribute(t),this.boundingBox.union(c))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let r=0,a=e.count;r<a;r++)d.fromBufferAttribute(e,r),n=Math.max(n,i.distanceToSquared(d)),d.fromBufferAttribute(t,r),n=Math.max(n,i.distanceToSquared(d));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var f=a,p=e.i(8560),m=e.i(31497);class h extends f.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:f.UniformsUtils.clone(f.UniformsUtils.merge([p.UniformsLib.common,p.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new f.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let v=m.version>=125?"uv1":"uv2",y=new s.Vector4,g=new s.Vector3,x=new s.Vector3,w=new s.Vector4,b=new s.Vector4,S=new s.Vector4,C=new s.Vector3,E=new s.Matrix4,A=new s.Line3,_=new s.Vector3,L=new s.Box3,U=new s.Sphere,z=new s.Vector4;function B(e,t,n){return z.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),z.multiplyScalar(1/z.w),z.x=i/n.width,z.y=i/n.height,z.applyMatrix4(e.projectionMatrixInverse),z.multiplyScalar(1/z.w),Math.abs(Math.max(z.x,z.y))}class j extends s.Mesh{constructor(e=new u,t=new h({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let e=0,r=0,a=t.count;e<a;e++,r+=2)g.fromBufferAttribute(t,e),x.fromBufferAttribute(i,e),n[r]=0===r?0:n[r-1],n[r+1]=n[r]+g.distanceTo(x);let r=new s.InstancedInterleavedBuffer(n,2,1);return e.setAttribute("instanceDistanceStart",new s.InterleavedBufferAttribute(r,1,0)),e.setAttribute("instanceDistanceEnd",new s.InterleavedBufferAttribute(r,1,1)),this}raycast(e,n){let r,a,o=this.material.worldUnits,l=e.camera;null!==l||o||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let d=this.matrixWorld,u=this.geometry,f=this.material;if(i=f.linewidth+c,null===u.boundingSphere&&u.computeBoundingSphere(),U.copy(u.boundingSphere).applyMatrix4(d),o)r=.5*i;else{let e=Math.max(l.near,U.distanceToPoint(t.origin));r=B(l,e,f.resolution)}if(U.radius+=r,!1!==t.intersectsSphere(U)){if(null===u.boundingBox&&u.computeBoundingBox(),L.copy(u.boundingBox).applyMatrix4(d),o)a=.5*i;else{let e=Math.max(l.near,L.distanceToPoint(t.origin));a=B(l,e,f.resolution)}L.expandByScalar(a),!1!==t.intersectsBox(L)&&(o?function(e,n){let r=e.matrixWorld,a=e.geometry,o=a.attributes.instanceStart,l=a.attributes.instanceEnd,c=Math.min(a.instanceCount,o.count);for(let a=0;a<c;a++){A.start.fromBufferAttribute(o,a),A.end.fromBufferAttribute(l,a),A.applyMatrix4(r);let c=new s.Vector3,d=new s.Vector3;t.distanceSqToSegment(A.start,A.end,d,c),d.distanceTo(c)<.5*i&&n.push({point:d,pointOnLine:c,distance:t.origin.distanceTo(d),object:e,face:null,faceIndex:a,uv:null,[v]:null})}}(this,n):function(e,n,r){let a=n.projectionMatrix,o=e.material.resolution,l=e.matrixWorld,c=e.geometry,d=c.attributes.instanceStart,u=c.attributes.instanceEnd,f=Math.min(c.instanceCount,d.count),p=-n.near;t.at(1,S),S.w=1,S.applyMatrix4(n.matrixWorldInverse),S.applyMatrix4(a),S.multiplyScalar(1/S.w),S.x*=o.x/2,S.y*=o.y/2,S.z=0,C.copy(S),E.multiplyMatrices(n.matrixWorldInverse,l);for(let n=0;n<f;n++){if(w.fromBufferAttribute(d,n),b.fromBufferAttribute(u,n),w.w=1,b.w=1,w.applyMatrix4(E),b.applyMatrix4(E),w.z>p&&b.z>p)continue;if(w.z>p){let e=w.z-b.z,t=(w.z-p)/e;w.lerp(b,t)}else if(b.z>p){let e=b.z-w.z,t=(b.z-p)/e;b.lerp(w,t)}w.applyMatrix4(a),b.applyMatrix4(a),w.multiplyScalar(1/w.w),b.multiplyScalar(1/b.w),w.x*=o.x/2,w.y*=o.y/2,b.x*=o.x/2,b.y*=o.y/2,A.start.copy(w),A.start.z=0,A.end.copy(b),A.end.z=0;let c=A.closestPointToPointParameter(C,!0);A.at(c,_);let f=s.MathUtils.lerp(w.z,b.z,c),m=f>=-1&&f<=1,h=C.distanceTo(_)<.5*i;if(m&&h){A.start.fromBufferAttribute(d,n),A.end.fromBufferAttribute(u,n),A.start.applyMatrix4(l),A.end.applyMatrix4(l);let i=new s.Vector3,a=new s.Vector3;t.distanceSqToSegment(A.start,A.end,a,i),r.push({point:a,pointOnLine:i,distance:t.origin.distanceTo(a),object:e,face:null,faceIndex:n,uv:null,[v]:null})}}}(this,l,n))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(y),this.material.uniforms.resolution.value.set(y.z,y.w))}}class M extends u{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,n=new Float32Array(2*i);if(3===t)for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];else for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5],n[2*r+6]=e[r+6],n[2*r+7]=e[r+7];return super.setColors(n,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class P extends j{constructor(e=new M,t=new h({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let O=r.forwardRef(function({points:e,color:t=0xffffff,vertexColors:i,linewidth:s,lineWidth:l,segments:c,dashed:d,...f},p){var m,v;let y=(0,o.useThree)(e=>e.size),g=r.useMemo(()=>c?new j:new P,[c]),[x]=r.useState(()=>new h),w=(null==i||null==(m=i[0])?void 0:m.length)===4?4:3,b=r.useMemo(()=>{let n=c?new u:new M,r=e.map(e=>{let t=Array.isArray(e);return e instanceof a.Vector3||e instanceof a.Vector4?[e.x,e.y,e.z]:e instanceof a.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(n.setPositions(r.flat()),i){t=0xffffff;let e=i.map(e=>e instanceof a.Color?e.toArray():e);n.setColors(e.flat(),w)}return n},[e,c,i,w]);return r.useLayoutEffect(()=>{g.computeLineDistances()},[e,g]),r.useLayoutEffect(()=>{d?x.defines.USE_DASH="":delete x.defines.USE_DASH,x.needsUpdate=!0},[d,x]),r.useEffect(()=>()=>{b.dispose(),x.dispose()},[b]),r.createElement("primitive",(0,n.default)({object:g,ref:p},f),r.createElement("primitive",{object:b,attach:"geometry"}),r.createElement("primitive",(0,n.default)({object:x,attach:"material",color:t,vertexColors:!!i,resolution:[y.width,y.height],linewidth:null!=(v=null!=s?s:l)?v:1,dashed:d,transparent:4===w},f)))});e.s(["Line",0,O],43216)},56420,e=>{"use strict";var t=e.i(71645);let i=(...e)=>e.filter((e,t,i)=>!!e&&""!==e.trim()&&i.indexOf(e)===t).join(" ").trim(),n=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,i)=>i?i.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let a=(0,t.createContext)({}),o=(0,t.forwardRef)(({color:e,size:n,strokeWidth:o,absoluteStrokeWidth:s,className:l="",children:c,iconNode:d,...u},f)=>{let{size:p=24,strokeWidth:m=2,absoluteStrokeWidth:h=!1,color:v="currentColor",className:y=""}=(0,t.useContext)(a)??{},g=s??h?24*Number(o??m)/Number(n??p):o??m;return(0,t.createElement)("svg",{ref:f,...r,width:n??p??r.width,height:n??p??r.height,stroke:e??v,strokeWidth:g,className:i("lucide",y,l),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,i])=>(0,t.createElement)(e,i)),...Array.isArray(c)?c:[c]])});e.s(["default",0,(e,r)=>{let a=(0,t.forwardRef)(({className:a,...s},l)=>(0,t.createElement)(o,{ref:l,iconNode:r,className:i(`lucide-${n(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,a),...s}));return a.displayName=n(e),a}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,i)=>{t.exports=e.r(76562)},79465,e=>{"use strict";var t=e.i(43476),i=e.i(71645),n=e.i(92989),r=e.i(94800),a=e.i(43216),o=e.i(90072);function s({latticeType:e,showUnitCell:n,showBonds:l,isPlaying:c,onDataChange:d}){let u=(0,i.useRef)(null),f=(0,i.useRef)(0),p=(0,i.useRef)(0),[m,h]=(0,i.useState)({latticeType:"FCC",unitCells:8,atomsPerCell:4,coordinationNumber:12,packingEfficiency:.74,totalAtoms:32}),v={FCC:{atomsPerCell:4,coordinationNumber:12,packingEfficiency:.74},BCC:{atomsPerCell:2,coordinationNumber:8,packingEfficiency:.68},HCP:{atomsPerCell:6,coordinationNumber:12,packingEfficiency:.74},diamond:{atomsPerCell:8,coordinationNumber:4,packingEfficiency:.34}},y=(0,i.useMemo)(()=>(()=>{let t=[];if("FCC"===e)for(let e=0;e<2;e++)for(let i=0;i<2;i++)for(let n=0;n<2;n++)t.push(new o.Vector3(2*e,2*i,2*n)),t.push(new o.Vector3(2*e+1,2*i+1,2*n)),t.push(new o.Vector3(2*e+1,2*i,2*n+1)),t.push(new o.Vector3(2*e,2*i+1,2*n+1));else if("BCC"===e)for(let e=0;e<2;e++)for(let i=0;i<2;i++)for(let n=0;n<2;n++)t.push(new o.Vector3(2*e,2*i,2*n)),t.push(new o.Vector3(2*e+1,2*i+1,2*n+1));else if("HCP"===e)for(let e=0;e<3;e++){let i=+(e%2!=0);for(let n=-1;n<=1;n++)for(let r=-1;r<=1;r++)t.push(new o.Vector3((n+i)*2,2*e*.8,2*r*.866))}else if("diamond"===e)for(let e=0;e<2;e++)for(let i=0;i<2;i++)for(let n=0;n<2;n++)t.push(new o.Vector3(2*e,2*i,2*n)),t.push(new o.Vector3(2*e+1,2*i+1,2*n)),t.push(new o.Vector3(2*e+1,2*i,2*n+1)),t.push(new o.Vector3(2*e,2*i+1,2*n+1)),t.push(new o.Vector3(2*e+.5,2*i+.5,2*n+.5)),t.push(new o.Vector3(2*e+1.5,2*i+1.5,2*n+.5)),t.push(new o.Vector3(2*e+1.5,2*i+.5,2*n+1.5)),t.push(new o.Vector3(2*e+.5,2*i+1.5,2*n+1.5));return t})(),[e]),g=(0,i.useMemo)(()=>{if(!l)return[];let t=[],i="diamond"===e?1.8:1.5;for(let e=0;e<y.length;e++)for(let n=e+1;n<y.length;n++){let r=y[e].distanceTo(y[n]);r<i&&r>.1&&t.push({start:[y[e].x,y[e].y,y[e].z],end:[y[n].x,y[n].y,y[n].z]})}return t},[y,e,l]),x=(0,i.useMemo)(()=>{if(!n)return[];let e=[];return[[[0,0,0],[2,0,0]],[[2,0,0],[2,2,0]],[[2,2,0],[0,2,0]],[[0,2,0],[0,0,0]],[[0,0,2],[2,0,2]],[[2,0,2],[2,2,2]],[[2,2,2],[0,2,2]],[[0,2,2],[0,0,2]],[[0,0,0],[0,0,2]],[[2,0,0],[2,0,2]],[[2,2,0],[2,2,2]],[[0,2,0],[0,2,2]]].forEach(t=>{e.push({points:[t[0],t[1]]})}),e},[n]),w=(0,i.useMemo)(()=>{let e=new o.Vector3;return y.forEach(t=>e.add(t)),e.divideScalar(y.length),e.negate()},[y]);(0,r.useFrame)((t,i)=>{if(u.current&&(c&&(p.current+=.15*i,u.current.rotation.y=p.current,u.current.rotation.x=.05*Math.sin(.3*p.current)),f.current++,f.current%8==0)){let t={latticeType:e,unitCells:8,atomsPerCell:v[e].atomsPerCell,coordinationNumber:v[e].coordinationNumber,packingEfficiency:v[e].packingEfficiency,totalAtoms:y.length};h(t),d?.(t)}});let b=e=>{let t=["#a855f7","#ec4899","#8b5cf6","#d946ef"];return t[e%t.length]};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("group",{ref:u,position:[w.x,w.y,w.z],children:[x.map((e,i)=>(0,t.jsx)(a.Line,{points:e.points,color:"#a855f7",lineWidth:2,opacity:.6,transparent:!0},`unit-cell-${i}`)),n&&[[0,0,0],[2,0,0],[2,2,0],[0,2,0],[0,0,2],[2,0,2],[2,2,2],[0,2,2]].map((e,i)=>(0,t.jsxs)("mesh",{position:e,children:[(0,t.jsx)("sphereGeometry",{args:[.08,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#ec4899",emissive:"#ec4899",emissiveIntensity:.5})]},`corner-${i}`)),g.map((e,i)=>(0,t.jsx)(a.Line,{points:[e.start,e.end],color:"#a855f7",lineWidth:3,opacity:.4,transparent:!0},`bond-${i}`)),y.map((e,i)=>(0,t.jsxs)("mesh",{position:e,castShadow:!0,children:[(0,t.jsx)("sphereGeometry",{args:[.25,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:b(i),emissive:b(i),emissiveIntensity:.3,metalness:.5,roughness:.3})]},i))]}),(0,t.jsx)("gridHelper",{args:[12,24,"#1a1a3e","#1a1a3e"],position:[0,-3,0]})]})}e.i(81413);var l=e.i(48205),c=e.i(82192),d=e.i(68647),u=e.i(14228),f=e.i(4685);e.s(["default",0,function(){let e=(0,n.useRouter)(),[r,a]=(0,i.useState)(null),[o,p]=(0,i.useState)(!0),[m,h]=(0,i.useState)(!0),[v,y]=(0,i.useState)(1),[g,x]=(0,i.useState)(0),[w,b]=(0,i.useState)("FCC"),[S,C]=(0,i.useState)(!0),[E,A]=(0,i.useState)(!0),_={FCC:{name:"Face-Centered Cubic",examples:"Al, Cu, Au, Ag"},BCC:{name:"Body-Centered Cubic",examples:"Fe, Cr, W, Na"},HCP:{name:"Hexagonal Close-Packed",examples:"Mg, Zn, Ti, Co"},diamond:{name:"Diamond Cubic",examples:"C (diamond), Si, Ge"}},L=(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)(d.ControlGroup,{title:"Crystal Structure",children:[(0,t.jsx)("div",{className:"grid grid-cols-2 gap-2",children:["FCC","BCC","HCP","diamond"].map(e=>(0,t.jsx)("button",{onClick:()=>b(e),className:`py-2 px-2 text-xs rounded-lg font-medium transition-all ${w===e?"bg-purple-600 text-white":"bg-gray-200/50 text-gray-700 hover:bg-gray-300/50"}`,children:e},e))}),(0,t.jsxs)("div",{className:"mt-2 p-2 bg-purple-50/50 rounded-lg border border-purple-200/50",children:[(0,t.jsx)("div",{className:"text-xs font-medium text-purple-700",children:_[w].name}),(0,t.jsx)("div",{className:"text-xs text-purple-600 mt-1",children:_[w].examples})]})]}),(0,t.jsx)(d.ControlGroup,{title:"Display Options",children:[{label:"Unit Cell Wireframe",checked:S,onChange:C},{label:"Atomic Bonds",checked:E,onChange:A}].map(e=>(0,t.jsxs)("label",{className:"flex items-center justify-between text-sm text-gray-700 cursor-pointer py-2 px-3 bg-gray-100/50 rounded-lg border border-gray-300/50",children:[(0,t.jsx)("span",{children:e.label}),(0,t.jsx)("input",{type:"checkbox",checked:e.checked,onChange:t=>e.onChange(t.target.checked),className:"w-4 h-4 rounded accent-purple-500"})]},e.label))}),(0,t.jsx)("button",{onClick:()=>e.push("/experiments/crystal-lattice/details"),className:"w-full py-2.5 bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-700 font-medium text-sm rounded-lg transition-all border border-purple-300/50 flex items-center justify-center gap-2",children:"📖 View Experiment Details"})]}),U=r?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(d.DataGrid,{data:{totalAtoms:{value:r.totalAtoms,unit:"atoms",color:"#a855f7",decimals:0},atomsPerCell:{value:r.atomsPerCell,unit:"atoms/cell",color:"#ec4899",decimals:0},coordinationNumber:{value:r.coordinationNumber,unit:"",color:"#8b5cf6",decimals:0},packingEfficiency:{value:100*r.packingEfficiency,unit:"%",color:"#22c55e",decimals:0}},columns:2}),(0,t.jsxs)("div",{className:"mt-3 p-3 bg-gray-800/50 rounded-lg",children:[(0,t.jsx)("div",{className:"text-xs text-gray-400 mb-1",children:"Structure Type"}),(0,t.jsx)("div",{className:"text-purple-400 text-sm font-medium",children:_[r.latticeType].name})]})]}):(0,t.jsx)("div",{className:"text-center text-gray-500 text-sm py-8",children:"Waiting for simulation data..."});return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(l.ExperimentContainer,{title:"Crystal Lattice",description:"Explore the atomic arrangement in crystalline solids",cameraPosition:[10,8,10],backgroundColor:"#050510",controls:null,dataPanel:null,children:(0,t.jsx)(s,{onDataChange:a,latticeType:w,showUnitCell:S,showBonds:E,isPlaying:m})}),(0,t.jsx)(u.SimulationController,{isPlaying:m,onPlayPause:()=>h(e=>!e),onReset:()=>{x(e=>e+1),h(!0),y(1)},speed:v,onSpeedChange:y}),(0,t.jsx)(c.FloatingControlPanel,{title:"⚙️ Lattice Parameters",initialPosition:{x:20,y:80},children:L}),(0,t.jsx)(f.DataPanel,{isVisible:o,onToggle:()=>p(!o),children:U})]})}],79465)}]);
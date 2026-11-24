(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,r;var n=e.i(31067),i=e.i(71645),o=e.i(90072),a=e.i(48546),s=o,l=o;let c=new l.Box3,d=new l.Vector3;class u extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,r=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),r.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let r=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(r,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(r,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let r;e instanceof Float32Array?r=e:Array.isArray(e)&&(r=new Float32Array(e));let n=new l.InstancedInterleavedBuffer(r,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(n,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),c.setFromBufferAttribute(t),this.boundingBox.union(c))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let r=this.boundingSphere.center;this.boundingBox.getCenter(r);let n=0;for(let i=0,o=e.count;i<o;i++)d.fromBufferAttribute(e,i),n=Math.max(n,r.distanceToSquared(d)),d.fromBufferAttribute(t,i),n=Math.max(n,r.distanceToSquared(d));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var h=o,f=e.i(8560),p=e.i(31497);class m extends h.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:h.UniformsUtils.clone(h.UniformsUtils.merge([f.UniformsLib.common,f.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new h.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let x=p.version>=125?"uv1":"uv2",g=new s.Vector4,v=new s.Vector3,y=new s.Vector3,b=new s.Vector4,w=new s.Vector4,S=new s.Vector4,M=new s.Vector3,C=new s.Matrix4,P=new s.Line3,E=new s.Vector3,j=new s.Box3,A=new s.Sphere,L=new s.Vector4;function _(e,t,n){return L.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),L.multiplyScalar(1/L.w),L.x=r/n.width,L.y=r/n.height,L.applyMatrix4(e.projectionMatrixInverse),L.multiplyScalar(1/L.w),Math.abs(Math.max(L.x,L.y))}class R extends s.Mesh{constructor(e=new u,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,r=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let e=0,i=0,o=t.count;e<o;e++,i+=2)v.fromBufferAttribute(t,e),y.fromBufferAttribute(r,e),n[i]=0===i?0:n[i-1],n[i+1]=n[i]+v.distanceTo(y);let i=new s.InstancedInterleavedBuffer(n,2,1);return e.setAttribute("instanceDistanceStart",new s.InterleavedBufferAttribute(i,1,0)),e.setAttribute("instanceDistanceEnd",new s.InterleavedBufferAttribute(i,1,1)),this}raycast(e,n){let i,o,a=this.material.worldUnits,l=e.camera;null!==l||a||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let d=this.matrixWorld,u=this.geometry,h=this.material;if(r=h.linewidth+c,null===u.boundingSphere&&u.computeBoundingSphere(),A.copy(u.boundingSphere).applyMatrix4(d),a)i=.5*r;else{let e=Math.max(l.near,A.distanceToPoint(t.origin));i=_(l,e,h.resolution)}if(A.radius+=i,!1!==t.intersectsSphere(A)){if(null===u.boundingBox&&u.computeBoundingBox(),j.copy(u.boundingBox).applyMatrix4(d),a)o=.5*r;else{let e=Math.max(l.near,j.distanceToPoint(t.origin));o=_(l,e,h.resolution)}j.expandByScalar(o),!1!==t.intersectsBox(j)&&(a?function(e,n){let i=e.matrixWorld,o=e.geometry,a=o.attributes.instanceStart,l=o.attributes.instanceEnd,c=Math.min(o.instanceCount,a.count);for(let o=0;o<c;o++){P.start.fromBufferAttribute(a,o),P.end.fromBufferAttribute(l,o),P.applyMatrix4(i);let c=new s.Vector3,d=new s.Vector3;t.distanceSqToSegment(P.start,P.end,d,c),d.distanceTo(c)<.5*r&&n.push({point:d,pointOnLine:c,distance:t.origin.distanceTo(d),object:e,face:null,faceIndex:o,uv:null,[x]:null})}}(this,n):function(e,n,i){let o=n.projectionMatrix,a=e.material.resolution,l=e.matrixWorld,c=e.geometry,d=c.attributes.instanceStart,u=c.attributes.instanceEnd,h=Math.min(c.instanceCount,d.count),f=-n.near;t.at(1,S),S.w=1,S.applyMatrix4(n.matrixWorldInverse),S.applyMatrix4(o),S.multiplyScalar(1/S.w),S.x*=a.x/2,S.y*=a.y/2,S.z=0,M.copy(S),C.multiplyMatrices(n.matrixWorldInverse,l);for(let n=0;n<h;n++){if(b.fromBufferAttribute(d,n),w.fromBufferAttribute(u,n),b.w=1,w.w=1,b.applyMatrix4(C),w.applyMatrix4(C),b.z>f&&w.z>f)continue;if(b.z>f){let e=b.z-w.z,t=(b.z-f)/e;b.lerp(w,t)}else if(w.z>f){let e=w.z-b.z,t=(w.z-f)/e;w.lerp(b,t)}b.applyMatrix4(o),w.applyMatrix4(o),b.multiplyScalar(1/b.w),w.multiplyScalar(1/w.w),b.x*=a.x/2,b.y*=a.y/2,w.x*=a.x/2,w.y*=a.y/2,P.start.copy(b),P.start.z=0,P.end.copy(w),P.end.z=0;let c=P.closestPointToPointParameter(M,!0);P.at(c,E);let h=s.MathUtils.lerp(b.z,w.z,c),p=h>=-1&&h<=1,m=M.distanceTo(E)<.5*r;if(p&&m){P.start.fromBufferAttribute(d,n),P.end.fromBufferAttribute(u,n),P.start.applyMatrix4(l),P.end.applyMatrix4(l);let r=new s.Vector3,o=new s.Vector3;t.distanceSqToSegment(P.start,P.end,o,r),i.push({point:o,pointOnLine:r,distance:t.origin.distanceTo(o),object:e,face:null,faceIndex:n,uv:null,[x]:null})}}}(this,l,n))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(g),this.material.uniforms.resolution.value.set(g.z,g.w))}}class O extends u{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,r=new Float32Array(2*t);for(let n=0;n<t;n+=3)r[2*n]=e[n],r[2*n+1]=e[n+1],r[2*n+2]=e[n+2],r[2*n+3]=e[n+3],r[2*n+4]=e[n+4],r[2*n+5]=e[n+5];return super.setPositions(r),this}setColors(e,t=3){let r=e.length-t,n=new Float32Array(2*r);if(3===t)for(let i=0;i<r;i+=t)n[2*i]=e[i],n[2*i+1]=e[i+1],n[2*i+2]=e[i+2],n[2*i+3]=e[i+3],n[2*i+4]=e[i+4],n[2*i+5]=e[i+5];else for(let i=0;i<r;i+=t)n[2*i]=e[i],n[2*i+1]=e[i+1],n[2*i+2]=e[i+2],n[2*i+3]=e[i+3],n[2*i+4]=e[i+4],n[2*i+5]=e[i+5],n[2*i+6]=e[i+6],n[2*i+7]=e[i+7];return super.setColors(n,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class z extends R{constructor(e=new O,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let U=i.forwardRef(function({points:e,color:t=0xffffff,vertexColors:r,linewidth:s,lineWidth:l,segments:c,dashed:d,...h},f){var p,x;let g=(0,a.useThree)(e=>e.size),v=i.useMemo(()=>c?new R:new z,[c]),[y]=i.useState(()=>new m),b=(null==r||null==(p=r[0])?void 0:p.length)===4?4:3,w=i.useMemo(()=>{let n=c?new u:new O,i=e.map(e=>{let t=Array.isArray(e);return e instanceof o.Vector3||e instanceof o.Vector4?[e.x,e.y,e.z]:e instanceof o.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(n.setPositions(i.flat()),r){t=0xffffff;let e=r.map(e=>e instanceof o.Color?e.toArray():e);n.setColors(e.flat(),b)}return n},[e,c,r,b]);return i.useLayoutEffect(()=>{v.computeLineDistances()},[e,v]),i.useLayoutEffect(()=>{d?y.defines.USE_DASH="":delete y.defines.USE_DASH,y.needsUpdate=!0},[d,y]),i.useEffect(()=>()=>{w.dispose(),y.dispose()},[w]),i.createElement("primitive",(0,n.default)({object:v,ref:f},h),i.createElement("primitive",{object:w,attach:"geometry"}),i.createElement("primitive",(0,n.default)({object:y,attach:"material",color:t,vertexColors:!!r,resolution:[g.width,g.height],linewidth:null!=(x=null!=s?s:l)?x:1,dashed:d,transparent:4===b},h)))});e.s(["Line",0,U],43216)},60099,e=>{"use strict";let t,r;var n=e.i(31067),i=e.i(71645),o=e.i(88014),a=e.i(90072),s=e.i(48546),l=e.i(94800);let c=new a.Vector3,d=new a.Vector3,u=new a.Vector3,h=new a.Vector2;function f(e,t,r){let n=c.setFromMatrixPosition(e.matrixWorld);n.project(t);let i=r.width/2,o=r.height/2;return[n.x*i+i,-(n.y*o)+o]}let p=e=>1e-10>Math.abs(e)?0:e;function m(e,t,r=""){let n="matrix3d(";for(let r=0;16!==r;r++)n+=p(t[r]*e.elements[r])+(15!==r?",":")");return r+n}let x=(t=[1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1],e=>m(e,t)),g=(r=e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1],(e,t)=>m(e,r(t),"translate(-50%,-50%)")),v=i.forwardRef(({children:e,eps:t=.001,style:r,className:m,prepend:v,center:y,fullscreen:b,portal:w,distanceFactor:S,sprite:M=!1,transform:C=!1,occlude:P,onOcclude:E,castShadow:j,receiveShadow:A,material:L,geometry:_,zIndexRange:R=[0x1000037,0],calculatePosition:O=f,as:z="div",wrapperClass:U,pointerEvents:B="auto",...D},H)=>{let{gl:N,camera:I,scene:T,size:V,raycaster:W,events:F,viewport:G}=(0,s.useThree)(),[k]=i.useState(()=>document.createElement(z)),$=i.useRef(null),q=i.useRef(null),Z=i.useRef(0),K=i.useRef([0,0]),J=i.useRef(null),X=i.useRef(null),Q=(null==w?void 0:w.current)||F.connected||N.domElement.parentNode,Y=i.useRef(null),ee=i.useRef(!1),et=i.useMemo(()=>{var e;return P&&"blending"!==P||Array.isArray(P)&&P.length&&(e=P[0])&&"object"==typeof e&&"current"in e},[P]);i.useLayoutEffect(()=>{let e=N.domElement;P&&"blending"===P?(e.style.zIndex=`${Math.floor(R[0]/2)}`,e.style.position="absolute",e.style.pointerEvents="none"):(e.style.zIndex=null,e.style.position=null,e.style.pointerEvents=null)},[P]),i.useLayoutEffect(()=>{if(q.current){let e=$.current=o.createRoot(k);if(T.updateMatrixWorld(),C)k.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";else{let e=O(q.current,I,V);k.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${e[0]}px,${e[1]}px,0);transform-origin:0 0;`}return Q&&(v?Q.prepend(k):Q.appendChild(k)),()=>{Q&&Q.removeChild(k),e.unmount()}}},[Q,C]),i.useLayoutEffect(()=>{U&&(k.className=U)},[U]);let er=i.useMemo(()=>C?{position:"absolute",top:0,left:0,width:V.width,height:V.height,transformStyle:"preserve-3d",pointerEvents:"none"}:{position:"absolute",transform:y?"translate3d(-50%,-50%,0)":"none",...b&&{top:-V.height/2,left:-V.width/2,width:V.width,height:V.height},...r},[r,y,b,V,C]),en=i.useMemo(()=>({position:"absolute",pointerEvents:B}),[B]);i.useLayoutEffect(()=>{var t,n;ee.current=!1,C?null==(t=$.current)||t.render(i.createElement("div",{ref:J,style:er},i.createElement("div",{ref:X,style:en},i.createElement("div",{ref:H,className:m,style:r,children:e})))):null==(n=$.current)||n.render(i.createElement("div",{ref:H,style:er,className:m,children:e}))});let ei=i.useRef(!0);(0,l.useFrame)(e=>{if(q.current){I.updateMatrixWorld(),q.current.updateWorldMatrix(!0,!1);let e=C?K.current:O(q.current,I,V);if(C||Math.abs(Z.current-I.zoom)>t||Math.abs(K.current[0]-e[0])>t||Math.abs(K.current[1]-e[1])>t){var r;let t,n,i,o,s=(r=q.current,t=c.setFromMatrixPosition(r.matrixWorld),n=d.setFromMatrixPosition(I.matrixWorld),i=t.sub(n),o=I.getWorldDirection(u),i.angleTo(o)>Math.PI/2),l=!1;et&&(Array.isArray(P)?l=P.map(e=>e.current):"blending"!==P&&(l=[T]));let f=ei.current;l?ei.current=function(e,t,r,n){let i=c.setFromMatrixPosition(e.matrixWorld),o=i.clone();o.project(t),h.set(o.x,o.y),r.setFromCamera(h,t);let a=r.intersectObjects(n,!0);if(a.length){let e=a[0].distance;return i.distanceTo(r.ray.origin)<e}return!0}(q.current,I,W,l)&&!s:ei.current=!s,f!==ei.current&&(E?E(!ei.current):k.style.display=ei.current?"block":"none");let m=Math.floor(R[0]/2),v=P?et?[R[0],m]:[m-1,0]:R;if(k.style.zIndex=`${function(e,t,r){if(t instanceof a.PerspectiveCamera||t instanceof a.OrthographicCamera){let n=c.setFromMatrixPosition(e.matrixWorld),i=d.setFromMatrixPosition(t.matrixWorld),o=n.distanceTo(i),a=(r[1]-r[0])/(t.far-t.near),s=r[1]-a*t.far;return Math.round(a*o+s)}}(q.current,I,v)}`,C){let[e,t]=[V.width/2,V.height/2],r=I.projectionMatrix.elements[5]*t,{isOrthographicCamera:n,top:i,left:o,bottom:a,right:s}=I,l=x(I.matrixWorldInverse),c=n?`scale(${r})translate(${p(-(s+o)/2)}px,${p((i+a)/2)}px)`:`translateZ(${r}px)`,d=q.current.matrixWorld;M&&((d=I.matrixWorldInverse.clone().transpose().copyPosition(d).scale(q.current.scale)).elements[3]=d.elements[7]=d.elements[11]=0,d.elements[15]=1),k.style.width=V.width+"px",k.style.height=V.height+"px",k.style.perspective=n?"":`${r}px`,J.current&&X.current&&(J.current.style.transform=`${c}${l}translate(${e}px,${t}px)`,X.current.style.transform=g(d,1/((S||10)/400)))}else{let t=void 0===S?1:function(e,t){if(t instanceof a.OrthographicCamera)return t.zoom;if(!(t instanceof a.PerspectiveCamera))return 1;{let r=c.setFromMatrixPosition(e.matrixWorld),n=d.setFromMatrixPosition(t.matrixWorld);return 1/(2*Math.tan(t.fov*Math.PI/180/2)*r.distanceTo(n))}}(q.current,I)*S;k.style.transform=`translate3d(${e[0]}px,${e[1]}px,0) scale(${t})`}K.current=e,Z.current=I.zoom}}if(!et&&Y.current&&!ee.current)if(C){if(J.current){let e=J.current.children[0];if(null!=e&&e.clientWidth&&null!=e&&e.clientHeight){let{isOrthographicCamera:t}=I;if(t||_)D.scale&&(Array.isArray(D.scale)?D.scale instanceof a.Vector3?Y.current.scale.copy(D.scale.clone().divideScalar(1)):Y.current.scale.set(1/D.scale[0],1/D.scale[1],1/D.scale[2]):Y.current.scale.setScalar(1/D.scale));else{let t=(S||10)/400,r=e.clientWidth*t,n=e.clientHeight*t;Y.current.scale.set(r,n,1)}ee.current=!0}}}else{let t=k.children[0];if(null!=t&&t.clientWidth&&null!=t&&t.clientHeight){let e=1/G.factor,r=t.clientWidth*e,n=t.clientHeight*e;Y.current.scale.set(r,n,1),ee.current=!0}Y.current.lookAt(e.camera.position)}});let eo=i.useMemo(()=>({vertexShader:C?void 0:`
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
      `}),[C]);return i.createElement("group",(0,n.default)({},D,{ref:q}),P&&!et&&i.createElement("mesh",{castShadow:j,receiveShadow:A,ref:Y},_||i.createElement("planeGeometry",null),L||i.createElement("shaderMaterial",{side:a.DoubleSide,vertexShader:eo.vertexShader,fragmentShader:eo.fragmentShader})))});e.s(["Html",0,v])},56420,e=>{"use strict";var t=e.i(71645);let r=(...e)=>e.filter((e,t,r)=>!!e&&""!==e.trim()&&r.indexOf(e)===t).join(" ").trim(),n=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,r)=>r?r.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var i={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let o=(0,t.createContext)({}),a=(0,t.forwardRef)(({color:e,size:n,strokeWidth:a,absoluteStrokeWidth:s,className:l="",children:c,iconNode:d,...u},h)=>{let{size:f=24,strokeWidth:p=2,absoluteStrokeWidth:m=!1,color:x="currentColor",className:g=""}=(0,t.useContext)(o)??{},v=s??m?24*Number(a??p)/Number(n??f):a??p;return(0,t.createElement)("svg",{ref:h,...i,width:n??f??i.width,height:n??f??i.height,stroke:e??x,strokeWidth:v,className:r("lucide",g,l),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,r])=>(0,t.createElement)(e,r)),...Array.isArray(c)?c:[c]])});e.s(["default",0,(e,i)=>{let o=(0,t.forwardRef)(({className:o,...s},l)=>(0,t.createElement)(a,{ref:l,iconNode:i,className:r(`lucide-${n(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,o),...s}));return o.displayName=n(e),o}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,r)=>{t.exports=e.r(76562)},32091,e=>{"use strict";var t=e.i(43476),r=e.i(71645),n=e.i(92989),i=e.i(94800),o=e.i(43216),a=e.i(60099),s=e.i(90072);let l=["Step 1: Sunlight (photons) hits chloroplast. Water (H₂O) molecules enter from below.","Step 2: Photosystem II absorbs light, splits H₂O → O₂ + H⁺ + e⁻. Electron transport chain activates.","Step 3: ATP and NADPH produced using light energy. 2H₂O → O₂ + 4H⁺ + 4e⁻"],c=["Step 4: CO₂ enters stroma. RuBisCO enzyme fixes CO₂ to RuBP (carbon fixation).","Step 5: ATP/NADPH power conversion to G3P. Reduction phase uses energy carriers.","Step 6: G3P molecules combine to form GLUCOSE (C₆H₁₂O₆). Calvin cycle complete!"];function d({onDataChange:e,isPlaying:n=!0,simulationSpeed:u=1,resetTrigger:h=0,lightIntensity:f=1,co2Level:p=1,stepMode:m="auto",showLabels:x=!0}){let g=(0,r.useRef)(null),v=(0,r.useRef)(0),y=(0,r.useRef)(0),b=(0,r.useRef)(0),w=(0,r.useRef)(1),S=(0,r.useRef)("Light Reactions"),M=(0,r.useRef)(0),C=(0,r.useRef)(0),P=(0,r.useRef)(0),E=(0,r.useRef)(0),j=(0,r.useRef)(0),A=(0,r.useRef)(0),L=(0,r.useRef)(0),_=(0,r.useRef)(0),R=(0,r.useRef)([]),[O,z]=(0,r.useState)([]),[U,B]=(0,r.useState)({phase:"Light Reactions",step:1,stepDescription:l[0],o2Produced:0,glucoseProduced:0,atpCount:0,nadphCount:0,lightEnergy:0,co2Consumed:0,h2oConsumed:0}),D=(0,r.useMemo)(()=>{let e=[];for(let t=0;t<=60;t++){let r=t/60*Math.PI*2;e.push([5.5*Math.cos(r),4*Math.sin(r),0])}return e},[]),H=(0,r.useMemo)(()=>{let e=[];for(let t=0;t<7;t++){let r=[];for(let e=0;e<6;e++)r.push([(t-3)*1.6,(e-2.5)*.28,.4*Math.sin(.7*t)]);e.push(r)}return e},[]),N=(0,r.useMemo)(()=>{let e=[];for(let t=0;t<6;t++)e.push([(t-2.5)*1.6,-1.2,.4*Math.sin(.7*t)]);return e},[]),I=(0,r.useMemo)(()=>{let e=[];for(let t=0;t<16;t++){let r=t/16*Math.PI*2;e.push([[9*Math.cos(r),7,0],[2.5*Math.cos(r),1.5,0]])}return e},[]),T=(0,r.useMemo)(()=>{let e=[];for(let t=0;t<=30;t++){let r=t/30;e.push([(r-.5)*10,.6+.25*Math.sin(r*Math.PI*4),0])}return e},[]),V=(0,r.useMemo)(()=>{let e=[];for(let t=0;t<=20;t++){let r=t/20;e.push([3*Math.cos(r*Math.PI*2),2*r-1,.5*Math.sin(r*Math.PI*2)])}return e},[]);(0,r.useEffect)(()=>{y.current=0,b.current=0,w.current=1,S.current="Light Reactions",M.current=0,C.current=0,P.current=0,E.current=0,j.current=0,A.current=0,L.current=0,_.current=0,R.current=[],z([]),B({phase:"Light Reactions",step:1,stepDescription:l[0],o2Produced:0,glucoseProduced:0,atpCount:0,nadphCount:0,lightEnergy:0,co2Consumed:0,h2oConsumed:0})},[h]);let W=(0,r.useCallback)((e,t)=>{let r,n,i=`${e}-${Date.now()}-${Math.random()}`;switch(e){case"photon":r=new s.Vector3((Math.random()-.5)*12,8,(Math.random()-.5)*8),n=new s.Vector3((Math.random()-.5)*4,.8,(Math.random()-.5)*2);break;case"H2O":r=new s.Vector3((Math.random()-.5)*10,-5,(Math.random()-.5)*5),n=new s.Vector3((Math.random()-.5)*3,.6,(Math.random()-.5)*2);break;case"CO2":r=new s.Vector3((Math.random()-.5)*12,7,(Math.random()-.5)*7),n=new s.Vector3((Math.random()-.5)*2,-2,(Math.random()-.5)*2);break;case"O2":r=new s.Vector3((Math.random()-.5)*3,.6,(Math.random()-.5)*2),n=new s.Vector3((Math.random()-.5)*7,6,(Math.random()-.5)*5);break;case"ATP":case"NADPH":r=new s.Vector3((Math.random()-.5)*3,.6,0),n=new s.Vector3((Math.random()-.5)*1.5,-2,(Math.random()-.5)*1.5);break;case"RuBP":r=new s.Vector3((Math.random()-.5)*1.5,-2,0),n=new s.Vector3((Math.random()-.5)*.8,-2,0);break;case"G3P":r=new s.Vector3((Math.random()-.5)*1.2,-2,0),n=new s.Vector3((Math.random()-.5)*1.8,-3,(Math.random()-.5)*2);break;case"glucose":r=new s.Vector3((Math.random()-.5)*1.5,-2,0),n=new s.Vector3((Math.random()-.5)*4,-4.5,(Math.random()-.5)*4);break;default:r=new s.Vector3(0,0,0),n=new s.Vector3(0,0,0)}let o={id:i,type:e,position:r.clone(),targetPosition:n,progress:0,speed:.25+.15*Math.random(),energyLevel:"photon"===e?f:void 0};R.current.push(o)},[f]),F=(0,r.useCallback)((e,t)=>{let r=Math.max(0,e-1);return"Light Reactions"===t?l[r]||l[2]:c[r]||c[2]},[]);return(0,i.useFrame)((t,r)=>{if(v.current++,g.current&&n){y.current+=r*u,b.current+=.015*r*u,g.current.rotation.y=b.current,"auto"===m&&(M.current+=r*u,M.current>5.5/u&&(M.current=0,w.current++,"Light Reactions"===S.current&&w.current>3?(S.current="Calvin Cycle",w.current=4):"Calvin Cycle"===S.current&&w.current>6&&(S.current="Light Reactions",w.current=1)));let t=w.current,n=S.current;if("Light Reactions"===n){let e=f*u;t>=1&&(A.current=Math.min(100,A.current+r*e*8),_.current=Math.min(100,_.current+r*e*3)),t>=2&&(C.current=Math.min(100,C.current+r*e*6)),t>=3&&(E.current=Math.min(60,E.current+r*e*2.5),j.current=Math.min(60,j.current+r*e*2)),1===t&&v.current%35==0&&(.7>Math.random()&&W("photon","light"),.5>Math.random()&&W("H2O","light")),2===t&&v.current%45==0&&.6>Math.random()&&W("O2","light"),3===t&&v.current%55==0&&(E.current<40&&.5>Math.random()&&W("ATP","light"),j.current<35&&.5>Math.random()&&W("NADPH","light"))}else{let e=p*f*u;t>=4&&(E.current=Math.max(0,E.current-r*e*.6),j.current=Math.max(0,j.current-r*e*.5),L.current=Math.min(100,L.current+r*e*4)),4===t&&v.current%45==0&&(.6>Math.random()&&W("CO2","calvin"),.4>Math.random()&&W("RuBP","calvin")),5===t&&v.current%50==0&&.5>Math.random()&&W("G3P","calvin"),6===t&&(P.current=Math.min(100,P.current+r*e*3.5),v.current%70==0&&.4>Math.random()&&W("glucose","calvin"))}if(R.current=R.current.filter(e=>(e.progress+=r*e.speed*u,e.position.lerp(e.targetPosition,r*e.speed*u),e.progress<1)),v.current%8==0){let t={phase:n,step:w.current,stepDescription:F(w.current,n),o2Produced:Math.round(C.current),glucoseProduced:Math.round(P.current),atpCount:Math.round(E.current),nadphCount:Math.round(j.current),lightEnergy:Math.round(A.current),co2Consumed:Math.round(L.current),h2oConsumed:Math.round(_.current)};B(t),z([...R.current]),e?.(t)}}}),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("ambientLight",{intensity:.3}),(0,t.jsx)("directionalLight",{position:[0,12,0],intensity:2.5*f,color:"#fef08a"}),(0,t.jsx)("pointLight",{position:[0,6,0],intensity:+f,color:"#fbbf24"}),(0,t.jsx)("pointLight",{position:[0,-2.5,0],intensity:.5,color:"#22c55e"}),(0,t.jsxs)("group",{ref:g,children:[(0,t.jsx)(o.Line,{points:D,color:"#22c55e",lineWidth:3,opacity:.5,transparent:!0}),(0,t.jsxs)("mesh",{rotation:[0,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[5.5,32,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#22c55e",transparent:!0,opacity:.1,roughness:.3,side:s.DoubleSide})]}),f>.3&&"Light Reactions"===S.current&&(0,t.jsx)("group",{children:I.map((e,r)=>(0,t.jsx)(o.Line,{points:e,color:"#fbbf24",lineWidth:1,opacity:.4*f+.15*Math.sin(2*y.current+r),transparent:!0},r))}),"Light Reactions"===S.current&&f>.5&&(0,t.jsx)(o.Line,{points:V,color:"#fbbf24",lineWidth:2,opacity:.3+.2*Math.sin(3*y.current),transparent:!0,dashed:!0}),H.map((e,r)=>(0,t.jsx)("group",{children:e.map((e,n)=>(0,t.jsxs)("group",{position:e,children:[(0,t.jsxs)("mesh",{rotation:[0,0,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.55,.55,.14,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#059669",roughness:.4,metalness:.1})]}),"Light Reactions"===S.current&&f>.4&&(0,t.jsxs)("mesh",{position:[0,.25,0],children:[(0,t.jsx)("sphereGeometry",{args:[.12,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#fbbf24",emissive:"#fbbf24",emissiveIntensity:f*(.4*Math.sin(2*y.current+r)+.6)})]})]},n))},r)),N.map((e,r)=>(0,t.jsx)("group",{position:e,children:(0,t.jsxs)("mesh",{rotation:[0,0,Math.PI/2],children:[(0,t.jsx)("capsuleGeometry",{args:[.14,.7,8,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#047857",transparent:!0,opacity:.85})]})},r)),"Light Reactions"===S.current&&w.current>=2&&(0,t.jsx)(o.Line,{points:T,color:"#fbbf24",lineWidth:2.5,opacity:.7+.25*Math.sin(5*y.current),transparent:!0}),(0,t.jsxs)("group",{position:[0,-2.2,0],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[2.5,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#22c55e",transparent:!0,opacity:.06})]}),"Calvin Cycle"===S.current&&p>.3&&(0,t.jsx)("group",{children:[0,1,2,3].map(e=>(0,t.jsxs)("mesh",{position:[1.4*Math.cos(e*Math.PI*2/4),0,1.4*Math.sin(e*Math.PI*2/4)],children:[(0,t.jsx)("sphereGeometry",{args:[.14,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#14b8a6",emissive:"#14b8a6",emissiveIntensity:.6*p*(.3*Math.sin(3*y.current+e)+.7)})]},e))})]}),O.map(e=>{let r={H2O:"#06b6d4",CO2:"#3b82f6",O2:"#22c55e",ATP:"#fbbf24",NADPH:"#a855f7",G3P:"#f472b6",glucose:"#fb923c",RuBP:"#14b8a6",photon:"#fef08a"}[e.type]||"#888",n={H2O:.22,CO2:.28,O2:.18,ATP:.25,NADPH:.23,G3P:.28,glucose:.4,RuBP:.2,photon:.15}[e.type]||.2,i="photon"===e.type;return(0,t.jsxs)("group",{position:e.position,children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[Math.max(.01,n),12,12]}),(0,t.jsx)("meshStandardMaterial",{color:r,emissive:r,emissiveIntensity:i?.8+.3*Math.sin(8*y.current):.4,transparent:!0,opacity:i?.9:.85})]}),x&&(0,t.jsx)(a.Html,{position:[0,n+.15,0],distanceFactor:12,center:!0,children:(0,t.jsx)("div",{className:"text-[10px] font-bold px-1 py-0.5 rounded whitespace-nowrap",style:{backgroundColor:r,color:"white"},children:e.type})})]},e.id)}),x&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(a.Html,{position:[0,-4.5,0],distanceFactor:10,children:(0,t.jsx)("div",{className:"bg-green-600/90 text-white px-2 py-1 rounded text-xs font-medium",children:"Chloroplast"})}),"Light Reactions"===S.current&&(0,t.jsx)(a.Html,{position:[0,3,0],distanceFactor:12,children:(0,t.jsx)("div",{className:"bg-amber-500/90 text-white px-2 py-1 rounded text-xs font-medium",children:"Thylakoids (Light Reactions)"})}),"Calvin Cycle"===S.current&&(0,t.jsx)(a.Html,{position:[0,-3.5,2],distanceFactor:12,children:(0,t.jsx)("div",{className:"bg-emerald-700/90 text-white px-2 py-1 rounded text-xs font-medium",children:"Stroma (Calvin Cycle)"})}),"Calvin Cycle"===S.current&&p>.3&&(0,t.jsx)(a.Html,{position:[1.8,-2.2,0],distanceFactor:12,children:(0,t.jsx)("div",{className:"bg-teal-600/90 text-white px-1.5 py-0.5 rounded text-[10px]",children:"RuBisCO"})}),"Light Reactions"===S.current&&w.current>=2&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(a.Html,{position:[-4,1.2,0],distanceFactor:12,children:(0,t.jsx)("div",{className:"bg-yellow-600/90 text-white px-1.5 py-0.5 rounded text-[10px]",children:"Photosystem II"})}),(0,t.jsx)(a.Html,{position:[4,1.2,0],distanceFactor:12,children:(0,t.jsx)("div",{className:"bg-orange-600/90 text-white px-1.5 py-0.5 rounded text-[10px]",children:"Photosystem I"})})]}),"Light Reactions"===S.current&&(0,t.jsx)(a.Html,{position:[-6,4,0],distanceFactor:10,children:(0,t.jsxs)("div",{className:"bg-gray-900/95 px-3 py-2 rounded-lg border border-gray-700 text-xs shadow-lg",children:[(0,t.jsx)("div",{className:"text-white font-bold mb-2",children:"⚡ Light Energy"}),(0,t.jsxs)("div",{className:"text-yellow-400",children:[Math.round(U.lightEnergy),"% captured"]}),(0,t.jsx)("div",{className:"text-gray-400 mt-1",children:"→ ATP + NADPH"})]})}),"Calvin Cycle"===S.current&&(0,t.jsx)(a.Html,{position:[-6,4,0],distanceFactor:10,children:(0,t.jsxs)("div",{className:"bg-gray-900/95 px-3 py-2 rounded-lg border border-gray-700 text-xs shadow-lg",children:[(0,t.jsx)("div",{className:"text-white font-bold mb-2",children:"🧪 Calvin Cycle"}),(0,t.jsxs)("div",{className:"text-blue-400",children:["CO₂: ",U.co2Consumed]}),(0,t.jsxs)("div",{className:"text-orange-400",children:["Glucose: ",U.glucoseProduced,"%"]}),(0,t.jsx)("div",{className:"text-gray-400 mt-1",children:"ATP/NADPH used"})]})})]})]})]})}e.i(81413);var u=e.i(48205),h=e.i(82192),f=e.i(68647),p=e.i(14228),m=e.i(4685);e.s(["default",0,function(){let e=(0,n.useRouter)(),[i,o]=(0,r.useState)(!0),[a,s]=(0,r.useState)(!0),[l,c]=(0,r.useState)(1),[x,g]=(0,r.useState)(0),[v,y]=(0,r.useState)(1),[b,w]=(0,r.useState)(1),[S,M]=(0,r.useState)("auto"),[C,P]=(0,r.useState)(!0),[E,j]=(0,r.useState)({phase:"Light Reactions",step:1,stepDescription:"Step 1: Sunlight hits chloroplast. Water molecules (H₂O) enter from below.",o2Produced:0,glucoseProduced:0,atpCount:0,nadphCount:0,lightEnergy:0,co2Consumed:0,h2oConsumed:0}),A=(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)(f.ControlGroup,{title:"Environmental Controls",children:[(0,t.jsx)(f.ControlSlider,{label:"Light Intensity",value:v,unit:"",min:0,max:2,step:.1,color:"#fbbf24",onChange:y,decimals:1}),(0,t.jsx)(f.ControlSlider,{label:"CO₂ Concentration",value:b,unit:"",min:0,max:2,step:.1,color:"#3b82f6",onChange:w,decimals:1})]}),(0,t.jsxs)(f.ControlGroup,{title:"Display Settings",children:[(0,t.jsx)(f.ControlDropdown,{label:"Step Mode",value:S,options:[{label:"Auto Play",value:"auto"},{label:"Manual Step",value:"step"}],onChange:M,color:"#22c55e"}),(0,t.jsx)(f.ControlCheckbox,{label:"Show Labels",checked:C,onChange:P,color:"#22c55e"})]}),(0,t.jsx)("button",{onClick:()=>e.push("/experiments/photosynthesis/details"),className:"w-full py-2.5 bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 text-green-700 font-medium text-sm rounded-lg transition-all border border-green-300/50 flex items-center justify-center gap-2",children:"📖 View Experiment Details"})]}),L=(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{className:"mb-3 p-2.5 bg-gray-800/50 rounded-lg",children:[(0,t.jsx)("div",{className:"text-center font-bold text-green-400 text-sm mb-1",children:E.phase}),(0,t.jsxs)("div",{className:"text-center text-gray-300 text-xs",children:["Step ",E.step,"/3"]})]}),(0,t.jsx)(f.DataGrid,{data:{o2:{value:E.o2Produced,unit:"units",color:"#ef4444",decimals:0},glucose:{value:E.glucoseProduced,unit:"units",color:"#a855f7",decimals:0},atp:{value:E.atpCount,unit:"count",color:"#fbbf24",decimals:0},nadph:{value:E.nadphCount,unit:"count",color:"#22c55e",decimals:0}},columns:2}),(0,t.jsx)("div",{className:"mt-3 p-3 bg-gray-800/50 rounded-lg",children:(0,t.jsx)("div",{className:"text-xs text-gray-300 leading-relaxed",children:E.stepDescription})})]});return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(u.ExperimentContainer,{title:"Photosynthesis",description:"Explore light reactions and Calvin cycle in chloroplasts",cameraPosition:[0,5,12],backgroundColor:"#050510",controls:null,dataPanel:null,children:(0,t.jsx)(d,{onDataChange:j,isPlaying:a,simulationSpeed:l,resetTrigger:x,lightIntensity:v,co2Level:b,stepMode:S,showLabels:C})}),(0,t.jsx)(p.SimulationController,{isPlaying:a,onPlayPause:()=>s(e=>!e),onReset:()=>{g(e=>e+1),s(!0),c(1),y(1),w(1),M("auto")},speed:l,onSpeedChange:c}),(0,t.jsx)(h.FloatingControlPanel,{title:"🌱 Photosynthesis Controls",initialPosition:{x:20,y:80},children:A}),(0,t.jsx)(m.DataPanel,{isVisible:i,onToggle:()=>o(!i),children:L})]})}],32091)}]);
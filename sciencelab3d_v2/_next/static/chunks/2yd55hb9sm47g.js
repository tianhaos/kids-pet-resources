(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,i;var n=e.i(31067),r=e.i(71645),o=e.i(90072),s=e.i(48546),a=o,l=o;let c=new l.Box3,d=new l.Vector3;class u extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(i,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let n=new l.InstancedInterleavedBuffer(i,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(n,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),c.setFromBufferAttribute(t),this.boundingBox.union(c))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let r=0,o=e.count;r<o;r++)d.fromBufferAttribute(e,r),n=Math.max(n,i.distanceToSquared(d)),d.fromBufferAttribute(t,r),n=Math.max(n,i.distanceToSquared(d));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var f=o,m=e.i(8560),p=e.i(31497);class h extends f.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:f.UniformsUtils.clone(f.UniformsUtils.merge([m.UniformsLib.common,m.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new f.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let g=p.version>=125?"uv1":"uv2",y=new a.Vector4,x=new a.Vector3,v=new a.Vector3,b=new a.Vector4,w=new a.Vector4,S=new a.Vector4,P=new a.Vector3,j=new a.Matrix4,E=new a.Line3,M=new a.Vector3,C=new a.Box3,A=new a.Sphere,L=new a.Vector4;function N(e,t,n){return L.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),L.multiplyScalar(1/L.w),L.x=i/n.width,L.y=i/n.height,L.applyMatrix4(e.projectionMatrixInverse),L.multiplyScalar(1/L.w),Math.abs(Math.max(L.x,L.y))}class _ extends a.Mesh{constructor(e=new u,t=new h({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let e=0,r=0,o=t.count;e<o;e++,r+=2)x.fromBufferAttribute(t,e),v.fromBufferAttribute(i,e),n[r]=0===r?0:n[r-1],n[r+1]=n[r]+x.distanceTo(v);let r=new a.InstancedInterleavedBuffer(n,2,1);return e.setAttribute("instanceDistanceStart",new a.InterleavedBufferAttribute(r,1,0)),e.setAttribute("instanceDistanceEnd",new a.InterleavedBufferAttribute(r,1,1)),this}raycast(e,n){let r,o,s=this.material.worldUnits,l=e.camera;null!==l||s||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let d=this.matrixWorld,u=this.geometry,f=this.material;if(i=f.linewidth+c,null===u.boundingSphere&&u.computeBoundingSphere(),A.copy(u.boundingSphere).applyMatrix4(d),s)r=.5*i;else{let e=Math.max(l.near,A.distanceToPoint(t.origin));r=N(l,e,f.resolution)}if(A.radius+=r,!1!==t.intersectsSphere(A)){if(null===u.boundingBox&&u.computeBoundingBox(),C.copy(u.boundingBox).applyMatrix4(d),s)o=.5*i;else{let e=Math.max(l.near,C.distanceToPoint(t.origin));o=N(l,e,f.resolution)}C.expandByScalar(o),!1!==t.intersectsBox(C)&&(s?function(e,n){let r=e.matrixWorld,o=e.geometry,s=o.attributes.instanceStart,l=o.attributes.instanceEnd,c=Math.min(o.instanceCount,s.count);for(let o=0;o<c;o++){E.start.fromBufferAttribute(s,o),E.end.fromBufferAttribute(l,o),E.applyMatrix4(r);let c=new a.Vector3,d=new a.Vector3;t.distanceSqToSegment(E.start,E.end,d,c),d.distanceTo(c)<.5*i&&n.push({point:d,pointOnLine:c,distance:t.origin.distanceTo(d),object:e,face:null,faceIndex:o,uv:null,[g]:null})}}(this,n):function(e,n,r){let o=n.projectionMatrix,s=e.material.resolution,l=e.matrixWorld,c=e.geometry,d=c.attributes.instanceStart,u=c.attributes.instanceEnd,f=Math.min(c.instanceCount,d.count),m=-n.near;t.at(1,S),S.w=1,S.applyMatrix4(n.matrixWorldInverse),S.applyMatrix4(o),S.multiplyScalar(1/S.w),S.x*=s.x/2,S.y*=s.y/2,S.z=0,P.copy(S),j.multiplyMatrices(n.matrixWorldInverse,l);for(let n=0;n<f;n++){if(b.fromBufferAttribute(d,n),w.fromBufferAttribute(u,n),b.w=1,w.w=1,b.applyMatrix4(j),w.applyMatrix4(j),b.z>m&&w.z>m)continue;if(b.z>m){let e=b.z-w.z,t=(b.z-m)/e;b.lerp(w,t)}else if(w.z>m){let e=w.z-b.z,t=(w.z-m)/e;w.lerp(b,t)}b.applyMatrix4(o),w.applyMatrix4(o),b.multiplyScalar(1/b.w),w.multiplyScalar(1/w.w),b.x*=s.x/2,b.y*=s.y/2,w.x*=s.x/2,w.y*=s.y/2,E.start.copy(b),E.start.z=0,E.end.copy(w),E.end.z=0;let c=E.closestPointToPointParameter(P,!0);E.at(c,M);let f=a.MathUtils.lerp(b.z,w.z,c),p=f>=-1&&f<=1,h=P.distanceTo(M)<.5*i;if(p&&h){E.start.fromBufferAttribute(d,n),E.end.fromBufferAttribute(u,n),E.start.applyMatrix4(l),E.end.applyMatrix4(l);let i=new a.Vector3,o=new a.Vector3;t.distanceSqToSegment(E.start,E.end,o,i),r.push({point:o,pointOnLine:i,distance:t.origin.distanceTo(o),object:e,face:null,faceIndex:n,uv:null,[g]:null})}}}(this,l,n))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(y),this.material.uniforms.resolution.value.set(y.z,y.w))}}class O extends u{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,n=new Float32Array(2*i);if(3===t)for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];else for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5],n[2*r+6]=e[r+6],n[2*r+7]=e[r+7];return super.setColors(n,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class z extends _{constructor(e=new O,t=new h({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let I=r.forwardRef(function({points:e,color:t=0xffffff,vertexColors:i,linewidth:a,lineWidth:l,segments:c,dashed:d,...f},m){var p,g;let y=(0,s.useThree)(e=>e.size),x=r.useMemo(()=>c?new _:new z,[c]),[v]=r.useState(()=>new h),b=(null==i||null==(p=i[0])?void 0:p.length)===4?4:3,w=r.useMemo(()=>{let n=c?new u:new O,r=e.map(e=>{let t=Array.isArray(e);return e instanceof o.Vector3||e instanceof o.Vector4?[e.x,e.y,e.z]:e instanceof o.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(n.setPositions(r.flat()),i){t=0xffffff;let e=i.map(e=>e instanceof o.Color?e.toArray():e);n.setColors(e.flat(),b)}return n},[e,c,i,b]);return r.useLayoutEffect(()=>{x.computeLineDistances()},[e,x]),r.useLayoutEffect(()=>{d?v.defines.USE_DASH="":delete v.defines.USE_DASH,v.needsUpdate=!0},[d,v]),r.useEffect(()=>()=>{w.dispose(),v.dispose()},[w]),r.createElement("primitive",(0,n.default)({object:x,ref:m},f),r.createElement("primitive",{object:w,attach:"geometry"}),r.createElement("primitive",(0,n.default)({object:v,attach:"material",color:t,vertexColors:!!i,resolution:[y.width,y.height],linewidth:null!=(g=null!=a?a:l)?g:1,dashed:d,transparent:4===b},f)))});e.s(["Line",0,I],43216)},60099,e=>{"use strict";let t,i;var n=e.i(31067),r=e.i(71645),o=e.i(88014),s=e.i(90072),a=e.i(48546),l=e.i(94800);let c=new s.Vector3,d=new s.Vector3,u=new s.Vector3,f=new s.Vector2;function m(e,t,i){let n=c.setFromMatrixPosition(e.matrixWorld);n.project(t);let r=i.width/2,o=i.height/2;return[n.x*r+r,-(n.y*o)+o]}let p=e=>1e-10>Math.abs(e)?0:e;function h(e,t,i=""){let n="matrix3d(";for(let i=0;16!==i;i++)n+=p(t[i]*e.elements[i])+(15!==i?",":")");return i+n}let g=(t=[1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1],e=>h(e,t)),y=(i=e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1],(e,t)=>h(e,i(t),"translate(-50%,-50%)")),x=r.forwardRef(({children:e,eps:t=.001,style:i,className:h,prepend:x,center:v,fullscreen:b,portal:w,distanceFactor:S,sprite:P=!1,transform:j=!1,occlude:E,onOcclude:M,castShadow:C,receiveShadow:A,material:L,geometry:N,zIndexRange:_=[0x1000037,0],calculatePosition:O=m,as:z="div",wrapperClass:I,pointerEvents:U="auto",...F},B)=>{let{gl:D,camera:T,scene:V,size:R,raycaster:k,events:H,viewport:W}=(0,a.useThree)(),[G]=r.useState(()=>document.createElement(z)),$=r.useRef(null),q=r.useRef(null),Z=r.useRef(0),J=r.useRef([0,0]),K=r.useRef(null),X=r.useRef(null),Q=(null==w?void 0:w.current)||H.connected||D.domElement.parentNode,Y=r.useRef(null),ee=r.useRef(!1),et=r.useMemo(()=>{var e;return E&&"blending"!==E||Array.isArray(E)&&E.length&&(e=E[0])&&"object"==typeof e&&"current"in e},[E]);r.useLayoutEffect(()=>{let e=D.domElement;E&&"blending"===E?(e.style.zIndex=`${Math.floor(_[0]/2)}`,e.style.position="absolute",e.style.pointerEvents="none"):(e.style.zIndex=null,e.style.position=null,e.style.pointerEvents=null)},[E]),r.useLayoutEffect(()=>{if(q.current){let e=$.current=o.createRoot(G);if(V.updateMatrixWorld(),j)G.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";else{let e=O(q.current,T,R);G.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${e[0]}px,${e[1]}px,0);transform-origin:0 0;`}return Q&&(x?Q.prepend(G):Q.appendChild(G)),()=>{Q&&Q.removeChild(G),e.unmount()}}},[Q,j]),r.useLayoutEffect(()=>{I&&(G.className=I)},[I]);let ei=r.useMemo(()=>j?{position:"absolute",top:0,left:0,width:R.width,height:R.height,transformStyle:"preserve-3d",pointerEvents:"none"}:{position:"absolute",transform:v?"translate3d(-50%,-50%,0)":"none",...b&&{top:-R.height/2,left:-R.width/2,width:R.width,height:R.height},...i},[i,v,b,R,j]),en=r.useMemo(()=>({position:"absolute",pointerEvents:U}),[U]);r.useLayoutEffect(()=>{var t,n;ee.current=!1,j?null==(t=$.current)||t.render(r.createElement("div",{ref:K,style:ei},r.createElement("div",{ref:X,style:en},r.createElement("div",{ref:B,className:h,style:i,children:e})))):null==(n=$.current)||n.render(r.createElement("div",{ref:B,style:ei,className:h,children:e}))});let er=r.useRef(!0);(0,l.useFrame)(e=>{if(q.current){T.updateMatrixWorld(),q.current.updateWorldMatrix(!0,!1);let e=j?J.current:O(q.current,T,R);if(j||Math.abs(Z.current-T.zoom)>t||Math.abs(J.current[0]-e[0])>t||Math.abs(J.current[1]-e[1])>t){var i;let t,n,r,o,a=(i=q.current,t=c.setFromMatrixPosition(i.matrixWorld),n=d.setFromMatrixPosition(T.matrixWorld),r=t.sub(n),o=T.getWorldDirection(u),r.angleTo(o)>Math.PI/2),l=!1;et&&(Array.isArray(E)?l=E.map(e=>e.current):"blending"!==E&&(l=[V]));let m=er.current;l?er.current=function(e,t,i,n){let r=c.setFromMatrixPosition(e.matrixWorld),o=r.clone();o.project(t),f.set(o.x,o.y),i.setFromCamera(f,t);let s=i.intersectObjects(n,!0);if(s.length){let e=s[0].distance;return r.distanceTo(i.ray.origin)<e}return!0}(q.current,T,k,l)&&!a:er.current=!a,m!==er.current&&(M?M(!er.current):G.style.display=er.current?"block":"none");let h=Math.floor(_[0]/2),x=E?et?[_[0],h]:[h-1,0]:_;if(G.style.zIndex=`${function(e,t,i){if(t instanceof s.PerspectiveCamera||t instanceof s.OrthographicCamera){let n=c.setFromMatrixPosition(e.matrixWorld),r=d.setFromMatrixPosition(t.matrixWorld),o=n.distanceTo(r),s=(i[1]-i[0])/(t.far-t.near),a=i[1]-s*t.far;return Math.round(s*o+a)}}(q.current,T,x)}`,j){let[e,t]=[R.width/2,R.height/2],i=T.projectionMatrix.elements[5]*t,{isOrthographicCamera:n,top:r,left:o,bottom:s,right:a}=T,l=g(T.matrixWorldInverse),c=n?`scale(${i})translate(${p(-(a+o)/2)}px,${p((r+s)/2)}px)`:`translateZ(${i}px)`,d=q.current.matrixWorld;P&&((d=T.matrixWorldInverse.clone().transpose().copyPosition(d).scale(q.current.scale)).elements[3]=d.elements[7]=d.elements[11]=0,d.elements[15]=1),G.style.width=R.width+"px",G.style.height=R.height+"px",G.style.perspective=n?"":`${i}px`,K.current&&X.current&&(K.current.style.transform=`${c}${l}translate(${e}px,${t}px)`,X.current.style.transform=y(d,1/((S||10)/400)))}else{let t=void 0===S?1:function(e,t){if(t instanceof s.OrthographicCamera)return t.zoom;if(!(t instanceof s.PerspectiveCamera))return 1;{let i=c.setFromMatrixPosition(e.matrixWorld),n=d.setFromMatrixPosition(t.matrixWorld);return 1/(2*Math.tan(t.fov*Math.PI/180/2)*i.distanceTo(n))}}(q.current,T)*S;G.style.transform=`translate3d(${e[0]}px,${e[1]}px,0) scale(${t})`}J.current=e,Z.current=T.zoom}}if(!et&&Y.current&&!ee.current)if(j){if(K.current){let e=K.current.children[0];if(null!=e&&e.clientWidth&&null!=e&&e.clientHeight){let{isOrthographicCamera:t}=T;if(t||N)F.scale&&(Array.isArray(F.scale)?F.scale instanceof s.Vector3?Y.current.scale.copy(F.scale.clone().divideScalar(1)):Y.current.scale.set(1/F.scale[0],1/F.scale[1],1/F.scale[2]):Y.current.scale.setScalar(1/F.scale));else{let t=(S||10)/400,i=e.clientWidth*t,n=e.clientHeight*t;Y.current.scale.set(i,n,1)}ee.current=!0}}}else{let t=G.children[0];if(null!=t&&t.clientWidth&&null!=t&&t.clientHeight){let e=1/W.factor,i=t.clientWidth*e,n=t.clientHeight*e;Y.current.scale.set(i,n,1),ee.current=!0}Y.current.lookAt(e.camera.position)}});let eo=r.useMemo(()=>({vertexShader:j?void 0:`
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
      `}),[j]);return r.createElement("group",(0,n.default)({},F,{ref:q}),E&&!et&&r.createElement("mesh",{castShadow:C,receiveShadow:A,ref:Y},N||r.createElement("planeGeometry",null),L||r.createElement("shaderMaterial",{side:s.DoubleSide,vertexShader:eo.vertexShader,fragmentShader:eo.fragmentShader})))});e.s(["Html",0,x])},56420,e=>{"use strict";var t=e.i(71645);let i=(...e)=>e.filter((e,t,i)=>!!e&&""!==e.trim()&&i.indexOf(e)===t).join(" ").trim(),n=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,i)=>i?i.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let o=(0,t.createContext)({}),s=(0,t.forwardRef)(({color:e,size:n,strokeWidth:s,absoluteStrokeWidth:a,className:l="",children:c,iconNode:d,...u},f)=>{let{size:m=24,strokeWidth:p=2,absoluteStrokeWidth:h=!1,color:g="currentColor",className:y=""}=(0,t.useContext)(o)??{},x=a??h?24*Number(s??p)/Number(n??m):s??p;return(0,t.createElement)("svg",{ref:f,...r,width:n??m??r.width,height:n??m??r.height,stroke:e??g,strokeWidth:x,className:i("lucide",y,l),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,i])=>(0,t.createElement)(e,i)),...Array.isArray(c)?c:[c]])});e.s(["default",0,(e,r)=>{let o=(0,t.forwardRef)(({className:o,...a},l)=>(0,t.createElement)(s,{ref:l,iconNode:r,className:i(`lucide-${n(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,o),...a}));return o.displayName=n(e),o}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,i)=>{t.exports=e.r(76562)},23237,e=>{"use strict";var t=e.i(43476),i=e.i(71645),n=e.i(92989),r=e.i(94800),o=e.i(43216),s=e.i(60099);let a={Na:{symbol:"Na",name:"Sodium",number:11,mass:23,radius:.9,color:"#AB5CF2",electronegativity:.93,valence:1},Cl:{symbol:"Cl",name:"Chlorine",number:17,mass:35.5,radius:.7,color:"#1FF01F",electronegativity:3.16,valence:7},H:{symbol:"H",name:"Hydrogen",number:1,mass:1,radius:.4,color:"#FFFFFF",electronegativity:2.2,valence:1},O:{symbol:"O",name:"Oxygen",number:8,mass:16,radius:.6,color:"#FF0D0D",electronegativity:3.44,valence:6},Fe:{symbol:"Fe",name:"Iron",number:26,mass:56,radius:.7,color:"#E06633",electronegativity:1.83,valence:2}},l=[{step:0,title:"Neutral Atoms",description:"Sodium (Na) has 1 valence electron. Chlorine (Cl) has 7 valence electrons. Both atoms are neutral."},{step:1,title:"Electron Transfer Begins",description:"The electronegativity difference (ΔEN = 2.23) is > 1.7, so this will be an ionic bond. Na's valence electron starts moving toward Cl."},{step:2,title:"Ion Formation",description:"Na loses its electron → Na⁺ (cation). Cl gains electron → Cl⁻ (anion). Opposite charges create electrostatic attraction."},{step:3,title:"Electrostatic Attraction",description:"Na⁺ (blue glow) and Cl⁻ (red glow) attract each other due to opposite charges. Coulomb force pulls them together."},{step:4,title:"Crystal Lattice Formation",description:"In solid NaCl, ions arrange in a crystal lattice structure. Each Na⁺ is surrounded by 6 Cl⁻ and vice versa."}],c=[{step:0,title:"Separate Atoms",description:"Two hydrogen atoms and one oxygen atom. Oxygen needs 2 electrons, each hydrogen needs 1 electron to complete shells."},{step:1,title:"Atoms Approach",description:"Electronegativity difference ΔEN = 1.24 (polar covalent). Atoms are attracted to form a stable molecule."},{step:2,title:"Electron Sharing",description:"Oxygen shares electrons with hydrogen. Shared pairs spend more time near oxygen (more electronegative)."},{step:3,title:"Bond Formation",description:"Two O-H covalent bonds form. Each hydrogen shares its electron with oxygen, creating shared electron pairs."},{step:4,title:"H₂O Molecule Formed",description:"Water molecule formed with 104.5° bond angle. The bent shape and polar bonds make water a polar molecule."}],d=[{step:0,title:"Metal Atoms",description:"Iron (Fe) atoms have low electronegativity (1.83) and few valence electrons. They readily lose electrons."},{step:1,title:"Lattice Formation",description:"Metal atoms arrange in a close-packed crystal lattice structure. Each atom touches many neighbors."},{step:2,title:"Electron Delocalization",description:"Valence electrons become delocalized - they're not bound to any specific atom. They form an 'electron sea'."},{step:3,title:"Electron Sea",description:"Delocalized electrons (blue spheres) move freely throughout the lattice, creating metallic bonding."}];function u({element:e,position:n,glowColor:o,glowIntensity:l=0,showLabel:c=!0,ionLabel:d}){let f=a[e],m=(0,i.useRef)(null);return(0,r.useFrame)((e,t)=>{m.current&&(m.current.rotation.y+=.15*t)}),(0,t.jsxs)("group",{position:n,children:[l>0&&(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[1.6*f.radius,32,32]}),(0,t.jsx)("meshBasicMaterial",{color:o,transparent:!0,opacity:.35*l})]}),(0,t.jsxs)("mesh",{ref:m,castShadow:!0,children:[(0,t.jsx)("sphereGeometry",{args:[f.radius,32,32]}),(0,t.jsx)("meshStandardMaterial",{color:f.color,metalness:.4,roughness:.5,emissive:f.color,emissiveIntensity:.5*l})]}),c&&(0,t.jsx)(s.Html,{position:[0,f.radius+.6,0],center:!0,distanceFactor:10,children:(0,t.jsxs)("div",{className:"text-xs font-bold whitespace-nowrap pointer-events-none select-none bg-black/60 px-2 py-1 rounded text-white",children:[f.symbol,d&&(0,t.jsx)("span",{className:"ml-1",children:d})]})})]})}function f({position:e,orbiting:n,orbitCenter:o=[0,0,0],orbitSpeed:s=2}){let a=(0,i.useRef)(null);return(0,r.useFrame)((e,t)=>{if(a.current&&n){let e=.001*performance.now();a.current.position.x=o[0]+.25*Math.cos(e*s),a.current.position.y=o[1]+.25*Math.sin(e*s),a.current.position.z=o[2]+.15*Math.sin(e*s*.5)}}),(0,t.jsxs)("mesh",{ref:a,position:e,children:[(0,t.jsx)("sphereGeometry",{args:[.12,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#3b82f6",emissive:"#3b82f6",emissiveIntensity:1.2})]})}function m({progress:e}){let n=Math.floor(18*e),r=(0,i.useMemo)(()=>{let e=[];for(let t=0;t<3;t++)for(let i=0;i<3;i++)for(let n=0;n<2;n++){let r=(t+i+n)%2==0;e.push({type:r?"Na":"Cl",pos:[(t-1.5)*2.2,(i-1.5)*2.2,(n-.5)*3.08]})}return e},[3,2.2]);return(0,t.jsx)("group",{children:r.slice(0,n).map((e,i)=>(0,t.jsx)(u,{element:e.type,position:e.pos,glowColor:"Na"===e.type?"#3b82f6":"#ef4444",glowIntensity:1,showLabel:!1,ionLabel:"Na"===e.type?"+":"⁻"},i))})}function p({oPos:e,h1Pos:n,h2Pos:s,bondOpacity:a,overlapOpacity:l,angleProgress:c}){let d=(0,i.useRef)(null);return(0,r.useFrame)((e,t)=>{d.current&&(d.current.rotation.y+=.1*t)}),(0,i.useMemo)(()=>Math.PI/180*104.5*c,[c]),(0,t.jsxs)("group",{ref:d,children:[(0,t.jsx)(u,{element:"O",position:e,showLabel:!1}),a>0&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(o.Line,{points:[e,n],color:"#22c55e",lineWidth:3,opacity:a,transparent:!0}),(0,t.jsx)(o.Line,{points:[e,s],color:"#22c55e",lineWidth:3,opacity:a,transparent:!0})]}),l>0&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("mesh",{position:[(e[0]+n[0])/2,(e[1]+n[1])/2,(e[2]+n[2])/2],children:[(0,t.jsx)("sphereGeometry",{args:[.35,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#3b82f6",transparent:!0,opacity:.25*l,emissive:"#3b82f6",emissiveIntensity:.4})]}),(0,t.jsxs)("mesh",{position:[(e[0]+s[0])/2,(e[1]+s[1])/2,(e[2]+s[2])/2],children:[(0,t.jsx)("sphereGeometry",{args:[.35,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#3b82f6",transparent:!0,opacity:.25*l,emissive:"#3b82f6",emissiveIntensity:.4})]})]}),(0,t.jsx)(u,{element:"H",position:n,showLabel:!1}),(0,t.jsx)(u,{element:"H",position:s,showLabel:!1}),l>.5&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(f,{position:[(e[0]+n[0])/2,(e[1]+n[1])/2,.25],orbiting:!0,orbitCenter:[(e[0]+n[0])/2,(e[1]+n[1])/2,0]}),(0,t.jsx)(f,{position:[(e[0]+s[0])/2,(e[1]+s[1])/2,.25],orbiting:!0,orbitCenter:[(e[0]+s[0])/2,(e[1]+s[1])/2,0]})]})]})}function h({latticeProgress:e,electronVisibility:n,electronMotion:o,glowIntensity:s}){let a=(0,i.useMemo)(()=>{let e=[];for(let t=0;t<3;t++)for(let i=0;i<3;i++)for(let n=0;n<3;n++)e.push([(t-1.5+.5)*2,(i-1.5+.5)*2,(n-1.5+.5)*2]);return e},[]),l=(0,i.useRef)([]);(0,r.useFrame)((e,t)=>{if(o>0){let e=.001*performance.now()*o;l.current.forEach((t,i)=>{if(t){let n=.6+i%5*.15,r=.6*i;t.position.x=2.8*Math.sin(e*n+r),t.position.y=2.8*Math.cos(e*n*.8+r),t.position.z=2.8*Math.sin(e*n*1.2+r)}})}});let c=Math.floor(e*a.length);return(0,t.jsxs)("group",{children:[a.slice(0,c).map((e,i)=>(0,t.jsx)(u,{element:"Fe",position:e,glowColor:"#E06633",glowIntensity:s,showLabel:!1},`atom-${i}`)),n>0&&Array.from({length:18}).map((e,i)=>(0,t.jsxs)("mesh",{ref:e=>{e&&(l.current[i]=e)},position:[0,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[.09,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#3b82f6",emissive:"#3b82f6",emissiveIntensity:1.2,transparent:!0,opacity:n})]},`electron-${i}`))]})}function g({bondType:e,isPlaying:n,animationSpeed:o,stepMode:y,manualStep:x,resetTrigger:v,onDataChange:b}){var w,S,P;let j=(0,i.useRef)({stepProgress:0,currentStep:0,timeInStep:0,naPos:[-3,0,0],clPos:[3,0,0],electronPos:[-2.5,0,0],naGlow:0,clGlow:0,naPlus:!1,clMinus:!1,latticeVisible:!1,ionicLatticeProgress:0,oPos:[0,0,0],h1Pos:[-4,0,0],h2Pos:[4,0,0],overlapOpacity:0,bondOpacity:0,angleProgress:0,latticeFormed:!1,latticeProgress:0,electronVisibility:0,electronMotion:0,glowIntensity:0}),[E,M]=(0,i.useState)(0),[C,A]=(0,i.useState)(null),L=(0,i.useRef)(0),N=(0,i.useRef)(0);(0,i.useEffect)(()=>{j.current={stepProgress:0,currentStep:0,timeInStep:0,naPos:[-3,0,0],clPos:[3,0,0],electronPos:[-2.5,0,0],naGlow:0,clGlow:0,naPlus:!1,clMinus:!1,latticeVisible:!1,ionicLatticeProgress:0,oPos:[0,0,0],h1Pos:[-4,0,0],h2Pos:[4,0,0],overlapOpacity:0,bondOpacity:0,angleProgress:0,latticeFormed:!1,latticeProgress:0,electronVisibility:0,electronMotion:0,glowIntensity:0},M(0)},[v,e]);let _=(0,i.useMemo)(()=>{switch(e){case"ionic":return{bondEnergy:411,electronegativityDiff:a.Cl.electronegativity-a.Na.electronegativity,bondLength:2.82};case"covalent":return{bondEnergy:463,electronegativityDiff:a.O.electronegativity-a.H.electronegativity,bondLength:.96};case"metallic":return{bondEnergy:100,electronegativityDiff:0,bondLength:2.48}}},[e]),O="ionic"===e?l:"covalent"===e?c:d;return(0,r.useFrame)((t,i)=>{let r=Math.min(i,.05),s=j.current;"auto"===y&&n?(s.timeInStep+=r*o,s.stepProgress=Math.min(s.timeInStep/3,1),s.stepProgress>=1&&(s.timeInStep=0,s.stepProgress=0,s.currentStep=(s.currentStep+1)%O.length)):(s.currentStep=x,s.stepProgress=1);let a=s.stepProgress,l=s.currentStep;switch(e){case"ionic":var c=s,d=l,u=a;switch(d){case 0:c.naPos=[-3,0,0],c.clPos=[3,0,0],c.electronPos=[-2.5,0,0],c.naGlow=0,c.clGlow=0,c.naPlus=!1,c.clMinus=!1,c.latticeVisible=!1;break;case 1:c.naPos=[-3+.5*u,0,0],c.clPos=[3-.3*u,0,0],c.electronPos=[-2.5+3.5*u,.5*Math.sin(u*Math.PI),0],c.naGlow=0,c.clGlow=.3*u,c.naPlus=!1,c.clMinus=!1,c.latticeVisible=!1;break;case 2:c.naPos=[-2,0,0],c.clPos=[2.3,0,0],c.electronPos=[1.5+.5*u,.2*Math.sin(u*Math.PI*2),0],c.naGlow=.8*u,c.clGlow=.8,c.naPlus=!0,c.clMinus=!0,c.latticeVisible=!1;break;case 3:c.naPos=[-2+ +u,0,0],c.clPos=[2.3-u,0,0],c.electronPos=[2,.15*Math.sin(5*u),0],c.naGlow=.8,c.clGlow=.8,c.naPlus=!0,c.clMinus=!0,c.latticeVisible=!1;break;case 4:c.latticeVisible=!0,c.ionicLatticeProgress=u,c.naGlow=1,c.clGlow=1,c.naPlus=!0,c.clMinus=!0}break;case"covalent":var f=s,m=l,p=a;switch(m){case 0:f.oPos=[0,0,0],f.h1Pos=[-4,0,0],f.h2Pos=[4,0,0],f.overlapOpacity=0,f.bondOpacity=0,f.angleProgress=0;break;case 1:let h=4-2.5*p;f.oPos=[0,0,0],f.h1Pos=[-h,0,0],f.h2Pos=[h,0,0],f.overlapOpacity=p>.5?(p-.5)*2:0,f.bondOpacity=0,f.angleProgress=0;break;case 2:f.oPos=[0,0,0],f.h1Pos=[-1.2,0,0],f.h2Pos=[1.2,0,0],f.overlapOpacity=.6,f.bondOpacity=p>.7?(p-.7)/.3:0,f.angleProgress=0;break;case 3:f.oPos=[0,0,0],f.h1Pos=[-1.2,0,0],f.h2Pos=[1.2,0,0],f.overlapOpacity=.6,f.bondOpacity=1,f.angleProgress=p;break;case 4:f.oPos=[0,0,0],f.h1Pos=[-1.2,0,0],f.h2Pos=[1.2,0,0],f.overlapOpacity=.6,f.bondOpacity=1,f.angleProgress=1}break;case"metallic":var g=s,v=l,w=a;switch(v){case 0:g.latticeFormed=!1,g.latticeProgress=0,g.electronVisibility=0,g.electronMotion=0,g.glowIntensity=0;break;case 1:g.latticeFormed=!0,g.latticeProgress=w,g.electronVisibility=0,g.electronMotion=0,g.glowIntensity=0;break;case 2:g.latticeFormed=!0,g.latticeProgress=1,g.electronVisibility=w,g.electronMotion=0,g.glowIntensity=.3*w;break;case 3:g.latticeFormed=!0,g.latticeProgress=1,g.electronVisibility=1,g.electronMotion=w,g.glowIntensity=.3}}if(L.current++,L.current>=8&&(L.current=0,M(s.currentStep)),N.current+=r,N.current>=.133){N.current=0;let t=O[s.currentStep],i={bondType:e,step:s.currentStep,totalSteps:O.length,bondEnergy:_.bondEnergy,electronegativityDiff:_.electronegativityDiff,bondLength:_.bondLength,description:t.title+": "+t.description};b?.(i),A(i)}}),(0,t.jsxs)("group",{children:[(0,t.jsx)("ambientLight",{intensity:.4}),(0,t.jsx)("directionalLight",{position:[10,15,10],intensity:1,castShadow:!0}),(0,t.jsx)("directionalLight",{position:[-10,10,-10],intensity:.3}),(0,t.jsx)("pointLight",{position:[0,5,8],intensity:.5,color:"#8b5cf6"}),(0,t.jsxs)("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-5,0],receiveShadow:!0,children:[(0,t.jsx)("planeGeometry",{args:[30,30]}),(0,t.jsx)("meshStandardMaterial",{color:"#050510",roughness:.95})]}),(0,t.jsx)("gridHelper",{args:[30,30,"#1a1a3e","#0a0a1e"],position:[0,-4.99,0]}),"ionic"===e&&((w=j.current).latticeVisible?(0,t.jsx)(m,{progress:w.ionicLatticeProgress}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(u,{element:"Na",position:w.naPos,glowColor:"#3b82f6",glowIntensity:w.naGlow,ionLabel:w.naPlus?"+":void 0}),(0,t.jsx)(u,{element:"Cl",position:w.clPos,glowColor:"#ef4444",glowIntensity:w.clGlow,ionLabel:w.clMinus?"⁻":void 0}),(0,t.jsx)(f,{position:w.electronPos})]})),"covalent"===e&&(S=j.current,(0,t.jsx)(p,{oPos:S.oPos,h1Pos:S.h1Pos,h2Pos:S.h2Pos,bondOpacity:S.bondOpacity,overlapOpacity:S.overlapOpacity,angleProgress:S.angleProgress})),"metallic"===e&&(P=j.current,(0,t.jsx)(h,{latticeProgress:P.latticeProgress,electronVisibility:P.electronVisibility,electronMotion:P.electronMotion,glowIntensity:P.glowIntensity})),(0,t.jsx)(s.Html,{position:[0,6,0],center:!0,children:(0,t.jsxs)("div",{className:"bg-black/70 px-4 py-2 rounded-lg backdrop-blur-sm",children:[(0,t.jsxs)("div",{className:"text-lg font-bold text-white",children:["Step ",E+1,"/",O.length]}),(0,t.jsx)("div",{className:"text-sm text-emerald-400",children:O[E]?.title||""})]})}),(0,t.jsx)(s.Html,{position:[-6,4,0],children:(0,t.jsxs)("div",{className:"bg-black/70 px-3 py-2 rounded-lg backdrop-blur-sm text-white text-xs",children:[(0,t.jsx)("div",{className:"font-bold mb-1",children:"Elements"}),"ionic"===e&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{className:"flex items-center gap-2 mb-1",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full",style:{background:a.Na.color}}),(0,t.jsx)("span",{children:"Na (Sodium)"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full",style:{background:a.Cl.color}}),(0,t.jsx)("span",{children:"Cl (Chlorine)"})]})]}),"covalent"===e&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{className:"flex items-center gap-2 mb-1",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full",style:{background:a.O.color}}),(0,t.jsx)("span",{children:"O (Oxygen)"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full",style:{background:a.H.color}}),(0,t.jsx)("span",{children:"H (Hydrogen)"})]})]}),"metallic"===e&&(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full",style:{background:a.Fe.color}}),(0,t.jsx)("span",{children:"Fe (Iron) + Delocalized e⁻"})]})]})})]})}e.i(81413);var y=e.i(48205),x=e.i(82192),v=e.i(68647),b=e.i(14228),w=e.i(4685);e.s(["default",0,function(){let e=(0,n.useRouter)(),[r,o]=(0,i.useState)(null),[s,a]=(0,i.useState)(!0),[l,c]=(0,i.useState)(!0),[d,u]=(0,i.useState)(1),[f,m]=(0,i.useState)(0),[p,h]=(0,i.useState)("ionic"),[S,P]=(0,i.useState)("auto"),[j,E]=(0,i.useState)(0),M={ionic:{title:"Ionic Bond",description:"Electrons are transferred from metal to non-metal, creating oppositely charged ions that attract.",example:"NaCl (Sodium Chloride)",color:"#AB5CF2"},covalent:{title:"Covalent Bond",description:"Electrons are shared between atoms to complete their outer shells.",example:"H₂O (Water)",color:"#FF0D0D"},metallic:{title:"Metallic Bond",description:"Valence electrons are delocalized, forming a 'sea of electrons' that holds metal atoms together.",example:"Fe (Iron)",color:"#E06633"}},C=(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsx)(v.ControlGroup,{title:"Bond Type",children:(0,t.jsx)("div",{className:"space-y-3",children:["ionic","covalent","metallic"].map(e=>(0,t.jsxs)("button",{onClick:()=>{h(e),E(0),m(e=>e+1)},className:`w-full py-3 px-4 rounded-lg font-medium transition-all text-left ${p===e?"bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg":"bg-gray-100/80 text-gray-700 hover:bg-gray-200/80"}`,children:[(0,t.jsx)("div",{className:"font-bold",children:M[e].title}),(0,t.jsx)("div",{className:`text-xs mt-1 ${p===e?"text-emerald-100":"text-gray-500"}`,children:M[e].example})]},e))})}),(0,t.jsx)(v.ControlGroup,{title:"Bond Info",children:(0,t.jsxs)("div",{className:"bg-blue-50/80 rounded-lg p-3 border border-blue-200/50",children:[(0,t.jsx)("div",{className:"text-xs text-gray-600 mb-2 font-medium",children:M[p].title}),(0,t.jsx)("div",{className:"text-xs text-gray-600 leading-relaxed",children:M[p].description})]})}),(0,t.jsx)(v.ControlGroup,{title:"Animation Mode",children:(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-2",children:[(0,t.jsx)("button",{onClick:()=>P("auto"),className:`py-2 px-3 text-xs rounded-lg font-medium transition-all ${"auto"===S?"bg-emerald-600 text-white":"bg-gray-200/50 text-gray-700 hover:bg-gray-300/50"}`,children:"Auto Play"}),(0,t.jsx)("button",{onClick:()=>P("manual"),className:`py-2 px-3 text-xs rounded-lg font-medium transition-all ${"manual"===S?"bg-emerald-600 text-white":"bg-gray-200/50 text-gray-700 hover:bg-gray-300/50"}`,children:"Manual Steps"})]})}),"manual"===S&&(0,t.jsx)(v.ControlGroup,{title:"Step Control",children:(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)("button",{onClick:()=>{E(e=>Math.max(e-1,0))},disabled:0===j,className:`flex-1 py-2 text-sm rounded-lg font-medium transition-all ${0===j?"bg-gray-300 text-gray-500 cursor-not-allowed":"bg-gray-200 text-gray-700 hover:bg-gray-300"}`,children:"← Prev"}),(0,t.jsxs)("div",{className:"flex-1 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium",children:[j+1,"/","metallic"===p?4:5]}),(0,t.jsx)("button",{onClick:()=>{let e="metallic"===p?4:5;E(t=>Math.min(t+1,e-1))},disabled:j>=("metallic"===p?3:4),className:`flex-1 py-2 text-sm rounded-lg font-medium transition-all ${j>=("metallic"===p?3:4)?"bg-gray-300 text-gray-500 cursor-not-allowed":"bg-gray-200 text-gray-700 hover:bg-gray-300"}`,children:"Next →"})]})}),(0,t.jsx)(v.ControlGroup,{title:"Animation Speed",children:(0,t.jsx)(v.ControlSlider,{label:"Speed",value:d,onChange:u,min:.25,max:2,step:.25,unit:"x",color:"#8b5cf6",decimals:2})}),(0,t.jsx)("button",{onClick:()=>e.push("/experiments/chemical-bonding/details"),className:"w-full py-2.5 bg-gradient-to-r from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 text-emerald-700 font-medium text-sm rounded-lg transition-all border border-emerald-300/50 flex items-center justify-center gap-2",children:"📖 View Experiment Details"})]}),A=r?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(v.DataGrid,{data:{step:{value:r.step+1,unit:`/${r.totalSteps}`,color:"#10b981",decimals:0},bondEnergy:{value:r.bondEnergy,unit:"kJ/mol",color:"#f59e0b",decimals:0},enDiff:{value:r.electronegativityDiff,unit:"ΔEN",color:"#ef4444",decimals:2},bondLength:{value:r.bondLength,unit:"Å",color:"#3b82f6",decimals:2}},columns:2}),(0,t.jsxs)("div",{className:"mt-3 p-3 bg-gray-800/50 rounded-lg",children:[(0,t.jsx)("div",{className:"text-xs text-gray-400 mb-2",children:"Current Step"}),(0,t.jsx)("div",{className:"text-xs text-gray-300 leading-relaxed",children:r.description})]}),(0,t.jsxs)("div",{className:"mt-3 p-3 bg-gray-800/50 rounded-lg",children:[(0,t.jsx)("div",{className:"text-xs text-gray-400 mb-1",children:"Bond Classification"}),(0,t.jsxs)("div",{className:"text-emerald-400 text-sm font-medium",children:["ionic"===r.bondType&&"Ionic (ΔEN > 1.7)","covalent"===r.bondType&&(r.electronegativityDiff>.5?"Polar Covalent (0.5 < ΔEN < 1.7)":"Nonpolar Covalent (ΔEN < 0.5)"),"metallic"===r.bondType&&"Metallic (delocalized electrons)"]})]})]}):(0,t.jsx)("div",{className:"text-center text-gray-500 text-sm py-8",children:"Waiting for simulation data..."});return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(y.ExperimentContainer,{title:"Chemical Bonding",description:"Explore how atoms connect through ionic, covalent, and metallic bonds. Watch step-by-step animations of bond formation.",cameraPosition:[12,8,12],backgroundColor:"#050510",controls:null,dataPanel:null,children:(0,t.jsx)(g,{onDataChange:o,bondType:p,isPlaying:l,animationSpeed:d,stepMode:S,manualStep:j,resetTrigger:f})}),(0,t.jsx)(b.SimulationController,{isPlaying:l,onPlayPause:()=>c(e=>!e),onReset:()=>{m(e=>e+1),c(!0),u(1),E(0)},speed:d,onSpeedChange:u,timeElapsed:r?.step??0}),(0,t.jsx)(x.FloatingControlPanel,{title:"⚛️ Chemical Bonding",initialPosition:{x:20,y:80},children:C}),(0,t.jsx)(w.DataPanel,{isVisible:s,onToggle:()=>a(!s),children:A})]})}],23237)}]);
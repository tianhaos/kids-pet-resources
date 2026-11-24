(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,i;var n=e.i(31067),r=e.i(71645),s=e.i(90072),o=e.i(48546),a=s,l=s;let d=new l.Box3,c=new l.Vector3;class u extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(i,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let n=new l.InstancedInterleavedBuffer(i,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(n,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),d.setFromBufferAttribute(t),this.boundingBox.union(d))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let r=0,s=e.count;r<s;r++)c.fromBufferAttribute(e,r),n=Math.max(n,i.distanceToSquared(c)),c.fromBufferAttribute(t,r),n=Math.max(n,i.distanceToSquared(c));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var f=s,p=e.i(8560),h=e.i(31497);class m extends f.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:f.UniformsUtils.clone(f.UniformsUtils.merge([p.UniformsLib.common,p.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new f.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let g=h.version>=125?"uv1":"uv2",x=new a.Vector4,v=new a.Vector3,y=new a.Vector3,b=new a.Vector4,w=new a.Vector4,S=new a.Vector4,j=new a.Vector3,C=new a.Matrix4,E=new a.Line3,M=new a.Vector3,A=new a.Box3,_=new a.Sphere,L=new a.Vector4;function z(e,t,n){return L.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),L.multiplyScalar(1/L.w),L.x=i/n.width,L.y=i/n.height,L.applyMatrix4(e.projectionMatrixInverse),L.multiplyScalar(1/L.w),Math.abs(Math.max(L.x,L.y))}class U extends a.Mesh{constructor(e=new u,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let e=0,r=0,s=t.count;e<s;e++,r+=2)v.fromBufferAttribute(t,e),y.fromBufferAttribute(i,e),n[r]=0===r?0:n[r-1],n[r+1]=n[r]+v.distanceTo(y);let r=new a.InstancedInterleavedBuffer(n,2,1);return e.setAttribute("instanceDistanceStart",new a.InterleavedBufferAttribute(r,1,0)),e.setAttribute("instanceDistanceEnd",new a.InterleavedBufferAttribute(r,1,1)),this}raycast(e,n){let r,s,o=this.material.worldUnits,l=e.camera;null!==l||o||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let d=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let c=this.matrixWorld,u=this.geometry,f=this.material;if(i=f.linewidth+d,null===u.boundingSphere&&u.computeBoundingSphere(),_.copy(u.boundingSphere).applyMatrix4(c),o)r=.5*i;else{let e=Math.max(l.near,_.distanceToPoint(t.origin));r=z(l,e,f.resolution)}if(_.radius+=r,!1!==t.intersectsSphere(_)){if(null===u.boundingBox&&u.computeBoundingBox(),A.copy(u.boundingBox).applyMatrix4(c),o)s=.5*i;else{let e=Math.max(l.near,A.distanceToPoint(t.origin));s=z(l,e,f.resolution)}A.expandByScalar(s),!1!==t.intersectsBox(A)&&(o?function(e,n){let r=e.matrixWorld,s=e.geometry,o=s.attributes.instanceStart,l=s.attributes.instanceEnd,d=Math.min(s.instanceCount,o.count);for(let s=0;s<d;s++){E.start.fromBufferAttribute(o,s),E.end.fromBufferAttribute(l,s),E.applyMatrix4(r);let d=new a.Vector3,c=new a.Vector3;t.distanceSqToSegment(E.start,E.end,c,d),c.distanceTo(d)<.5*i&&n.push({point:c,pointOnLine:d,distance:t.origin.distanceTo(c),object:e,face:null,faceIndex:s,uv:null,[g]:null})}}(this,n):function(e,n,r){let s=n.projectionMatrix,o=e.material.resolution,l=e.matrixWorld,d=e.geometry,c=d.attributes.instanceStart,u=d.attributes.instanceEnd,f=Math.min(d.instanceCount,c.count),p=-n.near;t.at(1,S),S.w=1,S.applyMatrix4(n.matrixWorldInverse),S.applyMatrix4(s),S.multiplyScalar(1/S.w),S.x*=o.x/2,S.y*=o.y/2,S.z=0,j.copy(S),C.multiplyMatrices(n.matrixWorldInverse,l);for(let n=0;n<f;n++){if(b.fromBufferAttribute(c,n),w.fromBufferAttribute(u,n),b.w=1,w.w=1,b.applyMatrix4(C),w.applyMatrix4(C),b.z>p&&w.z>p)continue;if(b.z>p){let e=b.z-w.z,t=(b.z-p)/e;b.lerp(w,t)}else if(w.z>p){let e=w.z-b.z,t=(w.z-p)/e;w.lerp(b,t)}b.applyMatrix4(s),w.applyMatrix4(s),b.multiplyScalar(1/b.w),w.multiplyScalar(1/w.w),b.x*=o.x/2,b.y*=o.y/2,w.x*=o.x/2,w.y*=o.y/2,E.start.copy(b),E.start.z=0,E.end.copy(w),E.end.z=0;let d=E.closestPointToPointParameter(j,!0);E.at(d,M);let f=a.MathUtils.lerp(b.z,w.z,d),h=f>=-1&&f<=1,m=j.distanceTo(M)<.5*i;if(h&&m){E.start.fromBufferAttribute(c,n),E.end.fromBufferAttribute(u,n),E.start.applyMatrix4(l),E.end.applyMatrix4(l);let i=new a.Vector3,s=new a.Vector3;t.distanceSqToSegment(E.start,E.end,s,i),r.push({point:s,pointOnLine:i,distance:t.origin.distanceTo(s),object:e,face:null,faceIndex:n,uv:null,[g]:null})}}}(this,l,n))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(x),this.material.uniforms.resolution.value.set(x.z,x.w))}}class B extends u{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,n=new Float32Array(2*i);if(3===t)for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];else for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5],n[2*r+6]=e[r+6],n[2*r+7]=e[r+7];return super.setColors(n,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class P extends U{constructor(e=new B,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let V=r.forwardRef(function({points:e,color:t=0xffffff,vertexColors:i,linewidth:a,lineWidth:l,segments:d,dashed:c,...f},p){var h,g;let x=(0,o.useThree)(e=>e.size),v=r.useMemo(()=>d?new U:new P,[d]),[y]=r.useState(()=>new m),b=(null==i||null==(h=i[0])?void 0:h.length)===4?4:3,w=r.useMemo(()=>{let n=d?new u:new B,r=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Vector3||e instanceof s.Vector4?[e.x,e.y,e.z]:e instanceof s.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(n.setPositions(r.flat()),i){t=0xffffff;let e=i.map(e=>e instanceof s.Color?e.toArray():e);n.setColors(e.flat(),b)}return n},[e,d,i,b]);return r.useLayoutEffect(()=>{v.computeLineDistances()},[e,v]),r.useLayoutEffect(()=>{c?y.defines.USE_DASH="":delete y.defines.USE_DASH,y.needsUpdate=!0},[c,y]),r.useEffect(()=>()=>{w.dispose(),y.dispose()},[w]),r.createElement("primitive",(0,n.default)({object:v,ref:p},f),r.createElement("primitive",{object:w,attach:"geometry"}),r.createElement("primitive",(0,n.default)({object:y,attach:"material",color:t,vertexColors:!!i,resolution:[x.width,x.height],linewidth:null!=(g=null!=a?a:l)?g:1,dashed:c,transparent:4===b},f)))});e.s(["Line",0,V],43216)},56420,e=>{"use strict";var t=e.i(71645);let i=(...e)=>e.filter((e,t,i)=>!!e&&""!==e.trim()&&i.indexOf(e)===t).join(" ").trim(),n=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,i)=>i?i.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,t.createContext)({}),o=(0,t.forwardRef)(({color:e,size:n,strokeWidth:o,absoluteStrokeWidth:a,className:l="",children:d,iconNode:c,...u},f)=>{let{size:p=24,strokeWidth:h=2,absoluteStrokeWidth:m=!1,color:g="currentColor",className:x=""}=(0,t.useContext)(s)??{},v=a??m?24*Number(o??h)/Number(n??p):o??h;return(0,t.createElement)("svg",{ref:f,...r,width:n??p??r.width,height:n??p??r.height,stroke:e??g,strokeWidth:v,className:i("lucide",x,l),...!d&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...c.map(([e,i])=>(0,t.createElement)(e,i)),...Array.isArray(d)?d:[d]])});e.s(["default",0,(e,r)=>{let s=(0,t.forwardRef)(({className:s,...a},l)=>(0,t.createElement)(o,{ref:l,iconNode:r,className:i(`lucide-${n(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...a}));return s.displayName=n(e),s}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,i)=>{t.exports=e.r(76562)},69255,e=>{"use strict";var t=e.i(43476),i=e.i(71645),n=e.i(92989),r=e.i(90072),s=e.i(94800),o=e.i(43216);function a({onDataChange:e,charges:n,showFieldLines:l=!0,showVectors:d=!0,showEquipotential:c=!0,showForceVectors:u=!0,cursorPosition:f}){let p=(0,i.useRef)(0);(0,i.useRef)(0);let h=(0,i.useRef)({electricField:0,potential:0,fieldX:0,fieldY:0,fieldZ:0,forcesBetweenCharges:[],numCharges:n.length}),[m,g]=(0,i.useState)(h.current),x=e=>{let t=new r.Vector3(0,0,0);for(let i of n){if(0===i.magnitude)continue;let n=e.clone().sub(i.position),r=n.length();if(r<.5)continue;let s=8.99*i.magnitude/(r*r),o=n.normalize();t.add(o.multiplyScalar(s))}return t},v=e=>{let t=0;for(let i of n){if(0===i.magnitude)continue;let n=e.distanceTo(i.position);n<.5||(t+=8.99*i.magnitude/n)}return t},y=(e,t)=>{let i=e.position.distanceTo(t.position);return i<.1?{force:0,distance:i}:{force:8.99*Math.abs(e.magnitude*t.magnitude)/(i*i),distance:i}};(0,s.useFrame)(()=>{if(p.current++,p.current%8!=0)return;let t=f||new r.Vector3(0,5,0),i=x(t),s=v(t),o=[];for(let e=0;e<n.length;e++)for(let t=e+1;t<n.length;t++){let i=y(n[e],n[t]);o.push({charge1:`Q${e+1}`,charge2:`Q${t+1}`,force:i.force,distance:i.distance})}let a={electricField:i.length(),potential:s,fieldX:i.x,fieldY:i.y,fieldZ:i.z,forcesBetweenCharges:o,numCharges:n.length};h.current=a,g(a),e?.(a)});let b=(0,i.useMemo)(()=>{if(!l)return[];let e=[],i=n.filter(e=>e.magnitude>0),s=n.filter(e=>e.magnitude<0);for(let n of i)for(let i=0;i<16;i++){let a=i/16*Math.PI*2,l=i%4/4*Math.PI,d=new r.Vector3(n.position.x+Math.cos(a)*Math.sin(l)*1.2,n.position.y+Math.sin(a)*Math.sin(l)*1.2,n.position.z+1.2*Math.cos(l)),c=[[d.x,d.y,d.z]];for(let e=0;e<80;e++){let e=x(d);if(0===e.length())break;let t=e.normalize();d.add(t.multiplyScalar(.3)),c.push([d.x,d.y,d.z]);let i=!1;for(let e of s)if(1.5>d.distanceTo(e.position)){i=!0;break}if(i||d.length()>25)break}c.length>2&&e.push((0,t.jsx)(o.Line,{points:c,color:"#fbbf24",lineWidth:3,opacity:.7,transparent:!0},`field-${n.id}-${i}`))}return e},[n,l]),w=(0,i.useMemo)(()=>{if(!c||0===n.length)return[];let e=[];[new r.Vector3(0,0,0),new r.Vector3(5,0,0),new r.Vector3(10,0,0)].map(e=>v(e));for(let i=0;i<6;i++)for(let n=0;n<3;n++){let s=4+3*n,a=[];for(let e=0;e<=48;e++){let t=e/48*Math.PI*2;a.push([Math.cos(t)*s,Math.sin(t)*s,0])}let l=(i/6+.1*n)%1,d=new r.Color().setHSL(l,.7,.6);e.push((0,t.jsxs)("group",{children:[(0,t.jsx)(o.Line,{points:a,color:d,lineWidth:2,opacity:.4,transparent:!0}),(0,t.jsxs)("mesh",{rotation:[Math.PI/2,0,0],children:[(0,t.jsx)("ringGeometry",{args:[s-.05,s+.05,48]}),(0,t.jsx)("meshBasicMaterial",{color:d,transparent:!0,opacity:.15,side:r.DoubleSide})]})]},`equipotential-${i}-${n}`))}return e},[n,c]),S=(0,i.useMemo)(()=>{if(!u)return[];let e=[];for(let i=0;i<n.length;i++)for(let s=i+1;s<n.length;s++){let a=n[i],l=n[s];if(0===a.magnitude||0===l.magnitude)continue;let{force:d}=y(a,l);if(d<.1)continue;let c=l.position.clone().sub(a.position).normalize(),u=a.magnitude>0&&l.magnitude<0||a.magnitude<0&&l.magnitude>0,f=Math.min(.5*d,5);e.push((0,t.jsxs)("group",{children:[(0,t.jsx)(o.Line,{points:[[a.position.x,a.position.y,a.position.z],[a.position.x+c.x*f*(u?1:-1),a.position.y+c.y*f*(u?1:-1),a.position.z+c.z*f*(u?1:-1)]],color:u?"#22c55e":"#ef4444",lineWidth:4}),(0,t.jsxs)("mesh",{position:new r.Vector3(a.position.x+c.x*f*(u?1:-1),a.position.y+c.y*f*(u?1:-1),a.position.z+c.z*f*(u?1:-1)),quaternion:new r.Quaternion().setFromUnitVectors(new r.Vector3(0,1,0),c.clone().multiplyScalar(u?1:-1)),children:[(0,t.jsx)("coneGeometry",{args:[.2,.5,8]}),(0,t.jsx)("meshStandardMaterial",{color:u?"#22c55e":"#ef4444",emissive:u?"#22c55e":"#ef4444",emissiveIntensity:.5})]})]},`force-${i}-${s}`))}return e},[n,u]),j=(0,i.useMemo)(()=>{if(!d)return[];let e=[];for(let i=-6;i<=6;i+=3)for(let n=-6;n<=6;n+=3){let s=x(new r.Vector3(i,n,0)),a=s.length();if(a>.1&&a<50){let r=s.clone().normalize(),l=Math.min(.3*a,1.5);e.push((0,t.jsx)("group",{position:[i,n,0],children:(0,t.jsx)(o.Line,{points:[[0,0,0],[r.x*l,r.y*l,r.z*l]],color:"#06b6d4",lineWidth:1.5,opacity:.5,transparent:!0})},`grid-${i}-${n}`))}}return e},[n,d]);return(0,t.jsxs)("group",{children:[(0,t.jsxs)("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-15,0],receiveShadow:!0,children:[(0,t.jsx)("planeGeometry",{args:[60,60]}),(0,t.jsx)("meshStandardMaterial",{color:"#030312",roughness:.98})]}),(0,t.jsx)("gridHelper",{args:[60,30,"#1a1a3e","#0a0a1e"],position:[0,-14.99,0]}),n.map((e,i)=>{let n=e.magnitude>0,r=n?"#ef4444":"#3b82f6",s=Math.abs(e.magnitude);return(0,t.jsxs)("group",{position:[e.position.x,e.position.y,e.position.z],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[1.5+.1*s,32,32]}),(0,t.jsx)("meshBasicMaterial",{color:r,transparent:!0,opacity:.15})]}),(0,t.jsxs)("mesh",{castShadow:!0,children:[(0,t.jsx)("sphereGeometry",{args:[.6+.05*s,32,32]}),(0,t.jsx)("meshStandardMaterial",{color:r,emissive:r,emissiveIntensity:1.2,metalness:.4,roughness:.3})]}),(0,t.jsx)("group",{position:[0,0,.7],children:n?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("planeGeometry",{args:[.6,.15]}),(0,t.jsx)("meshBasicMaterial",{color:"#ffffff"})]}),(0,t.jsxs)("mesh",{children:[(0,t.jsx)("planeGeometry",{args:[.15,.6]}),(0,t.jsx)("meshBasicMaterial",{color:"#ffffff"})]})]}):(0,t.jsx)(t.Fragment,{children:(0,t.jsxs)("mesh",{children:[(0,t.jsx)("planeGeometry",{args:[.6,.15]}),(0,t.jsx)("meshBasicMaterial",{color:"#ffffff"})]})})}),(0,t.jsxs)("mesh",{position:[0,1.5,0],children:[(0,t.jsx)("planeGeometry",{args:[1.2,.4]}),(0,t.jsx)("meshBasicMaterial",{color:"#ffffff",transparent:!0,opacity:.9})]})]},e.id)}),b,w,S,j,f&&(0,t.jsxs)("group",{position:[f.x,f.y,f.z],children:[(0,t.jsxs)("mesh",{rotation:[Math.PI/2,0,0],children:[(0,t.jsx)("ringGeometry",{args:[.4,.5,32]}),(0,t.jsx)("meshBasicMaterial",{color:"#f59e0b",transparent:!0,opacity:.6})]}),d&&(0,t.jsx)(o.Line,{points:[[0,0,0],[.3*m.fieldX,.3*m.fieldY,.3*m.fieldZ]],color:"#f59e0b",lineWidth:4})]}),Array.from({length:5}).map((e,i)=>{let n=5+4*i;return(0,t.jsxs)("group",{children:[(0,t.jsxs)("mesh",{position:[n,-14.5,0],children:[(0,t.jsx)("boxGeometry",{args:[.1,.3,.1]}),(0,t.jsx)("meshStandardMaterial",{color:"#333366"})]}),i>0&&(0,t.jsxs)("mesh",{position:[-n,-14.5,0],children:[(0,t.jsx)("boxGeometry",{args:[.1,.3,.1]}),(0,t.jsx)("meshStandardMaterial",{color:"#333366"})]})]},i)})]})}e.i(81413);var l=e.i(48205),d=e.i(68647),c=e.i(82192),u=e.i(14228),f=e.i(4685);e.s(["default",0,function(){let e=(0,n.useRouter)(),[s,o]=(0,i.useState)(null),[p,h]=(0,i.useState)(!0),[m,g]=(0,i.useState)(!0),[x,v]=(0,i.useState)(1),[y,b]=(0,i.useState)(0),[w,S]=(0,i.useState)(!0),[j,C]=(0,i.useState)(!0),[E,M]=(0,i.useState)(!0),[A,_]=(0,i.useState)(!0),[L,z]=(0,i.useState)(new r.Vector3(0,5,0)),[U,B]=(0,i.useState)([{id:"1",position:new r.Vector3(-6,0,0),magnitude:8},{id:"2",position:new r.Vector3(6,0,0),magnitude:-8},{id:"3",position:new r.Vector3(0,6,0),magnitude:5}]),[P,V]=(0,i.useState)("1"),N=(0,i.useCallback)(()=>{let e=Date.now().toString(),t=Math.random()*Math.PI*2,i=4+4*Math.random();B(n=>[...n,{id:e,position:new r.Vector3(Math.cos(t)*i,Math.sin(t)*i,0),magnitude:5}]),V(e)},[]),O=(0,i.useCallback)(e=>{B(t=>{let i=t.filter(t=>t.id!==e);return P===e&&i.length>0&&V(i[0].id),i})},[P]),D=(0,i.useCallback)((e,t)=>{B(i=>i.map(i=>i.id===e?{...i,magnitude:t}:i))},[]),I=(0,i.useCallback)(e=>{B(t=>t.map(t=>t.id===e?{...t,magnitude:-t.magnitude}:t))},[]),T=(0,i.useCallback)((e,t,i)=>{B(n=>n.map(n=>n.id===e?{...n,position:new r.Vector3("x"===t?i:n.position.x,"y"===t?i:n.position.y,n.position.z)}:n))},[]),k=(0,i.useMemo)(()=>U.find(e=>e.id===P)||U[0],[U,P]);(0,i.useEffect)(()=>{if(!m)return;let e=setInterval(()=>{z(e=>{let t=3e-4*Date.now();return new r.Vector3(5*Math.cos(t),5*Math.sin(t),0)})},100);return()=>clearInterval(e)},[m]);let R=(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)(d.ControlGroup,{title:"Charges",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)("div",{className:"flex gap-1 flex-wrap",children:U.map((e,i)=>(0,t.jsxs)("button",{onClick:()=>V(e.id),className:`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${P===e.id?e.magnitude>=0?"bg-red-500 text-white":"bg-blue-500 text-white":e.magnitude>=0?"bg-red-100 text-red-700 hover:bg-red-200":"bg-blue-100 text-blue-700 hover:bg-blue-200"}`,children:["Q",i+1,": ",e.magnitude>0?"+":"",e.magnitude.toFixed(0),"µC"]},e.id))}),(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)("button",{onClick:N,disabled:U.length>=6,className:"flex-1 py-2 bg-green-100 hover:bg-green-200 text-green-700 font-medium text-xs rounded-lg transition-all border border-green-300/50 disabled:opacity-50 disabled:cursor-not-allowed",children:"➕ Add Charge"}),(0,t.jsx)("button",{onClick:()=>O(P),disabled:U.length<=2,className:"flex-1 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium text-xs rounded-lg transition-all border border-red-300/50 disabled:opacity-50 disabled:cursor-not-allowed",children:"➖ Remove"})]})]}),k&&(0,t.jsxs)("div",{className:"mt-4 pt-4 border-t border-gray-200/50 space-y-3",children:[(0,t.jsxs)("div",{className:"text-xs font-semibold text-gray-500 uppercase tracking-wide",children:["Edit Q",U.findIndex(e=>e.id===k.id)+1]}),(0,t.jsx)(d.ControlSlider,{label:"Magnitude",value:Math.abs(k.magnitude),unit:"µC",min:1,max:15,step:1,color:k.magnitude>=0?"#ef4444":"#3b82f6",onChange:e=>D(k.id,k.magnitude>=0?e:-e),decimals:0}),(0,t.jsx)(d.ControlSlider,{label:"Position X",value:k.position.x,unit:"m",min:-12,max:12,step:.5,color:"#8b5cf6",onChange:e=>T(k.id,"x",e),decimals:1}),(0,t.jsx)(d.ControlSlider,{label:"Position Y",value:k.position.y,unit:"m",min:-12,max:12,step:.5,color:"#8b5cf6",onChange:e=>T(k.id,"y",e),decimals:1}),(0,t.jsx)("button",{onClick:()=>I(k.id),className:`w-full py-2 font-medium text-xs rounded-lg transition-all ${k.magnitude>=0?"bg-blue-100 hover:bg-blue-200 text-blue-700":"bg-red-100 hover:bg-red-200 text-red-700"}`,children:k.magnitude>=0?"🔄 Switch to Negative":"🔄 Switch to Positive"})]})]}),(0,t.jsxs)(d.ControlGroup,{title:"Measurement Position",children:[(0,t.jsx)(d.ControlSlider,{label:"Cursor X",value:L.x,unit:"m",min:-10,max:10,step:.5,color:"#f59e0b",onChange:e=>z(new r.Vector3(e,L.y,L.z)),decimals:1}),(0,t.jsx)(d.ControlSlider,{label:"Cursor Y",value:L.y,unit:"m",min:-10,max:10,step:.5,color:"#f59e0b",onChange:e=>z(new r.Vector3(L.x,e,L.z)),decimals:1})]}),(0,t.jsx)(d.ControlGroup,{title:"Display Options",children:[{label:"Electric Field Lines",checked:w,onChange:S,color:"text-yellow-500"},{label:"Field Vectors Grid",checked:j,onChange:C,color:"text-cyan-500"},{label:"Equipotential Surfaces",checked:E,onChange:M,color:"text-purple-500"},{label:"Force Vectors",checked:A,onChange:_,color:"text-green-500"}].map(e=>(0,t.jsxs)("label",{className:"flex items-center justify-between text-sm text-gray-700 cursor-pointer py-2 px-3 bg-gray-100/50 rounded-lg border border-gray-300/50 hover:bg-gray-200/50 transition-colors",children:[(0,t.jsx)("span",{className:e.color,children:e.label}),(0,t.jsx)("input",{type:"checkbox",checked:e.checked,onChange:t=>e.onChange(t.target.checked),className:"w-4 h-4 rounded accent-purple-500"})]},e.label))}),(0,t.jsx)("button",{onClick:()=>e.push("/experiments/electromagnetic/details"),className:"w-full py-2.5 bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-700 font-medium text-sm rounded-lg transition-all border border-purple-300/50 flex items-center justify-center gap-2",children:"📖 View Experiment Details"})]}),F=s?(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{className:"text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2",children:"Field at Measurement Point"}),(0,t.jsx)(d.DataGrid,{data:{electricField:{value:s.electricField,unit:"N/C",color:"#f59e0b",decimals:2},potential:{value:s.potential,unit:"V",color:"#8b5cf6",decimals:2},fieldX:{value:s.fieldX,unit:"N/C",color:"#ef4444",decimals:2},fieldY:{value:s.fieldY,unit:"N/C",color:"#22c55e",decimals:2}},columns:2})]}),s.forcesBetweenCharges.length>0&&(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{className:"text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2",children:"Forces Between Charges"}),(0,t.jsx)("div",{className:"space-y-2",children:s.forcesBetweenCharges.map((e,i)=>(0,t.jsxs)("div",{className:"flex justify-between items-center bg-gray-50 rounded-lg p-2 text-sm",children:[(0,t.jsxs)("span",{className:"text-gray-600",children:[e.charge1," ↔ ",e.charge2]}),(0,t.jsxs)("div",{className:"text-right",children:[(0,t.jsxs)("div",{className:"font-semibold",style:{color:"#ec4899"},children:["F = ",e.force.toFixed(3)," N"]}),(0,t.jsxs)("div",{className:"text-xs text-gray-500",children:["d = ",e.distance.toFixed(2)," m"]})]})]},i))})]})]}):(0,t.jsx)("div",{className:"text-center text-gray-500 text-sm py-8",children:"Waiting for simulation data..."});return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(l.ExperimentContainer,{title:"Electromagnetic Field",description:"Visualize electric fields, forces, and equipotential surfaces",cameraPosition:[0,0,45],backgroundColor:"#030312",controls:null,dataPanel:null,children:(0,t.jsx)(a,{onDataChange:o,charges:U,showFieldLines:w,showVectors:j,showEquipotential:E,showForceVectors:A,cursorPosition:L})}),(0,t.jsx)(u.SimulationController,{isPlaying:m,onPlayPause:()=>g(e=>!e),onReset:()=>{g(!0),v(1),b(0),z(new r.Vector3(0,5,0))},speed:x,onSpeedChange:v,timeElapsed:y}),(0,t.jsx)(c.FloatingControlPanel,{title:"⚡ Electric Field Controls",initialPosition:{x:20,y:80},children:R}),(0,t.jsx)(f.DataPanel,{isVisible:p,onToggle:()=>h(!p),children:F})]})}],69255)}]);
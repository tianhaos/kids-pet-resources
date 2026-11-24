(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,i;var r=e.i(31067),s=e.i(71645),n=e.i(90072),o=e.i(48546),a=n,l=n;let c=new l.Box3,d=new l.Vector3;class m extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(i,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let r=new l.InstancedInterleavedBuffer(i,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(r,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(r,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),c.setFromBufferAttribute(t),this.boundingBox.union(c))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let r=0;for(let s=0,n=e.count;s<n;s++)d.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(d)),d.fromBufferAttribute(t,s),r=Math.max(r,i.distanceToSquared(d));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var f=n,h=e.i(8560),u=e.i(31497);class p extends f.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:f.UniformsUtils.clone(f.UniformsUtils.merge([h.UniformsLib.common,h.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new f.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
					#include <${u.version>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let x=u.version>=125?"uv1":"uv2",g=new a.Vector4,y=new a.Vector3,v=new a.Vector3,b=new a.Vector4,S=new a.Vector4,j=new a.Vector4,w=new a.Vector3,M=new a.Matrix4,E=new a.Line3,A=new a.Vector3,C=new a.Box3,_=new a.Sphere,L=new a.Vector4;function z(e,t,r){return L.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),L.multiplyScalar(1/L.w),L.x=i/r.width,L.y=i/r.height,L.applyMatrix4(e.projectionMatrixInverse),L.multiplyScalar(1/L.w),Math.abs(Math.max(L.x,L.y))}class T extends a.Mesh{constructor(e=new m,t=new p({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,s=0,n=t.count;e<n;e++,s+=2)y.fromBufferAttribute(t,e),v.fromBufferAttribute(i,e),r[s]=0===s?0:r[s-1],r[s+1]=r[s]+y.distanceTo(v);let s=new a.InstancedInterleavedBuffer(r,2,1);return e.setAttribute("instanceDistanceStart",new a.InterleavedBufferAttribute(s,1,0)),e.setAttribute("instanceDistanceEnd",new a.InterleavedBufferAttribute(s,1,1)),this}raycast(e,r){let s,n,o=this.material.worldUnits,l=e.camera;null!==l||o||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let d=this.matrixWorld,m=this.geometry,f=this.material;if(i=f.linewidth+c,null===m.boundingSphere&&m.computeBoundingSphere(),_.copy(m.boundingSphere).applyMatrix4(d),o)s=.5*i;else{let e=Math.max(l.near,_.distanceToPoint(t.origin));s=z(l,e,f.resolution)}if(_.radius+=s,!1!==t.intersectsSphere(_)){if(null===m.boundingBox&&m.computeBoundingBox(),C.copy(m.boundingBox).applyMatrix4(d),o)n=.5*i;else{let e=Math.max(l.near,C.distanceToPoint(t.origin));n=z(l,e,f.resolution)}C.expandByScalar(n),!1!==t.intersectsBox(C)&&(o?function(e,r){let s=e.matrixWorld,n=e.geometry,o=n.attributes.instanceStart,l=n.attributes.instanceEnd,c=Math.min(n.instanceCount,o.count);for(let n=0;n<c;n++){E.start.fromBufferAttribute(o,n),E.end.fromBufferAttribute(l,n),E.applyMatrix4(s);let c=new a.Vector3,d=new a.Vector3;t.distanceSqToSegment(E.start,E.end,d,c),d.distanceTo(c)<.5*i&&r.push({point:d,pointOnLine:c,distance:t.origin.distanceTo(d),object:e,face:null,faceIndex:n,uv:null,[x]:null})}}(this,r):function(e,r,s){let n=r.projectionMatrix,o=e.material.resolution,l=e.matrixWorld,c=e.geometry,d=c.attributes.instanceStart,m=c.attributes.instanceEnd,f=Math.min(c.instanceCount,d.count),h=-r.near;t.at(1,j),j.w=1,j.applyMatrix4(r.matrixWorldInverse),j.applyMatrix4(n),j.multiplyScalar(1/j.w),j.x*=o.x/2,j.y*=o.y/2,j.z=0,w.copy(j),M.multiplyMatrices(r.matrixWorldInverse,l);for(let r=0;r<f;r++){if(b.fromBufferAttribute(d,r),S.fromBufferAttribute(m,r),b.w=1,S.w=1,b.applyMatrix4(M),S.applyMatrix4(M),b.z>h&&S.z>h)continue;if(b.z>h){let e=b.z-S.z,t=(b.z-h)/e;b.lerp(S,t)}else if(S.z>h){let e=S.z-b.z,t=(S.z-h)/e;S.lerp(b,t)}b.applyMatrix4(n),S.applyMatrix4(n),b.multiplyScalar(1/b.w),S.multiplyScalar(1/S.w),b.x*=o.x/2,b.y*=o.y/2,S.x*=o.x/2,S.y*=o.y/2,E.start.copy(b),E.start.z=0,E.end.copy(S),E.end.z=0;let c=E.closestPointToPointParameter(w,!0);E.at(c,A);let f=a.MathUtils.lerp(b.z,S.z,c),u=f>=-1&&f<=1,p=w.distanceTo(A)<.5*i;if(u&&p){E.start.fromBufferAttribute(d,r),E.end.fromBufferAttribute(m,r),E.start.applyMatrix4(l),E.end.applyMatrix4(l);let i=new a.Vector3,n=new a.Vector3;t.distanceSqToSegment(E.start,E.end,n,i),s.push({point:n,pointOnLine:i,distance:t.origin.distanceTo(n),object:e,face:null,faceIndex:r,uv:null,[x]:null})}}}(this,l,r))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(g),this.material.uniforms.resolution.value.set(g.z,g.w))}}class U extends m{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let r=0;r<t;r+=3)i[2*r]=e[r],i[2*r+1]=e[r+1],i[2*r+2]=e[r+2],i[2*r+3]=e[r+3],i[2*r+4]=e[r+4],i[2*r+5]=e[r+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,r=new Float32Array(2*i);if(3===t)for(let s=0;s<i;s+=t)r[2*s]=e[s],r[2*s+1]=e[s+1],r[2*s+2]=e[s+2],r[2*s+3]=e[s+3],r[2*s+4]=e[s+4],r[2*s+5]=e[s+5];else for(let s=0;s<i;s+=t)r[2*s]=e[s],r[2*s+1]=e[s+1],r[2*s+2]=e[s+2],r[2*s+3]=e[s+3],r[2*s+4]=e[s+4],r[2*s+5]=e[s+5],r[2*s+6]=e[s+6],r[2*s+7]=e[s+7];return super.setColors(r,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class P extends T{constructor(e=new U,t=new p({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let B=s.forwardRef(function({points:e,color:t=0xffffff,vertexColors:i,linewidth:a,lineWidth:l,segments:c,dashed:d,...f},h){var u,x;let g=(0,o.useThree)(e=>e.size),y=s.useMemo(()=>c?new T:new P,[c]),[v]=s.useState(()=>new p),b=(null==i||null==(u=i[0])?void 0:u.length)===4?4:3,S=s.useMemo(()=>{let r=c?new m:new U,s=e.map(e=>{let t=Array.isArray(e);return e instanceof n.Vector3||e instanceof n.Vector4?[e.x,e.y,e.z]:e instanceof n.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(r.setPositions(s.flat()),i){t=0xffffff;let e=i.map(e=>e instanceof n.Color?e.toArray():e);r.setColors(e.flat(),b)}return r},[e,c,i,b]);return s.useLayoutEffect(()=>{y.computeLineDistances()},[e,y]),s.useLayoutEffect(()=>{d?v.defines.USE_DASH="":delete v.defines.USE_DASH,v.needsUpdate=!0},[d,v]),s.useEffect(()=>()=>{S.dispose(),v.dispose()},[S]),s.createElement("primitive",(0,r.default)({object:y,ref:h},f),s.createElement("primitive",{object:S,attach:"geometry"}),s.createElement("primitive",(0,r.default)({object:v,attach:"material",color:t,vertexColors:!!i,resolution:[g.width,g.height],linewidth:null!=(x=null!=a?a:l)?x:1,dashed:d,transparent:4===b},f)))});e.s(["Line",0,B],43216)},56420,e=>{"use strict";var t=e.i(71645);let i=(...e)=>e.filter((e,t,i)=>!!e&&""!==e.trim()&&i.indexOf(e)===t).join(" ").trim(),r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,i)=>i?i.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var s={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let n=(0,t.createContext)({}),o=(0,t.forwardRef)(({color:e,size:r,strokeWidth:o,absoluteStrokeWidth:a,className:l="",children:c,iconNode:d,...m},f)=>{let{size:h=24,strokeWidth:u=2,absoluteStrokeWidth:p=!1,color:x="currentColor",className:g=""}=(0,t.useContext)(n)??{},y=a??p?24*Number(o??u)/Number(r??h):o??u;return(0,t.createElement)("svg",{ref:f,...s,width:r??h??s.width,height:r??h??s.height,stroke:e??x,strokeWidth:y,className:i("lucide",g,l),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(m)&&{"aria-hidden":"true"},...m},[...d.map(([e,i])=>(0,t.createElement)(e,i)),...Array.isArray(c)?c:[c]])});e.s(["default",0,(e,s)=>{let n=(0,t.forwardRef)(({className:n,...a},l)=>(0,t.createElement)(o,{ref:l,iconNode:s,className:i(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,n),...a}));return n.displayName=r(e),n}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,i)=>{t.exports=e.r(76562)},7638,e=>{"use strict";var t=e.i(43476),i=e.i(71645),r=e.i(92989);e.i(81413);var s=e.i(48205),n=e.i(14228),o=e.i(82192),a=e.i(4685),l=e.i(68647),c=e.i(94800),d=e.i(43216),m=e.i(16196),f=e.i(90072);let h=function({activationEnergy:e,energyReleased:r,isPlaying:s,stepMode:n,currentStep:o,onProgressChange:a,onDataChange:l}){let h=(0,i.useRef)(null),u=(0,i.useRef)(null),p=(0,i.useRef)(null),x=(0,i.useRef)(null),g=(0,i.useRef)({progress:0,frameCount:0,exothermicMolecules:[],endothermicMolecules:[],exothermicTemp:298,endothermicTemp:298,heatWavePhase:0}),y=(0,i.useMemo)(()=>new f.Object3D,[]),[v,b]=(0,i.useState)({exothermicTemp:298,endothermicTemp:298,exothermicEnergy:80,endothermicEnergy:80,progress:0,currentStep:1});(0,i.useEffect)(()=>{let e=[],t=[];for(let i=0;i<20;i++)e.push({position:new f.Vector3((Math.random()-.5)*1.5,(Math.random()-.5)*1.5,(Math.random()-.5)*1.5),velocity:new f.Vector3((Math.random()-.5)*.01,(Math.random()-.5)*.01,(Math.random()-.5)*.01)}),t.push({position:new f.Vector3((Math.random()-.5)*1.5,(Math.random()-.5)*1.5,(Math.random()-.5)*1.5),velocity:new f.Vector3((Math.random()-.5)*.01,(Math.random()-.5)*.01,(Math.random()-.5)*.01)});g.current.exothermicMolecules=e,g.current.endothermicMolecules=t,g.current.exothermicTemp=298,g.current.endothermicTemp=298},[]);let S=(0,i.useMemo)(()=>{let t=[],i=80-r,s=80+r;for(let r=0;r<=40;r++){let n,o=r/40,a=(o-.5)*6;n=o<.3?80:o>.7?(i+s)/2:80+Math.sin((o-.3)/.4*Math.PI)*e,t.push([a,n/50-.5,0])}return t},[e,r]);(0,c.useFrame)((e,t)=>{if(!h.current||!u.current||!s)return;let i=g.current;if(n)switch(o){case 1:i.progress=0;break;case 2:i.progress=.25;break;case 3:i.progress=.5;break;case 4:i.progress=.75;break;case 5:i.progress=1}else i.progress<1&&(i.progress=Math.min(i.progress+.15*t,1));let c=.01+.04*i.progress;for(let e of i.exothermicMolecules){e.velocity.x+=(Math.random()-.5)*c,e.velocity.y+=(Math.random()-.5)*c,e.velocity.z+=(Math.random()-.5)*c;let r=.03+.08*i.progress;e.velocity.length()>r&&e.velocity.normalize().multiplyScalar(r),e.position.add(e.velocity.clone().multiplyScalar(60*t)),Math.abs(e.position.x)>.8&&(e.velocity.x*=-1),Math.abs(e.position.y)>.8&&(e.velocity.y*=-1),Math.abs(e.position.z)>.8&&(e.velocity.z*=-1)}let d=.02-.015*i.progress;for(let e of i.endothermicMolecules){e.velocity.x+=(Math.random()-.5)*d,e.velocity.y+=(Math.random()-.5)*d,e.velocity.z+=(Math.random()-.5)*d;let r=Math.max(.005,.04-.03*i.progress);e.velocity.length()>r&&e.velocity.normalize().multiplyScalar(r),e.position.add(e.velocity.clone().multiplyScalar(60*t)),Math.abs(e.position.x)>.8&&(e.velocity.x*=-1),Math.abs(e.position.y)>.8&&(e.velocity.y*=-1),Math.abs(e.position.z)>.8&&(e.velocity.z*=-1)}if(i.exothermicTemp=298+.8*r*i.progress,i.endothermicTemp=298-.4*r*i.progress,i.heatWavePhase+=2*t,p.current){for(let e=0;e<20;e++){let t=i.exothermicMolecules[e];if(t){y.position.copy(t.position);let r=.08+.03*i.progress;y.scale.set(r,r,r),y.updateMatrix(),p.current.setMatrixAt(e,y.matrix)}}p.current.instanceMatrix.needsUpdate=!0}if(x.current){for(let e=0;e<20;e++){let t=i.endothermicMolecules[e];if(t){y.position.copy(t.position);let r=.1-.02*i.progress;y.scale.set(r,r,r),y.updateMatrix(),x.current.setMatrixAt(e,y.matrix)}}x.current.instanceMatrix.needsUpdate=!0}if(i.frameCount++,i.frameCount%8==0){a?.(i.progress);let e={exothermicTemp:i.exothermicTemp,endothermicTemp:i.endothermicTemp,exothermicEnergy:80-r*i.progress,endothermicEnergy:80+r*i.progress,progress:i.progress,currentStep:n?o:Math.floor(5*i.progress)+1};b(e),l?.(e)}});let j=g.current.progress,w=(e,t)=>{let i=e-t;return i>30?{color:"#ef4444",emissive:"#ef4444"}:i>10?{color:"#f97316",emissive:"#f97316"}:i<-20?{color:"#3b82f6",emissive:"#3b82f6"}:i<-5?{color:"#06b6d4",emissive:"#06b6d4"}:{color:"#22c55e",emissive:"#22c55e"}},M=w(v.exothermicTemp,298),E=w(v.endothermicTemp,298);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("ambientLight",{intensity:.4}),(0,t.jsx)("directionalLight",{position:[10,10,5],intensity:.8,castShadow:!0}),(0,t.jsx)("pointLight",{position:[0,0,0],intensity:.3,color:"#6366f1"}),(0,t.jsxs)("group",{ref:h,position:[-3,1,0],children:[(0,t.jsxs)("mesh",{position:[0,0,0],children:[(0,t.jsx)("cylinderGeometry",{args:[1,1,1.5,32,1,!0]}),(0,t.jsx)("meshStandardMaterial",{color:"#ffffff",transparent:!0,opacity:.15,side:f.DoubleSide})]}),(0,t.jsxs)("mesh",{position:[0,-.2,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.92,.92,1,32]}),(0,t.jsx)("meshStandardMaterial",{color:M.color,transparent:!0,opacity:.6+.2*j,emissive:M.color,emissiveIntensity:.4*j})]}),(0,t.jsxs)("instancedMesh",{ref:p,args:[void 0,void 0,20],children:[(0,t.jsx)("sphereGeometry",{args:[1,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#ef4444",emissive:"#ef4444",emissiveIntensity:.3+.5*j})]}),j>.3&&(0,t.jsx)(t.Fragment,{children:Array.from({length:4}).map((e,i)=>(0,t.jsxs)("group",{position:[Math.cos(i/4*Math.PI*2)*(1.2+.5*j),.5,Math.sin(i/4*Math.PI*2)*(1.2+.5*j)],rotation:[0,i/4*Math.PI*2,0],children:[(0,t.jsxs)("mesh",{position:[.3,0,0],children:[(0,t.jsx)("coneGeometry",{args:[.1,.2,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#f97316",emissive:"#f97316",emissiveIntensity:.7,transparent:!0,opacity:1-.3*j})]}),(0,t.jsxs)("mesh",{children:[(0,t.jsx)("cylinderGeometry",{args:[.03,.03,.3,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#f97316",emissive:"#f97316",emissiveIntensity:.7,transparent:!0,opacity:1-.3*j})]})]},i))}),(0,t.jsx)(m.Text,{position:[0,1.2,0],fontSize:.15,color:"#ef4444",anchorX:"center",children:"EXOTHERMIC"}),(0,t.jsx)(m.Text,{position:[0,1,0],fontSize:.08,color:"#94a3b8",anchorX:"center",children:"Releases Energy"}),(0,t.jsxs)("group",{position:[0,-1.2,0],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("planeGeometry",{args:[1,.25]}),(0,t.jsx)("meshStandardMaterial",{color:"#1a1a2e",transparent:!0,opacity:.8})]}),(0,t.jsxs)(m.Text,{position:[0,.05,.01],fontSize:.1,color:"#ef4444",anchorX:"center",children:[v.exothermicTemp.toFixed(0)," K"]})]})]}),(0,t.jsxs)("group",{ref:u,position:[3,1,0],children:[(0,t.jsxs)("mesh",{position:[0,0,0],children:[(0,t.jsx)("cylinderGeometry",{args:[1,1,1.5,32,1,!0]}),(0,t.jsx)("meshStandardMaterial",{color:"#ffffff",transparent:!0,opacity:.15,side:f.DoubleSide})]}),(0,t.jsxs)("mesh",{position:[0,-.2,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.92,.92,1,32]}),(0,t.jsx)("meshStandardMaterial",{color:E.color,transparent:!0,opacity:.7-.1*j,emissive:E.color,emissiveIntensity:.2-.1*j})]}),(0,t.jsxs)("instancedMesh",{ref:x,args:[void 0,void 0,20],children:[(0,t.jsx)("sphereGeometry",{args:[1,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#3b82f6",emissive:"#3b82f6",emissiveIntensity:Math.max(.1,.3-.2*j)})]}),j>.3&&(0,t.jsx)(t.Fragment,{children:Array.from({length:4}).map((e,i)=>(0,t.jsxs)("group",{position:[Math.cos(i/4*Math.PI*2+Math.PI/4)*(1.2+.5*j),.5,Math.sin(i/4*Math.PI*2+Math.PI/4)*(1.2+.5*j)],rotation:[0,i/4*Math.PI*2+Math.PI/4+Math.PI,0],children:[(0,t.jsxs)("mesh",{position:[.3,0,0],children:[(0,t.jsx)("coneGeometry",{args:[.1,.2,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#3b82f6",emissive:"#3b82f6",emissiveIntensity:.6,transparent:!0,opacity:1-.2*j})]}),(0,t.jsxs)("mesh",{children:[(0,t.jsx)("cylinderGeometry",{args:[.03,.03,.3,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#3b82f6",emissive:"#3b82f6",emissiveIntensity:.6,transparent:!0,opacity:1-.2*j})]})]},i))}),(0,t.jsx)(m.Text,{position:[0,1.2,0],fontSize:.15,color:"#3b82f6",anchorX:"center",children:"ENDOTHERMIC"}),(0,t.jsx)(m.Text,{position:[0,1,0],fontSize:.08,color:"#94a3b8",anchorX:"center",children:"Absorbs Energy"}),(0,t.jsxs)("group",{position:[0,-1.2,0],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("planeGeometry",{args:[1,.25]}),(0,t.jsx)("meshStandardMaterial",{color:"#1a1a2e",transparent:!0,opacity:.8})]}),(0,t.jsxs)(m.Text,{position:[0,.05,.01],fontSize:.1,color:"#3b82f6",anchorX:"center",children:[v.endothermicTemp.toFixed(0)," K"]})]})]}),(0,t.jsxs)("group",{position:[0,-1,-2],children:[(0,t.jsxs)("mesh",{position:[0,0,-.05],children:[(0,t.jsx)("planeGeometry",{args:[7,2.5]}),(0,t.jsx)("meshStandardMaterial",{color:"#0a0a1a",transparent:!0,opacity:.9})]}),(0,t.jsxs)("mesh",{position:[0,-1,0],children:[(0,t.jsx)("boxGeometry",{args:[7,.05,.05]}),(0,t.jsx)("meshStandardMaterial",{color:"#666"})]}),(0,t.jsxs)("mesh",{position:[-3.2,0,0],children:[(0,t.jsx)("boxGeometry",{args:[.05,2,.05]}),(0,t.jsx)("meshStandardMaterial",{color:"#666"})]}),(0,t.jsx)(d.Line,{points:S,color:"#ffffff",lineWidth:2,opacity:.8}),(0,t.jsxs)("mesh",{position:[2.5,(80-r)/50-1,.1],children:[(0,t.jsx)("sphereGeometry",{args:[.08,16,16]}),(0,t.jsx)("meshBasicMaterial",{color:"#ef4444"})]}),(0,t.jsxs)("mesh",{position:[2.5,(80+r)/50-1,.1],children:[(0,t.jsx)("sphereGeometry",{args:[.08,16,16]}),(0,t.jsx)("meshBasicMaterial",{color:"#3b82f6"})]}),(0,t.jsxs)("mesh",{position:[-2.5,1.6-1,.1],children:[(0,t.jsx)("sphereGeometry",{args:[.08,16,16]}),(0,t.jsx)("meshBasicMaterial",{color:"#22c55e"})]}),(0,t.jsxs)("mesh",{position:[0,(80+e)/50-1,.1],children:[(0,t.jsx)("sphereGeometry",{args:[.08,16,16]}),(0,t.jsx)("meshBasicMaterial",{color:"#f59e0b"})]})]}),(0,t.jsxs)("group",{position:[0,-2.5,0],children:[(0,t.jsxs)("mesh",{position:[0,0,-.05],children:[(0,t.jsx)("planeGeometry",{args:[6,.8]}),(0,t.jsx)("meshStandardMaterial",{color:"#0a0a1a",transparent:!0,opacity:.85})]}),(0,t.jsxs)("group",{position:[-1.5,.1,0],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("boxGeometry",{args:[2.5,.15,.05]}),(0,t.jsx)("meshStandardMaterial",{color:"#1a1a2e"})]}),(0,t.jsxs)("mesh",{position:[-1.1+v.exothermicTemp/500*2.2,0,.03],children:[(0,t.jsx)("boxGeometry",{args:[v.exothermicTemp/500*2.2,.1,.03]}),(0,t.jsx)("meshStandardMaterial",{color:M.color,emissive:M.color,emissiveIntensity:.5})]})]}),(0,t.jsxs)("group",{position:[1.5,.1,0],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("boxGeometry",{args:[2.5,.15,.05]}),(0,t.jsx)("meshStandardMaterial",{color:"#1a1a2e"})]}),(0,t.jsxs)("mesh",{position:[-1.1+v.endothermicTemp/500*2.2,0,.03],children:[(0,t.jsx)("boxGeometry",{args:[v.endothermicTemp/500*2.2,.1,.03]}),(0,t.jsx)("meshStandardMaterial",{color:E.color,emissive:E.color,emissiveIntensity:.5})]})]}),(0,t.jsxs)(m.Text,{position:[-1.5,-.2,.01],fontSize:.08,color:"#ef4444",anchorX:"center",children:["Exothermic: ΔH = -",r," kJ/mol"]}),(0,t.jsxs)(m.Text,{position:[1.5,-.2,.01],fontSize:.08,color:"#3b82f6",anchorX:"center",children:["Endothermic: ΔH = +",r," kJ/mol"]})]}),(0,t.jsxs)("group",{position:[0,3.2,0],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("boxGeometry",{args:[4,.15,.05]}),(0,t.jsx)("meshStandardMaterial",{color:"#1a1a2e"})]}),(0,t.jsxs)("mesh",{position:[-2+4*j,0,.03],children:[(0,t.jsx)("boxGeometry",{args:[4*j,.1,.03]}),(0,t.jsx)("meshStandardMaterial",{color:"#8b5cf6",emissive:"#8b5cf6",emissiveIntensity:.5})]})]}),(0,t.jsx)("gridHelper",{args:[14,28,"#1a1a3e","#1a1a3e"],position:[0,-3,0]})]})};e.s(["default",0,function(){let e=(0,r.useRouter)(),[c,d]=(0,i.useState)(!0),[m,f]=(0,i.useState)(1),[u,p]=(0,i.useState)(0),[x,g]=(0,i.useState)(!0),[y,v]=(0,i.useState)(50),[b,S]=(0,i.useState)(40),[j,w]=(0,i.useState)(!1),[M,E]=(0,i.useState)(1),[A,C]=(0,i.useState)(0),[_,L]=(0,i.useState)({exothermicTemp:298,endothermicTemp:298,exothermicEnergy:80,endothermicEnergy:80,progress:0,currentStep:1}),z=(0,i.useCallback)(()=>{d(e=>!e)},[]),T=(0,i.useCallback)(()=>{p(e=>e+1),C(0),E(1)},[]),U=(0,i.useCallback)(e=>{f(e)},[]),P=(0,i.useCallback)(e=>{C(e)},[]),B=(0,i.useCallback)(e=>{L(e)},[]),I=(0,i.useCallback)(()=>{j&&M<5&&E(e=>e+1)},[j,M]),N=(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"bg-gradient-to-r from-red-50 to-blue-50 rounded-lg p-3 border border-red-200/50",children:[(0,t.jsx)("div",{className:"text-sm font-semibold text-gray-800 mb-1",children:"Side-by-Side Comparison"}),(0,t.jsx)("div",{className:"text-xs text-gray-600",children:"Comparing exothermic (releases heat) and endothermic (absorbs heat) reactions simultaneously"})]}),(0,t.jsxs)(l.ControlGroup,{title:"Energy Parameters",children:[(0,t.jsx)(l.ControlSlider,{label:"Activation Energy",value:y,unit:"kJ/mol",min:10,max:100,step:5,color:"#f59e0b",onChange:v,decimals:0}),(0,t.jsx)(l.ControlSlider,{label:"Energy Change",value:b,unit:"kJ/mol",min:10,max:80,step:5,color:"#8b5cf6",onChange:S,decimals:0})]}),(0,t.jsx)(l.ControlGroup,{title:"Mode",children:(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-2",children:[(0,t.jsx)("button",{onClick:()=>{w(!1),E(1),C(0)},className:`py-2 px-3 rounded-lg text-sm font-medium transition-all ${!j?"bg-purple-600 text-white":"bg-gray-200/50 text-gray-700 hover:bg-gray-300/50"}`,children:"Auto"}),(0,t.jsx)("button",{onClick:()=>{w(!0),E(1),C(0)},className:`py-2 px-3 rounded-lg text-sm font-medium transition-all ${j?"bg-purple-600 text-white":"bg-gray-200/50 text-gray-700 hover:bg-gray-300/50"}`,children:"Step"})]})}),j&&(0,t.jsx)("button",{onClick:I,disabled:M>=5,className:"w-full py-2.5 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium text-sm rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50",children:M>=5?"✓ Complete":`Step ${M}/5 - Next`}),(0,t.jsx)("button",{onClick:()=>e.push("/experiments/thermochemistry/details"),className:"w-full py-2.5 bg-gradient-to-r from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300 text-orange-700 font-medium text-sm rounded-lg transition-all border border-orange-300/50 flex items-center justify-center gap-2",children:"📖 View Experiment Details"})]}),O=["Reactants","Activation Energy","Transition State","Products Formed","Energy Transferred"],D=(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-3 mb-3",children:[(0,t.jsxs)("div",{className:"bg-red-900/30 rounded-lg p-2 border border-red-500/30",children:[(0,t.jsx)("div",{className:"text-xs text-red-400 mb-1",children:"Exothermic"}),(0,t.jsxs)("div",{className:"text-sm font-bold text-red-300",children:[_.exothermicTemp.toFixed(0)," K"]}),(0,t.jsxs)("div",{className:"text-xs text-gray-400",children:["-",b," kJ/mol"]})]}),(0,t.jsxs)("div",{className:"bg-blue-900/30 rounded-lg p-2 border border-blue-500/30",children:[(0,t.jsx)("div",{className:"text-xs text-blue-400 mb-1",children:"Endothermic"}),(0,t.jsxs)("div",{className:"text-sm font-bold text-blue-300",children:[_.endothermicTemp.toFixed(0)," K"]}),(0,t.jsxs)("div",{className:"text-xs text-gray-400",children:["+",b," kJ/mol"]})]})]}),(0,t.jsx)(l.DataGrid,{data:{exoTemp:{value:_.exothermicTemp,unit:"K (exo)",color:"#ef4444",decimals:0},endoTemp:{value:_.endothermicTemp,unit:"K (endo)",color:"#3b82f6",decimals:0},exoEnergy:{value:_.exothermicEnergy,unit:"kJ (exo)",color:"#f59e0b",decimals:0},endoEnergy:{value:_.endothermicEnergy,unit:"kJ (endo)",color:"#8b5cf6",decimals:0}},columns:2}),(0,t.jsxs)("div",{className:"mt-3 p-3 bg-gray-800/50 rounded-lg space-y-2",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)("span",{className:"text-gray-400 text-sm",children:"Progress:"}),(0,t.jsxs)("span",{className:"font-mono text-purple-400",children:[Math.round(100*A),"%"]})]}),(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)("span",{className:"text-gray-400 text-sm",children:"Step:"}),(0,t.jsx)("span",{className:"font-mono text-orange-400 text-sm",children:j?`${M}/5`:"Auto"})]}),(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)("span",{className:"text-gray-400 text-sm",children:"Status:"}),(0,t.jsx)("span",{className:"font-mono text-green-400 text-sm",children:O[M-1]||O[Math.floor(4.9*A)]})]})]})]});return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.ExperimentContainer,{title:"Thermochemistry",description:"Compare energy changes in exothermic and endothermic reactions",cameraPosition:[8,6,8],backgroundColor:"#050510",controls:null,dataPanel:null,children:(0,t.jsx)(h,{onDataChange:B,onProgressChange:P,activationEnergy:y,energyReleased:b,isPlaying:c,stepMode:j,currentStep:M})}),(0,t.jsx)(n.SimulationController,{isPlaying:c,onPlayPause:z,onReset:T,speed:m,onSpeedChange:U}),(0,t.jsx)(o.FloatingControlPanel,{title:"⚙️ Reaction Parameters",initialPosition:{x:20,y:80},children:N}),(0,t.jsx)(a.DataPanel,{isVisible:x,onToggle:()=>g(!x),children:D})]})}],7638)}]);
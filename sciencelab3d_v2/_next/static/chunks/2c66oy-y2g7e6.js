(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,i;var n=e.i(31067),r=e.i(71645),s=e.i(90072),o=e.i(48546),a=s,l=s;let c=new l.Box3,d=new l.Vector3;class u extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(i,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let n=new l.InstancedInterleavedBuffer(i,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(n,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),c.setFromBufferAttribute(t),this.boundingBox.union(c))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let r=0,s=e.count;r<s;r++)d.fromBufferAttribute(e,r),n=Math.max(n,i.distanceToSquared(d)),d.fromBufferAttribute(t,r),n=Math.max(n,i.distanceToSquared(d));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var f=s,h=e.i(8560),p=e.i(31497);class m extends f.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:f.UniformsUtils.clone(f.UniformsUtils.merge([h.UniformsLib.common,h.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new f.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let x=p.version>=125?"uv1":"uv2",g=new a.Vector4,y=new a.Vector3,v=new a.Vector3,b=new a.Vector4,S=new a.Vector4,w=new a.Vector4,j=new a.Vector3,M=new a.Matrix4,E=new a.Line3,A=new a.Vector3,C=new a.Box3,_=new a.Sphere,L=new a.Vector4;function z(e,t,n){return L.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),L.multiplyScalar(1/L.w),L.x=i/n.width,L.y=i/n.height,L.applyMatrix4(e.projectionMatrixInverse),L.multiplyScalar(1/L.w),Math.abs(Math.max(L.x,L.y))}class O extends a.Mesh{constructor(e=new u,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let e=0,r=0,s=t.count;e<s;e++,r+=2)y.fromBufferAttribute(t,e),v.fromBufferAttribute(i,e),n[r]=0===r?0:n[r-1],n[r+1]=n[r]+y.distanceTo(v);let r=new a.InstancedInterleavedBuffer(n,2,1);return e.setAttribute("instanceDistanceStart",new a.InterleavedBufferAttribute(r,1,0)),e.setAttribute("instanceDistanceEnd",new a.InterleavedBufferAttribute(r,1,1)),this}raycast(e,n){let r,s,o=this.material.worldUnits,l=e.camera;null!==l||o||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let d=this.matrixWorld,u=this.geometry,f=this.material;if(i=f.linewidth+c,null===u.boundingSphere&&u.computeBoundingSphere(),_.copy(u.boundingSphere).applyMatrix4(d),o)r=.5*i;else{let e=Math.max(l.near,_.distanceToPoint(t.origin));r=z(l,e,f.resolution)}if(_.radius+=r,!1!==t.intersectsSphere(_)){if(null===u.boundingBox&&u.computeBoundingBox(),C.copy(u.boundingBox).applyMatrix4(d),o)s=.5*i;else{let e=Math.max(l.near,C.distanceToPoint(t.origin));s=z(l,e,f.resolution)}C.expandByScalar(s),!1!==t.intersectsBox(C)&&(o?function(e,n){let r=e.matrixWorld,s=e.geometry,o=s.attributes.instanceStart,l=s.attributes.instanceEnd,c=Math.min(s.instanceCount,o.count);for(let s=0;s<c;s++){E.start.fromBufferAttribute(o,s),E.end.fromBufferAttribute(l,s),E.applyMatrix4(r);let c=new a.Vector3,d=new a.Vector3;t.distanceSqToSegment(E.start,E.end,d,c),d.distanceTo(c)<.5*i&&n.push({point:d,pointOnLine:c,distance:t.origin.distanceTo(d),object:e,face:null,faceIndex:s,uv:null,[x]:null})}}(this,n):function(e,n,r){let s=n.projectionMatrix,o=e.material.resolution,l=e.matrixWorld,c=e.geometry,d=c.attributes.instanceStart,u=c.attributes.instanceEnd,f=Math.min(c.instanceCount,d.count),h=-n.near;t.at(1,w),w.w=1,w.applyMatrix4(n.matrixWorldInverse),w.applyMatrix4(s),w.multiplyScalar(1/w.w),w.x*=o.x/2,w.y*=o.y/2,w.z=0,j.copy(w),M.multiplyMatrices(n.matrixWorldInverse,l);for(let n=0;n<f;n++){if(b.fromBufferAttribute(d,n),S.fromBufferAttribute(u,n),b.w=1,S.w=1,b.applyMatrix4(M),S.applyMatrix4(M),b.z>h&&S.z>h)continue;if(b.z>h){let e=b.z-S.z,t=(b.z-h)/e;b.lerp(S,t)}else if(S.z>h){let e=S.z-b.z,t=(S.z-h)/e;S.lerp(b,t)}b.applyMatrix4(s),S.applyMatrix4(s),b.multiplyScalar(1/b.w),S.multiplyScalar(1/S.w),b.x*=o.x/2,b.y*=o.y/2,S.x*=o.x/2,S.y*=o.y/2,E.start.copy(b),E.start.z=0,E.end.copy(S),E.end.z=0;let c=E.closestPointToPointParameter(j,!0);E.at(c,A);let f=a.MathUtils.lerp(b.z,S.z,c),p=f>=-1&&f<=1,m=j.distanceTo(A)<.5*i;if(p&&m){E.start.fromBufferAttribute(d,n),E.end.fromBufferAttribute(u,n),E.start.applyMatrix4(l),E.end.applyMatrix4(l);let i=new a.Vector3,s=new a.Vector3;t.distanceSqToSegment(E.start,E.end,s,i),r.push({point:s,pointOnLine:i,distance:t.origin.distanceTo(s),object:e,face:null,faceIndex:n,uv:null,[x]:null})}}}(this,l,n))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(g),this.material.uniforms.resolution.value.set(g.z,g.w))}}class U extends u{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,n=new Float32Array(2*i);if(3===t)for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];else for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5],n[2*r+6]=e[r+6],n[2*r+7]=e[r+7];return super.setColors(n,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class V extends O{constructor(e=new U,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let B=r.forwardRef(function({points:e,color:t=0xffffff,vertexColors:i,linewidth:a,lineWidth:l,segments:c,dashed:d,...f},h){var p,x;let g=(0,o.useThree)(e=>e.size),y=r.useMemo(()=>c?new O:new V,[c]),[v]=r.useState(()=>new m),b=(null==i||null==(p=i[0])?void 0:p.length)===4?4:3,S=r.useMemo(()=>{let n=c?new u:new U,r=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Vector3||e instanceof s.Vector4?[e.x,e.y,e.z]:e instanceof s.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(n.setPositions(r.flat()),i){t=0xffffff;let e=i.map(e=>e instanceof s.Color?e.toArray():e);n.setColors(e.flat(),b)}return n},[e,c,i,b]);return r.useLayoutEffect(()=>{y.computeLineDistances()},[e,y]),r.useLayoutEffect(()=>{d?v.defines.USE_DASH="":delete v.defines.USE_DASH,v.needsUpdate=!0},[d,v]),r.useEffect(()=>()=>{S.dispose(),v.dispose()},[S]),r.createElement("primitive",(0,n.default)({object:y,ref:h},f),r.createElement("primitive",{object:S,attach:"geometry"}),r.createElement("primitive",(0,n.default)({object:v,attach:"material",color:t,vertexColors:!!i,resolution:[g.width,g.height],linewidth:null!=(x=null!=a?a:l)?x:1,dashed:d,transparent:4===b},f)))});e.s(["Line",0,B],43216)},56420,e=>{"use strict";var t=e.i(71645);let i=(...e)=>e.filter((e,t,i)=>!!e&&""!==e.trim()&&i.indexOf(e)===t).join(" ").trim(),n=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,i)=>i?i.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,t.createContext)({}),o=(0,t.forwardRef)(({color:e,size:n,strokeWidth:o,absoluteStrokeWidth:a,className:l="",children:c,iconNode:d,...u},f)=>{let{size:h=24,strokeWidth:p=2,absoluteStrokeWidth:m=!1,color:x="currentColor",className:g=""}=(0,t.useContext)(s)??{},y=a??m?24*Number(o??p)/Number(n??h):o??p;return(0,t.createElement)("svg",{ref:f,...r,width:n??h??r.width,height:n??h??r.height,stroke:e??x,strokeWidth:y,className:i("lucide",g,l),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,i])=>(0,t.createElement)(e,i)),...Array.isArray(c)?c:[c]])});e.s(["default",0,(e,r)=>{let s=(0,t.forwardRef)(({className:s,...a},l)=>(0,t.createElement)(o,{ref:l,iconNode:r,className:i(`lucide-${n(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...a}));return s.displayName=n(e),s}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,i)=>{t.exports=e.r(76562)},430,e=>{"use strict";var t=e.i(43476),i=e.i(71645),n=e.i(92989),r=e.i(94800),s=e.i(43216),o=e.i(16196),a=e.i(90072);let l=[{id:1,title:"Setup",description:"Battery connected to electrodes in electrolyte solution"},{id:2,title:"Current Flows",description:"Electrons flow from battery through wires to electrodes"},{id:3,title:"Reactions Begin",description:"Water molecules split at electrode surfaces"},{id:4,title:"Gases Form",description:"H₂ bubbles form at cathode (-), O₂ at anode (+)"},{id:5,title:"Collection",description:"Gases collected in test tubes - H₂:O₂ ratio = 2:1"}];function c({voltage:e,electrolyte:n,isRunning:d,step:u,onDataChange:f}){let h=(0,i.useRef)(null),p=(0,i.useRef)(null),m=(0,i.useRef)(null),x=(0,i.useRef)(null),g=(0,i.useRef)({bubbles:[],electrons:[],frameCount:0,h2Volume:0,o2Volume:0,lastBubbleTime:0,electronOffset:0}),y=(0,i.useMemo)(()=>new a.Object3D,[]),[v,b]=(0,i.useState)({voltage:e,current:0,h2Volume:0,o2Volume:0,reactionStatus:"Ready",electrolyte:n,step:u});(0,i.useEffect)(()=>{let e=[];for(let t=0;t<200;t++)e.push({position:new a.Vector3(0,-100,0),velocity:new a.Vector3(0,0,0),type:"H2",active:!1});let t=[];for(let e=0;e<20;e++)t.push(new a.Vector3(0,-100,0));g.current.bubbles=e,g.current.electrons=t},[]);let S=()=>{switch(n){case"water":default:return"#4a90d9";case"nacl":return"#87ceeb";case"cuso4":return"#4169e1"}};(0,r.useFrame)((t,i)=>{if(!h.current)return;let r=Math.min(i,.02),s=g.current,o=t.clock.elapsedTime,a=.05*e;if(d&&u>=3&&o-s.lastBubbleTime>1/a){for(let e=0;e<2;e++){let e=s.bubbles.findIndex(e=>!e.active);if(-1!==e){let t=s.bubbles[e];t.position.set(-1.8+(Math.random()-.5)*.3,-1.2,(Math.random()-.5)*.3),t.velocity.set((Math.random()-.5)*.15,.4+.4*Math.random(),(Math.random()-.5)*.1),t.type="H2",t.active=!0,s.h2Volume+=.01}}let e=s.bubbles.findIndex(e=>!e.active);if(-1!==e){let t=s.bubbles[e];t.position.set(1.8+(Math.random()-.5)*.3,-1.2,(Math.random()-.5)*.3),t.velocity.set((Math.random()-.5)*.12,.3+.3*Math.random(),(Math.random()-.5)*.1),t.type="O2",t.active=!0,s.o2Volume+=.01}s.lastBubbleTime=o}for(let t=0;t<200;t++){let i=s.bubbles[t];if(i){if(i.active){let n=e/6;i.position.add(i.velocity.clone().multiplyScalar(r*n)),i.position.x+=.003*Math.sin(4*o+t),i.position.z+=.003*Math.cos(3*o+t),i.position.y>(u>=4?4:2.5)&&(i.active=!1,i.position.y=-100)}if(i.active){y.position.copy(i.position);let e="H2"===i.type?.05:.1;y.scale.set(e,e,e),y.updateMatrix(),h.current.setMatrixAt(t,y.matrix)}else y.position.set(0,-100,0),y.scale.set(0,0,0),y.updateMatrix(),h.current.setMatrixAt(t,y.matrix)}}if(h.current.instanceMatrix.needsUpdate=!0,u>=2&&(s.electronOffset=(s.electronOffset+r*e*.5)%1),s.frameCount++,s.frameCount%8==0){let t=d?.15*e:0,i={voltage:e,current:t,h2Volume:Math.min(s.h2Volume,50),o2Volume:Math.min(s.o2Volume,25),reactionStatus:d?1===u?"Setup complete":2===u?"Current flowing":3===u?"Reactions starting":u>=4?"Gases producing":"Ready":"Paused",electrolyte:n,step:u};b(i),f?.(i)}});let w="#ffff00";return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("gridHelper",{args:[20,40,"#1a1a2e","#1a1a2e"],position:[0,-2.5,0]}),(0,t.jsxs)("group",{position:[0,3.5,0],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("boxGeometry",{args:[1.2,.6,.5]}),(0,t.jsx)("meshStandardMaterial",{color:"#2d2d2d",metalness:.8,roughness:.3})]}),(0,t.jsxs)("mesh",{position:[.4,.5,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.06,.06,.3,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#dc2626",metalness:.7})]}),(0,t.jsxs)("mesh",{position:[-.4,.4,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.08,.08,.2,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#2563eb",metalness:.7})]}),(0,t.jsxs)(o.Text,{position:[0,0,.26],fontSize:.15,color:"#ffffff",anchorX:"center",anchorY:"middle",children:[e,"V"]}),(0,t.jsx)(o.Text,{position:[.5,.7,0],fontSize:.2,color:"#dc2626",anchorX:"center",children:"+"}),(0,t.jsx)(o.Text,{position:[-.5,.6,0],fontSize:.25,color:"#2563eb",anchorX:"center",children:"−"})]}),u>=2&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.Line,{points:[[-.5,3.5,0],[-.5,1.5,0],[-1.8,1.5,0],[-1.8,0,0]],color:"#b8860b",lineWidth:3}),(0,t.jsx)(s.Line,{points:[[.5,3.5,0],[.5,1.5,0],[1.8,1.5,0],[1.8,0,0]],color:"#b8860b",lineWidth:3}),(0,t.jsxs)("instancedMesh",{ref:p,args:[void 0,void 0,20],children:[(0,t.jsx)("sphereGeometry",{args:[.04,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:w,emissive:w,emissiveIntensity:.8})]})]}),(0,t.jsxs)("mesh",{position:[0,0,0],children:[(0,t.jsx)("cylinderGeometry",{args:[2.5,2.5,3.5,32,1,!0]}),(0,t.jsx)("meshStandardMaterial",{color:"#ffffff",transparent:!0,opacity:.15,side:a.DoubleSide})]}),(0,t.jsxs)("mesh",{position:[0,-1.75,0],children:[(0,t.jsx)("cylinderGeometry",{args:[2.5,2.5,.1,32]}),(0,t.jsx)("meshStandardMaterial",{color:"#ffffff",transparent:!0,opacity:.2})]}),(0,t.jsxs)("mesh",{position:[0,-.2,0],children:[(0,t.jsx)("cylinderGeometry",{args:[2.4,2.4,2.8,32]}),(0,t.jsx)("meshStandardMaterial",{color:S(),transparent:!0,opacity:.35})]}),(0,t.jsxs)("mesh",{position:[0,1.2,0],rotation:[-Math.PI/2,0,0],children:[(0,t.jsx)("circleGeometry",{args:[2.35,32]}),(0,t.jsx)("meshStandardMaterial",{color:S(),transparent:!0,opacity:.4,side:a.DoubleSide})]}),(0,t.jsxs)("group",{position:[-1.8,-.5,0],children:[(0,t.jsxs)("mesh",{ref:m,children:[(0,t.jsx)("cylinderGeometry",{args:[.12,.12,3,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#2563eb",metalness:.9,roughness:.1,emissive:"#2563eb",emissiveIntensity:d&&u>=3?.3:0})]}),(0,t.jsx)(o.Text,{position:[-.5,1.5,0],fontSize:.18,color:"#2563eb",anchorX:"right",children:"CATHODE (−)"}),u>=3&&(0,t.jsx)(o.Text,{position:[-.5,1.2,0],fontSize:.1,color:"#60a5fa",anchorX:"right",maxWidth:3,children:"2H₂O + 2e⁻ → H₂(g) + 2OH⁻"})]}),(0,t.jsxs)("group",{position:[1.8,-.5,0],children:[(0,t.jsxs)("mesh",{ref:x,children:[(0,t.jsx)("cylinderGeometry",{args:[.12,.12,3,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#dc2626",metalness:.9,roughness:.1,emissive:"#dc2626",emissiveIntensity:d&&u>=3?.3:0})]}),(0,t.jsx)(o.Text,{position:[.5,1.5,0],fontSize:.18,color:"#dc2626",anchorX:"left",children:"ANODE (+)"}),u>=3&&(0,t.jsx)(o.Text,{position:[.5,1.2,0],fontSize:.1,color:"#f87171",anchorX:"left",maxWidth:3,children:"2H₂O → O₂(g) + 4H⁺ + 4e⁻"})]}),u>=4&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("group",{position:[-1.8,2.5,0],children:[(0,t.jsxs)("mesh",{rotation:[0,0,0],children:[(0,t.jsx)("cylinderGeometry",{args:[.35,.35,2,16,1,!0]}),(0,t.jsx)("meshStandardMaterial",{color:"#ffffff",transparent:!0,opacity:.2,side:a.DoubleSide})]}),(0,t.jsxs)("mesh",{position:[0,-.5+Math.min(v.h2Volume/50,.8),0],children:[(0,t.jsx)("cylinderGeometry",{args:[.32,.32,Math.min(v.h2Volume/25,1.5),16]}),(0,t.jsx)("meshStandardMaterial",{color:"#2563eb",transparent:!0,opacity:.4})]}),[.3,.6,.9].map((e,i)=>(0,t.jsxs)("mesh",{position:[.36,-.8+e,0],children:[(0,t.jsx)("boxGeometry",{args:[.08,.015,.015]}),(0,t.jsx)("meshBasicMaterial",{color:"#ffffff"})]},i)),(0,t.jsx)(o.Text,{position:[0,1.1,0],fontSize:.15,color:"#2563eb",anchorX:"center",children:"H₂"})]}),(0,t.jsxs)("group",{position:[1.8,2.5,0],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("cylinderGeometry",{args:[.35,.35,2,16,1,!0]}),(0,t.jsx)("meshStandardMaterial",{color:"#ffffff",transparent:!0,opacity:.2,side:a.DoubleSide})]}),(0,t.jsxs)("mesh",{position:[0,-.5+Math.min(v.o2Volume/50,.4),0],children:[(0,t.jsx)("cylinderGeometry",{args:[.32,.32,Math.min(v.o2Volume/25,1.5),16]}),(0,t.jsx)("meshStandardMaterial",{color:"#dc2626",transparent:!0,opacity:.4})]}),[.3,.6,.9].map((e,i)=>(0,t.jsxs)("mesh",{position:[.36,-.8+e,0],children:[(0,t.jsx)("boxGeometry",{args:[.08,.015,.015]}),(0,t.jsx)("meshBasicMaterial",{color:"#ffffff"})]},i)),(0,t.jsx)(o.Text,{position:[0,1.1,0],fontSize:.15,color:"#dc2626",anchorX:"center",children:"O₂"})]})]}),(0,t.jsxs)("instancedMesh",{ref:h,args:[void 0,void 0,200],children:[(0,t.jsx)("sphereGeometry",{args:[1,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#ffffff",transparent:!0,opacity:.8,metalness:.1,roughness:.1})]}),u>=1&&u<=5&&(0,t.jsxs)("group",{position:[0,-2.2,3],children:[(0,t.jsxs)("mesh",{position:[0,0,-.1],children:[(0,t.jsx)("planeGeometry",{args:[4,.8]}),(0,t.jsx)("meshStandardMaterial",{color:"#0a0a1a",transparent:!0,opacity:.8})]}),(0,t.jsxs)(o.Text,{position:[0,.15,0],fontSize:.14,color:"#ffffff",anchorX:"center",children:["Step ",u,": ",l[u-1].title]}),(0,t.jsx)(o.Text,{position:[0,-.05,0],fontSize:.09,color:"#94a3b8",anchorX:"center",maxWidth:3.8,children:l[u-1].description})]}),u>=4&&v.h2Volume>1&&v.o2Volume>.5&&(0,t.jsxs)("group",{position:[0,4.5,0],children:[(0,t.jsxs)("mesh",{position:[0,0,-.05],children:[(0,t.jsx)("planeGeometry",{args:[4,.8]}),(0,t.jsx)("meshStandardMaterial",{color:"#0a0a1a",transparent:!0,opacity:.85})]}),(0,t.jsx)(o.Text,{position:[0,.15,0],fontSize:.11,color:"#ffffff",anchorX:"center",children:"Gas Volume Ratio (H₂:O₂)"}),(0,t.jsxs)(o.Text,{position:[0,-.1,0],fontSize:.18,color:v.h2Volume/Math.max(v.o2Volume,.1)>=1.8&&v.h2Volume/Math.max(v.o2Volume,.1)<=2.2?"#4ade80":"#f87171",anchorX:"center",children:[(v.h2Volume/Math.max(v.o2Volume,.1)).toFixed(1),":1"]}),(0,t.jsx)(o.Text,{position:[0,-.3,0],fontSize:.08,color:"#94a3b8",anchorX:"center",children:"Expected: 2:1 (Faraday's Law)"})]}),5===u&&(0,t.jsxs)("group",{position:[0,5.5,0],children:[(0,t.jsxs)("mesh",{position:[0,0,-.1],children:[(0,t.jsx)("planeGeometry",{args:[7,.7]}),(0,t.jsx)("meshStandardMaterial",{color:"#0a0a1a",transparent:!0,opacity:.92})]}),(0,t.jsx)(o.Text,{position:[0,.15,0],fontSize:.13,color:"#4ade80",anchorX:"center",children:"2H₂O(l) → 2H₂(g) + O₂(g)"}),(0,t.jsx)(o.Text,{position:[0,-.15,0],fontSize:.08,color:"#94a3b8",anchorX:"center",children:"Overall: 2 water molecules → 2 hydrogen + 1 oxygen"})]}),5===u&&(0,t.jsxs)("group",{position:[0,-2.2,3],children:[(0,t.jsxs)("mesh",{position:[0,0,-.1],children:[(0,t.jsx)("planeGeometry",{args:[5,1]}),(0,t.jsx)("meshStandardMaterial",{color:"#0a0a1a",transparent:!0,opacity:.85})]}),(0,t.jsx)(o.Text,{position:[0,.2,0],fontSize:.1,color:"#60a5fa",anchorX:"center",children:"At Cathode (-): 2H₂O + 2e⁻ → H₂ + 2OH⁻"}),(0,t.jsx)(o.Text,{position:[0,-.1,0],fontSize:.1,color:"#f87171",anchorX:"center",children:"At Anode (+): 2H₂O → O₂ + 4H⁺ + 4e⁻"})]})]})}e.i(81413);var d=e.i(48205),u=e.i(82192),f=e.i(68647),h=e.i(14228),p=e.i(4685);let m=[{id:1,title:"Setup",description:"Battery connected to electrodes in electrolyte solution"},{id:2,title:"Current Flows",description:"Electrons flow from battery through wires to electrodes"},{id:3,title:"Reactions Begin",description:"Water molecules split at electrode surfaces"},{id:4,title:"Gases Form",description:"H₂ bubbles form at cathode (-), O₂ at anode (+)"},{id:5,title:"Collection",description:"Gases collected in test tubes - H₂:O₂ ratio = 2:1"}];e.s(["default",0,function(){let e=(0,n.useRouter)(),[r,s]=(0,i.useState)(null),[o,a]=(0,i.useState)(!0),[l,x]=(0,i.useState)(!0),[g,y]=(0,i.useState)(1),[v,b]=(0,i.useState)(0),[S,w]=(0,i.useState)(6),[j,M]=(0,i.useState)("water"),[E,A]=(0,i.useState)("step-through"),[C,_]=(0,i.useState)(1),[L,z]=(0,i.useState)(null),O=e=>{if(A(e),L&&(clearInterval(L),z(null)),"autoplay"===e){_(1);let e=setInterval(()=>{_(t=>t>=5?(clearInterval(e),5):t+1)},4e3/g);z(e)}},U=(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsx)(f.ControlGroup,{title:"Simulation Mode",children:(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-2",children:[(0,t.jsx)("button",{onClick:()=>O("step-through"),className:`py-2 px-3 rounded-lg text-sm font-medium transition-all ${"step-through"===E?"bg-blue-600 text-white":"bg-gray-200/50 text-gray-700 hover:bg-gray-300/50"}`,children:"📝 Step-Through"}),(0,t.jsx)("button",{onClick:()=>O("autoplay"),className:`py-2 px-3 rounded-lg text-sm font-medium transition-all ${"autoplay"===E?"bg-blue-600 text-white":"bg-gray-200/50 text-gray-700 hover:bg-gray-300/50"}`,children:"▶️ Auto-Play"})]})}),"step-through"===E&&(0,t.jsxs)(f.ControlGroup,{title:"Step Navigation",children:[(0,t.jsx)("div",{className:"flex gap-1 flex-wrap",children:[1,2,3,4,5].map(e=>(0,t.jsx)("button",{onClick:()=>{_(e),"autoplay"===E&&L&&(clearInterval(L),z(null),A("step-through"))},className:`flex-1 min-w-[40px] py-2 px-2 rounded-lg text-sm font-medium transition-all ${C===e?"bg-green-600 text-white":"bg-gray-200/50 text-gray-700 hover:bg-gray-300/50"}`,children:e},e))}),(0,t.jsxs)("div",{className:"mt-2 p-2 bg-blue-50/80 rounded-lg text-xs text-blue-800",children:[(0,t.jsx)("p",{className:"font-semibold",children:m[C-1].title}),(0,t.jsx)("p",{className:"text-blue-600 mt-1",children:m[C-1].description})]})]}),(0,t.jsx)(f.ControlGroup,{title:"Voltage",children:(0,t.jsx)(f.ControlSlider,{label:"Voltage",value:S,unit:"V",min:1,max:12,step:.5,color:"#f59e0b",onChange:w,decimals:1})}),(0,t.jsx)(f.ControlGroup,{title:"Electrolyte Solution",children:(0,t.jsx)("div",{className:"space-y-2",children:["water","nacl","cuso4"].map(e=>(0,t.jsx)("button",{onClick:()=>M(e),className:`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all text-left ${j===e?"bg-blue-600 text-white":"bg-gray-200/50 text-gray-700 hover:bg-gray-300/50"}`,children:(e=>{switch(e){case"water":return"Pure Water (H₂O)";case"nacl":return"Salt Solution (NaCl)";case"cuso4":return"Copper Sulfate (CuSO₄)"}})(e)},e))})}),(0,t.jsx)(f.ControlGroup,{title:"Simulation Speed",children:(0,t.jsx)(f.ControlSlider,{label:"Speed",value:g,unit:"×",min:.25,max:3,step:.25,color:"#8b5cf6",onChange:y,decimals:2})}),(0,t.jsx)("button",{onClick:()=>e.push("/experiments/electrolysis/details"),className:"w-full py-2.5 bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-700 font-medium text-sm rounded-lg transition-all border border-blue-300/50 flex items-center justify-center gap-2",children:"📖 View Experiment Details"})]}),V=r?(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsx)(f.DataGrid,{data:{voltage:{value:r.voltage,unit:"V",color:"#f59e0b",decimals:1},current:{value:r.current,unit:"A",color:"#3b82f6",decimals:2},h2Volume:{value:r.h2Volume,unit:"mL",color:"#2563eb",decimals:1},o2Volume:{value:r.o2Volume,unit:"mL",color:"#dc2626",decimals:1}},columns:2}),(0,t.jsxs)("div",{className:"bg-gray-50/80 rounded-lg p-3 space-y-2",children:[(0,t.jsx)("div",{className:"text-xs font-semibold text-gray-600 uppercase tracking-wide",children:"Status"}),(0,t.jsx)("div",{className:"text-sm font-medium text-gray-800",children:r.reactionStatus}),(0,t.jsxs)("div",{className:"pt-2 border-t border-gray-200",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between text-xs",children:[(0,t.jsx)("span",{className:"text-gray-500",children:"Current Step"}),(0,t.jsxs)("span",{className:"font-bold text-blue-600",children:[C,"/5"]})]}),(0,t.jsx)("div",{className:"mt-1 flex gap-1",children:[1,2,3,4,5].map(e=>(0,t.jsx)("div",{className:`flex-1 h-1.5 rounded-full transition-all ${e<=C?"bg-blue-500":"bg-gray-200"}`},e))})]}),r.h2Volume>0&&r.o2Volume>0&&(0,t.jsxs)("div",{className:"pt-2 border-t border-gray-200",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between text-xs",children:[(0,t.jsx)("span",{className:"text-gray-500",children:"H₂:O₂ Ratio"}),(0,t.jsxs)("span",{className:"font-bold text-green-600",children:[(r.h2Volume/Math.max(r.o2Volume,.1)).toFixed(1),":1"]})]}),(0,t.jsx)("div",{className:"text-xs text-gray-400 mt-1",children:"Expected: 2:1"})]})]}),C>=3&&(0,t.jsxs)("div",{className:"bg-blue-50/80 rounded-lg p-3 space-y-2",children:[(0,t.jsx)("div",{className:"text-xs font-semibold text-blue-800 uppercase tracking-wide",children:"Reactions"}),(0,t.jsxs)("div",{className:"space-y-1.5 text-xs",children:[(0,t.jsxs)("div",{className:"flex items-start gap-2",children:[(0,t.jsx)("span",{className:"text-blue-600 font-bold shrink-0",children:"Cathode (−):"}),(0,t.jsx)("span",{className:"text-gray-700",children:"2H₂O + 2e⁻ → H₂(g) + 2OH⁻"})]}),(0,t.jsxs)("div",{className:"flex items-start gap-2",children:[(0,t.jsx)("span",{className:"text-red-600 font-bold shrink-0",children:"Anode (+):"}),(0,t.jsx)("span",{className:"text-gray-700",children:"2H₂O → O₂(g) + 4H⁺ + 4e⁻"})]})]})]})]}):(0,t.jsx)("div",{className:"text-center text-gray-500 text-sm py-8",children:"Waiting for simulation data..."});return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(d.ExperimentContainer,{title:"Electrolysis of Water",description:"Learn how electricity splits water into hydrogen and oxygen gas",cameraPosition:[12,10,12],backgroundColor:"#050510",controls:null,dataPanel:null,children:(0,t.jsx)(c,{onDataChange:s,voltage:S,electrolyte:j,isRunning:l,step:C})}),(0,t.jsx)(h.SimulationController,{isPlaying:l,onPlayPause:()=>{x(e=>!e)},onReset:()=>{b(e=>e+1),x(!0),y(1),_(1),L&&(clearInterval(L),z(null))},speed:g,onSpeedChange:y}),(0,t.jsx)(u.FloatingControlPanel,{title:"⚡ Electrolysis Controls",initialPosition:{x:20,y:80},children:U}),(0,t.jsx)(p.DataPanel,{isVisible:o,onToggle:()=>a(!o),children:V})]})}],430)}]);
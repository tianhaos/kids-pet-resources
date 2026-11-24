(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,i;var n=e.i(31067),r=e.i(71645),a=e.i(90072),s=e.i(48546),o=a,l=a;let d=new l.Box3,c=new l.Vector3;class u extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(i,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let n=new l.InstancedInterleavedBuffer(i,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(n,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),d.setFromBufferAttribute(t),this.boundingBox.union(d))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let r=0,a=e.count;r<a;r++)c.fromBufferAttribute(e,r),n=Math.max(n,i.distanceToSquared(c)),c.fromBufferAttribute(t,r),n=Math.max(n,i.distanceToSquared(c));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var f=a,p=e.i(8560),h=e.i(31497);class m extends f.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:f.UniformsUtils.clone(f.UniformsUtils.merge([p.UniformsLib.common,p.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new f.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let v=h.version>=125?"uv1":"uv2",g=new o.Vector4,x=new o.Vector3,y=new o.Vector3,b=new o.Vector4,S=new o.Vector4,w=new o.Vector4,E=new o.Vector3,A=new o.Matrix4,L=new o.Line3,_=new o.Vector3,C=new o.Box3,j=new o.Sphere,M=new o.Vector4;function U(e,t,n){return M.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),M.multiplyScalar(1/M.w),M.x=i/n.width,M.y=i/n.height,M.applyMatrix4(e.projectionMatrixInverse),M.multiplyScalar(1/M.w),Math.abs(Math.max(M.x,M.y))}class z extends o.Mesh{constructor(e=new u,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let e=0,r=0,a=t.count;e<a;e++,r+=2)x.fromBufferAttribute(t,e),y.fromBufferAttribute(i,e),n[r]=0===r?0:n[r-1],n[r+1]=n[r]+x.distanceTo(y);let r=new o.InstancedInterleavedBuffer(n,2,1);return e.setAttribute("instanceDistanceStart",new o.InterleavedBufferAttribute(r,1,0)),e.setAttribute("instanceDistanceEnd",new o.InterleavedBufferAttribute(r,1,1)),this}raycast(e,n){let r,a,s=this.material.worldUnits,l=e.camera;null!==l||s||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let d=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let c=this.matrixWorld,u=this.geometry,f=this.material;if(i=f.linewidth+d,null===u.boundingSphere&&u.computeBoundingSphere(),j.copy(u.boundingSphere).applyMatrix4(c),s)r=.5*i;else{let e=Math.max(l.near,j.distanceToPoint(t.origin));r=U(l,e,f.resolution)}if(j.radius+=r,!1!==t.intersectsSphere(j)){if(null===u.boundingBox&&u.computeBoundingBox(),C.copy(u.boundingBox).applyMatrix4(c),s)a=.5*i;else{let e=Math.max(l.near,C.distanceToPoint(t.origin));a=U(l,e,f.resolution)}C.expandByScalar(a),!1!==t.intersectsBox(C)&&(s?function(e,n){let r=e.matrixWorld,a=e.geometry,s=a.attributes.instanceStart,l=a.attributes.instanceEnd,d=Math.min(a.instanceCount,s.count);for(let a=0;a<d;a++){L.start.fromBufferAttribute(s,a),L.end.fromBufferAttribute(l,a),L.applyMatrix4(r);let d=new o.Vector3,c=new o.Vector3;t.distanceSqToSegment(L.start,L.end,c,d),c.distanceTo(d)<.5*i&&n.push({point:c,pointOnLine:d,distance:t.origin.distanceTo(c),object:e,face:null,faceIndex:a,uv:null,[v]:null})}}(this,n):function(e,n,r){let a=n.projectionMatrix,s=e.material.resolution,l=e.matrixWorld,d=e.geometry,c=d.attributes.instanceStart,u=d.attributes.instanceEnd,f=Math.min(d.instanceCount,c.count),p=-n.near;t.at(1,w),w.w=1,w.applyMatrix4(n.matrixWorldInverse),w.applyMatrix4(a),w.multiplyScalar(1/w.w),w.x*=s.x/2,w.y*=s.y/2,w.z=0,E.copy(w),A.multiplyMatrices(n.matrixWorldInverse,l);for(let n=0;n<f;n++){if(b.fromBufferAttribute(c,n),S.fromBufferAttribute(u,n),b.w=1,S.w=1,b.applyMatrix4(A),S.applyMatrix4(A),b.z>p&&S.z>p)continue;if(b.z>p){let e=b.z-S.z,t=(b.z-p)/e;b.lerp(S,t)}else if(S.z>p){let e=S.z-b.z,t=(S.z-p)/e;S.lerp(b,t)}b.applyMatrix4(a),S.applyMatrix4(a),b.multiplyScalar(1/b.w),S.multiplyScalar(1/S.w),b.x*=s.x/2,b.y*=s.y/2,S.x*=s.x/2,S.y*=s.y/2,L.start.copy(b),L.start.z=0,L.end.copy(S),L.end.z=0;let d=L.closestPointToPointParameter(E,!0);L.at(d,_);let f=o.MathUtils.lerp(b.z,S.z,d),h=f>=-1&&f<=1,m=E.distanceTo(_)<.5*i;if(h&&m){L.start.fromBufferAttribute(c,n),L.end.fromBufferAttribute(u,n),L.start.applyMatrix4(l),L.end.applyMatrix4(l);let i=new o.Vector3,a=new o.Vector3;t.distanceSqToSegment(L.start,L.end,a,i),r.push({point:a,pointOnLine:i,distance:t.origin.distanceTo(a),object:e,face:null,faceIndex:n,uv:null,[v]:null})}}}(this,l,n))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(g),this.material.uniforms.resolution.value.set(g.z,g.w))}}class B extends u{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,n=new Float32Array(2*i);if(3===t)for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];else for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5],n[2*r+6]=e[r+6],n[2*r+7]=e[r+7];return super.setColors(n,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class O extends z{constructor(e=new B,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let D=r.forwardRef(function({points:e,color:t=0xffffff,vertexColors:i,linewidth:o,lineWidth:l,segments:d,dashed:c,...f},p){var h,v;let g=(0,s.useThree)(e=>e.size),x=r.useMemo(()=>d?new z:new O,[d]),[y]=r.useState(()=>new m),b=(null==i||null==(h=i[0])?void 0:h.length)===4?4:3,S=r.useMemo(()=>{let n=d?new u:new B,r=e.map(e=>{let t=Array.isArray(e);return e instanceof a.Vector3||e instanceof a.Vector4?[e.x,e.y,e.z]:e instanceof a.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(n.setPositions(r.flat()),i){t=0xffffff;let e=i.map(e=>e instanceof a.Color?e.toArray():e);n.setColors(e.flat(),b)}return n},[e,d,i,b]);return r.useLayoutEffect(()=>{x.computeLineDistances()},[e,x]),r.useLayoutEffect(()=>{c?y.defines.USE_DASH="":delete y.defines.USE_DASH,y.needsUpdate=!0},[c,y]),r.useEffect(()=>()=>{S.dispose(),y.dispose()},[S]),r.createElement("primitive",(0,n.default)({object:x,ref:p},f),r.createElement("primitive",{object:S,attach:"geometry"}),r.createElement("primitive",(0,n.default)({object:y,attach:"material",color:t,vertexColors:!!i,resolution:[g.width,g.height],linewidth:null!=(v=null!=o?o:l)?v:1,dashed:c,transparent:4===b},f)))});e.s(["Line",0,D],43216)},56420,e=>{"use strict";var t=e.i(71645);let i=(...e)=>e.filter((e,t,i)=>!!e&&""!==e.trim()&&i.indexOf(e)===t).join(" ").trim(),n=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,i)=>i?i.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let a=(0,t.createContext)({}),s=(0,t.forwardRef)(({color:e,size:n,strokeWidth:s,absoluteStrokeWidth:o,className:l="",children:d,iconNode:c,...u},f)=>{let{size:p=24,strokeWidth:h=2,absoluteStrokeWidth:m=!1,color:v="currentColor",className:g=""}=(0,t.useContext)(a)??{},x=o??m?24*Number(s??h)/Number(n??p):s??h;return(0,t.createElement)("svg",{ref:f,...r,width:n??p??r.width,height:n??p??r.height,stroke:e??v,strokeWidth:x,className:i("lucide",g,l),...!d&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...c.map(([e,i])=>(0,t.createElement)(e,i)),...Array.isArray(d)?d:[d]])});e.s(["default",0,(e,r)=>{let a=(0,t.forwardRef)(({className:a,...o},l)=>(0,t.createElement)(s,{ref:l,iconNode:r,className:i(`lucide-${n(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,a),...o}));return a.displayName=n(e),a}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,i)=>{t.exports=e.r(76562)},47585,e=>{"use strict";var t=e.i(43476),i=e.i(71645),n=e.i(92989),r=e.i(94800),a=e.i(43216),s=e.i(90072);function o({functionType:e,showDerivative:n,showIntegral:l,showTangent:d,speed:c,showRiemann:u,riemannRects:f,isPlaying:p,onDataChange:h}){let m=(0,i.useRef)(0),v=(0,i.useRef)(0),g=(0,i.useRef)([[0,0,0],[0,0,0]]),x=(0,i.useRef)(0),y=(0,i.useRef)(0),b=(0,i.useRef)(0),S=(0,i.useRef)(0),[w,E]=(0,i.useState)([[0,0,0],[0,0,0]]),[A,L]=(0,i.useState)({x:0,y:0,slope:0,area:0,derivativeValue:0}),_=(0,i.useMemo)(()=>({quadratic:{f:e=>.1*e*e-2,df:e=>.2*e,color:"#3b82f6",integral:e=>.1/3*e*e*e-2*e},cubic:{f:e=>.05*e*e*e-.3*e,df:e=>.15*e*e-.3,color:"#22c55e",integral:e=>.0125*e*e*e*e-.15*e*e},sine:{f:e=>1.5*Math.sin(e),df:e=>1.5*Math.cos(e),color:"#a855f7",integral:e=>-(1.5*Math.cos(e))},exponential:{f:e=>.3*Math.exp(.3*e)-1,df:e=>.09*Math.exp(.3*e),color:"#f59e0b",integral:e=>.3*Math.exp(.3*e)/.3*e-e}}),[])[e],C=(0,i.useMemo)(()=>{let e=[];for(let t=0;t<=200;t++){let i=(t-100)*.05,n=_.f(i);e.push([i,n,0])}return e},[_,e]),j=(0,i.useMemo)(()=>{let e=[];for(let t=0;t<=200;t++){let i=(t-100)*.05,n=_.df(i);e.push([i,n,.5])}return e},[_,e]),M=(0,i.useCallback)(e=>{let t=0,i=u?f:100,n=Math.abs(e)/i,r=e<0?e:0;for(let e=0;e<i;e++){let i=r+e*n+n/2;t+=Math.abs(_.f(i))*n}return t},[_,u,f]),U=(0,i.useMemo)(()=>{if(!u)return[];let e=[],t=x.current,i=Math.abs(t)/f,n=t<0?t:0;for(let t=0;t<f;t++){let r=n+t*i,a=_.f(r+i/2);a>-5&&e.push({x:r+i/2,y:a/2,width:.9*i,height:Math.max(.1,Math.abs(a))})}return e},[u,f,_,x.current]),z=(0,i.useMemo)(()=>[[-10,0,0],[10,0,0]],[]),B=(0,i.useMemo)(()=>[[0,-5,0],[0,5,0]],[]);return(0,r.useFrame)((e,t)=>{if(!p)return;v.current++,m.current+=t*c;let i=3*Math.sin(.5*m.current),n=_.f(i),r=_.df(i),a=M(Math.abs(i));if(x.current=i,y.current=n,b.current=r,S.current=a,d&&(g.current=[[i-1.5,n-1.5*r,0],[i+1.5,n+1.5*r,0]]),v.current%8==0){E(g.current);let e={x:i,y:n,slope:r,area:a,derivativeValue:r};L(e),h?.(e)}}),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("ambientLight",{intensity:.5}),(0,t.jsx)("pointLight",{position:[10,10,10],intensity:.8}),(0,t.jsx)("pointLight",{position:[-5,5,5],intensity:.3,color:"#22c55e"}),(0,t.jsx)(a.Line,{points:C,color:_.color,lineWidth:3}),n&&(0,t.jsx)(a.Line,{points:j,color:"#ef4444",lineWidth:2,opacity:.6,transparent:!0}),d&&(0,t.jsx)(a.Line,{points:w,color:"#fbbf24",lineWidth:2}),d&&(0,t.jsxs)("mesh",{position:[x.current,y.current,0],children:[(0,t.jsx)("sphereGeometry",{args:[.15,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#fbbf24",emissive:"#fbbf24",emissiveIntensity:.5})]}),u&&U.map((e,i)=>(0,t.jsxs)("mesh",{position:[e.x,e.y,-.05],children:[(0,t.jsx)("boxGeometry",{args:[e.width,e.height,.1]}),(0,t.jsx)("meshStandardMaterial",{color:_.color,transparent:!0,opacity:.3,side:s.DoubleSide})]},i)),l&&!u&&(0,t.jsxs)("mesh",{position:[x.current/2,-1,-.1],children:[(0,t.jsx)("planeGeometry",{args:[2*Math.abs(x.current),2]}),(0,t.jsx)("meshStandardMaterial",{color:_.color,transparent:!0,opacity:.15,side:s.DoubleSide})]}),l&&(0,t.jsx)(a.Line,{points:[[0,0,.3],[x.current,0,.3],[x.current,.3*S.current,.3],[0,.3*S.current,.3],[0,0,.3]],color:"#22c55e",lineWidth:2,opacity:.7,transparent:!0}),(0,t.jsx)("gridHelper",{args:[20,20,"#1a1a3e","#1a1a3e"],position:[0,-3,0]}),(0,t.jsx)(a.Line,{points:z,color:"#666",lineWidth:1}),(0,t.jsx)(a.Line,{points:B,color:"#666",lineWidth:1}),(0,t.jsxs)("mesh",{position:[0,4.5,0],children:[(0,t.jsx)("planeGeometry",{args:[5,.5]}),(0,t.jsx)("meshBasicMaterial",{color:_.color,transparent:!0,opacity:.8})]})]})}e.i(81413);var l=e.i(48205),d=e.i(82192),c=e.i(68647),u=e.i(14228),f=e.i(4685);let p=["quadratic","cubic","sine","exponential"];e.s(["default",0,function(){let e=(0,n.useRouter)(),[r,a]=(0,i.useState)(null),[s,h]=(0,i.useState)(!0),[m,v]=(0,i.useState)(!0),[g,x]=(0,i.useState)(1),[y,b]=(0,i.useState)(0),[S,w]=(0,i.useState)("quadratic"),[E,A]=(0,i.useState)(!0),[L,_]=(0,i.useState)(!0),[C,j]=(0,i.useState)(!0),[M,U]=(0,i.useState)(!1),[z,B]=(0,i.useState)(10),[O,D]=(0,i.useState)(1),P=(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsx)(c.ControlGroup,{title:"Function Type",children:(0,t.jsx)("div",{className:"grid grid-cols-2 gap-2",children:p.map(e=>(0,t.jsx)("button",{onClick:()=>w(e),className:`py-2 px-3 text-sm rounded-lg transition-all capitalize ${S===e?"bg-green-600 text-white":"bg-gray-200 text-gray-700 hover:bg-gray-300"}`,children:e},e))})}),(0,t.jsxs)(c.ControlGroup,{title:"Visualization",children:[(0,t.jsx)(c.ControlSlider,{label:"Animation Speed",value:O,unit:"",min:.1,max:2,step:.1,color:"#22c55e",onChange:D,decimals:1}),[{label:"Show Derivative",checked:E,onChange:A},{label:"Show Integral Area",checked:L,onChange:_},{label:"Show Tangent Line",checked:C,onChange:j},{label:"Show Riemann Sum",checked:M,onChange:U}].map(e=>(0,t.jsxs)("label",{className:"flex items-center justify-between text-sm text-gray-700 cursor-pointer py-2 px-3 bg-gray-100/50 rounded-lg border border-gray-300/50",children:[(0,t.jsx)("span",{children:e.label}),(0,t.jsx)("input",{type:"checkbox",checked:e.checked,onChange:t=>e.onChange(t.target.checked),className:"w-4 h-4 rounded accent-green-500"})]},e.label)),M&&(0,t.jsx)(c.ControlSlider,{label:"Riemann Rectangles",value:z,unit:"",min:5,max:50,step:1,color:"#16a34a",onChange:B,decimals:0})]}),(0,t.jsxs)("div",{className:"bg-green-50/50 rounded-lg p-3 border border-green-200/50",children:[(0,t.jsx)("div",{className:"text-xs text-gray-600 mb-2 font-medium",children:"Calculus Concepts"}),(0,t.jsxs)("div",{className:"text-xs text-gray-500",children:["Derivative = instantaneous rate of change",(0,t.jsx)("br",{}),"Integral = area under the curve",(0,t.jsx)("br",{}),"Tangent = line touching at a point"]})]}),(0,t.jsx)("button",{onClick:()=>e.push("/experiments/calculus-visualizer/details"),className:"w-full py-2.5 bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 text-green-700 font-medium text-sm rounded-lg transition-all border border-green-300/50 flex items-center justify-center gap-2",children:"📖 View Experiment Details"})]}),R=r?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(c.DataGrid,{data:{x:{value:r.x,unit:"",color:"#3b82f6",decimals:2},y:{value:r.y,unit:"f(x)",color:"#22c55e",decimals:2},slope:{value:r.slope,unit:"f'(x)",color:"#ef4444",decimals:2},area:{value:Math.abs(r.area),unit:"∫",color:"#a855f7",decimals:2}},columns:2}),(0,t.jsx)("div",{className:"mt-3 p-3 bg-gray-800/50 rounded-lg",children:(0,t.jsx)("div",{className:"text-center font-mono text-green-400 text-sm",children:"f'(x) = lim[h→0] (f(x+h) - f(x))/h"})})]}):(0,t.jsx)("div",{className:"text-center text-gray-500 text-sm py-8",children:"Waiting for simulation data..."});return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(l.ExperimentContainer,{title:"Calculus Visualizer",description:"Explore derivatives, integrals, and tangent lines",cameraPosition:[12,8,12],backgroundColor:"#050510",controls:null,dataPanel:null,children:(0,t.jsx)(o,{onDataChange:a,functionType:S,showDerivative:E,showIntegral:L,showTangent:C,showRiemann:M,riemannRects:z,speed:O,isPlaying:m})}),(0,t.jsx)(u.SimulationController,{isPlaying:m,onPlayPause:()=>v(e=>!e),onReset:()=>{b(e=>e+1),v(!0),x(1),D(1)},speed:g,onSpeedChange:x}),(0,t.jsx)(d.FloatingControlPanel,{title:"⚙️ Calculus Settings",initialPosition:{x:20,y:80},children:P}),(0,t.jsx)(f.DataPanel,{isVisible:s,onToggle:()=>h(!s),children:R})]})}],47585)}]);
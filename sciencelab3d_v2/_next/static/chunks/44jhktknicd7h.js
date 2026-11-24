(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,i;var n=e.i(31067),r=e.i(71645),s=e.i(90072),a=e.i(48546),o=s,l=s;let d=new l.Box3,c=new l.Vector3;class u extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(i,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let n=new l.InstancedInterleavedBuffer(i,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(n,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),d.setFromBufferAttribute(t),this.boundingBox.union(d))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let r=0,s=e.count;r<s;r++)c.fromBufferAttribute(e,r),n=Math.max(n,i.distanceToSquared(c)),c.fromBufferAttribute(t,r),n=Math.max(n,i.distanceToSquared(c));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var f=s,m=e.i(8560),p=e.i(31497);class h extends f.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:f.UniformsUtils.clone(f.UniformsUtils.merge([m.UniformsLib.common,m.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new f.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let y=p.version>=125?"uv1":"uv2",v=new o.Vector4,g=new o.Vector3,x=new o.Vector3,b=new o.Vector4,S=new o.Vector4,w=new o.Vector4,A=new o.Vector3,E=new o.Matrix4,N=new o.Line3,j=new o.Vector3,M=new o.Box3,C=new o.Sphere,_=new o.Vector4;function L(e,t,n){return _.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),_.multiplyScalar(1/_.w),_.x=i/n.width,_.y=i/n.height,_.applyMatrix4(e.projectionMatrixInverse),_.multiplyScalar(1/_.w),Math.abs(Math.max(_.x,_.y))}class z extends o.Mesh{constructor(e=new u,t=new h({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let e=0,r=0,s=t.count;e<s;e++,r+=2)g.fromBufferAttribute(t,e),x.fromBufferAttribute(i,e),n[r]=0===r?0:n[r-1],n[r+1]=n[r]+g.distanceTo(x);let r=new o.InstancedInterleavedBuffer(n,2,1);return e.setAttribute("instanceDistanceStart",new o.InterleavedBufferAttribute(r,1,0)),e.setAttribute("instanceDistanceEnd",new o.InterleavedBufferAttribute(r,1,1)),this}raycast(e,n){let r,s,a=this.material.worldUnits,l=e.camera;null!==l||a||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let d=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let c=this.matrixWorld,u=this.geometry,f=this.material;if(i=f.linewidth+d,null===u.boundingSphere&&u.computeBoundingSphere(),C.copy(u.boundingSphere).applyMatrix4(c),a)r=.5*i;else{let e=Math.max(l.near,C.distanceToPoint(t.origin));r=L(l,e,f.resolution)}if(C.radius+=r,!1!==t.intersectsSphere(C)){if(null===u.boundingBox&&u.computeBoundingBox(),M.copy(u.boundingBox).applyMatrix4(c),a)s=.5*i;else{let e=Math.max(l.near,M.distanceToPoint(t.origin));s=L(l,e,f.resolution)}M.expandByScalar(s),!1!==t.intersectsBox(M)&&(a?function(e,n){let r=e.matrixWorld,s=e.geometry,a=s.attributes.instanceStart,l=s.attributes.instanceEnd,d=Math.min(s.instanceCount,a.count);for(let s=0;s<d;s++){N.start.fromBufferAttribute(a,s),N.end.fromBufferAttribute(l,s),N.applyMatrix4(r);let d=new o.Vector3,c=new o.Vector3;t.distanceSqToSegment(N.start,N.end,c,d),c.distanceTo(d)<.5*i&&n.push({point:c,pointOnLine:d,distance:t.origin.distanceTo(c),object:e,face:null,faceIndex:s,uv:null,[y]:null})}}(this,n):function(e,n,r){let s=n.projectionMatrix,a=e.material.resolution,l=e.matrixWorld,d=e.geometry,c=d.attributes.instanceStart,u=d.attributes.instanceEnd,f=Math.min(d.instanceCount,c.count),m=-n.near;t.at(1,w),w.w=1,w.applyMatrix4(n.matrixWorldInverse),w.applyMatrix4(s),w.multiplyScalar(1/w.w),w.x*=a.x/2,w.y*=a.y/2,w.z=0,A.copy(w),E.multiplyMatrices(n.matrixWorldInverse,l);for(let n=0;n<f;n++){if(b.fromBufferAttribute(c,n),S.fromBufferAttribute(u,n),b.w=1,S.w=1,b.applyMatrix4(E),S.applyMatrix4(E),b.z>m&&S.z>m)continue;if(b.z>m){let e=b.z-S.z,t=(b.z-m)/e;b.lerp(S,t)}else if(S.z>m){let e=S.z-b.z,t=(S.z-m)/e;S.lerp(b,t)}b.applyMatrix4(s),S.applyMatrix4(s),b.multiplyScalar(1/b.w),S.multiplyScalar(1/S.w),b.x*=a.x/2,b.y*=a.y/2,S.x*=a.x/2,S.y*=a.y/2,N.start.copy(b),N.start.z=0,N.end.copy(S),N.end.z=0;let d=N.closestPointToPointParameter(A,!0);N.at(d,j);let f=o.MathUtils.lerp(b.z,S.z,d),p=f>=-1&&f<=1,h=A.distanceTo(j)<.5*i;if(p&&h){N.start.fromBufferAttribute(c,n),N.end.fromBufferAttribute(u,n),N.start.applyMatrix4(l),N.end.applyMatrix4(l);let i=new o.Vector3,s=new o.Vector3;t.distanceSqToSegment(N.start,N.end,s,i),r.push({point:s,pointOnLine:i,distance:t.origin.distanceTo(s),object:e,face:null,faceIndex:n,uv:null,[y]:null})}}}(this,l,n))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(v),this.material.uniforms.resolution.value.set(v.z,v.w))}}class U extends u{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,n=new Float32Array(2*i);if(3===t)for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];else for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5],n[2*r+6]=e[r+6],n[2*r+7]=e[r+7];return super.setColors(n,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class B extends z{constructor(e=new U,t=new h({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let O=r.forwardRef(function({points:e,color:t=0xffffff,vertexColors:i,linewidth:o,lineWidth:l,segments:d,dashed:c,...f},m){var p,y;let v=(0,a.useThree)(e=>e.size),g=r.useMemo(()=>d?new z:new B,[d]),[x]=r.useState(()=>new h),b=(null==i||null==(p=i[0])?void 0:p.length)===4?4:3,S=r.useMemo(()=>{let n=d?new u:new U,r=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Vector3||e instanceof s.Vector4?[e.x,e.y,e.z]:e instanceof s.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(n.setPositions(r.flat()),i){t=0xffffff;let e=i.map(e=>e instanceof s.Color?e.toArray():e);n.setColors(e.flat(),b)}return n},[e,d,i,b]);return r.useLayoutEffect(()=>{g.computeLineDistances()},[e,g]),r.useLayoutEffect(()=>{c?x.defines.USE_DASH="":delete x.defines.USE_DASH,x.needsUpdate=!0},[c,x]),r.useEffect(()=>()=>{S.dispose(),x.dispose()},[S]),r.createElement("primitive",(0,n.default)({object:g,ref:m},f),r.createElement("primitive",{object:S,attach:"geometry"}),r.createElement("primitive",(0,n.default)({object:x,attach:"material",color:t,vertexColors:!!i,resolution:[v.width,v.height],linewidth:null!=(y=null!=o?o:l)?y:1,dashed:c,transparent:4===b},f)))});e.s(["Line",0,O],43216)},56420,e=>{"use strict";var t=e.i(71645);let i=(...e)=>e.filter((e,t,i)=>!!e&&""!==e.trim()&&i.indexOf(e)===t).join(" ").trim(),n=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,i)=>i?i.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,t.createContext)({}),a=(0,t.forwardRef)(({color:e,size:n,strokeWidth:a,absoluteStrokeWidth:o,className:l="",children:d,iconNode:c,...u},f)=>{let{size:m=24,strokeWidth:p=2,absoluteStrokeWidth:h=!1,color:y="currentColor",className:v=""}=(0,t.useContext)(s)??{},g=o??h?24*Number(a??p)/Number(n??m):a??p;return(0,t.createElement)("svg",{ref:f,...r,width:n??m??r.width,height:n??m??r.height,stroke:e??y,strokeWidth:g,className:i("lucide",v,l),...!d&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...c.map(([e,i])=>(0,t.createElement)(e,i)),...Array.isArray(d)?d:[d]])});e.s(["default",0,(e,r)=>{let s=(0,t.forwardRef)(({className:s,...o},l)=>(0,t.createElement)(a,{ref:l,iconNode:r,className:i(`lucide-${n(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...o}));return s.displayName=n(e),s}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,i)=>{t.exports=e.r(76562)},68663,e=>{"use strict";var t=e.i(43476),i=e.i(71645),n=e.i(92989),r=e.i(94800),s=e.i(90072),a=e.i(43216);let o={1:{name:"Hydrogen",symbol:"H",massNumber:1},2:{name:"Helium",symbol:"He",massNumber:4},3:{name:"Lithium",symbol:"Li",massNumber:7},4:{name:"Beryllium",symbol:"Be",massNumber:9},5:{name:"Boron",symbol:"B",massNumber:11},6:{name:"Carbon",symbol:"C",massNumber:12},7:{name:"Nitrogen",symbol:"N",massNumber:14},8:{name:"Oxygen",symbol:"O",massNumber:16},9:{name:"Fluorine",symbol:"F",massNumber:19},10:{name:"Neon",symbol:"Ne",massNumber:20},11:{name:"Sodium",symbol:"Na",massNumber:23},12:{name:"Magnesium",symbol:"Mg",massNumber:24},13:{name:"Aluminum",symbol:"Al",massNumber:27},14:{name:"Silicon",symbol:"Si",massNumber:28},15:{name:"Phosphorus",symbol:"P",massNumber:31},16:{name:"Sulfur",symbol:"S",massNumber:32},17:{name:"Chlorine",symbol:"Cl",massNumber:35},18:{name:"Argon",symbol:"Ar",massNumber:40},19:{name:"Potassium",symbol:"K",massNumber:39},20:{name:"Calcium",symbol:"Ca",massNumber:40}},l=[.53,2.12,4.77,8.47],d=[2,8,8,2];function c({atomicNumber:e,showElectronShells:n,animationSpeed:u,isPlaying:f,onDataChange:m}){let p=(0,i.useRef)(null),h=(0,i.useRef)(null),y=(0,i.useRef)(null),v=(0,i.useRef)([]),g=(0,i.useRef)(0),x=(0,i.useRef)(0),b=(0,i.useMemo)(()=>new s.Object3D,[]),S=e=>{let t=[],i=e;for(let e=0;e<d.length&&i>0;e++){let n=Math.min(i,d[e]);t.push(n),i-=n}return t};(0,i.useEffect)(()=>{let t=S(e),i=[];t.forEach((e,t)=>{let n=t+1,r=2/n;for(let t=0;t<e;t++){let s=t/e*Math.PI*2;i.push({angle:s,speed:r,shell:n,trail:[]})}}),v.current=i},[e]);let w=o[e]||{name:"Unknown",symbol:"?",massNumber:2*e},A=w.massNumber-e,E=S(e),N=(0,i.useMemo)(()=>{let t=[],i=e+A;for(let n=0;n<i;n++){let r=Math.acos(1-2*(n+.5)/i),s=Math.PI*(1+Math.sqrt(5))*(n+.5),a=.35+.15*Math.random();t.push({pos:[a*Math.sin(r)*Math.cos(s),a*Math.sin(r)*Math.sin(s),a*Math.cos(r)],type:n<e?"proton":"neutron"})}return t},[e,A]),j=(0,i.useMemo)(()=>l.map((e,t)=>.8*e),[]),M=E.map((e,t)=>({n:t+1,radius:j[t],count:e}));return(0,r.useFrame)((t,i)=>{if(!p.current||!h.current)return;g.current++,x.current+=i,p.current.rotation.y+=.05*i;let n=v.current;for(let e=0;e<50;e++)if(e<n.length){let t=n[e],r=j[t.shell-1];f&&(t.angle+=t.speed*i*u);let a=(e%3-1)*.3,o=Math.cos(t.angle)*r,l=Math.sin(t.angle)*r*Math.sin(a),d=Math.sin(t.angle)*r*Math.cos(a);b.position.set(o,l,d),b.scale.set(.1,.1,.1),b.updateMatrix(),h.current.setMatrixAt(e,b.matrix),f&&(t.trail.push(new s.Vector3(o,l,d)),t.trail.length>20&&t.trail.shift())}else b.position.set(0,-100,0),b.scale.set(0,0,0),b.updateMatrix(),h.current.setMatrixAt(e,b.matrix);if(h.current.instanceMatrix.needsUpdate=!0,y.current){let e=.3+.1*Math.sin(.003*Date.now());y.current.children.forEach(t=>{if(t instanceof s.Mesh){let i=t.material;void 0!==i.emissiveIntensity&&(i.emissiveIntensity=e)}})}if(g.current%8==0&&m){let t=E.map((e,t)=>({shell:t+1,count:e})),i=E.map((e,t)=>0===e?null:`${t+1}s${e}`).filter(Boolean);m({elementName:w.name,symbol:w.symbol,atomicNumber:e,massNumber:w.massNumber,electronConfig:i.join(" "),shellElectrons:t})}}),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("group",{ref:p,children:[(0,t.jsxs)("group",{ref:y,children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.6,32,32]}),(0,t.jsx)("meshBasicMaterial",{color:"#ff6b6b",transparent:!0,opacity:.15})]}),N.map((e,i)=>(0,t.jsxs)("mesh",{position:e.pos,castShadow:!0,children:[(0,t.jsx)("sphereGeometry",{args:[.12,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:"proton"===e.type?"#ef4444":"#9ca3af",emissive:"proton"===e.type?"#dc2626":"#6b7280",emissiveIntensity:.3,metalness:.2,roughness:.8})]},i))]}),n&&M.map(e=>(0,t.jsxs)("group",{children:[(0,t.jsxs)("mesh",{rotation:[Math.PI/2,0,0],children:[(0,t.jsx)("ringGeometry",{args:[e.radius-.015,e.radius+.015,64]}),(0,t.jsx)("meshStandardMaterial",{color:"#06b6d4",transparent:!0,opacity:.4,side:s.DoubleSide,emissive:"#06b6d4",emissiveIntensity:.2})]}),(0,t.jsxs)("mesh",{rotation:[Math.PI/2,0,0],children:[(0,t.jsx)("ringGeometry",{args:[0,e.radius,32]}),(0,t.jsx)("meshStandardMaterial",{color:"#06b6d4",transparent:!0,opacity:.03,side:s.DoubleSide})]})]},e.n)),(0,t.jsxs)("instancedMesh",{ref:h,args:[void 0,void 0,50],children:[(0,t.jsx)("sphereGeometry",{args:[1,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#22d3ee",emissive:"#06b6d4",emissiveIntensity:.8})]}),v.current.map((e,i)=>e.trail.length>1&&(0,t.jsx)(a.Line,{points:e.trail,color:"#22d3ee",opacity:.4,transparent:!0,lineWidth:1},`trail-${i}`))]}),(0,t.jsxs)("mesh",{position:[0,j[E.length-1]+1.5,0],children:[(0,t.jsx)("planeGeometry",{args:[3,.8]}),(0,t.jsx)("meshBasicMaterial",{color:"#0a0a1a",transparent:!0,opacity:.85})]}),(0,t.jsx)("ambientLight",{intensity:.4}),(0,t.jsx)("pointLight",{position:[5,5,5],intensity:1}),(0,t.jsx)("pointLight",{position:[-5,-5,-5],intensity:.5,color:"#06b6d4"}),(0,t.jsx)("gridHelper",{args:[15,30,"#1a1a3e","#0f0f2e"],position:[0,-6,0]})]})}e.i(81413);var u=e.i(48205),f=e.i(82192),m=e.i(68647),p=e.i(14228),h=e.i(4685);e.s(["default",0,function(){let e=(0,n.useRouter)(),[r,s]=(0,i.useState)(null),[a,o]=(0,i.useState)(!0),[l,d]=(0,i.useState)(!0),[y,v]=(0,i.useState)(1),[g,x]=(0,i.useState)(0),[b,S]=(0,i.useState)(6),[w,A]=(0,i.useState)(!0),E=(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)(m.ControlGroup,{title:"Atomic Parameters",children:[(0,t.jsx)(m.ControlSlider,{label:"Atomic Number (Z)",value:b,unit:"",min:1,max:20,step:1,color:"#ef4444",onChange:S,decimals:0}),(0,t.jsxs)("div",{className:"text-center py-2 px-3 bg-gradient-to-r from-red-50 to-purple-50 rounded-lg border border-red-200",children:[(0,t.jsx)("div",{className:"text-lg font-bold text-gray-800",children:{1:"H",2:"He",3:"Li",4:"Be",5:"B",6:"C",7:"N",8:"O",9:"F",10:"Ne",11:"Na",12:"Mg",13:"Al",14:"Si",15:"P",16:"S",17:"Cl",18:"Ar",19:"K",20:"Ca"}[b]||`Z${b}`}),(0,t.jsx)("div",{className:"text-xs text-gray-600",children:r?.elementName||"Element"})]})]}),(0,t.jsx)(m.ControlGroup,{title:"Display Options",children:[{label:"Electron Shells",checked:w,onChange:A}].map(e=>(0,t.jsxs)("label",{className:"flex items-center justify-between text-sm text-gray-700 cursor-pointer py-2 px-3 bg-gray-100/50 rounded-lg border border-gray-300/50",children:[(0,t.jsx)("span",{children:e.label}),(0,t.jsx)("input",{type:"checkbox",checked:e.checked,onChange:t=>e.onChange(t.target.checked),className:"w-4 h-4 rounded accent-red-500"})]},e.label))}),(0,t.jsx)(m.ControlGroup,{title:"Quick Select",children:(0,t.jsx)("div",{className:"grid grid-cols-4 gap-2",children:[{z:1,label:"H",name:"Hydrogen"},{z:2,label:"He",name:"Helium"},{z:6,label:"C",name:"Carbon"},{z:8,label:"O",name:"Oxygen"},{z:10,label:"Ne",name:"Neon"},{z:11,label:"Na",name:"Sodium"},{z:18,label:"Ar",name:"Argon"},{z:20,label:"Ca",name:"Calcium"}].map(e=>(0,t.jsx)("button",{onClick:()=>S(e.z),title:e.name,className:`py-2 px-1 text-sm rounded transition-all ${b===e.z?"bg-gradient-to-br from-red-500 to-purple-500 text-white font-bold shadow-lg":"bg-gray-200/50 text-gray-700 hover:bg-gray-300/50"}`,children:e.label},e.z))})}),(0,t.jsx)("button",{onClick:()=>e.push("/experiments/atomic-structure/details"),className:"w-full py-2.5 bg-gradient-to-r from-red-100 to-purple-100 hover:from-red-200 hover:to-purple-200 text-red-700 font-medium text-sm rounded-lg transition-all border border-red-300/50 flex items-center justify-center gap-2",children:"📖 View Experiment Details"})]}),N=r?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{className:"p-3 bg-gradient-to-r from-red-900/30 to-purple-900/30 rounded-lg border border-red-700/30",children:[(0,t.jsx)("div",{className:"text-xs text-gray-400 mb-1",children:"Element"}),(0,t.jsx)("div",{className:"text-2xl font-bold text-white",children:r.elementName}),(0,t.jsxs)("div",{className:"text-lg text-gray-300",children:[r.symbol," (Z=",r.atomicNumber,")"]})]}),(0,t.jsx)(m.DataGrid,{data:{atomicNumber:{value:r.atomicNumber,unit:"Z",color:"#ef4444",decimals:0},massNumber:{value:r.massNumber,unit:"A",color:"#9ca3af",decimals:0},electrons:{value:r.atomicNumber,unit:"e⁻",color:"#22d3ee",decimals:0}},columns:2}),(0,t.jsxs)("div",{className:"mt-3 space-y-2",children:[(0,t.jsxs)("div",{className:"p-3 bg-gray-800/50 rounded-lg",children:[(0,t.jsx)("div",{className:"text-xs text-gray-400 mb-1",children:"Electron Configuration"}),(0,t.jsx)("div",{className:"font-mono text-cyan-400 text-sm",children:r.electronConfig})]}),(0,t.jsxs)("div",{className:"p-3 bg-gray-800/50 rounded-lg",children:[(0,t.jsx)("div",{className:"text-xs text-gray-400 mb-1",children:"Shell Electrons"}),(0,t.jsx)("div",{className:"space-y-1",children:r.shellElectrons.map(e=>(0,t.jsxs)("div",{className:"flex justify-between items-center text-sm",children:[(0,t.jsxs)("span",{className:"text-gray-400",children:["n=",e.shell]}),(0,t.jsxs)("span",{className:"font-mono text-cyan-400",children:[e.count," e⁻"]})]},e.shell))})]})]})]}):(0,t.jsx)("div",{className:"text-center text-gray-500 text-sm py-8",children:"Loading atom data..."});return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(u.ExperimentContainer,{title:"Atomic Structure",description:"Explore the Bohr model of the atom with interactive 3D visualization",cameraPosition:[12,8,12],backgroundColor:"#050510",controls:null,dataPanel:null,children:(0,t.jsx)(c,{onDataChange:s,atomicNumber:b,showElectronShells:w,animationSpeed:y,isPlaying:l},`${b}-${g}`)}),(0,t.jsx)(p.SimulationController,{isPlaying:l,onPlayPause:()=>d(e=>!e),onReset:()=>{x(e=>e+1),d(!0),v(1),S(6)},speed:y,onSpeedChange:v}),(0,t.jsx)(f.FloatingControlPanel,{title:"⚛️ Atomic Controls",initialPosition:{x:20,y:80},children:E}),(0,t.jsx)(h.DataPanel,{isVisible:a,onToggle:()=>o(!a),children:N})]})}],68663)}]);
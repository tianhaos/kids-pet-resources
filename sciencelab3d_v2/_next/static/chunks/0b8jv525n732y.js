(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,i;var n=e.i(31067),r=e.i(71645),a=e.i(90072),o=e.i(48546),s=a,l=a;let d=new l.Box3,c=new l.Vector3;class u extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(i,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let n=new l.InstancedInterleavedBuffer(i,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(n,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),d.setFromBufferAttribute(t),this.boundingBox.union(d))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let r=0,a=e.count;r<a;r++)c.fromBufferAttribute(e,r),n=Math.max(n,i.distanceToSquared(c)),c.fromBufferAttribute(t,r),n=Math.max(n,i.distanceToSquared(c));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var f=a,p=e.i(8560),m=e.i(31497);class h extends f.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:f.UniformsUtils.clone(f.UniformsUtils.merge([p.UniformsLib.common,p.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new f.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let v=m.version>=125?"uv1":"uv2",x=new s.Vector4,g=new s.Vector3,y=new s.Vector3,S=new s.Vector4,w=new s.Vector4,b=new s.Vector4,A=new s.Vector3,E=new s.Matrix4,L=new s.Line3,M=new s.Vector3,_=new s.Box3,C=new s.Sphere,j=new s.Vector4;function U(e,t,n){return j.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),j.multiplyScalar(1/j.w),j.x=i/n.width,j.y=i/n.height,j.applyMatrix4(e.projectionMatrixInverse),j.multiplyScalar(1/j.w),Math.abs(Math.max(j.x,j.y))}class z extends s.Mesh{constructor(e=new u,t=new h({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let e=0,r=0,a=t.count;e<a;e++,r+=2)g.fromBufferAttribute(t,e),y.fromBufferAttribute(i,e),n[r]=0===r?0:n[r-1],n[r+1]=n[r]+g.distanceTo(y);let r=new s.InstancedInterleavedBuffer(n,2,1);return e.setAttribute("instanceDistanceStart",new s.InterleavedBufferAttribute(r,1,0)),e.setAttribute("instanceDistanceEnd",new s.InterleavedBufferAttribute(r,1,1)),this}raycast(e,n){let r,a,o=this.material.worldUnits,l=e.camera;null!==l||o||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let d=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let c=this.matrixWorld,u=this.geometry,f=this.material;if(i=f.linewidth+d,null===u.boundingSphere&&u.computeBoundingSphere(),C.copy(u.boundingSphere).applyMatrix4(c),o)r=.5*i;else{let e=Math.max(l.near,C.distanceToPoint(t.origin));r=U(l,e,f.resolution)}if(C.radius+=r,!1!==t.intersectsSphere(C)){if(null===u.boundingBox&&u.computeBoundingBox(),_.copy(u.boundingBox).applyMatrix4(c),o)a=.5*i;else{let e=Math.max(l.near,_.distanceToPoint(t.origin));a=U(l,e,f.resolution)}_.expandByScalar(a),!1!==t.intersectsBox(_)&&(o?function(e,n){let r=e.matrixWorld,a=e.geometry,o=a.attributes.instanceStart,l=a.attributes.instanceEnd,d=Math.min(a.instanceCount,o.count);for(let a=0;a<d;a++){L.start.fromBufferAttribute(o,a),L.end.fromBufferAttribute(l,a),L.applyMatrix4(r);let d=new s.Vector3,c=new s.Vector3;t.distanceSqToSegment(L.start,L.end,c,d),c.distanceTo(d)<.5*i&&n.push({point:c,pointOnLine:d,distance:t.origin.distanceTo(c),object:e,face:null,faceIndex:a,uv:null,[v]:null})}}(this,n):function(e,n,r){let a=n.projectionMatrix,o=e.material.resolution,l=e.matrixWorld,d=e.geometry,c=d.attributes.instanceStart,u=d.attributes.instanceEnd,f=Math.min(d.instanceCount,c.count),p=-n.near;t.at(1,b),b.w=1,b.applyMatrix4(n.matrixWorldInverse),b.applyMatrix4(a),b.multiplyScalar(1/b.w),b.x*=o.x/2,b.y*=o.y/2,b.z=0,A.copy(b),E.multiplyMatrices(n.matrixWorldInverse,l);for(let n=0;n<f;n++){if(S.fromBufferAttribute(c,n),w.fromBufferAttribute(u,n),S.w=1,w.w=1,S.applyMatrix4(E),w.applyMatrix4(E),S.z>p&&w.z>p)continue;if(S.z>p){let e=S.z-w.z,t=(S.z-p)/e;S.lerp(w,t)}else if(w.z>p){let e=w.z-S.z,t=(w.z-p)/e;w.lerp(S,t)}S.applyMatrix4(a),w.applyMatrix4(a),S.multiplyScalar(1/S.w),w.multiplyScalar(1/w.w),S.x*=o.x/2,S.y*=o.y/2,w.x*=o.x/2,w.y*=o.y/2,L.start.copy(S),L.start.z=0,L.end.copy(w),L.end.z=0;let d=L.closestPointToPointParameter(A,!0);L.at(d,M);let f=s.MathUtils.lerp(S.z,w.z,d),m=f>=-1&&f<=1,h=A.distanceTo(M)<.5*i;if(m&&h){L.start.fromBufferAttribute(c,n),L.end.fromBufferAttribute(u,n),L.start.applyMatrix4(l),L.end.applyMatrix4(l);let i=new s.Vector3,a=new s.Vector3;t.distanceSqToSegment(L.start,L.end,a,i),r.push({point:a,pointOnLine:i,distance:t.origin.distanceTo(a),object:e,face:null,faceIndex:n,uv:null,[v]:null})}}}(this,l,n))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(x),this.material.uniforms.resolution.value.set(x.z,x.w))}}class B extends u{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,n=new Float32Array(2*i);if(3===t)for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];else for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5],n[2*r+6]=e[r+6],n[2*r+7]=e[r+7];return super.setColors(n,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class O extends z{constructor(e=new B,t=new h({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let P=r.forwardRef(function({points:e,color:t=0xffffff,vertexColors:i,linewidth:s,lineWidth:l,segments:d,dashed:c,...f},p){var m,v;let x=(0,o.useThree)(e=>e.size),g=r.useMemo(()=>d?new z:new O,[d]),[y]=r.useState(()=>new h),S=(null==i||null==(m=i[0])?void 0:m.length)===4?4:3,w=r.useMemo(()=>{let n=d?new u:new B,r=e.map(e=>{let t=Array.isArray(e);return e instanceof a.Vector3||e instanceof a.Vector4?[e.x,e.y,e.z]:e instanceof a.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(n.setPositions(r.flat()),i){t=0xffffff;let e=i.map(e=>e instanceof a.Color?e.toArray():e);n.setColors(e.flat(),S)}return n},[e,d,i,S]);return r.useLayoutEffect(()=>{g.computeLineDistances()},[e,g]),r.useLayoutEffect(()=>{c?y.defines.USE_DASH="":delete y.defines.USE_DASH,y.needsUpdate=!0},[c,y]),r.useEffect(()=>()=>{w.dispose(),y.dispose()},[w]),r.createElement("primitive",(0,n.default)({object:g,ref:p},f),r.createElement("primitive",{object:w,attach:"geometry"}),r.createElement("primitive",(0,n.default)({object:y,attach:"material",color:t,vertexColors:!!i,resolution:[x.width,x.height],linewidth:null!=(v=null!=s?s:l)?v:1,dashed:c,transparent:4===S},f)))});e.s(["Line",0,P],43216)},56420,e=>{"use strict";var t=e.i(71645);let i=(...e)=>e.filter((e,t,i)=>!!e&&""!==e.trim()&&i.indexOf(e)===t).join(" ").trim(),n=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,i)=>i?i.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let a=(0,t.createContext)({}),o=(0,t.forwardRef)(({color:e,size:n,strokeWidth:o,absoluteStrokeWidth:s,className:l="",children:d,iconNode:c,...u},f)=>{let{size:p=24,strokeWidth:m=2,absoluteStrokeWidth:h=!1,color:v="currentColor",className:x=""}=(0,t.useContext)(a)??{},g=s??h?24*Number(o??m)/Number(n??p):o??m;return(0,t.createElement)("svg",{ref:f,...r,width:n??p??r.width,height:n??p??r.height,stroke:e??v,strokeWidth:g,className:i("lucide",x,l),...!d&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...c.map(([e,i])=>(0,t.createElement)(e,i)),...Array.isArray(d)?d:[d]])});e.s(["default",0,(e,r)=>{let a=(0,t.forwardRef)(({className:a,...s},l)=>(0,t.createElement)(o,{ref:l,iconNode:r,className:i(`lucide-${n(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,a),...s}));return a.displayName=n(e),a}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,i)=>{t.exports=e.r(76562)},71885,e=>{"use strict";var t=e.i(43476),i=e.i(71645),n=e.i(92989),r=e.i(94800),a=e.i(43216),o=e.i(90072);function s(e,t){let i=new o.Vector3(...e);return i.applyMatrix4(t),[i.x,i.y,i.z]}function l({showBasis:e,showTransform:n,rotation:d,scale:c,isPlaying:u,onDataChange:f}){let p=(0,i.useRef)(null),m=(0,i.useRef)(null),h=(0,i.useRef)({frameCount:0,time:0,rotationMatrix:new o.Matrix4,scaleMatrix:new o.Matrix4,shearMatrix:new o.Matrix4}),[,v]=(0,i.useState)({}),x=(0,i.useMemo)(()=>[{dir:[1,0,0],color:"#ef4444",label:"X"},{dir:[0,1,0],color:"#22c55e",label:"Y"},{dir:[0,0,1],color:"#3b82f6",label:"Z"}],[]),g=(0,i.useMemo)(()=>[new o.Vector3(1,1.5,.5).normalize(),new o.Vector3(-1,1,.8).normalize(),new o.Vector3(.5,-1.2,1).normalize()],[]),y=(0,i.useMemo)(()=>{let e=[];for(let t=-4;t<=4;t+=.5)for(let i=-4;i<=4;i+=.5)e.push([t,0,i]);return e},[]),S=(0,i.useCallback)(()=>{let e,t=h.current,i=new o.Matrix4().multiply(t.rotationMatrix).multiply(t.scaleMatrix),n=i.determinant(),r=i.elements[0]+i.elements[5],a=r*r-4*(i.elements[0]*i.elements[5]-i.elements[4]*i.elements[1]);if(a>=0){let t=Math.sqrt(a);e=[(r+t)/2,(r-t)/2]}let s=g[0].clone().multiplyScalar(c),l=new o.Vector3(1,0,0),d=s.clone().normalize().dot(l),u=180/Math.PI*Math.acos(Math.max(-1,Math.min(1,d)));f?.({vectorMagnitude:s.length(),dotProduct:d,angle:u,determinant:n,eigenvalues:e}),v({})},[g,c,f]);(0,r.useFrame)((e,t)=>{if(!u)return;let i=h.current;i.time+=t,i.frameCount++;let n=i.time*d*.3;i.rotationMatrix.makeRotationY(n);let r=.8+.3*Math.sin(.5*i.time);i.scaleMatrix.makeScale(r,r,r);let a=.3*Math.sin(.4*i.time);if(i.shearMatrix.set(1,a,0,0,0,1,0,0,0,0,1,0,0,0,0,1),p.current&&(p.current.rotation.y=.15*Math.sin(.2*i.time),p.current.rotation.x=.1*Math.sin(.15*i.time)),m.current){let e=new o.Matrix4().multiply(i.rotationMatrix).multiply(i.shearMatrix);m.current.matrix.copy(e),m.current.matrixAutoUpdate=!1}i.frameCount%8==0&&S()});let w=h.current,b=new o.Matrix4().multiply(w.rotationMatrix).multiply(w.shearMatrix),A=x.map(e=>{let t=s([3*e.dir[0],3*e.dir[1],3*e.dir[2]],b);return{...e,transformed:t}}),E=y.map(e=>s(e,b));return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("ambientLight",{intensity:.5}),(0,t.jsx)("pointLight",{position:[10,10,10],intensity:1}),(0,t.jsx)("pointLight",{position:[-10,-5,-10],intensity:.3,color:"#6366f1"}),(0,t.jsxs)("group",{ref:p,scale:[c,c,c],children:[e&&x.map(e=>(0,t.jsx)("group",{children:(0,t.jsx)(a.Line,{points:[[0,0,0],[2.5*e.dir[0],2.5*e.dir[1],2.5*e.dir[2]]],color:e.color,lineWidth:2,opacity:.3,transparent:!0})},`orig-${e.label}`)),n&&A.map(e=>(0,t.jsxs)("group",{children:[(0,t.jsx)(a.Line,{points:[[0,0,0],e.transformed],color:e.color,lineWidth:4}),(0,t.jsxs)("mesh",{position:e.transformed.map(e=>1.1*e),children:[(0,t.jsx)("coneGeometry",{args:[.15,.3,8]}),(0,t.jsx)("meshStandardMaterial",{color:e.color,emissive:e.color,emissiveIntensity:.4})]})]},`trans-${e.label}`)),n&&(0,t.jsxs)("group",{children:[Array.from({length:17},(e,i)=>{let n=E.slice(17*i,(i+1)*17);return n.length<2?null:(0,t.jsx)(a.Line,{points:n,color:"#4f46e5",lineWidth:1,opacity:.4,transparent:!0},`h-${i}`)}),Array.from({length:17},(e,i)=>{let n=E.filter((e,t)=>t%17===i);return n.length<2?null:(0,t.jsx)(a.Line,{points:n,color:"#4f46e5",lineWidth:1,opacity:.4,transparent:!0},`v-${i}`)})]}),g.map((e,i)=>{let r=i/g.length*.15+.1,l=new o.Color().setHSL(r,.8,.5),d=[2*e.x,2*e.y,2*e.z],c=s(d,b);return(0,t.jsxs)("group",{children:[(0,t.jsx)(a.Line,{points:[[0,0,0],d],color:l.getStyle(),lineWidth:2,opacity:.5,transparent:!0}),n&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(a.Line,{points:[[0,0,0],c],color:l.getStyle(),lineWidth:3}),(0,t.jsxs)("mesh",{position:c.map(e=>1.15*e),children:[(0,t.jsx)("sphereGeometry",{args:[.1,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:l,emissive:l,emissiveIntensity:.5})]})]})]},i)}),(0,t.jsxs)("mesh",{position:[0,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[.12,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#fff",emissive:"#fff",emissiveIntensity:.5})]})]}),(0,t.jsx)("gridHelper",{args:[15,15,"#1a1a3e","#1a1a3e"],position:[0,-.1,0]}),(0,t.jsx)(a.Line,{points:[[-8,0,0],[8,0,0]],color:"#333",lineWidth:1}),(0,t.jsx)(a.Line,{points:[[0,-8,0],[0,8,0]],color:"#333",lineWidth:1}),(0,t.jsx)(a.Line,{points:[[0,0,-8],[0,0,8]],color:"#333",lineWidth:1})]})}e.i(81413);var d=e.i(48205),c=e.i(82192),u=e.i(68647),f=e.i(14228),p=e.i(4685);e.s(["default",0,function(){let e=(0,n.useRouter)(),[r,a]=(0,i.useState)(null),[o,s]=(0,i.useState)(!0),[m,h]=(0,i.useState)(!0),[v,x]=(0,i.useState)(1),[g,y]=(0,i.useState)(0),[S,w]=(0,i.useState)(!0),[b,A]=(0,i.useState)(!0),[E,L]=(0,i.useState)(.5),[M,_]=(0,i.useState)(1),C=(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsx)(u.ControlGroup,{title:"Display Options",children:[{label:"Show Basis Vectors",checked:S,onChange:w},{label:"Show Transform",checked:b,onChange:A}].map(e=>(0,t.jsxs)("label",{className:"flex items-center justify-between text-sm text-gray-700 cursor-pointer py-2 px-3 bg-gray-100/50 rounded-lg border border-gray-300/50",children:[(0,t.jsx)("span",{children:e.label}),(0,t.jsx)("input",{type:"checkbox",checked:e.checked,onChange:t=>e.onChange(t.target.checked),className:"w-4 h-4 rounded accent-indigo-500"})]},e.label))}),(0,t.jsxs)(u.ControlGroup,{title:"Transformation",children:[(0,t.jsx)(u.ControlSlider,{label:"Rotation Speed",value:E,unit:"",min:0,max:2,step:.1,color:"#6366f1",onChange:L,decimals:1}),(0,t.jsx)(u.ControlSlider,{label:"Scale",value:M,unit:"",min:.5,max:2,step:.1,color:"#818cf8",onChange:_,decimals:1})]}),(0,t.jsx)("button",{onClick:()=>e.push("/experiments/linear-algebra/details"),className:"w-full py-2.5 bg-gradient-to-r from-indigo-100 to-indigo-200 hover:from-indigo-200 hover:to-indigo-300 text-indigo-700 font-medium text-sm rounded-lg transition-all border border-indigo-300/50 flex items-center justify-center gap-2",children:"📖 View Experiment Details"})]}),j=r?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(u.DataGrid,{data:{magnitude:{value:r.vectorMagnitude,unit:"||v||",color:"#fbbf24",decimals:2},dotProduct:{value:r.dotProduct,unit:"v·w",color:"#6366f1",decimals:2},angle:{value:r.angle,unit:"°",color:"#818cf8",decimals:1},determinant:{value:r.determinant??1,unit:"det",color:"#22c55e",decimals:2}},columns:1}),(0,t.jsx)("div",{className:"mt-3 p-3 bg-gray-800/50 rounded-lg",children:(0,t.jsx)("div",{className:"text-center font-mono text-indigo-400 text-sm",children:"||v|| = √(x² + y² + z²)"})})]}):(0,t.jsx)("div",{className:"text-center text-gray-500 text-sm py-8",children:"Waiting for simulation data..."});return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(d.ExperimentContainer,{title:"Linear Algebra",description:"Explore vectors, matrices, and transformations",cameraPosition:[12,8,12],backgroundColor:"#050510",controls:null,dataPanel:null,children:(0,t.jsx)(l,{onDataChange:a,showBasis:S,showTransform:b,rotation:E,scale:M,isPlaying:m})}),(0,t.jsx)(f.SimulationController,{isPlaying:m,onPlayPause:()=>h(e=>!e),onReset:()=>{y(e=>e+1),h(!0),x(1),L(.5),_(1)},speed:v,onSpeedChange:x}),(0,t.jsx)(c.FloatingControlPanel,{title:"⚙️ Vector Settings",initialPosition:{x:20,y:80},children:C}),(0,t.jsx)(p.DataPanel,{isVisible:o,onToggle:()=>s(!o),children:j})]})}],71885)}]);
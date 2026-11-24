(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,r;var i=e.i(31067),n=e.i(71645),s=e.i(90072),a=e.i(48546),o=s,l=s;let c=new l.Box3,d=new l.Vector3;class u extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,r=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),r.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let r=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(r,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(r,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let r;e instanceof Float32Array?r=e:Array.isArray(e)&&(r=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(r,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(i,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(i,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),c.setFromBufferAttribute(t),this.boundingBox.union(c))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let r=this.boundingSphere.center;this.boundingBox.getCenter(r);let i=0;for(let n=0,s=e.count;n<s;n++)d.fromBufferAttribute(e,n),i=Math.max(i,r.distanceToSquared(d)),d.fromBufferAttribute(t,n),i=Math.max(i,r.distanceToSquared(d));this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var f=s,m=e.i(8560),h=e.i(31497);class p extends f.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:f.UniformsUtils.clone(f.UniformsUtils.merge([m.UniformsLib.common,m.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new f.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let x=h.version>=125?"uv1":"uv2",v=new o.Vector4,g=new o.Vector3,y=new o.Vector3,b=new o.Vector4,w=new o.Vector4,j=new o.Vector4,S=new o.Vector3,M=new o.Matrix4,E=new o.Line3,A=new o.Vector3,C=new o.Box3,P=new o.Sphere,L=new o.Vector4;function _(e,t,i){return L.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),L.multiplyScalar(1/L.w),L.x=r/i.width,L.y=r/i.height,L.applyMatrix4(e.projectionMatrixInverse),L.multiplyScalar(1/L.w),Math.abs(Math.max(L.x,L.y))}class B extends o.Mesh{constructor(e=new u,t=new p({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,r=e.attributes.instanceEnd,i=new Float32Array(2*t.count);for(let e=0,n=0,s=t.count;e<s;e++,n+=2)g.fromBufferAttribute(t,e),y.fromBufferAttribute(r,e),i[n]=0===n?0:i[n-1],i[n+1]=i[n]+g.distanceTo(y);let n=new o.InstancedInterleavedBuffer(i,2,1);return e.setAttribute("instanceDistanceStart",new o.InterleavedBufferAttribute(n,1,0)),e.setAttribute("instanceDistanceEnd",new o.InterleavedBufferAttribute(n,1,1)),this}raycast(e,i){let n,s,a=this.material.worldUnits,l=e.camera;null!==l||a||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let d=this.matrixWorld,u=this.geometry,f=this.material;if(r=f.linewidth+c,null===u.boundingSphere&&u.computeBoundingSphere(),P.copy(u.boundingSphere).applyMatrix4(d),a)n=.5*r;else{let e=Math.max(l.near,P.distanceToPoint(t.origin));n=_(l,e,f.resolution)}if(P.radius+=n,!1!==t.intersectsSphere(P)){if(null===u.boundingBox&&u.computeBoundingBox(),C.copy(u.boundingBox).applyMatrix4(d),a)s=.5*r;else{let e=Math.max(l.near,C.distanceToPoint(t.origin));s=_(l,e,f.resolution)}C.expandByScalar(s),!1!==t.intersectsBox(C)&&(a?function(e,i){let n=e.matrixWorld,s=e.geometry,a=s.attributes.instanceStart,l=s.attributes.instanceEnd,c=Math.min(s.instanceCount,a.count);for(let s=0;s<c;s++){E.start.fromBufferAttribute(a,s),E.end.fromBufferAttribute(l,s),E.applyMatrix4(n);let c=new o.Vector3,d=new o.Vector3;t.distanceSqToSegment(E.start,E.end,d,c),d.distanceTo(c)<.5*r&&i.push({point:d,pointOnLine:c,distance:t.origin.distanceTo(d),object:e,face:null,faceIndex:s,uv:null,[x]:null})}}(this,i):function(e,i,n){let s=i.projectionMatrix,a=e.material.resolution,l=e.matrixWorld,c=e.geometry,d=c.attributes.instanceStart,u=c.attributes.instanceEnd,f=Math.min(c.instanceCount,d.count),m=-i.near;t.at(1,j),j.w=1,j.applyMatrix4(i.matrixWorldInverse),j.applyMatrix4(s),j.multiplyScalar(1/j.w),j.x*=a.x/2,j.y*=a.y/2,j.z=0,S.copy(j),M.multiplyMatrices(i.matrixWorldInverse,l);for(let i=0;i<f;i++){if(b.fromBufferAttribute(d,i),w.fromBufferAttribute(u,i),b.w=1,w.w=1,b.applyMatrix4(M),w.applyMatrix4(M),b.z>m&&w.z>m)continue;if(b.z>m){let e=b.z-w.z,t=(b.z-m)/e;b.lerp(w,t)}else if(w.z>m){let e=w.z-b.z,t=(w.z-m)/e;w.lerp(b,t)}b.applyMatrix4(s),w.applyMatrix4(s),b.multiplyScalar(1/b.w),w.multiplyScalar(1/w.w),b.x*=a.x/2,b.y*=a.y/2,w.x*=a.x/2,w.y*=a.y/2,E.start.copy(b),E.start.z=0,E.end.copy(w),E.end.z=0;let c=E.closestPointToPointParameter(S,!0);E.at(c,A);let f=o.MathUtils.lerp(b.z,w.z,c),h=f>=-1&&f<=1,p=S.distanceTo(A)<.5*r;if(h&&p){E.start.fromBufferAttribute(d,i),E.end.fromBufferAttribute(u,i),E.start.applyMatrix4(l),E.end.applyMatrix4(l);let r=new o.Vector3,s=new o.Vector3;t.distanceSqToSegment(E.start,E.end,s,r),n.push({point:s,pointOnLine:r,distance:t.origin.distanceTo(s),object:e,face:null,faceIndex:i,uv:null,[x]:null})}}}(this,l,i))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(v),this.material.uniforms.resolution.value.set(v.z,v.w))}}class U extends u{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,r=new Float32Array(2*t);for(let i=0;i<t;i+=3)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5];return super.setPositions(r),this}setColors(e,t=3){let r=e.length-t,i=new Float32Array(2*r);if(3===t)for(let n=0;n<r;n+=t)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];else for(let n=0;n<r;n+=t)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5],i[2*n+6]=e[n+6],i[2*n+7]=e[n+7];return super.setColors(i,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class N extends B{constructor(e=new U,t=new p({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let z=n.forwardRef(function({points:e,color:t=0xffffff,vertexColors:r,linewidth:o,lineWidth:l,segments:c,dashed:d,...f},m){var h,x;let v=(0,a.useThree)(e=>e.size),g=n.useMemo(()=>c?new B:new N,[c]),[y]=n.useState(()=>new p),b=(null==r||null==(h=r[0])?void 0:h.length)===4?4:3,w=n.useMemo(()=>{let i=c?new u:new U,n=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Vector3||e instanceof s.Vector4?[e.x,e.y,e.z]:e instanceof s.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(i.setPositions(n.flat()),r){t=0xffffff;let e=r.map(e=>e instanceof s.Color?e.toArray():e);i.setColors(e.flat(),b)}return i},[e,c,r,b]);return n.useLayoutEffect(()=>{g.computeLineDistances()},[e,g]),n.useLayoutEffect(()=>{d?y.defines.USE_DASH="":delete y.defines.USE_DASH,y.needsUpdate=!0},[d,y]),n.useEffect(()=>()=>{w.dispose(),y.dispose()},[w]),n.createElement("primitive",(0,i.default)({object:g,ref:m},f),n.createElement("primitive",{object:w,attach:"geometry"}),n.createElement("primitive",(0,i.default)({object:y,attach:"material",color:t,vertexColors:!!r,resolution:[v.width,v.height],linewidth:null!=(x=null!=o?o:l)?x:1,dashed:d,transparent:4===b},f)))});e.s(["Line",0,z],43216)},60099,e=>{"use strict";let t,r;var i=e.i(31067),n=e.i(71645),s=e.i(88014),a=e.i(90072),o=e.i(48546),l=e.i(94800);let c=new a.Vector3,d=new a.Vector3,u=new a.Vector3,f=new a.Vector2;function m(e,t,r){let i=c.setFromMatrixPosition(e.matrixWorld);i.project(t);let n=r.width/2,s=r.height/2;return[i.x*n+n,-(i.y*s)+s]}let h=e=>1e-10>Math.abs(e)?0:e;function p(e,t,r=""){let i="matrix3d(";for(let r=0;16!==r;r++)i+=h(t[r]*e.elements[r])+(15!==r?",":")");return r+i}let x=(t=[1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1],e=>p(e,t)),v=(r=e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1],(e,t)=>p(e,r(t),"translate(-50%,-50%)")),g=n.forwardRef(({children:e,eps:t=.001,style:r,className:p,prepend:g,center:y,fullscreen:b,portal:w,distanceFactor:j,sprite:S=!1,transform:M=!1,occlude:E,onOcclude:A,castShadow:C,receiveShadow:P,material:L,geometry:_,zIndexRange:B=[0x1000037,0],calculatePosition:U=m,as:N="div",wrapperClass:z,pointerEvents:R="auto",...O},F)=>{let{gl:I,camera:D,scene:T,size:V,raycaster:W,events:G,viewport:H}=(0,o.useThree)(),[k]=n.useState(()=>document.createElement(N)),$=n.useRef(null),q=n.useRef(null),Z=n.useRef(0),K=n.useRef([0,0]),J=n.useRef(null),Q=n.useRef(null),X=(null==w?void 0:w.current)||G.connected||I.domElement.parentNode,Y=n.useRef(null),ee=n.useRef(!1),et=n.useMemo(()=>{var e;return E&&"blending"!==E||Array.isArray(E)&&E.length&&(e=E[0])&&"object"==typeof e&&"current"in e},[E]);n.useLayoutEffect(()=>{let e=I.domElement;E&&"blending"===E?(e.style.zIndex=`${Math.floor(B[0]/2)}`,e.style.position="absolute",e.style.pointerEvents="none"):(e.style.zIndex=null,e.style.position=null,e.style.pointerEvents=null)},[E]),n.useLayoutEffect(()=>{if(q.current){let e=$.current=s.createRoot(k);if(T.updateMatrixWorld(),M)k.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";else{let e=U(q.current,D,V);k.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${e[0]}px,${e[1]}px,0);transform-origin:0 0;`}return X&&(g?X.prepend(k):X.appendChild(k)),()=>{X&&X.removeChild(k),e.unmount()}}},[X,M]),n.useLayoutEffect(()=>{z&&(k.className=z)},[z]);let er=n.useMemo(()=>M?{position:"absolute",top:0,left:0,width:V.width,height:V.height,transformStyle:"preserve-3d",pointerEvents:"none"}:{position:"absolute",transform:y?"translate3d(-50%,-50%,0)":"none",...b&&{top:-V.height/2,left:-V.width/2,width:V.width,height:V.height},...r},[r,y,b,V,M]),ei=n.useMemo(()=>({position:"absolute",pointerEvents:R}),[R]);n.useLayoutEffect(()=>{var t,i;ee.current=!1,M?null==(t=$.current)||t.render(n.createElement("div",{ref:J,style:er},n.createElement("div",{ref:Q,style:ei},n.createElement("div",{ref:F,className:p,style:r,children:e})))):null==(i=$.current)||i.render(n.createElement("div",{ref:F,style:er,className:p,children:e}))});let en=n.useRef(!0);(0,l.useFrame)(e=>{if(q.current){D.updateMatrixWorld(),q.current.updateWorldMatrix(!0,!1);let e=M?K.current:U(q.current,D,V);if(M||Math.abs(Z.current-D.zoom)>t||Math.abs(K.current[0]-e[0])>t||Math.abs(K.current[1]-e[1])>t){var r;let t,i,n,s,o=(r=q.current,t=c.setFromMatrixPosition(r.matrixWorld),i=d.setFromMatrixPosition(D.matrixWorld),n=t.sub(i),s=D.getWorldDirection(u),n.angleTo(s)>Math.PI/2),l=!1;et&&(Array.isArray(E)?l=E.map(e=>e.current):"blending"!==E&&(l=[T]));let m=en.current;l?en.current=function(e,t,r,i){let n=c.setFromMatrixPosition(e.matrixWorld),s=n.clone();s.project(t),f.set(s.x,s.y),r.setFromCamera(f,t);let a=r.intersectObjects(i,!0);if(a.length){let e=a[0].distance;return n.distanceTo(r.ray.origin)<e}return!0}(q.current,D,W,l)&&!o:en.current=!o,m!==en.current&&(A?A(!en.current):k.style.display=en.current?"block":"none");let p=Math.floor(B[0]/2),g=E?et?[B[0],p]:[p-1,0]:B;if(k.style.zIndex=`${function(e,t,r){if(t instanceof a.PerspectiveCamera||t instanceof a.OrthographicCamera){let i=c.setFromMatrixPosition(e.matrixWorld),n=d.setFromMatrixPosition(t.matrixWorld),s=i.distanceTo(n),a=(r[1]-r[0])/(t.far-t.near),o=r[1]-a*t.far;return Math.round(a*s+o)}}(q.current,D,g)}`,M){let[e,t]=[V.width/2,V.height/2],r=D.projectionMatrix.elements[5]*t,{isOrthographicCamera:i,top:n,left:s,bottom:a,right:o}=D,l=x(D.matrixWorldInverse),c=i?`scale(${r})translate(${h(-(o+s)/2)}px,${h((n+a)/2)}px)`:`translateZ(${r}px)`,d=q.current.matrixWorld;S&&((d=D.matrixWorldInverse.clone().transpose().copyPosition(d).scale(q.current.scale)).elements[3]=d.elements[7]=d.elements[11]=0,d.elements[15]=1),k.style.width=V.width+"px",k.style.height=V.height+"px",k.style.perspective=i?"":`${r}px`,J.current&&Q.current&&(J.current.style.transform=`${c}${l}translate(${e}px,${t}px)`,Q.current.style.transform=v(d,1/((j||10)/400)))}else{let t=void 0===j?1:function(e,t){if(t instanceof a.OrthographicCamera)return t.zoom;if(!(t instanceof a.PerspectiveCamera))return 1;{let r=c.setFromMatrixPosition(e.matrixWorld),i=d.setFromMatrixPosition(t.matrixWorld);return 1/(2*Math.tan(t.fov*Math.PI/180/2)*r.distanceTo(i))}}(q.current,D)*j;k.style.transform=`translate3d(${e[0]}px,${e[1]}px,0) scale(${t})`}K.current=e,Z.current=D.zoom}}if(!et&&Y.current&&!ee.current)if(M){if(J.current){let e=J.current.children[0];if(null!=e&&e.clientWidth&&null!=e&&e.clientHeight){let{isOrthographicCamera:t}=D;if(t||_)O.scale&&(Array.isArray(O.scale)?O.scale instanceof a.Vector3?Y.current.scale.copy(O.scale.clone().divideScalar(1)):Y.current.scale.set(1/O.scale[0],1/O.scale[1],1/O.scale[2]):Y.current.scale.setScalar(1/O.scale));else{let t=(j||10)/400,r=e.clientWidth*t,i=e.clientHeight*t;Y.current.scale.set(r,i,1)}ee.current=!0}}}else{let t=k.children[0];if(null!=t&&t.clientWidth&&null!=t&&t.clientHeight){let e=1/H.factor,r=t.clientWidth*e,i=t.clientHeight*e;Y.current.scale.set(r,i,1),ee.current=!0}Y.current.lookAt(e.camera.position)}});let es=n.useMemo(()=>({vertexShader:M?void 0:`
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
      `}),[M]);return n.createElement("group",(0,i.default)({},O,{ref:q}),E&&!et&&n.createElement("mesh",{castShadow:C,receiveShadow:P,ref:Y},_||n.createElement("planeGeometry",null),L||n.createElement("shaderMaterial",{side:a.DoubleSide,vertexShader:es.vertexShader,fragmentShader:es.fragmentShader})))});e.s(["Html",0,g])},56420,e=>{"use strict";var t=e.i(71645);let r=(...e)=>e.filter((e,t,r)=>!!e&&""!==e.trim()&&r.indexOf(e)===t).join(" ").trim(),i=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,r)=>r?r.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var n={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,t.createContext)({}),a=(0,t.forwardRef)(({color:e,size:i,strokeWidth:a,absoluteStrokeWidth:o,className:l="",children:c,iconNode:d,...u},f)=>{let{size:m=24,strokeWidth:h=2,absoluteStrokeWidth:p=!1,color:x="currentColor",className:v=""}=(0,t.useContext)(s)??{},g=o??p?24*Number(a??h)/Number(i??m):a??h;return(0,t.createElement)("svg",{ref:f,...n,width:i??m??n.width,height:i??m??n.height,stroke:e??x,strokeWidth:g,className:r("lucide",v,l),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,r])=>(0,t.createElement)(e,r)),...Array.isArray(c)?c:[c]])});e.s(["default",0,(e,n)=>{let s=(0,t.forwardRef)(({className:s,...o},l)=>(0,t.createElement)(a,{ref:l,iconNode:n,className:r(`lucide-${i(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...o}));return s.displayName=i(e),s}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,r)=>{t.exports=e.r(76562)},88820,e=>{"use strict";var t=e.i(43476),r=e.i(71645),i=e.i(92989),n=e.i(94800),s=e.i(43216),a=e.i(60099),o=e.i(90072);let l=[[-8,0,0],[-6,0,0],[-4,0,0],[-2,0,0],[0,0,0],[2,0,0],[4,0,0],[5,0,0],[5,2,0],[5,4,0],[3,4,0],[1,4,0],[-1,4,0],[-3,4,0],[-5,4,0],[-7,4,0],[-7,2,0],[-7,0,0],[-8,0,0]];function c({voltage:e,position:r}){return(0,t.jsxs)("group",{position:r,children:[(0,t.jsxs)("mesh",{castShadow:!0,receiveShadow:!0,children:[(0,t.jsx)("cylinderGeometry",{args:[1.2,1.2,3.5,24]}),(0,t.jsx)("meshStandardMaterial",{color:"#1a1a2e",metalness:.7,roughness:.3})]}),(0,t.jsxs)("mesh",{position:[0,0,1.3],rotation:[0,0,0],children:[(0,t.jsx)("planeGeometry",{args:[1.8,.8]}),(0,t.jsx)("meshBasicMaterial",{color:"#fbbf24"})]}),(0,t.jsx)(a.Html,{position:[0,0,1.35],center:!0,distanceFactor:12,children:(0,t.jsxs)("div",{className:"text-sm font-bold text-black bg-yellow-400 px-2 py-1 rounded font-mono",children:[e.toFixed(1),"V"]})}),(0,t.jsxs)("mesh",{position:[0,1.9,0],castShadow:!0,children:[(0,t.jsx)("cylinderGeometry",{args:[.3,.3,.4,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#dc2626",metalness:.8,roughness:.2})]}),(0,t.jsx)(a.Html,{position:[0,2.3,0],center:!0,distanceFactor:15,children:(0,t.jsx)("div",{className:"text-lg font-bold text-red-500",children:"+"})}),(0,t.jsxs)("mesh",{position:[0,-1.9,0],castShadow:!0,children:[(0,t.jsx)("cylinderGeometry",{args:[.35,.35,.3,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#2563eb",metalness:.8,roughness:.2})]}),(0,t.jsx)(a.Html,{position:[0,-2.3,0],center:!0,distanceFactor:15,children:(0,t.jsx)("div",{className:"text-lg font-bold text-blue-500",children:"−"})})]})}function d({power:e,isBurned:i,position:s}){let l=(0,r.useRef)(null),c=(0,r.useRef)(null),u=i?0:Math.min(e/100,1),f=5*u,m=i?new o.Color("#333333"):new o.Color().setHSL(.1,1,.3+.6*u);return(0,n.useFrame)(()=>{if(l.current&&c.current&&!i&&e>0){let e=1+.1*Math.sin(.01*Date.now())*u;c.current.material.emissiveIntensity=f*e,l.current.material.emissiveIntensity=.3*f*e}l.current&&i&&(l.current.material.emissiveIntensity=0,(c.current?.material).emissiveIntensity=0)}),(0,t.jsxs)("group",{position:s,children:[(0,t.jsxs)("mesh",{ref:l,castShadow:!0,children:[(0,t.jsx)("sphereGeometry",{args:[1,32,32]}),(0,t.jsx)("meshStandardMaterial",{color:m,transparent:!0,opacity:i?.8:.3+.5*u,metalness:.1,roughness:.1,emissive:m,emissiveIntensity:.3*f})]}),(0,t.jsxs)("mesh",{ref:c,position:[0,0,0],children:[(0,t.jsx)("torusKnotGeometry",{args:[.3,.05,64,8,2,3]}),(0,t.jsx)("meshStandardMaterial",{color:i?"#222":"#ff8800",emissive:i?"#111":"#ff6600",emissiveIntensity:f})]}),(0,t.jsxs)("mesh",{position:[0,-1.1,0],castShadow:!0,children:[(0,t.jsx)("cylinderGeometry",{args:[.4,.45,.4,20]}),(0,t.jsx)("meshStandardMaterial",{color:"#9ca3af",metalness:.95,roughness:.15})]}),Array.from({length:3}).map((e,r)=>(0,t.jsxs)("mesh",{position:[0,-1.35-.15*r,0],castShadow:!0,children:[(0,t.jsx)("torusGeometry",{args:[.42,.04,8,24]}),(0,t.jsx)("meshStandardMaterial",{color:"#78716c",metalness:.9,roughness:.2})]},r)),(0,t.jsxs)("mesh",{position:[0,-1.9,0],children:[(0,t.jsx)("circleGeometry",{args:[.25,20]}),(0,t.jsx)("meshStandardMaterial",{color:"#d1d5db",metalness:1,roughness:.1})]}),!i&&u>.05&&(0,t.jsx)("pointLight",{position:[0,0,0],intensity:3*f,color:"#ffaa44",distance:15,decay:2}),!i&&u>.1&&(0,t.jsx)("spotLight",{position:[0,0,0],"target-position":[0,-3,0],intensity:2*f,color:"#ffcc88",angle:Math.PI/4,penumbra:.5,distance:20,decay:1.5,castShadow:!0}),(0,t.jsx)(a.Html,{position:[1.5,0,0],center:!0,distanceFactor:10,children:(0,t.jsxs)("div",{className:"text-[10px] text-amber-300 bg-black/80 px-2 py-1 rounded whitespace-nowrap pointer-events-none select-none border border-amber-500/30",children:["💡 ",i?"BURNT!":`P = ${e.toFixed(1)}W`]})})]})}function u({current:e,position:i}){let s=(0,r.useRef)(null),o=(0,r.useRef)({rotation:0}),l=.15*e;(0,n.useFrame)((e,t)=>{s.current&&(o.current.rotation+=l*t*60,s.current.rotation.z=o.current.rotation)});let c=Math.abs(300*e);return(0,t.jsxs)("group",{position:i,children:[(0,t.jsxs)("mesh",{castShadow:!0,receiveShadow:!0,children:[(0,t.jsx)("cylinderGeometry",{args:[.8,.8,1,24]}),(0,t.jsx)("meshStandardMaterial",{color:"#374151",metalness:.8,roughness:.25})]}),(0,t.jsxs)("mesh",{position:[0,.55,0],castShadow:!0,children:[(0,t.jsx)("cylinderGeometry",{args:[.5,.5,.15,20]}),(0,t.jsx)("meshStandardMaterial",{color:"#4b5563",metalness:.85,roughness:.2})]}),(0,t.jsxs)("mesh",{position:[0,-.55,0],castShadow:!0,children:[(0,t.jsx)("cylinderGeometry",{args:[.5,.5,.15,20]}),(0,t.jsx)("meshStandardMaterial",{color:"#4b5563",metalness:.85,roughness:.2})]}),(0,t.jsxs)("group",{ref:s,position:[0,.7,0],children:[Array.from({length:5}).map((e,r)=>(0,t.jsx)("group",{rotation:[0,0,r*Math.PI*2/5],children:(0,t.jsxs)("mesh",{position:[0,.15,.25],castShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[.12,.04,.55]}),(0,t.jsx)("meshStandardMaterial",{color:"#3b82f6",metalness:.4,roughness:.5})]})},r)),(0,t.jsxs)("mesh",{children:[(0,t.jsx)("cylinderGeometry",{args:[.12,.12,.1,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#6b7280",metalness:.95,roughness:.1})]})]}),(0,t.jsxs)("mesh",{position:[0,-.8,0],rotation:[0,0,Math.PI/2],receiveShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[1,.1,.8]}),(0,t.jsx)("meshStandardMaterial",{color:"#1f2937",metalness:.85,roughness:.2})]}),(0,t.jsx)(a.Html,{position:[1.5,0,0],center:!0,distanceFactor:10,children:(0,t.jsxs)("div",{className:"text-[10px] text-blue-300 bg-black/80 px-2 py-1 rounded whitespace-nowrap pointer-events-none select-none border border-blue-500/30",children:["⚙️ I = ",e.toFixed(2),"A",(0,t.jsx)("br",{}),c.toFixed(0)," RPM"]})})]})}function f({value:e,unit:r,label:i,color:n,position:s}){return(0,t.jsxs)("group",{position:s,children:[(0,t.jsxs)("mesh",{castShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[1.5,.8,.2]}),(0,t.jsx)("meshStandardMaterial",{color:"#0a0a0a",metalness:.3,roughness:.7})]}),(0,t.jsxs)("mesh",{position:[0,0,.11],children:[(0,t.jsx)("planeGeometry",{args:[1.3,.6]}),(0,t.jsx)("meshBasicMaterial",{color:n})]}),(0,t.jsx)(a.Html,{position:[0,0,.15],center:!0,distanceFactor:12,children:(0,t.jsxs)("div",{className:"text-black font-mono font-bold text-sm bg-opacity-100",children:[(0,t.jsx)("div",{className:"text-[8px] opacity-75",children:i}),(0,t.jsxs)("div",{children:[e.toFixed(2),r]})]})})]})}function m({particles:e}){let i=(0,r.useRef)(null),s=(0,r.useMemo)(()=>new o.Object3D,[]);return(0,n.useFrame)(()=>{if(i.current){for(let t=0;t<e.length;t++){let r=e[t];s.position.copy(r.pos);let n=.3*r.life;s.scale.set(n,n,n),s.updateMatrix(),i.current.setMatrixAt(t,s.matrix)}i.current.instanceMatrix.needsUpdate=!0}}),(0,t.jsxs)("instancedMesh",{ref:i,args:[void 0,void 0,e.length],children:[(0,t.jsx)("sphereGeometry",{args:[1,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#888",transparent:!0,opacity:.4,depthWrite:!1})]})}function h({progress:e,current:i}){let s=(0,r.useRef)(null),a=(0,r.useMemo)(()=>new o.Object3D,[]),c=.1+Math.min(i/20,.1),d=.5+Math.min(i/10,1.5);return(0,n.useFrame)(()=>{if(s.current){for(let t=0;t<e.length;t++){let r=function(e){let t=l.length-1,r=e%1*t,i=Math.floor(r),n=r-i,s=l[i],a=l[Math.min(i+1,t)];return new o.Vector3(s[0]+(a[0]-s[0])*n,s[1]+(a[1]-s[1])*n,s[2]+(a[2]-s[2])*n)}(e[t]);a.position.copy(r),a.scale.set(c,c,c),a.updateMatrix(),s.current.setMatrixAt(t,a.matrix)}s.current.instanceMatrix.needsUpdate=!0}}),(0,t.jsxs)("instancedMesh",{ref:s,args:[void 0,void 0,50],children:[(0,t.jsx)("sphereGeometry",{args:[1,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#60a5fa",emissive:"#3b82f6",emissiveIntensity:d,toneMapped:!1})]})}function p({power:e,position:r}){let i=Math.min(e/100,1);return(0,t.jsxs)("group",{position:r,children:[(0,t.jsxs)("mesh",{castShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[2,1.2,.3]}),(0,t.jsx)("meshStandardMaterial",{color:"#1a1a2e",metalness:.5,roughness:.5})]}),(0,t.jsx)(a.Html,{position:[0,.5,.2],center:!0,distanceFactor:12,children:(0,t.jsx)("div",{className:"text-[9px] text-gray-400 font-semibold",children:"POWER METER"})}),(0,t.jsx)(a.Html,{position:[0,0,.2],center:!0,distanceFactor:12,children:(0,t.jsxs)("div",{className:"text-green-400 font-mono font-bold text-sm",children:[e.toFixed(2)," W"]})}),(0,t.jsxs)("mesh",{position:[0,-.25,.16],children:[(0,t.jsx)("planeGeometry",{args:[1.8,.15]}),(0,t.jsx)("meshBasicMaterial",{color:"#0a0a0a"})]}),(0,t.jsxs)("mesh",{position:[-.9+.9*i,-.25,.17],children:[(0,t.jsx)("planeGeometry",{args:[1.8*i,.12]}),(0,t.jsx)("meshBasicMaterial",{color:i>.8?"#ef4444":i>.5?"#f59e0b":"#22c55e"})]}),(0,t.jsx)(a.Html,{position:[0,-.6,.2],center:!0,distanceFactor:15,children:(0,t.jsx)("div",{className:"text-[8px] text-gray-500 font-mono whitespace-nowrap",children:"P = V × I = V²/R"})})]})}function x({voltage:e,resistance:i,bulbEnabled:v,motorEnabled:g,isPlaying:y,onDataChange:b}){let w=(0,r.useRef)({time:0,frameCount:0,lastDataUpdate:0,electronProgress:Array.from({length:50},(e,t)=>t/50),motorRotation:0,smokeParticles:[],bulbBurned:!1}),j=(0,r.useRef)(e/i),S=(0,r.useRef)(e*j.current),M=v&&e>12&&i<50;(0,n.useFrame)((t,r)=>{let n=w.current;if(y){if(n.time+=r,j.current=e/i,S.current=e*j.current,M&&!n.bulbBurned){n.bulbBurned=!0;for(let e=0;e<30;e++)n.smokeParticles.push({pos:new o.Vector3(-2,2,0),vel:new o.Vector3((Math.random()-.5)*.5,.3*Math.random(),(Math.random()-.5)*.3),life:1})}else M||(n.bulbBurned=!1,n.smokeParticles=[]);n.smokeParticles=n.smokeParticles.filter(e=>(e.pos.add(e.vel),e.life-=.5*r,e.life>0));let t=.01*j.current*r;n.electronProgress=n.electronProgress.map(e=>(e+t)%1),n.motorRotation+=.15*j.current*r*60}if(n.frameCount++,n.lastDataUpdate++,n.lastDataUpdate>=8&&b){n.lastDataUpdate=0;let t="off";v&&(n.bulbBurned?t="burned":e>0&&(t="on"));let r=g?Math.abs(300*j.current):0;b({voltage:e,current:j.current,resistance:i,power:S.current,bulbStatus:t,motorRpm:r})}});let E=(0,r.useMemo)(()=>l.map(e=>[...e]),[]),A=v?S.current:0;return(0,t.jsxs)("group",{children:[(0,t.jsx)("ambientLight",{intensity:.25}),(0,t.jsx)("directionalLight",{position:[10,20,10],intensity:1.2,castShadow:!0}),(0,t.jsx)("directionalLight",{position:[-10,15,-10],intensity:.5}),(0,t.jsx)("hemisphereLight",{args:["#b1e1ff","#1a1a2e",.4]}),(0,t.jsxs)("mesh",{position:[-1,-1,-.5],receiveShadow:!0,children:[(0,t.jsx)("boxGeometry",{args:[18,12,.3]}),(0,t.jsx)("meshStandardMaterial",{color:"#0f172a",metalness:.4,roughness:.6})]}),(0,t.jsx)("gridHelper",{args:[16,16,"#1e3a5f","#0f2744"],position:[-1,-.84,-.34]}),l.map((e,r)=>{if(0===r)return null;let i=l[r-1],n=[(i[0]+e[0])/2,(i[1]+e[1])/2,(i[2]+e[2])/2],s=Math.sqrt(Math.pow(e[0]-i[0],2)+Math.pow(e[1]-i[1],2)+Math.pow(e[2]-i[2],2)),a=Math.atan2(e[1]-i[1],e[0]-i[0]);return(0,t.jsxs)("group",{position:n,rotation:[0,0,a],children:[(0,t.jsxs)("mesh",{castShadow:!0,receiveShadow:!0,children:[(0,t.jsx)("cylinderGeometry",{args:[.08,.08,s,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#d97706",metalness:.8,roughness:.3})]}),(0,t.jsxs)("mesh",{children:[(0,t.jsx)("cylinderGeometry",{args:[.12,.12,s,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#fbbf24",transparent:!0,opacity:.2,emissive:"#f59e0b",emissiveIntensity:.3})]})]},r)}),(0,t.jsx)(s.Line,{points:E,color:"#d97706",lineWidth:2}),(0,t.jsx)(c,{voltage:e,position:[-7,2,0]}),v&&(0,t.jsx)(d,{power:A,isBurned:w.current.bulbBurned,position:[-2,2,0]}),g&&(0,t.jsx)(u,{current:j.current,position:[2,2,0]}),(0,t.jsx)(f,{value:e,unit:"V",label:"VOLTMETER",color:"#06b6d4",position:[3,0,0]}),(0,t.jsx)(f,{value:j.current,unit:"A",label:"AMMETER",color:"#8b5cf6",position:[-3,0,0]}),(0,t.jsx)(p,{power:S.current,position:[0,4.5,0]}),y&&e>0&&(0,t.jsx)(h,{progress:w.current.electronProgress,current:j.current}),w.current.smokeParticles.length>0&&(0,t.jsx)(m,{particles:w.current.smokeParticles}),[[-7,4,0],[-7,0,0],[-2,2,0],[2,2,0]].map((e,r)=>(0,t.jsxs)("mesh",{position:e,castShadow:!0,children:[(0,t.jsx)("sphereGeometry",{args:[.15,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#f59e0b",metalness:.9,roughness:.1,emissive:"#fbbf24",emissiveIntensity:.4})]},r)),(0,t.jsxs)("group",{position:[0,6,0],children:[(0,t.jsxs)("mesh",{position:[0,0,0],children:[(0,t.jsx)("planeGeometry",{args:[6,1.5]}),(0,t.jsx)("meshStandardMaterial",{color:"#0a0a1a",transparent:!0,opacity:.85})]}),(0,t.jsx)(a.Html,{position:[0,0,.1],center:!0,children:(0,t.jsx)("div",{className:"bg-gradient-to-r from-slate-900/90 to-slate-800/90 text-white px-5 py-2.5 rounded-xl border border-slate-600/50 whitespace-nowrap",children:(0,t.jsxs)("div",{className:"font-mono text-sm space-y-1",children:[(0,t.jsx)("div",{className:"text-amber-400 font-semibold",children:"Ohm's Law"}),(0,t.jsxs)("div",{className:"text-slate-300",children:[(0,t.jsx)("span",{className:"text-amber-300",children:"V"})," = ",e.toFixed(1),"V |"," ",(0,t.jsx)("span",{className:"text-blue-300",children:"I"})," = ",j.current.toFixed(3),"A |"," ",(0,t.jsx)("span",{className:"text-red-300",children:"R"})," = ",i,"Ω"]}),(0,t.jsxs)("div",{className:"text-green-300",children:["P = V × I = ",S.current.toFixed(2),"W"]})]})})})]})]})}e.i(81413);var v=e.i(48205),g=e.i(82192),y=e.i(68647),b=e.i(14228),w=e.i(4685);e.s(["default",0,function(){let e=(0,i.useRouter)(),[n,s]=(0,r.useState)(null),[a,o]=(0,r.useState)(!0),[l,c]=(0,r.useState)(!0),[d,u]=(0,r.useState)(1),[f,m]=(0,r.useState)(0),[h,p]=(0,r.useState)(12),[j,S]=(0,r.useState)(100),[M,E]=(0,r.useState)(!0),[A,C]=(0,r.useState)(!0),P=(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)(y.ControlGroup,{title:"Circuit Parameters",children:[(0,t.jsx)(y.ControlSlider,{label:"Voltage",value:h,unit:"V",min:1,max:24,step:.5,color:"#f59e0b",onChange:p,decimals:1}),(0,t.jsx)(y.ControlSlider,{label:"Resistance",value:j,unit:"Ω",min:10,max:1e3,step:10,color:"#ef4444",onChange:S,decimals:0})]}),(0,t.jsxs)(y.ControlGroup,{title:"Component Toggles",children:[(0,t.jsx)(y.ControlCheckbox,{label:"Light Bulb",checked:M,onChange:E,color:"#fbbf24"}),(0,t.jsx)(y.ControlCheckbox,{label:"DC Motor/Fan",checked:A,onChange:C,color:"#3b82f6"})]}),(0,t.jsx)(y.ControlGroup,{title:"Quick Presets",children:(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-2",children:[(0,t.jsx)(y.ControlButton,{label:"Dim Bulb",icon:"💡",onClick:()=>{p(3),S(500)},variant:"secondary",size:"sm"}),(0,t.jsx)(y.ControlButton,{label:"Bright Bulb",icon:"🔦",onClick:()=>{p(12),S(100)},variant:"primary",size:"sm"}),(0,t.jsx)(y.ControlButton,{label:"High Current",icon:"⚡",onClick:()=>{p(9),S(50)},variant:"warning",size:"sm"}),(0,t.jsx)(y.ControlButton,{label:"Fast Motor",icon:"⚙️",onClick:()=>{p(12),S(20)},variant:"primary",size:"sm"})]})}),(0,t.jsxs)(y.ControlGroup,{title:"Danger Zone",children:[(0,t.jsx)(y.ControlButton,{label:"⚠️ Burn Out Bulb",onClick:()=>{p(24),S(30)},variant:"danger",fullWidth:!0}),(0,t.jsx)("p",{className:"text-[9px] text-gray-500 mt-1 text-center",children:"High voltage + low resistance = burnt bulb!"})]}),(0,t.jsx)(y.ControlButton,{label:"📖 View Theory & Details",onClick:()=>e.push("/experiments/ohms-law/details"),variant:"secondary",fullWidth:!0})]}),L=n?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(y.DataGrid,{data:{voltage:{value:n.voltage,unit:"V",color:"#f59e0b",decimals:1},current:{value:n.current,unit:"A",color:"#8b5cf6",decimals:3},resistance:{value:n.resistance,unit:"Ω",color:"#ef4444",decimals:0},power:{value:n.power,unit:"W",color:"#22c55e",decimals:2}},columns:2}),(0,t.jsxs)("div",{className:"mt-3 space-y-2",children:[(0,t.jsx)("div",{className:`p-2 rounded-lg border ${"burned"===n.bulbStatus?"bg-red-900/30 border-red-500/30":"on"===n.bulbStatus?"bg-amber-900/30 border-amber-500/30":"bg-gray-800/30 border-gray-600/30"}`,children:(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)("span",{className:"text-[10px] text-gray-400",children:"💡 Bulb"}),(0,t.jsx)("span",{className:`text-[10px] font-semibold ${"burned"===n.bulbStatus?"text-red-400":"on"===n.bulbStatus?"text-amber-400":"text-gray-500"}`,children:"burned"===n.bulbStatus?"BURNT!":"on"===n.bulbStatus?"ON":"OFF"})]})}),(0,t.jsx)("div",{className:`p-2 rounded-lg border ${n.motorRpm>0?"bg-blue-900/30 border-blue-500/30":"bg-gray-800/30 border-gray-600/30"}`,children:(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)("span",{className:"text-[10px] text-gray-400",children:"⚙️ Motor"}),(0,t.jsx)("span",{className:`text-[10px] font-semibold ${n.motorRpm>0?"text-blue-400":"text-gray-500"}`,children:n.motorRpm>0?`${n.motorRpm.toFixed(0)} RPM`:"OFF"})]})})]}),(0,t.jsx)("div",{className:"mt-3 p-3 bg-gradient-to-r from-slate-900/80 to-slate-800/80 rounded-lg border border-slate-600/50",children:(0,t.jsxs)("div",{className:"text-center font-mono text-xs space-y-1.5",children:[(0,t.jsx)("div",{className:"text-amber-400 font-semibold mb-2",children:"⚡ Ohm's Law"}),(0,t.jsx)("div",{className:"text-slate-300",children:"I = V / R"}),(0,t.jsxs)("div",{className:"text-slate-400 text-[10px]",children:["I = ",n.voltage.toFixed(1),"V / ",n.resistance,"Ω"]}),(0,t.jsxs)("div",{className:"text-blue-300 font-semibold",children:["I = ",n.current.toFixed(3)," A"]}),(0,t.jsx)("div",{className:"mt-2 text-green-400 font-semibold",children:"⚡ Power"}),(0,t.jsx)("div",{className:"text-slate-300",children:"P = V × I = V² / R"}),(0,t.jsxs)("div",{className:"text-slate-400 text-[10px]",children:["P = ",n.voltage.toFixed(1),"V × ",n.current.toFixed(3),"A"]}),(0,t.jsxs)("div",{className:"text-green-300 font-semibold",children:["P = ",n.power.toFixed(2)," W"]})]})}),(0,t.jsx)("div",{className:"mt-3 p-2.5 bg-blue-900/20 rounded-lg border border-blue-500/20",children:(0,t.jsxs)("div",{className:"text-[9px] text-blue-300 text-center space-y-0.5",children:[(0,t.jsx)("div",{className:"font-semibold mb-1",children:"Power Equations:"}),(0,t.jsx)("div",{children:"P = V × I"}),(0,t.jsx)("div",{children:"P = I² × R"}),(0,t.jsx)("div",{children:"P = V² / R"})]})}),"burned"===n.bulbStatus&&(0,t.jsx)("div",{className:"mt-3 p-3 bg-red-900/40 rounded-lg border border-red-500/50 animate-pulse",children:(0,t.jsxs)("div",{className:"text-center text-red-400 font-semibold text-xs",children:["⚠️ BULB BURNT OUT!",(0,t.jsx)("br",{}),(0,t.jsx)("span",{className:"text-red-300 font-normal",children:"Voltage too high for resistance"})]})})]}):(0,t.jsx)("div",{className:"text-center text-gray-500 text-sm py-8",children:"Waiting for simulation data..."});return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(v.ExperimentContainer,{title:"Ohm's Law",description:"Interactive circuit simulation: Explore voltage, current, and resistance relationships",cameraPosition:[15,12,15],backgroundColor:"#050510",controls:null,dataPanel:null,children:(0,t.jsx)(x,{onDataChange:s,voltage:h,resistance:j,bulbEnabled:M,motorEnabled:A,isPlaying:l})}),(0,t.jsx)(b.SimulationController,{isPlaying:l,onPlayPause:()=>c(e=>!e),onReset:()=>{m(e=>e+1),c(!0),u(1),p(12),S(100),E(!0),C(!0)},speed:d,onSpeedChange:u}),(0,t.jsx)(g.FloatingControlPanel,{title:"⚡ Circuit Controls",initialPosition:{x:20,y:80},children:P}),(0,t.jsx)(w.DataPanel,{isVisible:a,onToggle:()=>o(!a),children:L})]})}],88820)}]);
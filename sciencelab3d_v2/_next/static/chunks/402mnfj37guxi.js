(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,i;var n=e.i(31067),r=e.i(71645),s=e.i(90072),o=e.i(48546),a=s,l=s;let c=new l.Box3,d=new l.Vector3;class u extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(i,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let n=new l.InstancedInterleavedBuffer(i,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(n,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),c.setFromBufferAttribute(t),this.boundingBox.union(c))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let r=0,s=e.count;r<s;r++)d.fromBufferAttribute(e,r),n=Math.max(n,i.distanceToSquared(d)),d.fromBufferAttribute(t,r),n=Math.max(n,i.distanceToSquared(d));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var f=s,h=e.i(8560),m=e.i(31497);class p extends f.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:f.UniformsUtils.clone(f.UniformsUtils.merge([h.UniformsLib.common,h.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new f.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let v=m.version>=125?"uv1":"uv2",x=new a.Vector4,y=new a.Vector3,g=new a.Vector3,b=new a.Vector4,S=new a.Vector4,w=new a.Vector4,M=new a.Vector3,j=new a.Matrix4,E=new a.Line3,C=new a.Vector3,A=new a.Box3,L=new a.Sphere,_=new a.Vector4;function z(e,t,n){return _.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),_.multiplyScalar(1/_.w),_.x=i/n.width,_.y=i/n.height,_.applyMatrix4(e.projectionMatrixInverse),_.multiplyScalar(1/_.w),Math.abs(Math.max(_.x,_.y))}class P extends a.Mesh{constructor(e=new u,t=new p({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let e=0,r=0,s=t.count;e<s;e++,r+=2)y.fromBufferAttribute(t,e),g.fromBufferAttribute(i,e),n[r]=0===r?0:n[r-1],n[r+1]=n[r]+y.distanceTo(g);let r=new a.InstancedInterleavedBuffer(n,2,1);return e.setAttribute("instanceDistanceStart",new a.InterleavedBufferAttribute(r,1,0)),e.setAttribute("instanceDistanceEnd",new a.InterleavedBufferAttribute(r,1,1)),this}raycast(e,n){let r,s,o=this.material.worldUnits,l=e.camera;null!==l||o||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let d=this.matrixWorld,u=this.geometry,f=this.material;if(i=f.linewidth+c,null===u.boundingSphere&&u.computeBoundingSphere(),L.copy(u.boundingSphere).applyMatrix4(d),o)r=.5*i;else{let e=Math.max(l.near,L.distanceToPoint(t.origin));r=z(l,e,f.resolution)}if(L.radius+=r,!1!==t.intersectsSphere(L)){if(null===u.boundingBox&&u.computeBoundingBox(),A.copy(u.boundingBox).applyMatrix4(d),o)s=.5*i;else{let e=Math.max(l.near,A.distanceToPoint(t.origin));s=z(l,e,f.resolution)}A.expandByScalar(s),!1!==t.intersectsBox(A)&&(o?function(e,n){let r=e.matrixWorld,s=e.geometry,o=s.attributes.instanceStart,l=s.attributes.instanceEnd,c=Math.min(s.instanceCount,o.count);for(let s=0;s<c;s++){E.start.fromBufferAttribute(o,s),E.end.fromBufferAttribute(l,s),E.applyMatrix4(r);let c=new a.Vector3,d=new a.Vector3;t.distanceSqToSegment(E.start,E.end,d,c),d.distanceTo(c)<.5*i&&n.push({point:d,pointOnLine:c,distance:t.origin.distanceTo(d),object:e,face:null,faceIndex:s,uv:null,[v]:null})}}(this,n):function(e,n,r){let s=n.projectionMatrix,o=e.material.resolution,l=e.matrixWorld,c=e.geometry,d=c.attributes.instanceStart,u=c.attributes.instanceEnd,f=Math.min(c.instanceCount,d.count),h=-n.near;t.at(1,w),w.w=1,w.applyMatrix4(n.matrixWorldInverse),w.applyMatrix4(s),w.multiplyScalar(1/w.w),w.x*=o.x/2,w.y*=o.y/2,w.z=0,M.copy(w),j.multiplyMatrices(n.matrixWorldInverse,l);for(let n=0;n<f;n++){if(b.fromBufferAttribute(d,n),S.fromBufferAttribute(u,n),b.w=1,S.w=1,b.applyMatrix4(j),S.applyMatrix4(j),b.z>h&&S.z>h)continue;if(b.z>h){let e=b.z-S.z,t=(b.z-h)/e;b.lerp(S,t)}else if(S.z>h){let e=S.z-b.z,t=(S.z-h)/e;S.lerp(b,t)}b.applyMatrix4(s),S.applyMatrix4(s),b.multiplyScalar(1/b.w),S.multiplyScalar(1/S.w),b.x*=o.x/2,b.y*=o.y/2,S.x*=o.x/2,S.y*=o.y/2,E.start.copy(b),E.start.z=0,E.end.copy(S),E.end.z=0;let c=E.closestPointToPointParameter(M,!0);E.at(c,C);let f=a.MathUtils.lerp(b.z,S.z,c),m=f>=-1&&f<=1,p=M.distanceTo(C)<.5*i;if(m&&p){E.start.fromBufferAttribute(d,n),E.end.fromBufferAttribute(u,n),E.start.applyMatrix4(l),E.end.applyMatrix4(l);let i=new a.Vector3,s=new a.Vector3;t.distanceSqToSegment(E.start,E.end,s,i),r.push({point:s,pointOnLine:i,distance:t.origin.distanceTo(s),object:e,face:null,faceIndex:n,uv:null,[v]:null})}}}(this,l,n))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(x),this.material.uniforms.resolution.value.set(x.z,x.w))}}class U extends u{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,n=new Float32Array(2*i);if(3===t)for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];else for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5],n[2*r+6]=e[r+6],n[2*r+7]=e[r+7];return super.setColors(n,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class I extends P{constructor(e=new U,t=new p({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let B=r.forwardRef(function({points:e,color:t=0xffffff,vertexColors:i,linewidth:a,lineWidth:l,segments:c,dashed:d,...f},h){var m,v;let x=(0,o.useThree)(e=>e.size),y=r.useMemo(()=>c?new P:new I,[c]),[g]=r.useState(()=>new p),b=(null==i||null==(m=i[0])?void 0:m.length)===4?4:3,S=r.useMemo(()=>{let n=c?new u:new U,r=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Vector3||e instanceof s.Vector4?[e.x,e.y,e.z]:e instanceof s.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(n.setPositions(r.flat()),i){t=0xffffff;let e=i.map(e=>e instanceof s.Color?e.toArray():e);n.setColors(e.flat(),b)}return n},[e,c,i,b]);return r.useLayoutEffect(()=>{y.computeLineDistances()},[e,y]),r.useLayoutEffect(()=>{d?g.defines.USE_DASH="":delete g.defines.USE_DASH,g.needsUpdate=!0},[d,g]),r.useEffect(()=>()=>{S.dispose(),g.dispose()},[S]),r.createElement("primitive",(0,n.default)({object:y,ref:h},f),r.createElement("primitive",{object:S,attach:"geometry"}),r.createElement("primitive",(0,n.default)({object:g,attach:"material",color:t,vertexColors:!!i,resolution:[x.width,x.height],linewidth:null!=(v=null!=a?a:l)?v:1,dashed:d,transparent:4===b},f)))});e.s(["Line",0,B],43216)},60099,e=>{"use strict";let t,i;var n=e.i(31067),r=e.i(71645),s=e.i(88014),o=e.i(90072),a=e.i(48546),l=e.i(94800);let c=new o.Vector3,d=new o.Vector3,u=new o.Vector3,f=new o.Vector2;function h(e,t,i){let n=c.setFromMatrixPosition(e.matrixWorld);n.project(t);let r=i.width/2,s=i.height/2;return[n.x*r+r,-(n.y*s)+s]}let m=e=>1e-10>Math.abs(e)?0:e;function p(e,t,i=""){let n="matrix3d(";for(let i=0;16!==i;i++)n+=m(t[i]*e.elements[i])+(15!==i?",":")");return i+n}let v=(t=[1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1],e=>p(e,t)),x=(i=e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1],(e,t)=>p(e,i(t),"translate(-50%,-50%)")),y=r.forwardRef(({children:e,eps:t=.001,style:i,className:p,prepend:y,center:g,fullscreen:b,portal:S,distanceFactor:w,sprite:M=!1,transform:j=!1,occlude:E,onOcclude:C,castShadow:A,receiveShadow:L,material:_,geometry:z,zIndexRange:P=[0x1000037,0],calculatePosition:U=h,as:I="div",wrapperClass:B,pointerEvents:O="auto",...R},T)=>{let{gl:D,camera:N,scene:V,size:W,raycaster:H,events:F,viewport:G}=(0,a.useThree)(),[k]=r.useState(()=>document.createElement(I)),$=r.useRef(null),q=r.useRef(null),Z=r.useRef(0),K=r.useRef([0,0]),J=r.useRef(null),X=r.useRef(null),Q=(null==S?void 0:S.current)||F.connected||D.domElement.parentNode,Y=r.useRef(null),ee=r.useRef(!1),et=r.useMemo(()=>{var e;return E&&"blending"!==E||Array.isArray(E)&&E.length&&(e=E[0])&&"object"==typeof e&&"current"in e},[E]);r.useLayoutEffect(()=>{let e=D.domElement;E&&"blending"===E?(e.style.zIndex=`${Math.floor(P[0]/2)}`,e.style.position="absolute",e.style.pointerEvents="none"):(e.style.zIndex=null,e.style.position=null,e.style.pointerEvents=null)},[E]),r.useLayoutEffect(()=>{if(q.current){let e=$.current=s.createRoot(k);if(V.updateMatrixWorld(),j)k.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";else{let e=U(q.current,N,W);k.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${e[0]}px,${e[1]}px,0);transform-origin:0 0;`}return Q&&(y?Q.prepend(k):Q.appendChild(k)),()=>{Q&&Q.removeChild(k),e.unmount()}}},[Q,j]),r.useLayoutEffect(()=>{B&&(k.className=B)},[B]);let ei=r.useMemo(()=>j?{position:"absolute",top:0,left:0,width:W.width,height:W.height,transformStyle:"preserve-3d",pointerEvents:"none"}:{position:"absolute",transform:g?"translate3d(-50%,-50%,0)":"none",...b&&{top:-W.height/2,left:-W.width/2,width:W.width,height:W.height},...i},[i,g,b,W,j]),en=r.useMemo(()=>({position:"absolute",pointerEvents:O}),[O]);r.useLayoutEffect(()=>{var t,n;ee.current=!1,j?null==(t=$.current)||t.render(r.createElement("div",{ref:J,style:ei},r.createElement("div",{ref:X,style:en},r.createElement("div",{ref:T,className:p,style:i,children:e})))):null==(n=$.current)||n.render(r.createElement("div",{ref:T,style:ei,className:p,children:e}))});let er=r.useRef(!0);(0,l.useFrame)(e=>{if(q.current){N.updateMatrixWorld(),q.current.updateWorldMatrix(!0,!1);let e=j?K.current:U(q.current,N,W);if(j||Math.abs(Z.current-N.zoom)>t||Math.abs(K.current[0]-e[0])>t||Math.abs(K.current[1]-e[1])>t){var i;let t,n,r,s,a=(i=q.current,t=c.setFromMatrixPosition(i.matrixWorld),n=d.setFromMatrixPosition(N.matrixWorld),r=t.sub(n),s=N.getWorldDirection(u),r.angleTo(s)>Math.PI/2),l=!1;et&&(Array.isArray(E)?l=E.map(e=>e.current):"blending"!==E&&(l=[V]));let h=er.current;l?er.current=function(e,t,i,n){let r=c.setFromMatrixPosition(e.matrixWorld),s=r.clone();s.project(t),f.set(s.x,s.y),i.setFromCamera(f,t);let o=i.intersectObjects(n,!0);if(o.length){let e=o[0].distance;return r.distanceTo(i.ray.origin)<e}return!0}(q.current,N,H,l)&&!a:er.current=!a,h!==er.current&&(C?C(!er.current):k.style.display=er.current?"block":"none");let p=Math.floor(P[0]/2),y=E?et?[P[0],p]:[p-1,0]:P;if(k.style.zIndex=`${function(e,t,i){if(t instanceof o.PerspectiveCamera||t instanceof o.OrthographicCamera){let n=c.setFromMatrixPosition(e.matrixWorld),r=d.setFromMatrixPosition(t.matrixWorld),s=n.distanceTo(r),o=(i[1]-i[0])/(t.far-t.near),a=i[1]-o*t.far;return Math.round(o*s+a)}}(q.current,N,y)}`,j){let[e,t]=[W.width/2,W.height/2],i=N.projectionMatrix.elements[5]*t,{isOrthographicCamera:n,top:r,left:s,bottom:o,right:a}=N,l=v(N.matrixWorldInverse),c=n?`scale(${i})translate(${m(-(a+s)/2)}px,${m((r+o)/2)}px)`:`translateZ(${i}px)`,d=q.current.matrixWorld;M&&((d=N.matrixWorldInverse.clone().transpose().copyPosition(d).scale(q.current.scale)).elements[3]=d.elements[7]=d.elements[11]=0,d.elements[15]=1),k.style.width=W.width+"px",k.style.height=W.height+"px",k.style.perspective=n?"":`${i}px`,J.current&&X.current&&(J.current.style.transform=`${c}${l}translate(${e}px,${t}px)`,X.current.style.transform=x(d,1/((w||10)/400)))}else{let t=void 0===w?1:function(e,t){if(t instanceof o.OrthographicCamera)return t.zoom;if(!(t instanceof o.PerspectiveCamera))return 1;{let i=c.setFromMatrixPosition(e.matrixWorld),n=d.setFromMatrixPosition(t.matrixWorld);return 1/(2*Math.tan(t.fov*Math.PI/180/2)*i.distanceTo(n))}}(q.current,N)*w;k.style.transform=`translate3d(${e[0]}px,${e[1]}px,0) scale(${t})`}K.current=e,Z.current=N.zoom}}if(!et&&Y.current&&!ee.current)if(j){if(J.current){let e=J.current.children[0];if(null!=e&&e.clientWidth&&null!=e&&e.clientHeight){let{isOrthographicCamera:t}=N;if(t||z)R.scale&&(Array.isArray(R.scale)?R.scale instanceof o.Vector3?Y.current.scale.copy(R.scale.clone().divideScalar(1)):Y.current.scale.set(1/R.scale[0],1/R.scale[1],1/R.scale[2]):Y.current.scale.setScalar(1/R.scale));else{let t=(w||10)/400,i=e.clientWidth*t,n=e.clientHeight*t;Y.current.scale.set(i,n,1)}ee.current=!0}}}else{let t=k.children[0];if(null!=t&&t.clientWidth&&null!=t&&t.clientHeight){let e=1/G.factor,i=t.clientWidth*e,n=t.clientHeight*e;Y.current.scale.set(i,n,1),ee.current=!0}Y.current.lookAt(e.camera.position)}});let es=r.useMemo(()=>({vertexShader:j?void 0:`
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
      `}),[j]);return r.createElement("group",(0,n.default)({},R,{ref:q}),E&&!et&&r.createElement("mesh",{castShadow:A,receiveShadow:L,ref:Y},z||r.createElement("planeGeometry",null),_||r.createElement("shaderMaterial",{side:o.DoubleSide,vertexShader:es.vertexShader,fragmentShader:es.fragmentShader})))});e.s(["Html",0,y])},56420,e=>{"use strict";var t=e.i(71645);let i=(...e)=>e.filter((e,t,i)=>!!e&&""!==e.trim()&&i.indexOf(e)===t).join(" ").trim(),n=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,i)=>i?i.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,t.createContext)({}),o=(0,t.forwardRef)(({color:e,size:n,strokeWidth:o,absoluteStrokeWidth:a,className:l="",children:c,iconNode:d,...u},f)=>{let{size:h=24,strokeWidth:m=2,absoluteStrokeWidth:p=!1,color:v="currentColor",className:x=""}=(0,t.useContext)(s)??{},y=a??p?24*Number(o??m)/Number(n??h):o??m;return(0,t.createElement)("svg",{ref:f,...r,width:n??h??r.width,height:n??h??r.height,stroke:e??v,strokeWidth:y,className:i("lucide",x,l),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,i])=>(0,t.createElement)(e,i)),...Array.isArray(c)?c:[c]])});e.s(["default",0,(e,r)=>{let s=(0,t.forwardRef)(({className:s,...a},l)=>(0,t.createElement)(o,{ref:l,iconNode:r,className:i(`lucide-${n(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...a}));return s.displayName=n(e),s}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,i)=>{t.exports=e.r(76562)},67382,e=>{"use strict";var t=e.i(43476),i=e.i(71645),n=e.i(92989);e.i(81413);var r=e.i(48205),s=e.i(14228),o=e.i(82192),a=e.i(4685),l=e.i(68647),c=e.i(94800),d=e.i(43216),u=e.i(60099),f=e.i(90072);function h({onDataChange:e,isPlaying:n=!0,simulationSpeed:r=1,resetTrigger:s=0,virusLevel:o=1,antibodyRate:a=1,speed:l=1}){let m=(0,i.useRef)(null),p=(0,i.useRef)([]),v=(0,i.useRef)([]),x=(0,i.useRef)([]),y=(0,i.useRef)(0),g=(0,i.useRef)(0),[b,S]=(0,i.useState)({virusCount:10,antibodyCount:0,tCellCount:2});(0,i.useEffect)(()=>{let e=[];for(let t=0;t<Math.floor(10*o);t++)e.push({id:t,position:new f.Vector3((Math.random()-.5)*10,(Math.random()-.5)*6,(Math.random()-.5)*10),velocity:new f.Vector3((Math.random()-.5)*.015,(Math.random()-.5)*.015,(Math.random()-.5)*.015),active:!0,rotation:new f.Vector3(Math.random()*Math.PI*2,Math.random()*Math.PI*2,Math.random()*Math.PI*2)});p.current=e,v.current=[],x.current=Array.from({length:2},(e,t)=>({angle:t/2*Math.PI*2,radius:4,verticalOffset:0})),y.current=0,g.current=0},[s,o]);let w=(0,i.useMemo)(()=>{let e=[];for(let t=-8;t<=8;t+=2){let i=[];for(let e=0;e<=16;e++){let n=e/16*Math.PI*2;i.push([t,3.5*Math.sin(n),3.5*Math.cos(n)])}e.push(i)}for(let t=0;t<8;t++){let i=t/8*Math.PI*2,n=3.5*Math.sin(i),r=3.5*Math.cos(i);e.push([[-8,n,r],[8,n,r]])}return e},[]),M=(0,i.useMemo)(()=>{let e=[];for(let t=0;t<6;t++){let i=(t-2.5)*1.2,n=2*Math.sin(.8*t);e.push([[-10,i,n],[10,i,n]])}return e},[]);(0,c.useFrame)((t,i)=>{if(!m.current||!n)return;y.current+=i*r*l;let s=p.current,c=v.current;for(let e of s){if(!e.active)continue;e.velocity.x+=(Math.random()-.5)*.002,e.velocity.y+=(Math.random()-.5)*.002,e.velocity.z+=(Math.random()-.5)*.002;let t=.02*l;e.velocity.length()>t&&e.velocity.normalize().multiplyScalar(t),e.position.add(e.velocity.clone().multiplyScalar(r*l)),e.rotation.x+=2*i,e.rotation.y+=1.5*i,Math.abs(e.position.x)>6&&(e.velocity.x*=-1),Math.abs(e.position.y)>6&&(e.velocity.y*=-1),Math.abs(e.position.z)>6&&(e.velocity.z*=-1),e.position.x=Math.max(-6,Math.min(6,e.position.x)),e.position.y=Math.max(-6,Math.min(6,e.position.y)),e.position.z=Math.max(-6,Math.min(6,e.position.z))}if(Math.random()<.001*o*r&&s.length<35){let e=Math.max(0,...s.map(e=>e.id))+1;s.push({id:e,position:new f.Vector3((Math.random()-.5)*4,(Math.random()-.5)*4,(Math.random()-.5)*4),velocity:new f.Vector3((Math.random()-.5)*.015,(Math.random()-.5)*.015,(Math.random()-.5)*.015),active:!0,rotation:new f.Vector3(0,0,0)})}if(Math.random()<.025*a*r&&s.length>0){let e=Math.max(0,...c.map(e=>e.id),0)+1,t=s.filter(e=>e.active)[Math.floor(Math.random()*s.filter(e=>e.active).length)];t&&c.push({id:e,position:new f.Vector3(5,2,5),targetId:t.id,active:!0})}for(let e=c.length-1;e>=0;e--){let t=c[e];if(!t.active){c.splice(e,1);continue}if(null!==t.targetId){let e=s.find(e=>e.id===t.targetId&&e.active);if(e){let i=new f.Vector3().subVectors(e.position,t.position).normalize();t.position.add(i.multiplyScalar(.06*r*l)),.5>t.position.distanceTo(e.position)&&(e.active=!1,t.active=!1)}else t.active=!1}}for(let e=s.length-1;e>=0;e--)s[e].active||s.splice(e,1);for(let e of x.current)e.angle+=.5*i*r*l;if(y.current>10&&x.current.length<8&&x.current.push({angle:.5*y.current,radius:4,verticalOffset:0}),g.current++,g.current%8==0){let t={virusCount:s.filter(e=>e.active).length,antibodyCount:c.length,tCellCount:x.current.length};S(t),e?.(t)}});let j=(0,i.useMemo)(()=>({viruses:p.current.filter(e=>e.active).map(e=>({...e,position:e.position.clone(),rotation:e.rotation.clone()})),antibodies:v.current.filter(e=>e.active).map(e=>({...e,position:e.position.clone()})),tCells:x.current.map(e=>({...e}))}),[b]);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("ambientLight",{intensity:.4}),(0,t.jsx)("directionalLight",{position:[10,10,5],intensity:.8,castShadow:!0}),(0,t.jsx)("pointLight",{position:[0,0,0],intensity:.3,color:"#f97316"}),(0,t.jsx)("pointLight",{position:[0,5,0],intensity:.2,color:"#ef4444"}),(0,t.jsxs)("group",{ref:m,children:[(0,t.jsxs)("mesh",{position:[0,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[6.5,32,32]}),(0,t.jsx)("meshPhysicalMaterial",{color:"#f97316",transparent:!0,opacity:.06,roughness:.5,side:f.DoubleSide})]}),w.map((e,i)=>(0,t.jsx)(d.Line,{points:e,color:"#ea580c",lineWidth:1,opacity:.3,transparent:!0,dashed:i>=8,dashSize:.2,gapSize:.1},i)),M.map((e,i)=>(0,t.jsx)(d.Line,{points:e,color:"#dc2626",lineWidth:1,opacity:.2,transparent:!0,dashed:!0,dashSize:.3,gapSize:.2},i)),j.viruses.map(e=>(0,t.jsxs)("group",{position:e.position,rotation:[e.rotation.x,e.rotation.y,e.rotation.z],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.25,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#ef4444",emissive:"#ef4444",emissiveIntensity:.4,metalness:.3,roughness:.7})]}),Array.from({length:8}).map((e,i)=>{let n=i/8*Math.PI*2;return(0,t.jsx)("group",{rotation:[0,0,n],position:[.2*Math.cos(n),.2*Math.sin(n),0],children:(0,t.jsxs)("mesh",{position:[.12,0,0],children:[(0,t.jsx)("sphereGeometry",{args:[.06,6,6]}),(0,t.jsx)("meshStandardMaterial",{color:"#fca5a5"})]})},i)}),Array.from({length:3}).map((e,i)=>(0,t.jsxs)("mesh",{position:[(Math.random()-.5)*.15,(Math.random()-.5)*.15,(Math.random()-.5)*.15],children:[(0,t.jsx)("sphereGeometry",{args:[.04,4,4]}),(0,t.jsx)("meshStandardMaterial",{color:"#fbbf24"})]},i))]},e.id)),j.antibodies.map(e=>(0,t.jsxs)("group",{position:e.position,children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("boxGeometry",{args:[.08,.3,.08]}),(0,t.jsx)("meshStandardMaterial",{color:"#3b82f6",emissive:"#3b82f6",emissiveIntensity:.5})]}),(0,t.jsxs)("mesh",{position:[.08,.12,0],rotation:[0,0,Math.PI/4],children:[(0,t.jsx)("boxGeometry",{args:[.12,.06,.06]}),(0,t.jsx)("meshStandardMaterial",{color:"#60a5fa"})]}),(0,t.jsxs)("mesh",{position:[.08,.12,0],rotation:[0,0,-Math.PI/4],children:[(0,t.jsx)("boxGeometry",{args:[.12,.06,.06]}),(0,t.jsx)("meshStandardMaterial",{color:"#60a5fa"})]}),(0,t.jsxs)("mesh",{position:[.14,.2,0],children:[(0,t.jsx)("sphereGeometry",{args:[.04,6,6]}),(0,t.jsx)("meshStandardMaterial",{color:"#93c5fd",emissive:"#93c5fd",emissiveIntensity:.3})]}),(0,t.jsxs)("mesh",{position:[.14,.2,0],children:[(0,t.jsx)("sphereGeometry",{args:[.04,6,6]}),(0,t.jsx)("meshStandardMaterial",{color:"#93c5fd",emissive:"#93c5fd",emissiveIntensity:.3})]})]},e.id)),j.tCells.map((e,i)=>(0,t.jsxs)("group",{position:[Math.cos(e.angle)*e.radius,e.verticalOffset,Math.sin(e.angle)*e.radius],children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.45,16,16]}),(0,t.jsx)("meshStandardMaterial",{color:"#22c55e",metalness:.3,roughness:.6})]}),Array.from({length:5}).map((e,i)=>{let n=i/5*Math.PI*2;return(0,t.jsxs)("mesh",{position:[.35*Math.cos(n),.35*Math.sin(n),0],children:[(0,t.jsx)("sphereGeometry",{args:[.1,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#16a34a",emissive:"#16a34a",emissiveIntensity:.3})]},i)}),(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.2,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:"#15803d"})]})]},`tcell-${i}`)),(0,t.jsx)(u.Html,{position:[0,-5.5,0],distanceFactor:10,children:(0,t.jsxs)("div",{className:"bg-orange-500/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg",children:["Immune Response Battle",(0,t.jsxs)("div",{className:"text-xs mt-1 opacity-80",children:[b.virusCount," viruses • ",b.antibodyCount," antibodies • ",b.tCellCount," T-cells"]})]})}),(0,t.jsx)(u.Html,{position:[0,5,0],distanceFactor:10,children:(0,t.jsx)("div",{className:"bg-red-600/90 text-white px-3 py-1 rounded text-xs font-medium",children:"Blood Vessel Environment"})}),(0,t.jsx)(u.Html,{position:[-5,3,0],distanceFactor:10,children:(0,t.jsxs)("div",{className:"bg-gray-900/90 text-white px-3 py-2 rounded text-xs space-y-1.5",children:[(0,t.jsx)("div",{className:"font-bold text-sm mb-2",children:"Immune Components"}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-4 h-4 rounded-full bg-red-500"}),(0,t.jsx)("span",{children:"Virus"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-4 h-4 rounded bg-blue-500"}),(0,t.jsx)("span",{children:"Antibody"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-4 h-4 rounded-full bg-green-500"}),(0,t.jsx)("span",{children:"T-Cell"})]})]})}),(0,t.jsx)(u.Html,{position:[5,3,0],distanceFactor:10,children:(0,t.jsxs)("div",{className:"bg-gray-900/90 text-white px-3 py-2 rounded text-xs",children:[(0,t.jsx)("div",{className:"font-bold text-sm mb-2",children:"Battle Status"}),(0,t.jsx)("div",{className:b.virusCount<5?"text-green-400":"text-red-400",children:b.virusCount<5?"✓ Winning":"⚠ Fighting"}),(0,t.jsx)("div",{className:"text-xs opacity-70 mt-1",children:b.antibodyCount>b.virusCount?"Antibodies dominant":"Virus spreading"})]})})]}),(0,t.jsx)("pointLight",{position:[0,0,0],intensity:.2,color:"#dc2626",distance:15})]})}e.s(["default",0,function(){let e=(0,n.useRouter)(),[c,d]=(0,i.useState)(!0),[u,f]=(0,i.useState)(1),[m,p]=(0,i.useState)(0),[v,x]=(0,i.useState)(!0),[y,g]=(0,i.useState)(!1),[b,S]=(0,i.useState)(1),[w,M]=(0,i.useState)(1),[j,E]=(0,i.useState)(1),[C,A]=(0,i.useState)({virusCount:10,antibodyCount:0,tCellCount:2}),L=(0,i.useCallback)(()=>{d(e=>!e)},[]),_=(0,i.useCallback)(()=>{p(e=>e+1),S(1),M(1),E(1)},[]),z=(0,i.useCallback)(e=>{f(e)},[]),P=(0,i.useCallback)(e=>{A(e)},[]),U=(0,i.useMemo)(()=>(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(l.ControlGroup,{title:"Infection Control",children:[(0,t.jsx)(l.ControlSlider,{label:"Virus Level",value:b,min:.5,max:3,step:.1,onChange:S}),(0,t.jsx)(l.ControlSlider,{label:"Antibody Rate",value:w,min:.1,max:3,step:.1,onChange:M}),(0,t.jsx)(l.ControlSlider,{label:"Speed",value:j,min:.5,max:3,step:.1,onChange:E})]}),(0,t.jsx)("button",{onClick:()=>e.push("/experiments/immune-response/details"),className:"w-full mt-4 px-4 py-2 bg-[#f97316]/20 hover:bg-[#f97316]/30 text-[#f97316] rounded-lg border border-[#f97316]/50 transition-colors text-sm font-medium",children:"View Details"})]}),[b,w,j,e]),I=(0,i.useMemo)(()=>(0,t.jsx)(l.DataGrid,{data:{viruses:{value:C.virusCount,unit:"particles",color:"#ef4444",decimals:0},antibodies:{value:C.antibodyCount,unit:"proteins",color:"#3b82f6",decimals:0},tCells:{value:C.tCellCount,unit:"cells",color:"#f97316",decimals:0}},columns:1}),[C]),B=(0,i.useMemo)(()=>(0,t.jsx)(a.DataPanel,{isVisible:y,onToggle:()=>g(e=>!e),children:I}),[y,I]);return(0,t.jsxs)("div",{className:"w-full h-screen relative",children:[(0,t.jsx)(r.ExperimentContainer,{title:"Immune System Response",description:"Watch immune cells fight viral infection",cameraPosition:[0,5,15],backgroundColor:"#050510",controls:null,dataPanel:B,children:(0,t.jsx)(h,{onDataChange:P,isPlaying:c,simulationSpeed:u,resetTrigger:m,virusLevel:b,antibodyRate:w,speed:j})}),(0,t.jsx)(s.SimulationController,{isPlaying:c,onPlayPause:L,onReset:_,speed:u,onSpeedChange:z,timeElapsed:0}),v&&(0,t.jsx)(o.FloatingControlPanel,{initialPosition:{x:window.innerWidth-340,y:80},children:U}),!v&&(0,t.jsx)("button",{onClick:()=>x(!0),className:"fixed top-20 right-4 z-20 px-4 py-2 bg-[#f97316]/20 hover:bg-[#f97316]/30 text-[#f97316] rounded-lg border border-[#f97316]/50 transition-colors text-sm font-medium",children:"Show Controls"})]})}],67382)}]);
(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43216,e=>{"use strict";let t,r;var i=e.i(31067),n=e.i(71645),a=e.i(90072),s=e.i(48546),o=a,l=a;let d=new l.Box3,c=new l.Vector3;class u extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,r=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),r.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let r=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(r,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(r,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let r;e instanceof Float32Array?r=e:Array.isArray(e)&&(r=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(r,2*t,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(i,t,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(i,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),d.setFromBufferAttribute(t),this.boundingBox.union(d))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let r=this.boundingSphere.center;this.boundingBox.getCenter(r);let i=0;for(let n=0,a=e.count;n<a;n++)c.fromBufferAttribute(e,n),i=Math.max(i,r.distanceToSquared(c)),c.fromBufferAttribute(t,n),i=Math.max(i,r.distanceToSquared(c));this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var f=a,h=e.i(8560),m=e.i(31497);class p extends f.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:f.UniformsUtils.clone(f.UniformsUtils.merge([h.UniformsLib.common,h.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new f.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let g=m.version>=125?"uv1":"uv2",v=new o.Vector4,x=new o.Vector3,y=new o.Vector3,b=new o.Vector4,S=new o.Vector4,w=new o.Vector4,M=new o.Vector3,j=new o.Matrix4,E=new o.Line3,A=new o.Vector3,C=new o.Box3,L=new o.Sphere,P=new o.Vector4;function z(e,t,i){return P.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),P.multiplyScalar(1/P.w),P.x=r/i.width,P.y=r/i.height,P.applyMatrix4(e.projectionMatrixInverse),P.multiplyScalar(1/P.w),Math.abs(Math.max(P.x,P.y))}class _ extends o.Mesh{constructor(e=new u,t=new p({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,r=e.attributes.instanceEnd,i=new Float32Array(2*t.count);for(let e=0,n=0,a=t.count;e<a;e++,n+=2)x.fromBufferAttribute(t,e),y.fromBufferAttribute(r,e),i[n]=0===n?0:i[n-1],i[n+1]=i[n]+x.distanceTo(y);let n=new o.InstancedInterleavedBuffer(i,2,1);return e.setAttribute("instanceDistanceStart",new o.InterleavedBufferAttribute(n,1,0)),e.setAttribute("instanceDistanceEnd",new o.InterleavedBufferAttribute(n,1,1)),this}raycast(e,i){let n,a,s=this.material.worldUnits,l=e.camera;null!==l||s||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let d=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let c=this.matrixWorld,u=this.geometry,f=this.material;if(r=f.linewidth+d,null===u.boundingSphere&&u.computeBoundingSphere(),L.copy(u.boundingSphere).applyMatrix4(c),s)n=.5*r;else{let e=Math.max(l.near,L.distanceToPoint(t.origin));n=z(l,e,f.resolution)}if(L.radius+=n,!1!==t.intersectsSphere(L)){if(null===u.boundingBox&&u.computeBoundingBox(),C.copy(u.boundingBox).applyMatrix4(c),s)a=.5*r;else{let e=Math.max(l.near,C.distanceToPoint(t.origin));a=z(l,e,f.resolution)}C.expandByScalar(a),!1!==t.intersectsBox(C)&&(s?function(e,i){let n=e.matrixWorld,a=e.geometry,s=a.attributes.instanceStart,l=a.attributes.instanceEnd,d=Math.min(a.instanceCount,s.count);for(let a=0;a<d;a++){E.start.fromBufferAttribute(s,a),E.end.fromBufferAttribute(l,a),E.applyMatrix4(n);let d=new o.Vector3,c=new o.Vector3;t.distanceSqToSegment(E.start,E.end,c,d),c.distanceTo(d)<.5*r&&i.push({point:c,pointOnLine:d,distance:t.origin.distanceTo(c),object:e,face:null,faceIndex:a,uv:null,[g]:null})}}(this,i):function(e,i,n){let a=i.projectionMatrix,s=e.material.resolution,l=e.matrixWorld,d=e.geometry,c=d.attributes.instanceStart,u=d.attributes.instanceEnd,f=Math.min(d.instanceCount,c.count),h=-i.near;t.at(1,w),w.w=1,w.applyMatrix4(i.matrixWorldInverse),w.applyMatrix4(a),w.multiplyScalar(1/w.w),w.x*=s.x/2,w.y*=s.y/2,w.z=0,M.copy(w),j.multiplyMatrices(i.matrixWorldInverse,l);for(let i=0;i<f;i++){if(b.fromBufferAttribute(c,i),S.fromBufferAttribute(u,i),b.w=1,S.w=1,b.applyMatrix4(j),S.applyMatrix4(j),b.z>h&&S.z>h)continue;if(b.z>h){let e=b.z-S.z,t=(b.z-h)/e;b.lerp(S,t)}else if(S.z>h){let e=S.z-b.z,t=(S.z-h)/e;S.lerp(b,t)}b.applyMatrix4(a),S.applyMatrix4(a),b.multiplyScalar(1/b.w),S.multiplyScalar(1/S.w),b.x*=s.x/2,b.y*=s.y/2,S.x*=s.x/2,S.y*=s.y/2,E.start.copy(b),E.start.z=0,E.end.copy(S),E.end.z=0;let d=E.closestPointToPointParameter(M,!0);E.at(d,A);let f=o.MathUtils.lerp(b.z,S.z,d),m=f>=-1&&f<=1,p=M.distanceTo(A)<.5*r;if(m&&p){E.start.fromBufferAttribute(c,i),E.end.fromBufferAttribute(u,i),E.start.applyMatrix4(l),E.end.applyMatrix4(l);let r=new o.Vector3,a=new o.Vector3;t.distanceSqToSegment(E.start,E.end,a,r),n.push({point:a,pointOnLine:r,distance:t.origin.distanceTo(a),object:e,face:null,faceIndex:i,uv:null,[g]:null})}}}(this,l,i))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(v),this.material.uniforms.resolution.value.set(v.z,v.w))}}class U extends u{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,r=new Float32Array(2*t);for(let i=0;i<t;i+=3)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5];return super.setPositions(r),this}setColors(e,t=3){let r=e.length-t,i=new Float32Array(2*r);if(3===t)for(let n=0;n<r;n+=t)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];else for(let n=0;n<r;n+=t)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5],i[2*n+6]=e[n+6],i[2*n+7]=e[n+7];return super.setColors(i,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class R extends _{constructor(e=new U,t=new p({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let N=n.forwardRef(function({points:e,color:t=0xffffff,vertexColors:r,linewidth:o,lineWidth:l,segments:d,dashed:c,...f},h){var m,g;let v=(0,s.useThree)(e=>e.size),x=n.useMemo(()=>d?new _:new R,[d]),[y]=n.useState(()=>new p),b=(null==r||null==(m=r[0])?void 0:m.length)===4?4:3,S=n.useMemo(()=>{let i=d?new u:new U,n=e.map(e=>{let t=Array.isArray(e);return e instanceof a.Vector3||e instanceof a.Vector4?[e.x,e.y,e.z]:e instanceof a.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(i.setPositions(n.flat()),r){t=0xffffff;let e=r.map(e=>e instanceof a.Color?e.toArray():e);i.setColors(e.flat(),b)}return i},[e,d,r,b]);return n.useLayoutEffect(()=>{x.computeLineDistances()},[e,x]),n.useLayoutEffect(()=>{c?y.defines.USE_DASH="":delete y.defines.USE_DASH,y.needsUpdate=!0},[c,y]),n.useEffect(()=>()=>{S.dispose(),y.dispose()},[S]),n.createElement("primitive",(0,i.default)({object:x,ref:h},f),n.createElement("primitive",{object:S,attach:"geometry"}),n.createElement("primitive",(0,i.default)({object:y,attach:"material",color:t,vertexColors:!!r,resolution:[v.width,v.height],linewidth:null!=(g=null!=o?o:l)?g:1,dashed:c,transparent:4===b},f)))});e.s(["Line",0,N],43216)},60099,e=>{"use strict";let t,r;var i=e.i(31067),n=e.i(71645),a=e.i(88014),s=e.i(90072),o=e.i(48546),l=e.i(94800);let d=new s.Vector3,c=new s.Vector3,u=new s.Vector3,f=new s.Vector2;function h(e,t,r){let i=d.setFromMatrixPosition(e.matrixWorld);i.project(t);let n=r.width/2,a=r.height/2;return[i.x*n+n,-(i.y*a)+a]}let m=e=>1e-10>Math.abs(e)?0:e;function p(e,t,r=""){let i="matrix3d(";for(let r=0;16!==r;r++)i+=m(t[r]*e.elements[r])+(15!==r?",":")");return r+i}let g=(t=[1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1],e=>p(e,t)),v=(r=e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1],(e,t)=>p(e,r(t),"translate(-50%,-50%)")),x=n.forwardRef(({children:e,eps:t=.001,style:r,className:p,prepend:x,center:y,fullscreen:b,portal:S,distanceFactor:w,sprite:M=!1,transform:j=!1,occlude:E,onOcclude:A,castShadow:C,receiveShadow:L,material:P,geometry:z,zIndexRange:_=[0x1000037,0],calculatePosition:U=h,as:R="div",wrapperClass:N,pointerEvents:B="auto",...O},T)=>{let{gl:D,camera:I,scene:G,size:W,raycaster:H,events:F,viewport:V}=(0,o.useThree)(),[k]=n.useState(()=>document.createElement(R)),$=n.useRef(null),q=n.useRef(null),Z=n.useRef(0),K=n.useRef([0,0]),J=n.useRef(null),X=n.useRef(null),Q=(null==S?void 0:S.current)||F.connected||D.domElement.parentNode,Y=n.useRef(null),ee=n.useRef(!1),et=n.useMemo(()=>{var e;return E&&"blending"!==E||Array.isArray(E)&&E.length&&(e=E[0])&&"object"==typeof e&&"current"in e},[E]);n.useLayoutEffect(()=>{let e=D.domElement;E&&"blending"===E?(e.style.zIndex=`${Math.floor(_[0]/2)}`,e.style.position="absolute",e.style.pointerEvents="none"):(e.style.zIndex=null,e.style.position=null,e.style.pointerEvents=null)},[E]),n.useLayoutEffect(()=>{if(q.current){let e=$.current=a.createRoot(k);if(G.updateMatrixWorld(),j)k.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";else{let e=U(q.current,I,W);k.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${e[0]}px,${e[1]}px,0);transform-origin:0 0;`}return Q&&(x?Q.prepend(k):Q.appendChild(k)),()=>{Q&&Q.removeChild(k),e.unmount()}}},[Q,j]),n.useLayoutEffect(()=>{N&&(k.className=N)},[N]);let er=n.useMemo(()=>j?{position:"absolute",top:0,left:0,width:W.width,height:W.height,transformStyle:"preserve-3d",pointerEvents:"none"}:{position:"absolute",transform:y?"translate3d(-50%,-50%,0)":"none",...b&&{top:-W.height/2,left:-W.width/2,width:W.width,height:W.height},...r},[r,y,b,W,j]),ei=n.useMemo(()=>({position:"absolute",pointerEvents:B}),[B]);n.useLayoutEffect(()=>{var t,i;ee.current=!1,j?null==(t=$.current)||t.render(n.createElement("div",{ref:J,style:er},n.createElement("div",{ref:X,style:ei},n.createElement("div",{ref:T,className:p,style:r,children:e})))):null==(i=$.current)||i.render(n.createElement("div",{ref:T,style:er,className:p,children:e}))});let en=n.useRef(!0);(0,l.useFrame)(e=>{if(q.current){I.updateMatrixWorld(),q.current.updateWorldMatrix(!0,!1);let e=j?K.current:U(q.current,I,W);if(j||Math.abs(Z.current-I.zoom)>t||Math.abs(K.current[0]-e[0])>t||Math.abs(K.current[1]-e[1])>t){var r;let t,i,n,a,o=(r=q.current,t=d.setFromMatrixPosition(r.matrixWorld),i=c.setFromMatrixPosition(I.matrixWorld),n=t.sub(i),a=I.getWorldDirection(u),n.angleTo(a)>Math.PI/2),l=!1;et&&(Array.isArray(E)?l=E.map(e=>e.current):"blending"!==E&&(l=[G]));let h=en.current;l?en.current=function(e,t,r,i){let n=d.setFromMatrixPosition(e.matrixWorld),a=n.clone();a.project(t),f.set(a.x,a.y),r.setFromCamera(f,t);let s=r.intersectObjects(i,!0);if(s.length){let e=s[0].distance;return n.distanceTo(r.ray.origin)<e}return!0}(q.current,I,H,l)&&!o:en.current=!o,h!==en.current&&(A?A(!en.current):k.style.display=en.current?"block":"none");let p=Math.floor(_[0]/2),x=E?et?[_[0],p]:[p-1,0]:_;if(k.style.zIndex=`${function(e,t,r){if(t instanceof s.PerspectiveCamera||t instanceof s.OrthographicCamera){let i=d.setFromMatrixPosition(e.matrixWorld),n=c.setFromMatrixPosition(t.matrixWorld),a=i.distanceTo(n),s=(r[1]-r[0])/(t.far-t.near),o=r[1]-s*t.far;return Math.round(s*a+o)}}(q.current,I,x)}`,j){let[e,t]=[W.width/2,W.height/2],r=I.projectionMatrix.elements[5]*t,{isOrthographicCamera:i,top:n,left:a,bottom:s,right:o}=I,l=g(I.matrixWorldInverse),d=i?`scale(${r})translate(${m(-(o+a)/2)}px,${m((n+s)/2)}px)`:`translateZ(${r}px)`,c=q.current.matrixWorld;M&&((c=I.matrixWorldInverse.clone().transpose().copyPosition(c).scale(q.current.scale)).elements[3]=c.elements[7]=c.elements[11]=0,c.elements[15]=1),k.style.width=W.width+"px",k.style.height=W.height+"px",k.style.perspective=i?"":`${r}px`,J.current&&X.current&&(J.current.style.transform=`${d}${l}translate(${e}px,${t}px)`,X.current.style.transform=v(c,1/((w||10)/400)))}else{let t=void 0===w?1:function(e,t){if(t instanceof s.OrthographicCamera)return t.zoom;if(!(t instanceof s.PerspectiveCamera))return 1;{let r=d.setFromMatrixPosition(e.matrixWorld),i=c.setFromMatrixPosition(t.matrixWorld);return 1/(2*Math.tan(t.fov*Math.PI/180/2)*r.distanceTo(i))}}(q.current,I)*w;k.style.transform=`translate3d(${e[0]}px,${e[1]}px,0) scale(${t})`}K.current=e,Z.current=I.zoom}}if(!et&&Y.current&&!ee.current)if(j){if(J.current){let e=J.current.children[0];if(null!=e&&e.clientWidth&&null!=e&&e.clientHeight){let{isOrthographicCamera:t}=I;if(t||z)O.scale&&(Array.isArray(O.scale)?O.scale instanceof s.Vector3?Y.current.scale.copy(O.scale.clone().divideScalar(1)):Y.current.scale.set(1/O.scale[0],1/O.scale[1],1/O.scale[2]):Y.current.scale.setScalar(1/O.scale));else{let t=(w||10)/400,r=e.clientWidth*t,i=e.clientHeight*t;Y.current.scale.set(r,i,1)}ee.current=!0}}}else{let t=k.children[0];if(null!=t&&t.clientWidth&&null!=t&&t.clientHeight){let e=1/V.factor,r=t.clientWidth*e,i=t.clientHeight*e;Y.current.scale.set(r,i,1),ee.current=!0}Y.current.lookAt(e.camera.position)}});let ea=n.useMemo(()=>({vertexShader:j?void 0:`
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
      `}),[j]);return n.createElement("group",(0,i.default)({},O,{ref:q}),E&&!et&&n.createElement("mesh",{castShadow:C,receiveShadow:L,ref:Y},z||n.createElement("planeGeometry",null),P||n.createElement("shaderMaterial",{side:s.DoubleSide,vertexShader:ea.vertexShader,fragmentShader:ea.fragmentShader})))});e.s(["Html",0,x])},56420,e=>{"use strict";var t=e.i(71645);let r=(...e)=>e.filter((e,t,r)=>!!e&&""!==e.trim()&&r.indexOf(e)===t).join(" ").trim(),i=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,r)=>r?r.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var n={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let a=(0,t.createContext)({}),s=(0,t.forwardRef)(({color:e,size:i,strokeWidth:s,absoluteStrokeWidth:o,className:l="",children:d,iconNode:c,...u},f)=>{let{size:h=24,strokeWidth:m=2,absoluteStrokeWidth:p=!1,color:g="currentColor",className:v=""}=(0,t.useContext)(a)??{},x=o??p?24*Number(s??m)/Number(i??h):s??m;return(0,t.createElement)("svg",{ref:f,...n,width:i??h??n.width,height:i??h??n.height,stroke:e??g,strokeWidth:x,className:r("lucide",v,l),...!d&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...c.map(([e,r])=>(0,t.createElement)(e,r)),...Array.isArray(d)?d:[d]])});e.s(["default",0,(e,n)=>{let a=(0,t.forwardRef)(({className:a,...o},l)=>(0,t.createElement)(s,{ref:l,iconNode:n,className:r(`lucide-${i(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,a),...o}));return a.displayName=i(e),a}],56420)},11241,e=>{"use strict";let t=(0,e.i(56420).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["ArrowLeft",0,t],11241)},92989,(e,t,r)=>{t.exports=e.r(76562)},50319,e=>{"use strict";var t=e.i(43476),r=e.i(71645);e.i(81413);var i=e.i(48205),n=e.i(14228),a=e.i(82192),s=e.i(4685),o=e.i(68647),l=e.i(94800),d=e.i(30297),c=e.i(60099),u=e.i(43216),f=e.i(90072);function h({onDataChange:e,isPlaying:i=!0,simulationSpeed:n=1,resetTrigger:a=0,mutationRate:s=.15,predatorSpeed:o=1,initialPopulation:m=40,generationSpeed:p=1}){let g=(0,r.useRef)(null),v=(0,r.useRef)(0),x=(0,r.useRef)([]),y=(0,r.useRef)({id:0,position:[0,0,0],target:null}),b=(0,r.useRef)(0),S=(0,r.useRef)(0),w=(0,r.useRef)(0),M=(0,r.useRef)([]),j=(0,r.useRef)(0),E=(0,r.useRef)("grass"),A=(0,r.useRef)(0),[C,L]=(0,r.useState)({generation:0,populationCount:m,percentGreen:50,percentRed:50,percentSmall:50,percentLarge:50,averageSize:.5,percentSurviving:100,environmentPhase:"Grassland"}),P={grass:{background:"#1a2e1a",ground:"#15803d",name:"Grassland",advantage:"green"},dirt:{background:"#2e251a",ground:"#8B4513",name:"Dirt Field",advantage:"red"},snow:{background:"#1a1e2e",ground:"#e0e7ff",name:"Snowy Area",advantage:"none"}};(0,r.useEffect)(()=>{let e=[];b.current=0;for(let t=0;t<m;t++){let t=Math.random()>.5,r=Math.random();e.push({id:b.current++,position:[(Math.random()-.5)*14,0,(Math.random()-.5)*14],velocity:[(Math.random()-.5)*.02,0,(Math.random()-.5)*.02],size:r,color:t?"green":"red",alive:!0,age:0})}x.current=e,y.current={id:0,position:[0,0,0],target:null},S.current=0,w.current=0,M.current=[],j.current=0,E.current="grass",A.current=0},[a,m]);let z=(0,r.useCallback)(e=>.025*(1-.7*e),[]),_=(0,r.useCallback)((e,t)=>{let r=.2+.3*e.size;return"grass"===t?"green"===e.color?r-=.4:r+=.3:"dirt"===t?"red"===e.color?r-=.3:r+=.2:"snow"===t&&(r+=.1),Math.max(.05,Math.min(1,r))},[]);(0,l.useFrame)((t,r)=>{if(!g.current||!i)return;v.current++,j.current+=r*n*p;let a=x.current,l=y.current;if(A.current+=r*n,A.current>15){A.current=0;let e=["grass","dirt","snow"],t=e.indexOf(E.current);E.current=e[(t+1)%e.length]}let d=E.current;a.forEach(e=>{if(!e.alive)return;let t=z(e.size);e.velocity[0]+=(Math.random()-.5)*.01*n,e.velocity[2]+=(Math.random()-.5)*.01*n;let i=Math.sqrt(e.velocity[0]**2+e.velocity[2]**2);if(i>t){let r=t/i;e.velocity[0]*=r,e.velocity[2]*=r}e.position[0]+=e.velocity[0]*n,e.position[2]+=e.velocity[2]*n,e.position[0]>7&&(e.position[0]=-7),e.position[0]<-7&&(e.position[0]=7),e.position[2]>7&&(e.position[2]=-7),e.position[2]<-7&&(e.position[2]=7),e.age+=r*n});let c=a.filter(e=>e.alive);if(c.length>0){let e=c.find(e=>e.id===l.target);if(!e||!e.alive){let t=c.filter(e=>Math.random()<_(e,d));e=t.length>0?t[Math.floor(Math.random()*t.length)]:c[Math.floor(Math.random()*c.length)],l.target=e?.id??null}if(e){let t=e.position[0]-l.position[0],r=e.position[2]-l.position[2],i=Math.sqrt(t*t+r*r),a=.035*o*n;i>.5?(l.position[0]+=t/i*a,l.position[2]+=r/i*a):(e.alive=!1,l.target=null)}}if(j.current-w.current>6/p){w.current=j.current;let e=S.current+1;S.current=e;let t=a.filter(e=>e.alive),r=t.filter(e=>"green"===e.color).length,i=t.filter(e=>"red"===e.color).length,n=t.reduce((e,t)=>e+t.size,0)/t.length;M.current.push({gen:e,green:r,red:i,avgSize:n});let o=[];for(;t.length+o.length<m&&t.length>0;){let e=t[Math.floor(Math.random()*t.length)],r=Math.random()<s,i=e.size;r&&(i=Math.max(0,Math.min(1,e.size+(Math.random()-.5)*.4)));let n=e.color;r&&.3>Math.random()&&(n="green"===e.color?"red":"green"),o.push({id:b.current++,position:[e.position[0]+(Math.random()-.5)*2,0,e.position[2]+(Math.random()-.5)*2],velocity:[(Math.random()-.5)*.02,0,(Math.random()-.5)*.02],size:i,color:n,alive:!0,age:0})}x.current=[...t,...o]}if(v.current%8==0){let t=x.current.filter(e=>e.alive),r=t.filter(e=>"green"===e.color).length,i=t.filter(e=>"red"===e.color).length,n=t.filter(e=>e.size<.5).length,a=t.filter(e=>e.size>=.5).length,s=t.reduce((e,t)=>e+t.size,0)/t.length,o=Math.round(t.length/m*100),l=P[d],c={generation:S.current,populationCount:t.length,percentGreen:Math.round(r/t.length*100),percentRed:Math.round(i/t.length*100),percentSmall:Math.round(n/t.length*100),percentLarge:Math.round(a/t.length*100),averageSize:Math.round(100*s)/100,percentSurviving:o,environmentPhase:l.name};L(c),e?.(c)}});let U=(0,r.useMemo)(()=>{let e=M.current;if(0===e.length)return[];let t=[];return e.forEach((r,i)=>{let n=-6+.5*i;t.push([n,.5,-5+r.green/m*3]),i<e.length-1&&t.push([n+.5,.5,-5+e[i+1].green/m*3])}),t},[C,m]),R=(0,r.useMemo)(()=>{let e=M.current;if(0===e.length)return[];let t=[];return e.forEach((r,i)=>{let n=-6+.5*i;t.push([n,0,-5+r.red/m*3]),i<e.length-1&&t.push([n+.5,0,-5+e[i+1].red/m*3])}),t},[C,m]),N=E.current,B=P[N],O=(0,r.useMemo)(()=>x.current.filter(e=>e.alive).map(e=>(0,t.jsxs)("group",{position:e.position,children:[(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.15+.1*e.size,12,12]}),(0,t.jsx)("meshStandardMaterial",{color:"green"===e.color?"#22c55e":"#ef4444",emissive:"green"===e.color?"#22c55e":"#ef4444",emissiveIntensity:.4,roughness:.5,metalness:.3})]}),e.size<.3&&(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.2,8,8]}),(0,t.jsx)("meshBasicMaterial",{color:"#3b82f6",transparent:!0,opacity:.3,blending:f.AdditiveBlending})]})]},e.id)),[C,N]);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("ambientLight",{intensity:.5}),(0,t.jsx)("directionalLight",{position:[10,15,10],intensity:.8,castShadow:!0}),(0,t.jsx)("pointLight",{position:[0,8,0],intensity:.3,color:B.ground}),(0,t.jsx)(d.OrbitControls,{enableDamping:!0,dampingFactor:.05,maxPolarAngle:Math.PI/2.5}),(0,t.jsxs)("group",{ref:g,children:[(0,t.jsxs)("mesh",{position:[0,-.1,0],rotation:[-Math.PI/2,0,0],receiveShadow:!0,children:[(0,t.jsx)("planeGeometry",{args:[16,16]}),(0,t.jsx)("meshStandardMaterial",{color:B.ground,roughness:.95,metalness:.05})]}),"grass"===N&&Array.from({length:150}).map((e,r)=>(0,t.jsxs)("mesh",{position:[(Math.random()-.5)*15,0,(Math.random()-.5)*15],rotation:[0,Math.random()*Math.PI,0],children:[(0,t.jsx)("coneGeometry",{args:[.02,.12,4]}),(0,t.jsx)("meshStandardMaterial",{color:"#16a34a",roughness:.8})]},r)),"snow"===N&&Array.from({length:100}).map((e,r)=>(0,t.jsxs)("mesh",{position:[(Math.random()-.5)*15,.05,(Math.random()-.5)*15],children:[(0,t.jsx)("sphereGeometry",{args:[.08,6,6]}),(0,t.jsx)("meshStandardMaterial",{color:"#ffffff",roughness:.9})]},r)),"dirt"===N&&Array.from({length:50}).map((e,r)=>(0,t.jsxs)("mesh",{position:[(Math.random()-.5)*15,0,(Math.random()-.5)*15],children:[(0,t.jsx)("dodecahedronGeometry",{args:[.1]}),(0,t.jsx)("meshStandardMaterial",{color:"#654321",roughness:.9})]},r)),O,(0,t.jsxs)("mesh",{position:[y.current.position[0],.5,y.current.position[2]],children:[(0,t.jsx)("coneGeometry",{args:[.5,1,4]}),(0,t.jsx)("meshStandardMaterial",{color:"#dc2626",emissive:"#dc2626",emissiveIntensity:.5,roughness:.4,metalness:.4})]}),(0,t.jsxs)("mesh",{position:[y.current.position[0],.5,y.current.position[2]],children:[(0,t.jsx)("sphereGeometry",{args:[.15,8,8]}),(0,t.jsx)("meshStandardMaterial",{color:"#fbbf24",emissive:"#fbbf24",emissiveIntensity:.8})]}),(0,t.jsxs)("group",{position:[-5,4,5],rotation:[-Math.PI/3,0,0],children:[(0,t.jsxs)("mesh",{position:[3,.25,-1.5],children:[(0,t.jsx)("boxGeometry",{args:[8,1.5,.1]}),(0,t.jsx)("meshStandardMaterial",{color:"#1f2937",transparent:!0,opacity:.9})]}),U.length>1&&(0,t.jsx)(u.Line,{points:U,color:"#22c55e",lineWidth:3}),R.length>1&&(0,t.jsx)(u.Line,{points:R,color:"#ef4444",lineWidth:3}),(0,t.jsx)(c.Html,{position:[7,1,-1.5],distanceFactor:15,children:(0,t.jsx)("div",{className:"bg-gray-900/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap",children:"Population Over Generations"})})]}),(0,t.jsxs)("group",{position:[5,4,0],rotation:[-Math.PI/4,0,0],children:[(0,t.jsxs)("mesh",{position:[0,.5,0],children:[(0,t.jsx)("boxGeometry",{args:[3,2,.1]}),(0,t.jsx)("meshStandardMaterial",{color:"#1f2937",transparent:!0,opacity:.9})]}),(0,t.jsxs)("mesh",{position:[-.8,.5,0],children:[(0,t.jsx)("boxGeometry",{args:[.4,Math.max(.01,C.percentSmall/50),.1]}),(0,t.jsx)("meshStandardMaterial",{color:"#3b82f6"})]}),(0,t.jsxs)("mesh",{position:[.8,.5,0],children:[(0,t.jsx)("boxGeometry",{args:[.4,Math.max(.01,C.percentLarge/50),.1]}),(0,t.jsx)("meshStandardMaterial",{color:"#f59e0b"})]}),(0,t.jsx)(c.Html,{position:[0,1.8,0],distanceFactor:12,children:(0,t.jsx)("div",{className:"text-xs text-white",children:"Size Distribution"})})]}),(0,t.jsx)(c.Html,{position:[0,5,0],distanceFactor:12,children:(0,t.jsxs)("div",{className:`bg-gradient-to-r px-4 py-2 rounded-lg text-sm font-bold shadow-lg ${"grass"===N?"from-green-600/90 to-green-700/90 text-white":"dirt"===N?"from-amber-700/90 to-amber-800/90 text-white":"from-blue-400/90 to-blue-500/90 text-white"}`,children:[B.name," | Generation: ",C.generation," | Population: ",C.populationCount]})}),(0,t.jsx)(c.Html,{position:[0,-2.5,0],distanceFactor:15,children:(0,t.jsxs)("div",{className:`px-4 py-2 rounded-lg text-sm font-bold shadow-lg ${"grass"===N?"bg-green-600/90 text-white":"dirt"===N?"bg-amber-700/90 text-white":"bg-blue-400/90 text-gray-900"}`,children:["Environment: ",B.name," ","grass"===N?"(🌿 Green Advantage)":"dirt"===N?"(🟤 Red Advantage)":"(❄️ Both Visible)"]})}),(0,t.jsx)(c.Html,{position:[-6,3,4],distanceFactor:12,children:(0,t.jsxs)("div",{className:"bg-gray-900/90 text-white px-3 py-2 rounded text-xs space-y-1",children:[(0,t.jsx)("div",{className:"font-bold text-green-400 mb-2",children:"Color Traits"}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-green-500"}),(0,t.jsxs)("span",{children:["Green (Camouflaged in grass): ",C.percentGreen,"%"]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-red-500"}),(0,t.jsxs)("span",{children:["Red (Visible in grass): ",C.percentRed,"%"]})]}),(0,t.jsxs)("div",{className:"mt-2 pt-2 border-t border-gray-700",children:[(0,t.jsx)("div",{className:"font-bold text-blue-400 mb-1",children:"Size Traits"}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-blue-500"}),(0,t.jsxs)("span",{children:["Small (Fast): ",C.percentSmall,"%"]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-amber-500"}),(0,t.jsxs)("span",{children:["Large (Slow): ",C.percentLarge,"%"]})]})]})]})}),(0,t.jsx)(c.Html,{position:[6,3,0],distanceFactor:12,children:(0,t.jsxs)("div",{className:"bg-gray-900/90 text-white px-3 py-2 rounded text-xs max-w-[200px]",children:[(0,t.jsx)("div",{className:"font-bold text-amber-400 mb-2",children:"How Natural Selection Works"}),(0,t.jsxs)("div",{className:"space-y-1 text-gray-300",children:[(0,t.jsx)("div",{children:"1. Environment favors certain traits"}),(0,t.jsx)("div",{children:"2. Camouflaged organisms survive more"}),(0,t.jsx)("div",{children:"3. Small organisms escape faster"}),(0,t.jsx)("div",{children:"4. Survivors pass traits to offspring"}),(0,t.jsx)("div",{children:"5. Population adapts over generations"})]}),(0,t.jsxs)("div",{className:"mt-2 pt-2 border-t border-gray-700",children:[(0,t.jsx)("div",{className:"text-green-400",children:"✓ Camouflaged = Less visible"}),(0,t.jsx)("div",{className:"text-blue-400",children:"✓ Small = Fast escape"})]})]})}),(0,t.jsx)(c.Html,{position:[0,2.5,-3],distanceFactor:12,children:(0,t.jsx)("div",{className:"bg-red-600/90 text-white px-3 py-1 rounded text-xs",children:"🔴 Predator Hunts Visible Organisms"})}),(0,t.jsx)(c.Html,{position:[0,-1.8,3],distanceFactor:15,children:(0,t.jsxs)("div",{className:"bg-gray-900/90 text-white px-4 py-2 rounded-lg text-sm",children:["Surviving to Next Generation: ",(0,t.jsxs)("span",{className:"font-bold text-yellow-400",children:[C.percentSurviving,"%"]})]})})]})]})}e.s(["default",0,function(){let[e,l]=(0,r.useState)(!0),[d,c]=(0,r.useState)(1),[u,f]=(0,r.useState)(0),[m,p]=(0,r.useState)(!0),[g,v]=(0,r.useState)(!1),[x,y]=(0,r.useState)(.15),[b,S]=(0,r.useState)(1),[w,M]=(0,r.useState)(40),[j,E]=(0,r.useState)(1),[A,C]=(0,r.useState)({generation:0,populationCount:40,percentGreen:50,percentRed:50,percentSmall:50,percentLarge:50,averageSize:.5,percentSurviving:100,environmentPhase:"Grassland"}),L=(0,r.useCallback)(()=>{l(e=>!e)},[]),P=(0,r.useCallback)(()=>{f(e=>e+1)},[]),z=(0,r.useCallback)(e=>{c(e)},[]),_=(0,r.useCallback)(e=>{C(e)},[]),U=(0,r.useMemo)(()=>(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(o.ControlGroup,{title:"Evolution Parameters",children:[(0,t.jsx)(o.ControlSlider,{label:"Mutation Rate",value:x,min:0,max:.5,step:.05,onChange:y,color:"#22c55e",decimals:2}),(0,t.jsx)(o.ControlSlider,{label:"Predator Speed",value:b,min:.5,max:2,step:.1,onChange:S,color:"#ef4444",decimals:1}),(0,t.jsx)(o.ControlSlider,{label:"Initial Population",value:w,min:20,max:80,step:5,onChange:M,color:"#3b82f6",decimals:0}),(0,t.jsx)(o.ControlSlider,{label:"Generation Speed",value:j,min:.5,max:3,step:.1,onChange:E,color:"#fbbf24",decimals:1})]}),(0,t.jsxs)("div",{className:"bg-green-50/50 rounded-lg p-3 border border-green-200/50",children:[(0,t.jsx)("div",{className:"text-xs text-gray-600 mb-2 font-medium",children:"Natural Selection Info"}),(0,t.jsxs)("div",{className:"text-xs text-gray-500 space-y-1",children:[(0,t.jsx)("div",{children:"• Green organisms are camouflaged in grass"}),(0,t.jsx)("div",{children:"• Red organisms are visible to predators"}),(0,t.jsx)("div",{children:"• Small organisms move faster"}),(0,t.jsx)("div",{children:"• Environment changes every 15 seconds"}),(0,t.jsx)("div",{children:"• Survivors reproduce with mutations"})]})]}),(0,t.jsx)("button",{onClick:P,className:"w-full mt-4 px-4 py-2 bg-[#22c55e]/20 hover:bg-[#22c55e]/30 text-[#22c55e] rounded-lg border border-[#22c55e]/50 transition-colors text-sm font-medium",children:"Reset Simulation"})]}),[x,b,w,j,P]),R=(0,r.useMemo)(()=>(0,t.jsx)(o.DataGrid,{data:{generation:{value:A.generation,unit:"gen",color:"#22c55e",decimals:0},population:{value:A.populationCount,unit:"organisms",color:"#34d399",decimals:0},green:{value:A.percentGreen,unit:"camouflaged",color:"#22c55e",decimals:0},red:{value:A.percentRed,unit:"visible",color:"#ef4444",decimals:0},small:{value:A.percentSmall,unit:"fast",color:"#3b82f6",decimals:0},large:{value:A.percentLarge,unit:"slow",color:"#f59e0b",decimals:0},surviving:{value:A.percentSurviving,unit:"%",color:"#fbbf24",decimals:0}},columns:2}),[A]),N=(0,r.useMemo)(()=>(0,t.jsx)(s.DataPanel,{isVisible:g,onToggle:()=>v(e=>!e),children:R}),[g,R]);return(0,t.jsxs)("div",{className:"w-full h-screen relative",children:[(0,t.jsx)(i.ExperimentContainer,{title:"Natural Selection",description:"Watch evolution in action: environment changes favor different traits, and survivors pass on their genes",cameraPosition:[0,8,12],backgroundColor:"#0a0a0f",controls:null,dataPanel:N,children:(0,t.jsx)(h,{onDataChange:_,isPlaying:e,simulationSpeed:d,resetTrigger:u,mutationRate:x,predatorSpeed:b,initialPopulation:w,generationSpeed:j})}),(0,t.jsx)(n.SimulationController,{isPlaying:e,onPlayPause:L,onReset:P,speed:d,onSpeedChange:z,timeElapsed:0}),m&&(0,t.jsx)(a.FloatingControlPanel,{initialPosition:{x:window.innerWidth-340,y:80},children:U}),!m&&(0,t.jsx)("button",{onClick:()=>p(!0),className:"fixed top-20 right-4 z-20 px-4 py-2 bg-[#22c55e]/20 hover:bg-[#22c55e]/30 text-[#22c55e] rounded-lg border border-[#22c55e]/50 transition-colors text-sm font-medium",children:"Show Controls"})]})}],50319)}]);
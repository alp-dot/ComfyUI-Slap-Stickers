// Deterministic float64 geometry. Mirrors surface.py, guarded by parity fixtures.
export const PLANE_TOL = .03;
const JACOBI_SWEEPS = 24, JACOBI_EPSILON = 1e-14, PARALLEL_COS = .05;
export const dot = (a, b) => a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const add = (a, b) => a.map((v, i) => v+b[i]);
const sub = (a, b) => a.map((v, i) => v-b[i]);
const mul = (a, t) => a.map(v => v*t);
const unit = a => Math.sqrt(dot(a, a)) > 1e-12 ? mul(a, 1/Math.sqrt(dot(a, a))) : [0, 0, 0];
const cross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
const matvec = (a, b) => a.map(row => dot(row, b));
export function projectRectangle(p0,e1,e2,width,height,intrinsics,offset=[0,0]){
  const rectangle=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,y])=>add(p0,add(mul(e1,x*width/2),mul(e2,y*height/2))));
  const near=.05*p0[2],polygon=[];
  const project=q=>{const p=matvec(intrinsics,q);return [p[0]/p[2]+offset[0],p[1]/p[2]+offset[1]];};
  rectangle.forEach((q,i)=>{
    const r=rectangle[(i+1)%4];
    if(q[2]>=near)polygon.push(q);
    if((q[2]>=near)!==(r[2]>=near))polygon.push(add(q,mul(sub(r,q),(near-q[2])/(r[2]-q[2]))));
  });
  const top3d=add(p0,mul(e2,-height/2)),center=project(p0),p=matvec(intrinsics,p0),up=matvec(intrinsics,mul(e2,-1));
  return {corners:polygon.map(project),handles:rectangle.map(q=>q[2]>=near?project(q):null),center,top:top3d[2]>=near?project(top3d):null,up:[up[0]*p[2]-p[0]*up[2],up[1]*p[2]-p[1]*up[2]]};
}
export function inverse3(a) {
  const c = [cross(a[1], a[2]), cross(a[2], a[0]), cross(a[0], a[1])];
  const determinant = dot(a[0], c[0]);
  return [0,1,2].map(i => [0,1,2].map(j => c[j][i]/determinant));
}
function smallestEigenvector(matrix) {
  const a = matrix.map(row => [...row]), v = [[1,0,0],[0,1,0],[0,0,1]];
  for (let iteration = 0; iteration < JACOBI_SWEEPS; iteration++) {
    if (Math.max(Math.abs(a[0][1]), Math.abs(a[0][2]), Math.abs(a[1][2])) <= JACOBI_EPSILON*Math.max(1, Math.abs(a[0][0]+a[1][1]+a[2][2]))) break;
    for (const [p, q] of [[0,1],[0,2],[1,2]]) {
      if (Math.abs(a[p][q]) < 1e-30) continue;
      const angle = .5*Math.atan2(2*a[p][q], a[q][q]-a[p][p]), c = Math.cos(angle), s = Math.sin(angle);
      const app = a[p][p], aqq = a[q][q], apq = a[p][q];
      for (let k = 0; k < 3; k++) {
        if (k !== p && k !== q) {
          const akp = a[k][p], akq = a[k][q];
          a[k][p] = a[p][k] = c*akp-s*akq;
          a[k][q] = a[q][k] = s*akp+c*akq;
        }
        const vkp = v[k][p], vkq = v[k][q];
        v[k][p] = c*vkp-s*vkq; v[k][q] = s*vkp+c*vkq;
      }
      a[p][p] = c*c*app-2*s*c*apq+s*s*aqq;
      a[q][q] = s*s*app+2*s*c*apq+c*c*aqq;
      a[p][q] = a[q][p] = 0;
    }
  }
  let index = 0;
  for (let j = 1; j < 3; j++) if (a[j][j] < a[index][index]) index = j;
  return unit(v.map(row => row[index]));
}
export function flatSurface(grid, sticker, aspect, physicalWidth = null, frameOnly = false) {
  const { width: w, height: h, points: p, normals, valid } = grid;
  const point = i => [p[i*3], p[i*3+1], p[i*3+2]];
  const normal = i => [normals[i*3], normals[i*3+1], normals[i*3+2]];
  const [u,v] = sticker.anchor;
  let ay = Math.min(h-1, Math.floor(v*h)), ax = Math.min(w-1, Math.floor(u*w)), a = ay*w+ax;
  if (!valid[a]) {
    let best = Infinity, nearest = -1;
    for (let i = 0; i < w*h; i++) if (valid[i]) {
      const d = (Math.floor(i/w)-ay)**2+(i%w-ax)**2;
      if (d < best) { best = d; nearest = i; }
    }
    if (nearest < 0 || best > 100**2) return null;
    a = nearest; ay = Math.floor(a/w); ax = a%w;
  }
  const edge = sticker.edge;
  const connected = (i, j) => valid[i] && valid[j] && Math.abs(p[i*3+2]-p[j*3+2]) <= edge*Math.min(p[i*3+2], p[j*3+2]);
  const apparent = physicalWidth !== null ? physicalWidth*grid.intrinsics[0][0]/p[a*3+2] : sticker.size;
  const radius = Math.min(32, Math.max(3, Math.floor(.25*Math.min(apparent*w, apparent*w/aspect)+.5)));
  const xmin = Math.max(0, ax-radius), xmax = Math.min(w-1, ax+radius), ymin = Math.max(0, ay-radius), ymax = Math.min(h-1, ay+radius);
  let queue = [a];
  const seen = new Set(queue);
  for (let head = 0; head < queue.length; head++) {
    const i = queue[head], y = Math.floor(i/w), x = i%w;
    for (const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nx = x+dx, ny = y+dy, j = ny*w+nx;
      if (nx >= xmin && nx <= xmax && ny >= ymin && ny <= ymax && !seen.has(j) && connected(i,j)) { seen.add(j); queue.push(j); }
    }
  }
  const cells = [...seen].sort((a,b) => a-b);
  let mean, n;
  if (cells.length >= 6) {
    mean = [0,0,0];
    for (const i of cells) mean = add(mean, point(i));
    mean = mul(mean, 1/cells.length);
    const covariance = [[0,0,0],[0,0,0],[0,0,0]];
    for (const i of cells) {
      const d = sub(point(i), mean);
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) covariance[r][c] += d[r]*d[c];
    }
    n = smallestEigenvector(covariance);
  } else {
    mean = point(a); n = unit(normal(a));
    if (!n.some(Boolean)) n = mul(unit(point(a)), -1);
  }
  if (dot(n, point(a)) > 0) n = mul(n, -1);
  const inv = inverse3(grid.intrinsics), ray = matvec(inv, [u,v,1]);
  const denominator = dot(n,ray), grazing = Math.abs(denominator)/Math.sqrt(dot(ray,ray)) < PARALLEL_COS;
  let p0 = grazing ? point(a) : mul(ray, dot(n,mean)/denominator);
  if (p0[2] <= 0) p0 = point(a);
  const ray1 = matvec(inv, [u,v-1/h,1]), d1 = dot(n,ray1);
  const p1 = Math.abs(d1) > 1e-12 ? mul(ray1, dot(n,mean)/d1) : [0,0,0];
  let up = unit(sub(p1,p0));
  if (grazing || p1[2] <= 0 || !up.some(Boolean)) {
    up = sub([0,-1,0], mul(n,dot(n,[0,-1,0])));
    if (Math.sqrt(dot(up,up)) < 1e-6) up = sub([0,0,1], mul(n,n[2]));
    up = unit(up);
  }
  const down = mul(up,-1), right = cross(n,down), theta = sticker.rotation*Math.PI/180, c = Math.cos(theta), s = Math.sin(theta);
  const e1 = add(mul(right,c),mul(down,s)), e2 = add(mul(right,-s),mul(down,c));
  const width = physicalWidth ?? sticker.size*p0[2]/grid.intrinsics[0][0], height = width/aspect;
  const {corners}=projectRectangle(p0,e1,e2,width,height,grid.intrinsics);
  const bounds = [Math.max(0,Math.min(...corners.map(p=>p[0]))), Math.max(0,Math.min(...corners.map(p=>p[1]))), Math.min(1,Math.max(...corners.map(p=>p[0]))), Math.min(1,Math.max(...corners.map(p=>p[1])))];
  if(frameOnly)return {p0,n,e1,e2,w:width,h:height,bounds,corners,cell:a};
  const [bx0,by0,bx1,by1] = [Math.floor(bounds[0]*w)-2,Math.floor(bounds[1]*h)-2,Math.ceil(bounds[2]*w)+2,Math.ceil(bounds[3]*h)+2];
  const region = new Uint8Array(w*h), visited = new Uint8Array(w*h);
  queue = [a]; visited[a] = 1;
  for (let head = 0; head < queue.length; head++) {
    const i = queue[head], y = Math.floor(i/w), x = i%w;
    if (x < bx0 || x > bx1 || y < by0 || y > by1 || Math.abs(dot(n,sub(point(i),p0))) > PLANE_TOL*p[i*3+2]) continue;
    region[i] = 1;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const nx = x+dx, ny = y+dy, j = ny*w+nx;
      if ((!dx && !dy) || nx < 0 || nx >= w || ny < 0 || ny >= h || visited[j] || !connected(i,j)) continue;
      if (dx && dy && ![[i,y*w+nx],[i,ny*w+x],[j,y*w+nx],[j,ny*w+x]].every(([k,l]) => connected(k,l))) continue;
      visited[j] = 1; queue.push(j);
    }
  }
  return { p0,n,e1,e2,w:width,h:height,region,bounds,corners,cell:a };
}
export function decodeGrid(buffer, meta) {
  const width = meta.grid_w, height = meta.grid_h, count = width*height;
  if (meta.format !== 1 || !Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || buffer.byteLength !== count*25) throw new Error("The surface data is incomplete. Run the workflow again.");
  const view = new DataView(buffer);
  const points = new Float32Array(count*3), normals = new Float32Array(count*3);
  for (let i = 0; i < count*3; i++) { points[i] = view.getFloat32(i*4,true); normals[i] = view.getFloat32(count*12+i*4,true); }
  return { width, height, points, normals, valid: new Uint8Array(buffer.slice(count*24)), intrinsics: meta.intrinsics };
}

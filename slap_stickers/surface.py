"""Deterministic float64 geometry shared with surface.js."""

from collections import deque
import math

import numpy as np

PLANE_TOL = .03
PARALLEL_COS = .05
JACOBI_SWEEPS = 24
JACOBI_EPSILON = 1e-14


def _unit(v):
    length = math.sqrt(float(v @ v))
    return v / length if length > 1e-12 else np.zeros(3)


def _smallest_eigenvector(matrix):
    a = matrix.copy()
    v = np.eye(3)
    for _ in range(JACOBI_SWEEPS):
        if max(abs(a[0, 1]), abs(a[0, 2]), abs(a[1, 2])) <= JACOBI_EPSILON * max(1., abs(float(np.trace(a)))):
            break
        for p, q in ((0, 1), (0, 2), (1, 2)):
            if abs(a[p, q]) < 1e-30:
                continue
            angle = .5 * math.atan2(2 * a[p, q], a[q, q] - a[p, p])
            c, s = math.cos(angle), math.sin(angle)
            app, aqq, apq = a[p, p], a[q, q], a[p, q]
            for k in range(3):
                if k not in (p, q):
                    akp, akq = a[k, p], a[k, q]
                    a[k, p] = a[p, k] = c * akp - s * akq
                    a[k, q] = a[q, k] = s * akp + c * akq
                vkp, vkq = v[k, p], v[k, q]
                v[k, p], v[k, q] = c * vkp - s * vkq, s * vkp + c * vkq
            a[p, p] = c*c*app - 2*s*c*apq + s*s*aqq
            a[q, q] = s*s*app + 2*s*c*apq + c*c*aqq
            a[p, q] = a[q, p] = 0
    return _unit(v[:, min(range(3), key=lambda j: a[j, j])])


def flat_surface(grid, sticker, aspect, physical_width=None, *, frame_only=False):
    """Return tangent frame, projected corners and connected region, or no surface."""
    h, w = grid.height, grid.width
    p = grid.points.astype(np.float64).reshape(-1, 3)
    normals = grid.normals.astype(np.float64).reshape(-1, 3)
    valid = grid.valid.reshape(-1).astype(bool)
    u, v = sticker["anchor"]
    ay, ax = min(h-1, int(v*h)), min(w-1, int(u*w))
    a = ay*w + ax
    if not valid[a]:
        candidates = np.flatnonzero(valid)
        if not len(candidates):
            return None
        a = min(candidates, key=lambda i: ((i // w - ay)**2 + (i % w - ax)**2, i))
        if (a // w - ay)**2 + (a % w - ax)**2 > 100**2:
            return None
        ay, ax = divmod(int(a), w)
    edge = sticker["edge"]

    def connected(i, j):
        return bool(valid[i] and valid[j] and abs(p[i, 2]-p[j, 2]) <= edge*min(p[i, 2], p[j, 2]))

    apparent = physical_width * grid.intrinsics[0, 0] / p[a, 2] if physical_width is not None else sticker["size"]
    radius = min(32, max(3, math.floor(.25*min(apparent*w, apparent*w/aspect) + .5)))
    xmin, xmax, ymin, ymax = max(0, ax-radius), min(w-1, ax+radius), max(0, ay-radius), min(h-1, ay+radius)
    seen, queue = {int(a)}, deque([int(a)])
    while queue:
        i = queue.popleft()
        y, x = divmod(i, w)
        for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nx, ny = x+dx, y+dy
            j = ny*w+nx
            if xmin <= nx <= xmax and ymin <= ny <= ymax and j not in seen and connected(i, j):
                seen.add(j)
                queue.append(j)
    cells = sorted(seen)
    if len(cells) >= 6:
        samples = p[cells]
        mean = np.cumsum(samples, axis=0)[-1] / len(cells)
        delta = samples-mean
        covariance = np.empty((3, 3))
        for r in range(3):
            for c in range(3):
                covariance[r, c] = np.cumsum(delta[:, r]*delta[:, c])[-1]
        n = _smallest_eigenvector(covariance)
    else:
        mean = p[a].copy()
        n = _unit(normals[a])
        if not np.any(n):
            n = -_unit(p[a])
    if n @ p[a] > 0:
        n = -n
    inv = np.linalg.inv(grid.intrinsics)
    ray = inv @ [u, v, 1]
    dot = float(n @ ray)
    grazing = abs(dot) / float(np.linalg.norm(ray)) < PARALLEL_COS
    p0 = p[a].copy() if grazing else ray * float(n @ mean) / dot
    if p0[2] <= 0:
        p0 = p[a].copy()
    ray1 = inv @ [u, v-1/h, 1]
    dot1 = float(n @ ray1)
    p1 = ray1 * float(n @ mean) / dot1 if abs(dot1) > 1e-12 else np.zeros(3)
    up = _unit(p1-p0)
    if grazing or p1[2] <= 0 or not np.any(up):
        up = np.array([0., -1, 0]) - n * float(n @ [0, -1, 0])
        if np.linalg.norm(up) < 1e-6:
            up = np.array([0., 0, 1]) - n * n[2]
        up = _unit(up)
    down, right = -up, np.cross(n, -up)
    theta = sticker["rotation"] * math.pi / 180
    c, s = math.cos(theta), math.sin(theta)
    e1, e2 = c*right+s*down, -s*right+c*down
    width = physical_width if physical_width is not None else sticker["size"] * p0[2] / grid.intrinsics[0, 0]
    height = width/aspect
    corners3d = [p0 + sx*width/2*e1 + sy*height/2*e2 for sx, sy in ((-1,-1),(1,-1),(1,1),(-1,1))]
    near = .05*p0[2]
    polygon = []
    for i, q in enumerate(corners3d):
        r = corners3d[(i+1) % 4]
        if q[2] >= near:
            polygon.append(q)
        if (q[2] >= near) != (r[2] >= near):
            polygon.append(q + (r-q) * (near-q[2])/(r[2]-q[2]))
    projected = []
    for q in polygon:
        image = grid.intrinsics @ q
        projected.append([float(image[0]/image[2]), float(image[1]/image[2])])
    bounds = [max(0., min(q[0] for q in projected)), max(0., min(q[1] for q in projected)),
              min(1., max(q[0] for q in projected)), min(1., max(q[1] for q in projected))]
    if frame_only:
        return {"p0": p0, "n": n, "e1": e1, "e2": e2, "w": float(width), "h": float(height),
                "bounds": bounds, "corners": projected, "cell": int(a)}
    bx0, by0, bx1, by1 = math.floor(bounds[0]*w)-2, math.floor(bounds[1]*h)-2, math.ceil(bounds[2]*w)+2, math.ceil(bounds[3]*h)+2
    region = np.zeros(h*w, dtype=np.uint8)
    visited = {int(a)}
    queue = deque([int(a)])
    while queue:
        i = queue.popleft()
        y, x = divmod(i, w)
        if not (bx0 <= x <= bx1 and by0 <= y <= by1) or abs(float(n @ (p[i]-p0))) > PLANE_TOL*p[i, 2]:
            continue
        region[i] = 1
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                nx, ny = x+dx, y+dy
                j = ny*w+nx
                if (dx == dy == 0) or not (0 <= nx < w and 0 <= ny < h) or j in visited or not connected(i, j):
                    continue
                if dx and dy and not all(connected(k, l) for k, l in ((i, y*w+nx),(i, ny*w+x),(j, y*w+nx),(j, ny*w+x))):
                    continue
                visited.add(j)
                queue.append(j)
    return {"p0": p0, "n": n, "e1": e1, "e2": e2, "w": float(width), "h": float(height),
            "region": region.reshape(h, w), "bounds": bounds, "corners": projected, "cell": int(a)}


def flat_uv(surface, coordinates, intrinsics):
    coords = np.asarray(coordinates, dtype=np.float64)
    rays = np.concatenate((coords, np.ones((*coords.shape[:-1], 1))), axis=-1) @ np.linalg.inv(intrinsics).T
    denom = rays @ surface["n"]
    numerator = float(surface["n"] @ surface["p0"])
    distance = np.divide(numerator, denom, out=np.full_like(denom, np.nan), where=np.abs(denom) > 1e-12)
    q = rays * distance[..., None] - surface["p0"]
    uv = np.stack((q @ surface["e1"] / surface["w"] + .5, q @ surface["e2"] / surface["h"] + .5), axis=-1)
    uv[distance <= 0] = np.nan
    return uv

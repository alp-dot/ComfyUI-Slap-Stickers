import numpy as np
import json
from pathlib import Path
import pytest
from slap_stickers.surface import flat_surface
from slap_stickers.wrap import wrap_surface
from slap_stickers.grid import Grid
from tests.python.test_surface import plane_grid, sticker


@pytest.mark.parametrize('case',json.loads((Path(__file__).parents[1]/'fixtures/geometry/wrap.json').read_text()),ids=lambda c:c['name'])
def test_wrap_matches_the_shared_geometry_fixture(case):
    h,w=case['height'],case['width']
    grid=Grid(np.array(case['points'],dtype=np.float32).reshape(h,w,3),np.array(case['normals'],dtype=np.float32).reshape(h,w,3),np.array(case['valid'],dtype=np.uint8).reshape(h,w),np.array(case['intrinsics']))
    result=wrap_surface(grid,case['sticker'],case['aspect'])
    np.testing.assert_array_equal(result['reached'],case['expected']['reached'])
    np.testing.assert_array_equal(result['region'],case['expected']['region'])
    np.testing.assert_allclose(result['xy'],case['expected']['xy'],atol=1e-6,rtol=0)


def cylinder_grid(h=25,w=81):
    # Camera looking at the near side of a unit cylinder centered at z=3.
    yy,xx=np.mgrid[:h,:w];theta=(xx-(w-1)/2)*1.1/((w-1)/2)
    z=3-np.cos(theta);x=np.sin(theta);y=((yy+.5)/h-.5)*z
    p=np.stack((x,y,z),-1).astype(np.float32)
    n=np.stack((np.sin(theta),np.zeros_like(theta),-np.cos(theta)),-1).astype(np.float32)
    # This analytic grid samples angle uniformly; normalized projection is nonuniform.
    return Grid(p,n,np.ones((h,w),np.uint8),np.array([[1,0,.5],[0,1,.5],[0,0,1.]]))


def test_cylinder_preserves_arc_length_and_is_not_a_flat_projection():
    grid=cylinder_grid();s=wrap_surface(grid,sticker(size=1.1),aspect=1)
    row=grid.height//2;col=60
    theta=(col-40)*1.1/40
    assert s['reached'][row,col]
    assert abs(s['xy'][row,col,0]-theta)<.02
    assert abs(s['xy'][row,col,0]-grid.points[row,col,0])>.02
    assert s['region'][row,col]


def test_wrap_on_a_plane_matches_local_metric_coordinates():
    grid=plane_grid(25,33);s=wrap_surface(grid,sticker(size=.8),1)
    yy,xx=np.where(s['reached']);p=grid.points[yy,xx]-s['p0']
    expected=np.stack((p@s['e1'],p@s['e2']),-1)
    np.testing.assert_allclose(s['xy'][yy,xx],expected,atol=1e-6)


def test_wrap_does_not_cross_depth_jump_or_invalid_barrier():
    grid=plane_grid(25,33);grid.points[:,20:]*=2;grid.valid[18]=0
    s=wrap_surface(grid,sticker(size=1.8,anchor=[.4,.4]),1)
    assert not s['reached'][:,20:].any()
    assert not s['reached'][18:].any()


def camera_cylinder_grid(h=49,w=81):
    yy,xx=np.mgrid[:h,:w]
    k=np.array([[1.6,0,.5],[0,1.6*w/h,.5],[0,0,1.]])
    rx=((xx+.5)/w-.5)/k[0,0]
    ry=((yy+.5)/h-.5)/k[1,1]
    a=1+rx*rx
    z=(3-np.sqrt(9-8*a))/a
    points=np.stack((rx*z,ry*z,z),-1).astype(np.float32)
    normals=np.stack((rx*z,np.zeros_like(z),z-3),-1).astype(np.float32)
    return Grid(points,normals,np.ones((h,w),np.uint8),k)


def test_camera_cylinder_preserves_arc_with_perspective_projection():
    grid=camera_cylinder_grid()
    s=wrap_surface(grid,sticker(size=1.4),3.5)
    point=grid.points[24,70]
    angle=np.arctan2(point[0],3-point[2])
    assert s['region'][24,70]
    assert abs(s['xy'][24,70,0]-angle)<.02*angle
    projected=grid.points@grid.intrinsics.T
    np.testing.assert_allclose(projected[24,70,:2]/projected[24,70,2],[(70.5)/81,.5],atol=1e-7)

import { Scene } from "three-full";

export default function(width,height,betZones,forIntersect){    
    
    let _matLine = new THREE.LineMaterial({
        color: 0xAAAAAA,
        linewidth: 2, // in pixels        
        dashed: false,
    });    

    _matLine.resolution.set(width, height);
    this.resizeUpdate.matLine = _matLine

    const RoundedRectangle = function (width, height, radius) {
        let ctx = new THREE.Shape();
        let x = -width / 2
        let y = -height / 2
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y + height - radius);
        ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
        ctx.lineTo(x + width - radius, y + height);
        ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
        ctx.lineTo(x + width, y + radius);
        ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
        ctx.lineTo(x + radius, y);
        ctx.quadraticCurveTo(x, y, x, y + radius);
        ctx.autoClose = true;      
    return ctx;
    }

    let _r1 = RoundedRectangle(10, 16, 0.8),
    _r2 = RoundedRectangle(13, 16, 0.8);

    let _positions = [],
    _positions2 = [];

    
    for(let a of _r1.getPoints()){
        _positions.push(a.x, a.y, 0)    
    }

    _r2.getPoints().forEach(a => {
      _positions2.push(a.x, a.y, 0)
    });


    let _pl_mt = new THREE.MeshPhongMaterial({
      color: 0x3f675a,
      opacity: 0.25,
      transparent: true,
      alphaTest: 0.25,
    })

    
    let _pl_g1 = new THREE.ShapeGeometry(_r1),
      _pl_g2 = new THREE.ShapeGeometry(_r2)
    let _pl_m1 = new THREE.Mesh(_pl_g1, _pl_mt);
    let _pl_m2 = new THREE.Mesh(_pl_g2, _pl_mt.clone())    
    _pl_m1.position.z = _pl_m2.position.z = 0

    let _geo = new THREE.LineGeometry(),
      _geo2 = new THREE.LineGeometry();
    _geo.setPositions(_positions)
    _geo2.setPositions(_positions2)

    var _line = new THREE.Line2(_geo, _matLine),
      _line2 = new THREE.Line2(_geo2, _matLine);
    _line.computeLineDistances();
    _line2.computeLineDistances();

    let _group = new THREE.Group();
    _group.add(_line)
    _group.add(_pl_m1);
    _group.name = 'bet_2'
    betZones[2] = _group;

    let _group2 = new THREE.Group();
    _group2.add(_line2)
    _group2.add(_pl_m2)
    _group2.position.x = 13.5;
    _group2.name = 'bet_3'
    betZones[3] = _group2;
    _group2.rotation.z = Math.PI / 24
    _group2.position.y = 1

    let _group3 = _group2.clone()
    _group3.name = 'bet_1'
    betZones[1] = _group3;
    _group3.position.x = _group2.position.x * -1
    _group3.rotation.z = _group2.rotation.z * -1

    let _group4 = _group2.clone()
    _group4.name = 'bet_4'
    betZones[4] = _group4;
    _group4.position.x = _group2.position.x + 15;
    _group4.position.y = 4.4
    _group4.rotation.z = Math.PI / 10

    let _group5 = _group4.clone()
    _group5.name = 'bet_0'
    betZones[0] = _group5;
    _group5.position.x = _group4.position.x * -1;
    _group5.rotation.z = _group4.rotation.z * -1;

    betZones = betZones.map((t, i) => {      
      let a = (t.getObjectByProperty('type', 'Mesh'))
      a.userData.index = i;      
      scene.add(t);

      if (i > 0) {
        a.material = a.material.clone();
      }
      a.name = `betzone_${i}`;
      a.receiveShadow = true;
      
      return a
    })

    this.betZones = betZones
    
    forIntersect.betting_zone = betZones
}
import { FontLoader } from 'three-full'
import { Scene } from 'three-full';

const fontLoader = new FontLoader()
fontLoader.load('', font => {
  let geometry = new THREE.TextGeometry('hello three.js',{
    font: font,
    size: 80,
    height: 5,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 10,
		bevelSize: 8,
		bevelSegments: 5
  })

  let mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial())
  Scene.add(mesh)
})

export default {}
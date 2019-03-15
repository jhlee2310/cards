export default function(game, table_group){
  const { THREE, scene } = game;
  const fontLoader = new THREE.FontLoader()
    fontLoader.load('/gentilis_bold.typeface.json', font => {
    let geometry = new THREE.TextGeometry('Player',{
      font: font,
      size: 5,
      height: 1,
      curveSegments: 6,
      bevelEnabled: false,      
      //bevelSegments: 5
    })

    let geometry2 = new THREE.TextGeometry('WIN',{
      font: font,
      size: 5,
      height: 1,
      curveSegments: 6,
      bevelEnabled: false,      
      //bevelSegments: 5
    })

    let player_win = new THREE.Group();
    let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial())
    let mesh2 = new THREE.Mesh(geometry2, new THREE.MeshPhongMaterial())
    player_win.add(mesh)
    player_win.add(mesh2)
    table_group.add(player_win);
  })
}
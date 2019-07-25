	var renderer;
	var scene;
	var camera;
	var spotLight;
	var smsh;
	var smsh2;
	var smsh3;
	var smshBigO;
	
	<!-- add objects in the scope so all methods can access -->
	var groundPlane;
	var ball;
	var heavyBall;

	<!-- 3. Add the following two lines. -->
	Physijs.scripts.worker = 'libs/physijs_worker.js';
    Physijs.scripts.ammo = 'ammo.js';
	
	function init()
	{
		<!-- 4. Edit the scene creation -->
		scene = new Physijs.Scene();
		scene.setGravity(new THREE.Vector3( 0, 0, -30 ));
		
		setupCamera();
		setupRenderer();
		addSpotLight();
		camera.rotation.z = -Math.PI/2;
		
		<!-- 5. Ground plane -->
		createGroundPlane();
		
		<!-- 7. Create and add cannon -->
		createCannon();
		
		<!-- 11. Create ball -->
		createBall();
		
		<!-- 14. Create target -->
		createTarget();
		createOrangeTarget();
		createOrangeTarget2();
		createObstacles();
		createBigObstacle();
		loadSounds();
		playMusic();
		updateScore();
		printName();
		//printInstructions();
		//printInstructions2();
		
	
		// Output to the stream
		document.body.appendChild( renderer.domElement );
		
		// Call render
		render();
	}
	
	function render()
	{
		<!-- 6. Physics simulation -->
		scene.simulate();
		
		<!-- 9. Maintain cannon elevation controls -->
		maintainCannonElevationControls();
		
		<!-- 10. Maintain cannon right/left -->
		maintainCannonRightLeft();

		<!-- 12. Look for ball keypresses -->
		maintainBallKeypresses();
		
		 maintainPlaneRightLeft();
		
		<!-- 15. Check for ball off the plane -->
		checkBallPosition();
		

		// Request animation frame
		requestAnimationFrame( render );
		
		// Call render()
		renderer.render( scene, camera );
	}
	
	<!-- 5. Ground plane -->
	function createGroundPlane()
	{
		var texture = THREE.ImageUtils.loadTexture('images/groundterrain.jpg');
		
		var planeMaterial = new Physijs.createMaterial(new THREE.MeshLambertMaterial({map:texture}), .4, .8 );
		var planeGeometry = new THREE.PlaneGeometry( 300, 300, 6);
		groundPlane = new Physijs.BoxMesh( planeGeometry, planeMaterial, 0 );
		groundPlane.name = "GroundPlane";
		scene.add( groundPlane );
		groundPlane.addEventListener( 'collision', function( other_object, linear_velocity, angular_velocity )
		{
			if( other_object.name == "CannonBall" )
			{
				one.play();
				
			}
			if( other_object.name == "TargetBall" )
			{
				one.play();
				scoreValue+=5;
				updateScore();
				
			}
			if( other_object.name == "TargetBall2")
			{
				one.play();
				scoreValue+=5;
				updateScore();
				
			}
			if( other_object.name == "TargetBall3")
			{
				one.play();
				scoreValue+=5;
				updateScore();
				
			}
			if( other_object.name == "TargetBall5")
			{
				one.play();
				scoreValue+=5;
				updateScore();
				
			}
		});
	}
	
	<!-- 7. Create cannon -->
	
	function createCannon()
	{
		var cylinderGeometry = new THREE.CylinderGeometry( 3, 3, 17);
		var cannonMaterial = new THREE.MeshLambertMaterial({color:'black'});
		var can = new THREE.Mesh( cylinderGeometry, cannonMaterial );
		can.position.y = -2;
		can.position.x = 0;
		can.position.z = -8;
		
		

		//<!-- 8. Create Object3D wrapper that will allow use to correctly rotate -->
		cannon = new THREE.Object3D();
		cannon.add( can );
		
		cannon.rotation.z = Math.PI / 2;
		cannon.position.x -= 80;
		cannon.position.z += 15;
		cannon.name = "CannonBall";
		scene.add(cannon);
		
		var cannonBodyGeometry = new THREE.CylinderGeometry(6,6,15);
		cannonBody = new Physijs.SphereMesh( cannonBodyGeometry, cannonMaterial );
		cannonBody.position.x = -90;
		cannonBody.position.y = 0;
		cannonBody.position.z = 10;
		cannonBody.name = "cannonBody";
		scene.add(cannonBody);
		
	}
	
		function createCannon2()
	{
		var cylinderGeometry = new THREE.CylinderGeometry( 3, 3, 17);
		var cannonMaterial = new THREE.MeshLambertMaterial({color:'black'});
		var can = new THREE.Mesh( cylinderGeometry, cannonMaterial );
		can.position.y = -90;
		can.position.x = -90;
		can.position.z = -8;
		can.rotation.z = Math.PI/2;
		

		//<!-- 8. Create Object3D wrapper that will allow use to correctly rotate -->
		cannon = new THREE.Object3D();
		cannon.add( can );
		
		cannon.rotation.z = Math.PI / 2;
		cannon.position.x -= 84;
		cannon.position.z += 20;
		cannon.name = "CannonBall";
		scene.add(cannon);
		
		
		/*
		var cannonBodyGeometry = new THREE.CylinderGeometry(6,6,15);
		cannonBody = new Physijs.SphereMesh( cannonBodyGeometry, cannonMaterial );
		cannonBody.position.x = -90;
		cannonBody.position.y = 0;
		cannonBody.position.z = 5;
		cannonBody.name = "cannonBody";
		scene.add(cannonBody);
		/*var sphereGeometry = new THREE.SphereGeometry( 6 );
		var sphereMaterial = new Physijs.createMaterial( new THREE.MeshLambertMaterial({color:'black'}), .95, .95 );
		cannonBody = new Physijs.SphereMesh( sphereGeometry, sphereMaterial );
		cannonBody.position.x = -80;
		cannonBody.position.y = 0;
		cannonBody.position.z = 0;
		cannonBody.name = "cannonBody";
		groundPlane.add(cannonBody);
		*/
	}
	
	<!-- 9. Maintain cannon elevation controls -->
	function maintainCannonElevationControls()
	{
		if( Key.isDown(Key.W))
		{
			cannon.rotation.y -= 0.01;
			if( cannon.rotation.y < -( Math.PI / 3 ) )
			{
				cannon.rotation.y = -( Math.PI / 3 );
			}
		}
		if( Key.isDown(Key.S))
		{
			cannon.rotation.y += 0.01;
			if( cannon.rotation.y > 0 )
			{
				cannon.rotation.y = 0;
			}
		}
	}

	<!-- 10. Maintain cannon right/left -->
	function maintainCannonRightLeft()
	{
		if( Key.isDown(Key.A))
		{
			cannon.rotation.z += 0.01;
		}
		if( Key.isDown(Key.D))
		{
			cannon.rotation.z -= 0.01;
		}
	}
	
	<!-- 12. Look for ball keypresses -->
	var ballLaunched = false;
	function maintainBallKeypresses()
	{
		if( !ballLaunched && Key.isDown(Key.F) )//Adding the space bar as an additional fire button 
		{
			createBall();
			ballLaunched = true;
			scene.add( ball );
			ball.applyCentralImpulse( new THREE.Vector3( 16000, -( Math.PI / 2 - cannon.rotation.z ) * 20000, -cannon.rotation.y * 20000 ) );//cannon sharp angles were fixed with this
			explode.play();
			scoreValue--;
		}
		if( !ballLaunched && Key.isDown(Key.SPACE) )//Adding the space bar as an additional fire button 
		{
			createHeavyBall();
			ballLaunched = true;
			scene.add( heavyBall );
			heavyBall.applyCentralImpulse( new THREE.Vector3( 25000, -( Math.PI / 2 - cannon.rotation.z ) * 22000, -cannon.rotation.y * 22000 ) );//cannon sharp angles were fixed with this
			explode.play();
			scoreValue-=3;
		}
		if( ballLaunched && Key.isDown(Key.L) )
		{
			load.play();
			ballLaunched = false;
			scene.remove( ball );
			scoreValue--;
			updateScore();
			
			
			
		}
	}
	
		
		
	function maintainPlaneRightLeft()
	{
		
		if( Key.isDown( Key.LEFTARROW ))
		{
			camera.position.x -= 1;
			scene.add(camera );
		}
		if( Key.isDown( Key.RIGHTARROW ) )
		{
			camera.position.x += 1;
			scene.add(camera );
		}
		if( Key.isDown( Key.UPARROW ) && camera.position.z < 200 )
		{
			camera.position.z += 0.5;
			scene.add( camera );//This is what actually makes it stay
		}
		if( Key.isDown( Key.DOWNARROW )&& camera.position.z > 20 )
		{
			camera.position.z -= 0.5;
			scene.add( camera );
		}
	}
	
	<!-- 11. Create ball -->
	function createBall()
	{
		var ballGeometry = new THREE.SphereGeometry( 3 );
		var ballMaterial = Physijs.createMaterial( new THREE.MeshLambertMaterial({color:'white'}), .95, .95 );
		ball = new Physijs.SphereMesh( ballGeometry, ballMaterial );
		
		ball.position.x = cannon.position.x + Math.cos((Math.PI/2)-cannon.rotation.z) * 10;
		ball.position.y = cannon.position.y - Math.cos(cannon.rotation.z) * 10;
		ball.position.z = cannon.position.z - Math.sin(cannon.rotation.y) * 10;
		
		ball.name = 'CannonBall';
		
		ball.addEventListener( 'collision', function( other_object, linear_velocity, angular_velocity )
		{
			if( other_object.name == "CannonBall" )
			{
				one.play();
				
			}
			
		});
	}
	
	function createHeavyBall()
	{
		var ballGeometry = new THREE.SphereGeometry( 4.5 );
		var ballMaterial = Physijs.createMaterial( new THREE.MeshLambertMaterial({color:'black'}), .80, .80 );
		heavyBall = new Physijs.SphereMesh( ballGeometry, ballMaterial );
		
		heavyBall.position.x = cannon.position.x + Math.cos((Math.PI/2)-cannon.rotation.z) * 10;
		heavyBall.position.y = cannon.position.y - Math.cos(cannon.rotation.z) * 10;
		heavyBall.position.z = cannon.position.z - Math.sin(cannon.rotation.y) * 10;
		
		heavyBall.name = 'CannonHeavyBall';
		
		heavyBall.addEventListener( 'collision', function( other_object, linear_velocity, angular_velocity )
		{
			if( other_object.name != "GroundPlane" )
			{
				one.play();
			
			}
			
		});
	}

	<!-- 14. Create target -->
	var targetlist;
	function createTarget()
	{
		targetlist = [];
		
		for( var i=0; i<4; i++ )
		{
			var geo = new THREE.BoxGeometry( 4, 4, 12 );
			var mat = Physijs.createMaterial( new THREE.MeshLambertMaterial({color:'blue'}), .95, .95 );
			var msh = new Physijs.BoxMesh( geo, mat );
			switch( i )
			{
				case 0: msh.position.x = 80; break;
				case 1: msh.position.x = 85; msh.position.y = 5; break;
				case 2: msh.position.x = 90; break;
				case 3: msh.position.x = 85; msh.position.y = -5; break;
			}
			msh.position.z = 6;
			targetlist.push( msh );
			scene.add( msh );
		}
		
		var sg = new THREE.BoxGeometry( 10,10,10 );
		var sm = new Physijs.createMaterial( new THREE.MeshLambertMaterial({color:'red'}), .4, .4 );
		smsh = new Physijs.BoxMesh( sg, sm );
		smsh.position.x = 85;
		smsh.position.y = 0;
		smsh.position.z = 18;
		smsh.name = "TargetBall";
		
		scene.add( smsh );
	}
	
	function createOrangeTarget()
	{
		targetlist = [];
		
		for( var i=0; i<4; i++ )
		{
			var geo = new THREE.BoxGeometry( 4, 4, 12 );
			var mat = Physijs.createMaterial( new THREE.MeshLambertMaterial({color:'orange'}), .95, .95 );
			var msh2 = new Physijs.BoxMesh( geo, mat );
			switch( i )
			{
				case 0: msh2.position.x = 50; msh2.position.y = 50;break;
				case 1: msh2.position.x = 55; msh2.position.y = 55; break;
				case 2: msh2.position.x = 60; msh2.position.y = 50;break;
				case 3: msh2.position.x = 55; msh2.position.y = 45; break;
			}
			msh2.position.z = 6;
			targetlist.push( msh2 );
			scene.add( msh2 );
		}
		var geo = new THREE.BoxGeometry( 12, 24, 15 );
		var mat = Physijs.createMaterial( new THREE.MeshLambertMaterial({color:'orange'}), .5, .5 );
		var obstacle = new Physijs.BoxMesh( geo, mat );
		obstacle.position.x = 25;
		obstacle.position.z = 18;
		scene.add(obstacle);
		
		var sg = new THREE.SphereGeometry( 5 );
		var sm = new Physijs.createMaterial( new THREE.MeshLambertMaterial({color:'red'}), .95, .95 );
		smsh2 = new Physijs.SphereMesh( sg, sm );
		smsh2.position.x = 55;
		smsh2.position.y = 50;
		smsh2.position.z = 16;
		smsh2.name = "TargetBall2";
		
		scene.add( smsh2 );
	}

	function createBigObstacle()
	{
		var geo = new THREE.BoxGeometry( 12, 12, 48 );
		var mat = Physijs.createMaterial( new THREE.MeshLambertMaterial({color:'orange'}), .95, .95 );
		var mshBigO = new Physijs.BoxMesh( geo, mat );
			
		mshBigO.position.x = 90; 
		mshBigO.position.y = 80;
		mshBigO.position.z = 24;
		scene.add(mshBigO);	
		
		var sg = new THREE.SphereGeometry( 5 );
		var sm = new Physijs.createMaterial( new THREE.MeshLambertMaterial({color:'red'}), .95, .95 );
		smshBigO = new Physijs.SphereMesh( sg, sm );
		smshBigO.position.x = 90;
		smshBigO.position.y = 80;
		smshBigO.position.z = 52.5;
		smshBigO.name = "TargetBall5";
		scene.add( smshBigO );
	}
	
	function createOrangeTarget2()
	{
		targetlist = [];
		var geometry = new THREE.RingGeometry( 2, 8, 32 );
		var material = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );
		var mesh = new Physijs.BoxMesh( geometry, material );
		mesh.position.x = 55;
		mesh.position.y = -50;
		mesh.position.z = 24;
		scene.add( mesh );
		for( var i=0; i<4; i++ )
		{
			var geo = new THREE.BoxGeometry( 4, 4, 24 );
			var mat = Physijs.createMaterial( new THREE.MeshLambertMaterial({color:'orange'}), .95, .95 );
			var msh3 = new Physijs.BoxMesh( geo, mat );
			switch( i )
			{
				case 0: msh3.position.x = 50; msh3.position.y = -50;break;
				case 1: msh3.position.x = 55; msh3.position.y = -55; break;
				case 2: msh3.position.x = 60; msh3.position.y = -50;break;
				case 3: msh3.position.x = 55; msh3.position.y = -45; break;
			}
			msh3.position.z = 12;
			targetlist.push( msh3 );
			scene.add( msh3 );
		}
		
		var sg = new THREE.SphereGeometry( 5 );
		var sm = new Physijs.createMaterial( new THREE.MeshLambertMaterial({color:'red'}), .95, .95 );
		smsh3 = new Physijs.SphereMesh( sg, sm );
		smsh3.position.x = 55;
		smsh3.position.y = -50;
		smsh3.position.z = 27.5;
		smsh3.name = "TargetBall3";
		
		scene.add( smsh3 );
	}
	
	function createObstacles()
	{
		targetlist = [];
		
		for( var i=0; i<60; i++ )
		{
			var geo = new THREE.BoxGeometry( 10, 10, 10 );
			var mat = Physijs.createMaterial( new THREE.MeshLambertMaterial({color:'gray'}), .95, .95 );
			var msh4 = new Physijs.BoxMesh( geo, mat );
			
				if(i<20){
				 msh4.position.x = 35;
				 msh4.position.y = 120 - ((i+1) *12);	
				}
				if( i > 20){
						msh4.position.z = 20;
						msh4.position.x = 25;
						msh4.position.y = 120 - (((i)-20)*12);	
					
					
				}
				
			
			msh4.position.z = 5;
			targetlist.push( msh4 );
			scene.add( msh4 );
		}
		
		
		
	}
	
	
	<!-- 15. Check for ball off the plane -->
	function checkBallPosition()
	{
		if( smsh.position.y > 5 && smsh2.position.y > 5 && smsh3.position.y > 5 && smshBigO.position.y > 5 )
		{
			scene( smsh3 );
			
			
		}
		
	}
	
	function setupCamera()
	{
		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1,1000 );
		camera.position.x = -180;
		camera.position.y = 0;//-100;
		camera.position.z = 80;//250;
		
		//camera.lookAt( scene.position );
		camera.lookAt( scene.position);
	}
	
	function setupRenderer()
	{
		renderer = new THREE.WebGLRenderer();
		//						color     alpha
		renderer.setClearColor( 0x000000, 1.0 );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.shadowMapEnabled = true;
	}

	function addSpotLight()
	{
        spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 0, 0, 200 );
        spotLight.shadowCameraNear = 10;
        spotLight.shadowCameraFar = 100;
        spotLight.castShadow = true;
		spotLight.intensity = 10;
        scene.add(spotLight);
	}
	
	function playMusic(){
		music.play();
	}
	
	var explode, one, two, three, four, five, music;
	function loadSounds()
	{
		explode = new Audio("sounds/Explosion.mp3");
		one = new Audio("sounds/1.mp3");
		applause = new Audio("sounds/applause.mp3");
		three = new Audio("sounds/3.mp3");
		four = new Audio("sounds/4.mp3");
		five = new Audio("sounds/5.mp3");
		music = new Audio("sounds/gameMusic.mp3");
		load = new Audio("sounds/load.mp3");
	}
	var nameIdObject = null;
	var instructionsObject = null;
	var instructionsObject2 = null;
	var scoreObject = null;
	var scoreValue = 0;
	function updateScore()
	{
		if( scoreObject != null )
		{
			scene.remove( scoreObject );
		}
		
	var scoreString = "SCORE  " + "[" + scoreValue + "]";
		
		var scoreObjectGeometry = new THREE.TextGeometry( scoreString,
		{
			size: 6,
			height: 3,
			curveSegments: 10,
			bevelEnabled: false
		});
		
		var scoreObjectMaterial = new THREE.MeshLambertMaterial({color:0x9999FF});
		
		scoreObject = new THREE.Mesh( scoreObjectGeometry, scoreObjectMaterial );
		scoreObject.position.x = -15;
		scoreObject.position.y = -70;
		scoreObject.position.z = 25	;
		scoreObject.rotation.x =  Math.PI / 2;
		scoreObject.rotation.y = - Math.PI / 2;
		
		scene.add( scoreObject );
	}
	
	function printName()
	{
		if( nameIdObject != null )
		{
			scene.remove( nameIdObject );
		}
		
		var nameString = "By: Jose Ghersy" ;
		
		var nameIdObjectGeometry = new THREE.TextGeometry( nameString,
		{
			size: 3,
			height: 1,
			curveSegments: 10,
			bevelEnabled: false
		});
		
		var nameIdObjectMaterial = new THREE.MeshLambertMaterial({color:0x9999FF});
		
		nameIdObject = new THREE.Mesh( nameIdObjectGeometry, nameIdObjectMaterial );
		nameIdObject.position.x = -80;
		nameIdObject.position.y = -50;
		nameIdObject.position.z = 1;
		nameIdObject.rotation.x =  Math.PI / 2;
		nameIdObject.rotation.y = - Math.PI / 2;
		
		scene.add( nameIdObject );
	}
	/*function printInstructions()
	{
		if( instructionsObject != null )
		{
			scene.remove( instructionsObject );
		}
		
		var instructionsString = " L: Load - F: Fire - Space: Fire Heavy Cannon Ball " ;
		
		var instructionsObjectGeometry = new THREE.TextGeometry( instructionsString,
		{
			size: 3,
			height: 1.2,
			curveSegments: 10,
			bevelEnabled: false
		});
		
		var instructionsObjectMaterial = new THREE.MeshLambertMaterial({color:0x9999FF});
		
		instructionsObject = new THREE.Mesh( instructionsObjectGeometry,instructionsObjectMaterial );
		instructionsObject.position.x = -55;
		instructionsObject.position.y = 100;
		instructionsObject.position.z = 10;
		instructionsObject.rotation.x =  Math.PI / 2;
		instructionsObject.rotation.y = - Math.PI / 2;
		
		scene.add( instructionsObject );
	}
	function printInstructions2()
	{
		if( instructionsObject2 != null )
		{
			scene.remove( instructionsObject2 );
		}
		
		var instructionsString2 = " Cannon Angles A: left - D: rigth - W: Up - S: Down " ;
		
		var instructionsObjectGeometry2 = new THREE.TextGeometry( instructionsString2,
		{
			size: 3,
			height: 1.2,
			curveSegments: 10,
			bevelEnabled: false
		});
		
		var instructionsObjectMaterial2 = new THREE.MeshLambertMaterial({color:0x000000});
		
		instructionsObject2 = new THREE.Mesh( instructionsObjectGeometry2,instructionsObjectMaterial2 );
		instructionsObject2.position.x = -95;
		instructionsObject2.position.y = 50;
		instructionsObject2.position.z = 1;
		instructionsObject2.rotation.x =  Math.PI / 2;
		instructionsObject2.rotation.y = - Math.PI / 2;
		 
		
		scene.add( instructionsObject2 );
	}*/
	
	window.onload = init;

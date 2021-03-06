
"use strict";
twgl.setDefaults({attribPrefix: "a_"});
var m4 = twgl.m4;
var gl = twgl.getWebGLContext(document.getElementById("c"), { premultipliedAlpha: false, alpha: true });
var meshCube, shaderCube, meshParticle, shaderParticle;
var meshScreen, shaderScreen;
var scene, frame, audio, textures;
var	textElement = document.getElementById("debug");
var ready = false;

loadAssets([
	"shaders/Cube.frag",
	"shaders/Cube.vert",
	"shaders/Particle.frag",
	"shaders/Particle.vert",
	"shaders/PostProcess.frag",
	"shaders/PostProcess.vert",
	"shaders/Raymarching.frag",
	"shaders/Raymarching.vert",
	"shaders/utils.glsl",
]);

function start ()
{
	scene = new Scene();
	audio = new AudioAnalyser();

	meshCube = twgl.createBufferInfoFromArrays(gl, createCube());
	shaderCube = new Shader("Cube");
	meshParticle = twgl.createBufferInfoFromArrays(gl, createGridParticles(100));
	shaderParticle = new Shader("Particle");
	meshScreen = twgl.createBufferInfoFromArrays(gl, createPlane());
	shaderScreen = new Shader("Raymarching");

	frame = new FrameBuffer();
	scene.uniforms.u_frameBuffer = frame.getTexture();

	textures = twgl.createTextures(gl, {
		ground1: { 
	    mag: gl.NEAREST,
	    min: gl.NEAREST,
			src: "images/TexturesCom_Gravel0159_1_seamless_S.jpg"
		},
	})
	scene.uniforms.u_texture = textures.ground1;

	ready = true;
}

function render (time)
{
	time *= 0.001;
	twgl.resizeCanvasToDisplaySize(gl.canvas);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	if (ready)
	{
		mouse.update();
		scene.update(time);

		frame.recordStart();
		scene.clear();
		scene.draw(meshCube, shaderCube);
		scene.draw(meshParticle, shaderParticle);
		frame.recordStop();

		// post fx
		scene.draw(meshScreen, shaderScreen);

		// audio.analyser.getByteFrequencyData(audio.dataArray);
		// textures.fft.src = audio.dataArray;

	} else if (assetsIsLoaded) {
		start();
	}

	requestAnimationFrame(render);
}
requestAnimationFrame(render);
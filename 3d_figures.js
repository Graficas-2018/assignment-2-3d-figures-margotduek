var projectionMatrix;

var shaderProgram, shaderVertexPositionAttribute, shaderVertexColorAttribute,
    shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

var duration = 5000; // ms

// Attributes: Input variables used in the vertex shader. Since the vertex shader is called on each vertex, these will be different every time the vertex shader is invoked.
// Uniforms: Input variables for both the vertex and fragment shaders. These do not change values from vertex to vertex.
// Varyings: Used for passing data from the vertex shader to the fragment shader. Represent information for which the shader can output different value for each vertex.
var vertexShaderSource =
    "    attribute vec3 vertexPos;\n" +
    "    attribute vec4 vertexColor;\n" +
    "    uniform mat4 modelViewMatrix;\n" +
    "    uniform mat4 projectionMatrix;\n" +
    "    varying vec4 vColor;\n" +
    "    void main(void) {\n" +
    "		// Return the transformed and projected vertex value\n" +
    "        gl_Position = projectionMatrix * modelViewMatrix * \n" +
    "            vec4(vertexPos, 1.0);\n" +
    "        // Output the vertexColor in vColor\n" +
    "        vColor = vertexColor;\n" +
    "    }\n";

// precision lowp float
// This determines how much precision the GPU uses when calculating floats. The use of highp depends on the system.
// - highp for vertex positions,
// - mediump for texture coordinates,
// - lowp for colors.
var fragmentShaderSource =
    "    precision lowp float;\n" +
    "    varying vec4 vColor;\n" +
    "    void main(void) {\n" +
    "    gl_FragColor = vColor;\n" +
    "}\n";

function initWebGL(canvas)
{
    var gl = null;
    var msg = "Your browser does not support WebGL, " +
        "or it is not enabled by default.";
    try
    {
        gl = canvas.getContext("experimental-webgl");
    }
    catch (e)
    {
        msg = "Error creating WebGL Context!: " + e.toString();
    }

    if (!gl)
    {
        alert(msg);
        throw new Error(msg);
    }

    return gl;
 }

function initViewport(gl, canvas)
{
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initGL(canvas)
{
    // Create a project matrix with 45 degree field of view
    projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 10000);
    // mat4.translate(projectionMatrix, projectionMatrix, [0, 0, -5]);
}

// TO DO: Create the functions for each of the figures.



// Create the vertex, color and index data for a multi-colored scutoid
function createScutoid(gl, translation, rotationAxis)
{
    // Vertex Data
    var vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    var verts = [


       // Back face
       // El de 5 lados
        0.0,  1.0, -2.0, // 1 | punto irreggular =()
       -1.0,  0.0, -2.0, // 2
        1.0,  0.0, -2.0, // 3
       -0.5, -1.0, -2.0, // 4
        0.5, -1.0, -2.0, // 5

        // Front face
        // el de 6 lados
       -1.0,  0.0,  1.0, // 6
       -0.5,  1.0,  1.0, // 7 conectan con el 1
       -0.5, -1.0,  1.0, // 8
        0.5,  1.0,  1.0, // 9 conectan con el 1
        0.5, -1.0,  1.0, // 10
        1.0,  0.0,  1.0, // 11

       // Vienen 3 caras que son rectangulos normales que juntan las 2 figulas
       // 1 face
        0.5, -1.0,  1.0, // 10  | 12
        1.0,  0.0,  1.0, // 11  | 13
        1.0,  0.0, -2.0, // 3   | 14
        0.5, -1.0, -2.0, // 5   | 15

        // 2 face
        -1.0,  0.0,  1.0, // 6  | 16
        -0.5, -1.0,  1.0, // 8  | 17
        -1.0,  0.0, -2.0, // 2  | 18
        -0.5, -1.0, -2.0, // 4  | 19

        // 3 face
        -0.5, -1.0,  1.0, // 8  | 20
         0.5, -1.0,  1.0, // 10 | 21
        -0.5, -1.0, -2.0, // 4  | 22
         0.5, -1.0, -2.0, // 5  | 23

       // Vienen 2 caras que tocan una cara del de 5 y una cara del de 6, dejando así espacio parama
       // el triangulito que va de la 6ta cara al los trinagulitos
       // 4 face
       -0.5,  1.0,  1.0, // 7   | 24
       -1.0,  0.0, -2.0, // 2   | 25
        0.0,  1.0, -2.0, // 1   | 26
        0.0,  1.0,  0.0, // El punto en el que se une con el nuevo triangulo  | 27
        0.5,  1.0,  1.0, // 9   | 28


       // 5 face
        0.5, -1.0,  1.0, // 10  | 29
        1.0,  0.0, -2.0, // 3   | 30
        0.0,  1.0, -2.0, // 1   | 31
        0.0,  1.0,  0.0, // El punto en el que se une con el nuevo triangulo  | 32
        1.0,  0.0,  1.0, // 11  | 33

        // el triangulito de enmedio
        0.5,  1.0,  1.0, // 9   | 34
        0.0,  1.0,  0.0, // El punto en el que se une con el nuevo triangulo  | 35
        1.0,  0.0,  1.0 // 11   | 36

       ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // colores RGBA
    var faceColors = [
        [1.0, 0.0, 0.0, 1.0], // Front face
        [0.0, 1.0, 0.0, 1.0], // Back face
        [0.0, 0.0, 1.0, 1.0], // 1 face
        [1.0, 1.0, 0.0, 1.0], // 2 face
        [1.0, 0.0, 1.0, 1.0], // 3 face
        [0.0, 1.0, 1.0, 1.0],  // 4 face
        [0.0, 0.0, 1.0, 1.0], // 5 face
        [1.0, 1.0, 0.0, 1.0] // Triangulo
    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the scutoid's face.
    // hay que ponerle un color a cada vertice, en este caso de 4 en 4 porque una cara del cubo tiene 4 vertices
    var vertexColors = [];
    // for (var i in faceColors)
    // {
    //     var color = faceColors[i];
    //     for (var j=0; j < 4; j++)
    //         vertexColors = vertexColors.concat(color);
    // }
    for (const color of faceColors)
    {
        for (var j=0; j < 4; j++)
            vertexColors = vertexColors.concat(color);
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    var scutoidIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, scutoidIndexBuffer);
    // estos numeritos son las ileras del arreglo verts y con eso crean las caras
    var scutoidIndices = [
        6, 7, 8,      7, 8, 9,    8, 9, 10,       9, 10, 11,    // Front face
        1, 2, 3,      2, 3, 4,    3, 4, 5,                      // Back face
        12, 13, 14,     13, 14, 15,     // 1 face
        16, 17, 18,     17, 18, 19, // 2 face
        20, 21, 22,     21, 22, 23,  // 3 face
        24, 25, 26,     24, 26, 27,     24, 27, 28,        // 4 face
        29, 30, 31,     29, 31, 32,     29, 32, 33,          // 5 face
        34, 35, 36
    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(scutoidIndices), gl.STATIC_DRAW);

    var scutoid = {
            buffer:vertexBuffer, colorBuffer:colorBuffer, indices:scutoidIndexBuffer,
            vertSize:3, nVerts:36, colorSize:4, nColors: 32, nIndices:60, // nindices es la cantidad de indices en el arreglo scutoidindices
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()};

    mat4.translate(scutoid.modelViewMatrix, scutoid.modelViewMatrix, translation);

    scutoid.update = function()
    {
        var now = Date.now();
        var deltat = now - this.currentTime;
        this.currentTime = now;
        var fract = deltat / duration;
        var angle = Math.PI * 2 * fract;

        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    };

    return scutoid;
}

function createShader(gl, str, type)
{
    var shader;
    if (type == "fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShader(gl)
{
    // load and compile the fragment and vertex shader
    var fragmentShader = createShader(gl, fragmentShaderSource, "fragment");
    var vertexShader = createShader(gl, vertexShaderSource, "vertex");

    // link them together into a new program
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // get pointers to the shader params
    shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);

    shaderVertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(shaderVertexColorAttribute);

    shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
}

function draw(gl, objs)
{
    // clear the background (with black)
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);

    // set the shader to use
    gl.useProgram(shaderProgram);

    for(i = 0; i<objs.length; i++)
    {
        obj = objs[i];
        // connect up the shader parameters: vertex position, color and projection/model matrices
        // set up the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
        gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
        gl.vertexAttribPointer(shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

        gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, obj.modelViewMatrix);

        // Draw the object's primitives using indexed buffer information.
        // void gl.drawElements(mode, count, type, offset);
        // mode: A GLenum specifying the type primitive to render.
        // count: A GLsizei specifying the number of elements to be rendered.
        // type: A GLenum specifying the type of the values in the element array buffer.
        // offset: A GLintptr specifying an offset in the element array buffer.
        gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
    }
}

function run(gl, objs)
{
    // The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint.
    requestAnimationFrame(function() { run(gl, objs); });
    draw(gl, objs);

    for(i = 0; i<objs.length; i++)
        objs[i].update();
}

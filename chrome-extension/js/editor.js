const glslEditor = new GlslEditor('#glsl_editor', { 
    canvas_size: 500,
    canvas_draggable: true,
    theme: 'monokai',
    multipleBuffers: true,
    watchHash: true,
    fileDrops: true,
    menu: true
});
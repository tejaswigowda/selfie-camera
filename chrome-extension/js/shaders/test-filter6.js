const testFilter = `
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;

    // Time varying pixel color
    vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
    
    vec3 currentColor = vec3(texture2D(iChannel0, uv));
    
    // Output to screen
    fragColor = vec4(col * 0.5 + currentColor *0.5,1.0);
}
 `;

export { testFilter }
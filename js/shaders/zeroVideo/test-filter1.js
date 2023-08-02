
const testFilter = `
#define TAU 6.283185307179586

vec2 dihedral(in vec2 _uv, float n) {
    float alpha0 = atan(_uv.y/_uv.x);
    float falpha = fract(alpha0) * TAU;
    //float ialpha = floor(alpha0);
    
    float l = length(_uv);
    return l*vec2(cos(falpha),sin(falpha));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;

    uv = dihedral(uv,1.);//iTime/10.);
    
    vec2 cr = vec2(.3*sin(iTime * 1.5),.3);
    vec2 cg = vec2(.1+.1*sin(iTime * 1.2),-.4-.3*sin(iTime * 2.));
    vec2 cb = vec2(-.1-.2*sin(iTime * .1),.4*sin(iTime * .4));
    
    vec3 col = 1.-vec3(
        smoothstep(.2,.8,length(cr-uv)),
        smoothstep(.1,.9,length(cg-uv)),
        smoothstep(.8,.9,length(cb-uv))
    );
    fragColor = vec4(col,1.0);
}
`;

export { testFilter }
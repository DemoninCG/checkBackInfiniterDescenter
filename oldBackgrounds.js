/*const fragmentShaderSource = `
    precision highp float;
    uniform vec2 resolution;
    uniform float time;

    uniform vec3 u_color1;
    uniform vec3 u_color2;
    uniform vec3 u_color3;

    vec2 hash( vec2 p ) // replace this by something better
    {
        p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
        return -1.0 + 2.0*fract(sin(p)*43758.5453123);
    }

    float noise( in vec2 p )
    {
        const float K1 = 0.366025404; // (sqrt(3)-1)/2;
        const float K2 = 0.211324865; // (3-sqrt(3))/6;

        vec2  i = floor( p + (p.x+p.y)*K1 );
        vec2  a = p - i + (i.x+i.y)*K2;
        float m = step(a.y,a.x); 
        vec2  o = vec2(m,1.0-m);
        vec2  b = a - o + K2;
        vec2  c = a - 1.0 + 2.0*K2;
        vec3  h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
        vec3  n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
        return dot( n, vec3(70.0) );
    }

    float maximum(vec3 p)
    {
        float max = p.x;
        if (p.y > max)
        max = p.y;
        if (p.z > max)
        max = p.z;
        return max;
        
        
    }
    float minimum(vec3 p)
    {
        float min = p.x;
        if (p.y < min)
        min = p.y;
        if (p.z < min)
        min = p.z;
        return min;
        
        
    }
    vec3 normalize2 (vec3 grosscolor)
    {
        grosscolor = (grosscolor*grosscolor*grosscolor);
        float max = maximum(grosscolor);
        float min = minimum(grosscolor);
        return (grosscolor.xyz/(max+min));

    }

    vec2 rotate (vec2 oldpoint, float angle)
    {
        float left, right;
        
        left = cos(angle)*oldpoint.x;
        left -= sin(angle)*oldpoint.y;
        right = sin(angle)*oldpoint.x;  
        right += cos(angle)*oldpoint.y;
        
        return vec2(left,right);
    }

    float noise4( vec2 uv )
    {
        float f = 0.5;
        float frequency = 1.75;
        float amplitude = 0.5;
        //for(int i = 0; i <int(floor(log(time*time))); i++){
        for(int i = 0; i <5; i++){
            f += amplitude*noise( frequency*uv - rotate(vec2(log(time/10.0+3.0),log(time/10.0+3.0)/999.0),time/9999.0) );
            frequency *= 2.0;                                                                                             //helper
            amplitude *= 0.5;
        }
        return f;
    }
    // -----------------------------------------------

    void main()
    {
        vec2 p = gl_FragCoord.xy / resolution.xy;

        vec2 uv = 0.6*p*vec2(resolution.x/resolution.y,0.8);
        uv = rotate(uv,-0.5);
        
        //uv -= 2.0*vec2(resolution.x/2.0, resolution.y/2.0);
        
        float interval = 10.0;
        vec3 dblue = interval*u_color1;
        vec3 cyan = interval*u_color2;
        vec3 magenta = interval*u_color3;
        
        float f = 0.0;
        
        vec3 color = vec3(0.75,0.75,0.75);   
        f = noise4( uv + noise4(uv)*(log(time+100.0)+(time/120.0)) );
        color += f*dblue;
        
        f = noise4( f*rotate(uv,sin(time/22.0)) + f*noise4(f*uv));
        color += f*cyan;
        
        f = noise4( f*rotate(uv,time/14.0) + f*noise4(uv)*noise4(uv));
        color += f*magenta;
        
        color = normalize2(color);
        gl_FragColor = vec4(color,1.0);
    }
`;*/

/*const fragmentShaderSource = `
    precision highp float;
    uniform vec2 resolution;
    uniform float time;

    float ltime;

    float noise(vec2 p)
    {
    return sin(p.x*10.) * sin(p.y*(3. + sin(ltime/11.))) + .2; 
    }

    mat2 rotate(float angle)
    {
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    }


    float fbm(vec2 p)
    {
    p *= 1.1;
    float f = 0.;
    float amp = .5;
    for( int i = 0; i < 3; i++) {
        mat2 modify = rotate(ltime/50. * float(i*i));
        f += amp*noise(p);
        p = modify * p;
        p *= 2.;
        amp /= 2.2;
    }
    return f;
    }

    float pattern(vec2 p, out vec2 q, out vec2 r) {
    q = vec2( fbm(p + vec2(1.)),
            fbm(rotate(.1*ltime)*p + vec2(3.)));
    r = vec2( fbm(rotate(.2)*q + vec2(0.)),
            fbm(q + vec2(0.)));
    return fbm(p + 1.*r);

    }

    vec3 hsv2rgb(vec3 c)
    {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    void main() {
        vec2 p = gl_FragCoord.xy / resolution.xy;
        ltime = (time / 10.0);
        float ctime = (time / 10.0) + fbm(p/8.)*40.;
        float ftime = fract(ctime/6.);
        ltime = floor(ctime/6.0) + (1.-cos(ftime*3.1415)/2.);
        ltime = ltime*6.;
        vec2 q;
        vec2 r;
        float f = pattern(p, q, r);
        vec3 col = hsv2rgb(vec3(q.x/10. + ltime/100. + .4, abs(r.y)*3. + .1, r.x + f));
        float vig = 1. - pow(4.*(p.x - .5)*(p.x - .5), 10.);
        vig *= 1. - pow(4.*(p.y - .5)*(p.y - .5), 10.);
        gl_FragColor = vec4(col*vig,1.);
    }
`;*/


/*const fragmentShaderSource = `
    precision highp float;
    uniform vec2 resolution;
    uniform float time;

    float ltime;

    float noise(vec2 p)
    {
    return sin(p.x*10.) * sin(p.y*(3. + sin(ltime/11.))) + .2; 
    }

    mat2 rotate(float angle)
    {
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    }


    float fbm(vec2 p)
    {
    p *= 1.1;
    float f = 0.;
    float amp = .5;
    for( int i = 0; i < 3; i++) {
        mat2 modify = rotate(ltime/50. * float(i*i));
        f += amp*noise(p);
        p = modify * p;
        p *= 2.;
        amp /= 2.2;
    }
    return f;
    }

    float pattern(vec2 p, out vec2 q, out vec2 r) {
    q = vec2( fbm(p + vec2(1.)),
            fbm(rotate(.1*ltime)*p + vec2(3.)));
    r = vec2( fbm(rotate(.2)*q + vec2(0.)),
            fbm(q + vec2(0.)));
    return fbm(p + 1.*r);

    }

    vec3 hsv2rgb(vec3 c)
    {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    void main() {
        vec2 p = gl_FragCoord.xy / resolution.xy;
        ltime = (time / 10.0);
        float ctime = (time / 10.0) + fbm(p/8.)*40.;
        float ftime = fract(ctime/6.);
        ltime = floor(ctime/6.0) + (1.-cos(ftime*3.1415)/2.);
        ltime = ltime*6.;
        vec2 q;
        vec2 r;
        float f = pattern(p, q, r);
        vec3 col = hsv2rgb(vec3(q.x/10. + ltime/100. + .4, abs(r.y)*3. + .1, r.x + f));
        float vig = 1. - pow(4.*(p.x - .5)*(p.x - .5), 10.);
        vig *= 1. - pow(4.*(p.y - .5)*(p.y - .5), 10.);
        gl_FragColor = vec4(col*vig,1.);
    }
`;*/
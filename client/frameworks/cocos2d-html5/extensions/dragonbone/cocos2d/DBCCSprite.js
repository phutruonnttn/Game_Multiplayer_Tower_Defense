/**
 * Created by KienVN on 7/15/2016.
 */

db.SHADER_OVERLAY_COLOR_FRAG =
    "varying vec2 v_texCoord;\n"
    +"uniform vec4 u_color;\n"
    +"vec3 blend (vec3 src, vec3 dst)\n"
    +"{\n"
    +"return vec3((dst.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - dst.x) * (1.0 - src.x)),\n"
    +"(dst.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - dst.y) * (1.0 - src.y)),\n"
    +"(dst.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - dst.z) * (1.0 - src.z)));\n"
    +"}\n"
    +"void main()\n"
    +"{\n"
    +"vec4 dst = texture2D(CC_Texture0, vec2(v_texCoord.x, v_texCoord.y));\n"
    +"vec4 src = u_color;\n"
    +"gl_FragColor.xyz = blend(src.xyz, dst.xyz);\n"
    +"gl_FragColor.w = dst.w;\n"
    +"}";

/**
 * @constant
 * @type {String}
 */
db.SHADER_OVERLAY_COLOR_VERT =
    "attribute vec4 a_position;\n"
    +"attribute vec2 a_texCoord;\n"
    +"attribute vec4 a_color;\n"
    +"varying vec2 v_texCoord;\n"
    +"void main()\n"
    +"{\n"
    +"gl_Position = CC_PMatrix * CC_MVMatrix * a_position;\n"
    +"v_texCoord = a_texCoord;\n"
    +"}\n";



db.DBCCSprite = cc.Sprite.extend(
    {
        ctor:function()
        {
            this._super();
           // this.addChild(new cc.LabelTTF("I"));
        },
        setColorByShader:function(r, g, b)
        {
            this.shaderProgram = db.DBCCSprite.getProgramColor(r/255, g/255, b/255);
        }
    }
);
db.DBCCSprite.create = function(spriteFrame)
{
    var sprite =  new db.DBCCSprite();
    if(spriteFrame)
    {
        sprite.initWithSpriteFrame(spriteFrame)
    }
    return sprite;
};

db.DBCCSprite._listShader = "";
db.DBCCSprite.getProgramColor = function(r, g, b)
{
    var num = r * 1000000 + g * 1000 + b;
    var key = num.toString();
    var shader = db.DBCCSprite._listShader[key];
    if(!shader) {
        shader = new cc.GLProgram();
        shader.initWithVertexShaderByteArray(db.SHADER_OVERLAY_COLOR_VERT ,db.SHADER_OVERLAY_COLOR_FRAG);
        shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
        shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
        shader.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);

        shader.link();
        shader.updateUniforms();
        shader.use();

        shader.setUniformLocationWith4f(shader.getUniformLocationForName('u_color'), r,g,b,1.0);
        shader.updateUniforms();

        db.DBCCSprite._listShader[key] = shader;
    }

    return shader;
};